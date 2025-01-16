const { StatusCodes } = require("http-status-codes");

const createCustomError = (err, req, res, next) => {
  const customError = {
    statusCodes: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong please try again.!",
  };

  if ((err.name = "ValidationError")) {
    customError.statusCodes = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  if (err && err.code === 11000) {
    customError.statusCodes = StatusCodes.BAD_REQUEST;
    customError.msg = `This email ${err.keyValue.email}  is already existed in System. Please choose another.!`;
  }

  return res.status(customError.statusCodes).json({ msg: customError.msg });
};

module.exports = createCustomError;
