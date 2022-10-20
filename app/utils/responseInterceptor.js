const { Prisma } = require("@prisma/client");

module.exports = {
  /**
   * 
   * @param {request} res 
   * @param {responseData} data 
   * @param {responseCode} code 
   * @returns {response}
   */
  successResponse(res, data, code) {
    return res.status(code ? code : 200).json({ success: true, data });
  },
  /**
   * 
   * @param {request} res 
   * @param {errorData} data 
   * @param {errorCode} code 
   * @returns {response}
   */
  errorResponse(res, data, code) {
    if (data instanceof Error) {
      console.log("Error : ",data)
      if (
        data instanceof Prisma.PrismaClientKnownRequestError ||
        data instanceof Prisma.PrismaClientValidationError
      ) {
        data = "Cannot process query";
      } else {
        data = data.message;
      }
    }
    return res.status(code ? code : 400).json({ success: false, data });
  },
};
