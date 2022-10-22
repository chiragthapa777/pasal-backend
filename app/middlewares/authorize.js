const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function authorize(roles) {
	return (req, res, next) => {
		try {
			const token = req.header("token");
			if (!token)
				return res
					.status(401)
					.json({ success: false, data: "Login first !!!" });
			const secretKey = process.env.SECRET_KEY;
			const payload = jwt.verify(token, secretKey);
      console.log(payload)
			prisma.user
				.findUnique({
					where: { id: Number(payload.id) },
				})
				.then((user) => {
					if (
						roles.length > 0 &&
						user.role !== "ADMIN" &&
						!roles.find((r) => r === user.role)
					) {
						return res
							.status(401)
							.json({
								success: false,
								data: "Not authorized !!!",
							});
					}
					req.user = user;
					next();
				})
				.catch((error) => {
					console.log(error);
					return res
						.status(400)
						.json({ success: false, data: "Cannot Find the user" });
				});
		} catch (error) {
			res.status(400).json({ success: false, data: "Invalid Token" });
		}
	};
}

module.exports = authorize;
