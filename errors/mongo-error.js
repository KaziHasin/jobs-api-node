const CustomAPIError = require("./custom-error");
const handleMongoError = (error) => {
  if (error.code === 11000 && error.keyPattern.email) {
    return new CustomAPIError("Email address is already in use", 400);
  } else if (error.name == "CastError") {
    return new CustomAPIError(`Not found data`, 404);
  } else if (error.errors) {
    const errorMessages = Object.values(error.errors).map((err) => err.message);
    return new CustomAPIError(errorMessages, 400);
  } else if (error) {
    return new CustomAPIError(error, 500);
  } else {
    return new CustomAPIError("An error occurred", 500);
  }
};

module.exports = handleMongoError;
