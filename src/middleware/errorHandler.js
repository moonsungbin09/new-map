export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({ message: "잠시 후 다시 시도해 주세요." });
}
