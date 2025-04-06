class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    message,
    data,
  });
}

function failure(res, error) {
  if (error.name === "SequlizeValidationError") {
    const errors = error.errors.map((err) => err.message);
    return res.status(400).json({
      status: false,
      message: "请求参数错误",
      errors,
    });
  }
  if (error.name === "NotFoundError") {
    return res.status(404).json({
      status: false,
      message: "资源不存在",
      errors: [error.message],
    });
  }
  return res.status(500).json({
    status: false,
    message: "服务器错误",
    errors: [error.message],
  })
}

module.exports = {
  NotFoundError,
  success,
  failure
};
