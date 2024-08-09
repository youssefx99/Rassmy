module.exports = function returnRequest(res, statusCode, status, dataObject) {
  return res.status(statusCode).json({
    status: status,
    data: dataObject,
  });
};
