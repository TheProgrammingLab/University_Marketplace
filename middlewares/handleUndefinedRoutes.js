import { AppError } from "../utilities/AppError.js";

export default async function handleUndefinedRoutes(req, res, next) {
  next(new AppError(404, `The route '${req.originalUrl}' does not exist on the server`));
}
