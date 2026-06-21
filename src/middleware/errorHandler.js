export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err?.statusCode ?? err?.status;

  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "요청 JSON 형식이 올바르지 않습니다." });
  }

  if (err?.code === "SERVICE_UNAVAILABLE") {
    const detail = err?.message ? ` (${err.message})` : "";
    return res
      .status(503)
      .json({ message: `서비스가 일시적으로 준비 중입니다. 잠시 후 다시 시도해 주세요.${detail}` });
  }

  if (Number.isInteger(status) && status >= 400 && status < 600) {
    return res.status(status).json({ message: err?.message || "요청을 처리할 수 없습니다." });
  }

  return res.status(500).json({ message: "잠시 후 다시 시도해 주세요." });
}
