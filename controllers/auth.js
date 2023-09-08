const User = require("../models/User");
const Blacklist = require("../models/Blacklist");
const bcrypt = require("bcryptjs");
const CustomAPIError = require("../errors/custom-error");
const handleMongoError = require("../errors/mongo-error");
const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = user.createJwt();

    res.status(201).json({
      user: { name: user.getName() },
      token,
      msg: "User created successfully",
    });
  } catch (error) {
    next(handleMongoError(error));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new CustomAPIError("Email and Password must be provided", 400));
  }
  const user = await User.findOne({ email });

  if (!user) {
    next(new CustomAPIError("Invalid credentials", 401));
    return;
  }

  isConfirmedPassword = await user.comparePassword(password);

  if (!isConfirmedPassword) {
    next(new CustomAPIError("Invalid credentials", 401));
    return;
  }

  const token = user.createJwt();

  res.status(200).json({
    user: { name: user.getName() },
    token,
    msg: "User logged in successfully",
  });
};

const logout = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) next(new CustomAPIError("No token found", 401));
    const token = authToken.split(" ")[1];
    const ifBlacklist = await Blacklist.findOne({ token });
    if (ifBlacklist) {
      next(new CustomAPIError("Already logout", 401));
    }
    const newBlacklist = new Blacklist({
      token: token,
    });

    await newBlacklist.save();

    // await Blacklist.create({ token });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(handleMongoError(error));
  }
};

module.exports = { register, login, logout };
