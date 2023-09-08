const jwt = require("jsonwebtoken");
const BlackList = require("../models/Blacklist");
const CustomAPIError = require("../errors/custom-error");

const authMiddleware = async (req, res, next) => {
  const autToken = req.headers.authorization;

  if (!autToken || !autToken.startsWith("Bearer ")) {
    next(new CustomAPIError("No token found", 401));
  }
  const token = autToken.split(" ")[1];
  const checkBlacklist = await BlackList.findOne({ token });
  if (checkBlacklist) {
    next(
      new CustomAPIError("This session has expired. Please login again", 401)
    );
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const { name, userId } = decode;

    req.user = { name, userId };
    next();
  } catch (error) {
    next(new CustomAPIError("Unauthorized to access", 401));
  }
};

module.exports = authMiddleware;
