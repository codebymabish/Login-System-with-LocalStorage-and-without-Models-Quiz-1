import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// assign default permissions on new user creation or role change
userSchema.pre("save", function (next) {
  if (!this.isModified("role")) return next();
  const role = this.role;
  if (role === "admin")
    this.permissions = [
      "create_quiz",
      "edit_quiz",
      "delete_quiz",
      "take_quiz",
      "view_results",
      "manage_users",
    ];
  if (role === "teacher")
    this.permissions = [
      "create_quiz",
      "edit_quiz",
      "delete_quiz",
      "view_results",
    ];
  if (role === "student") this.permissions = ["take_quiz", "view_results"];
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
