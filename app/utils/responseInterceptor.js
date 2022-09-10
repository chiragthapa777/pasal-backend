const { Prisma } = require("@prisma/client");

module.exports = {
  successResponse(res, data, code) {
    return res.status(code ? code : 200).json({ success: true, data });
  },
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
