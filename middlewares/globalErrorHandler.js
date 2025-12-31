export default async function globalErrorHandler(req, res) {
  const url = req.originalUrl;
  res.status(404).json({
    status: "fail",
    message: `The route ${url} does not exist on the server`,
  });
}
