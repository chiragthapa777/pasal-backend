const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
	const alice = await prisma.otherCharge.upsert({
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
    const tags = await prisma.tag.upsert({
      where: {
        name: tag
      },
      update: {},
      create: {
        name: tag
      },
    });
  }
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
