class AuthService {
    constructor(UserModel, bcrypt, jwt, config) {
        this.UserModel = UserModel;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
        this.config = config;
    }

    async signup(email, password) {
        const hashedPassword = await this.bcrypt.hash(password, 10);
        const newUser = new this.UserModel({ email, password: hashedPassword });
        return await newUser.save();
    }

    async login(email, password) {
        const user = await this.UserModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await this.bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = this.generateToken(user._id);
        return { user, token };
    }

    generateToken(userId) {
        return this.jwt.sign({ id: userId }, this.config.JWT_SECRET, { expiresIn: '1h' });
    }
}

export default AuthService;