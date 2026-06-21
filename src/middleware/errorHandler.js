export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err?.statusCode ?? err?.status;

  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "요청 JSON 형식이 올바르지 않습니다." });
  }

  if (Number.isInteger(status) && status >= 400 && status < 600) {
    return res.status(status).json({ message: err?.message || "요청을 처리할 수 없습니다." });
  }

  return res.status(500).json({ message: "잠시 후 다시 시도해 주세요." });
}
