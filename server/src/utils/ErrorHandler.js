const logger = require("../functions/logger");
const ErrorHandler = (message, statusCode, req, res,error) => {
  // console.log("🚀 ~ ErrorHandler ~ error:", error)
  logger.error({
    method: req.method,
    url: req.url,
    date: new Date(),
    message: message,
  });
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = {ErrorHandler}
