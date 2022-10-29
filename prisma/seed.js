const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
require("dotenv").config();
async function main() {
	const delivery = await prisma.otherCharge.upsert({
		where: {
			name: "delivery",
		},
		update: {},
		create: {
			name: "delivery",
			desc: "charge for delivery",
			price: 100,
		},
	});

	console.log("Delivery charge created : ",delivery)
	const salt = await bcrypt.genSalt(10);
    const hashPassword =await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
	console.log(hashPassword)

	const admin = await prisma.user.upsert({
		where: {
			email: "chiragthapa777@gmail.com",
		},
		update: {},
		create: {
			name: "Chirag Thapa",
			password: hashPassword,
			email: "chiragthapa777@gmail.com",
			role:"ADMIN"
		},
	});
	delete admin.password
	console.log("Admin created : ",admin)
	const tags=[]
	const tagsArray = [
		"Women's Fashion",
		"Health & Beauty",
		"Men's Fashion",
		"Watches, Bags, Jewellery",
		"Electronic Devices",
		"TV & Home Appliances",
		"Electronic Accessories",
		"Groceries & Pets",
		"Babies & Toys",
		"Home & Lifestyle",
		"Sports & Outdoor",
		"Motors, Tools & DIY",
	];
  for (const tag of tagsArray){
    const Tag = await prisma.tag.upsert({
      where: {
        name: tag
      },
      update: {},
      create: {
        name: tag
      },
    });
	tags.push(Tag)
  }
  console.log("Base Tag/Categories created : ",tags)
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
