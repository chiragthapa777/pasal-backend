const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function authorize(roles) {
	return (req, res, next) => {
		try {
			let token = req.header("token");
			if (!token) {
				token = req.cookies.Ptoken;
			}
			if (!token && !roles.includes("VISITOR"))
				return res
					.status(401)
					.json({ success: false, data: "Login first !!!" });
			const secretKey = process.env.SECRET_KEY;
			const payload = jwt.verify(token, secretKey);
			prisma.user
				.findUnique({
					where: { id: Number(payload.id) },
				})
				.then((user) => {
					if (
						roles.length > 0 &&
						user.role !== "ADMIN" &&
						!roles.find((r) => r === user.role) &&
						!roles.includes("VISITOR")
					) {
						return res.status(401).json({
							success: false,
							data: "Not authorized !!!",
						});
					}
					console.log(`Serving request for user: ${user?.name}(${user?.role}) ${user?.vendorId&&`vendorId : ${user.vendorId}`}`)
					req.user = user;
					return next();
				})
				.catch((error) => {
					console.log(error);
					if(roles.includes("VISITOR")){return next()}
					return res
						.status(400)
						.json({ success: false, data: "Cannot Find the user" });
				});
		} catch (error) {
			console.log(error.message)
			if(roles.includes("VISITOR")){return next()}
			res.status(400).json({ success: false, data: "Invalid Token" });
		}
	};
}

module.exports = authorize;
