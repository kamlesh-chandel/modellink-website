import { sendResponse } from "./api.response.js";
import { HTTP_STATUS } from "./httpStatus.js";

export const errorHandler = (res, error) => {
  if (error.name === "ValidationError") {
    return sendResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      false,
      error.message,
      null
    );
  }

  if (error.name === "CastError") {
    return sendResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      false,
      "Invalid ID",
      null
    );
  }

  if (error.code === 11000) {
    return sendResponse(
      res,
      HTTP_STATUS.CONFLICT,
      false,
      "Duplicate record",
      null
    );
  }

  return sendResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    false,
    "Internal server error",
    null
  );
};
