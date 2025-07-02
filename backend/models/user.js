const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    // Personal Info
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [30, "First name cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [30, "Last name cannot exceed 30 characters"],
    },

    // Auth Credentials
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // this to hide the password by default use user.find({email}).select('+password'):
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => validator.isMobilePhone(v, "any"),
        message: "Invalid phone number",
      },
    },

    // Addresses
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: "Ethiopia" },
        zipCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],

    // Roles & Status
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
