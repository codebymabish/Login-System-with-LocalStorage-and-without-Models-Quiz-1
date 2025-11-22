class UserService {
    constructor(UserModel) {
        this.UserModel = UserModel;
    }

    async findUserByEmail(email) {
        try {
            const user = await this.UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw new Error('Error finding user by email');
        }
    }

    async createUser(userData) {
        try {
            const newUser = new this.UserModel(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    async updateUser(userId, updateData) {
        try {
            const updatedUser = await this.UserModel.findByIdAndUpdate(userId, updateData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating user');
        }
    }

    async deleteUser(userId) {
        try {
            await this.UserModel.findByIdAndDelete(userId);
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting user');
        }
    }
}

export default UserService;