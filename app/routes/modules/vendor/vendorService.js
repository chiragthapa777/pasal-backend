const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const includeObj = {
	_count: {
		select: {
			productGroups: true,
			products: true,
			users: true,
		},
	},
	users: true,
};

module.exports = {
	async create(req, res) {
		try {
			let vendor = await prisma.vendor.findMany({
				where: {
					OR: [
						{
							email: req.body.email,
						},
						{
							pan: req.body.pan,
						},
						{
							name: req.body.name,
						},
					],
				},
			});
			if (vendor.length > 0) {
				throw "Email or pan or name already exists";
			}
			let data = {
				...req.body,
			};
            if(req.user.role==="ADMIN"){
                data.requestAccepted=true
            }
			return await prisma.$transaction(async (t) => {
				const vendor = await t.vendor.create({
					data,
				});
                const newdata = {
                    vendorId: vendor.id
                }
                if(req.user.role!=="ADMIN"){
                    newdata.role="SELLER"
                }
				await t.user.update({
					where: {
						id: Number(req.user.id),
					},
					data:newdata
				});
				return vendor;
			});
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
	async find(req, res) {
		try {
			const whereObj = {};
			if (req.query.userId && !isNaN(req.query.userId)) {
				whereObj.users = {
					some: {
						id: Number(req.query.userId),
					},
				};
			}
			return await prisma.vendor.findMany({
				where: whereObj,
				include: includeObj,
			});
		} catch (error) {
			throw error;
		}
	},
	async findById(req, res) {
		try {
			return await prisma.vendor.findUnique({
				where: {
					id: Number(req.params.id),
				},
				include: includeObj,
			});
		} catch (error) {
			throw error;
		}
	},
	async update(req, res) {
		try {
			const data = { ...req.body };
			return await prisma.vendor.update({
				where: {
					id: Number(req.params.id),
				},
				data,
				include: includeObj,
			});
		} catch (error) {
			throw error;
		}
	},
	async delete(req, res) {
		try {
			return "delete";
		} catch (error) {
			throw error;
		}
	},
	async acceptVendorRequest(req, res) {
		try {
			const { vendorId } = req.params;
			return await prisma.$transaction(async (t) => {
				const vendor = await t.vendor.update({
					where: {
						id: Number(vendorId),
					},
					data: {
						requestAccepted: true,
					},
					include: {
						users: true,
					},
				});
				for (const u of vendor.users) {
					if (u.role !== "ADMIN") {
						await t.user.update({
							where: {
								id: Number(u.id),
							},
							data: {
								role: "SELLER",
							},
						});
					}
				}
				delete vendor.users;
				return vendor;
			});
		} catch (error) {
			throw error;
		}
	},
};
