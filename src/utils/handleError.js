export const handleError = (res, statusCode, errorMessage) => {
  res.status(statusCode).json({ success: false, error: errorMessage });
};
