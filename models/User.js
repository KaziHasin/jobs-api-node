const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Name is required`],
    trim: true,
    minlength: [3, "Name must be more than 3 character"],
    maxlength: [20, `Name can't be more than 20 characters`],
  },
  email: {
    type: String,
    required: [true, `Email is required`],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Email is wrong",
    ],
    unique: [true, "Email must ba a unique"],
  },
  password: {
    type: String,
    required: [true, `Password is required`],
    minlength: [6, "Password must be more than 3 character"],
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getName = function () {
  return this.name;
};

UserSchema.methods.createJwt = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

UserSchema.methods.comparePassword = async function (loginPassword) {
  const isPassword = await bcrypt.compare(loginPassword, this.password);
  return isPassword;
};

module.exports = mongoose.model("User", UserSchema);
