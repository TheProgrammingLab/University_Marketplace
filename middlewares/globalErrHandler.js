import { AppError } from "../utilities/AppError.js";
function handleDuplicateError(err) {
  const regex = /Key \(([^)]+)\)=\(([^)]+)\)/;
  const match = err.detail?.match(regex);

  //I declare this a production-grade😃
  if (match) {
    const field = match[1];
    const value = match[2];

    if (err.constraint === "users_username_key") {
      return new AppError(400, "Username already taken");
    }
    return new AppError(400, `The ${field} "${value}" already in use`);
  }

  return new AppError(400, "Duplicate field value");
}

function handleJwtError(err) {
  if (err.message === "jwt expired") {
    return new AppError(401, "Access token expired.");
    // return new AppError(401, "Session expired. Please log in again.");
  }
}

function sendDevErro(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
}

function sendProdErro(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
}

export default function globalErrHandler(err, _, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(err);

  if (process.env.ENV === "development") {
    sendDevErro(err, res);
  } else {
    let error = err;
    if (err.code === "23505") {
      error = handleDuplicateError(err);
    }

    if (err.name === "TokenExpiredError") {
      error = handleJwtError(err);
    }
    sendProdErro(error, res);
  }
}
