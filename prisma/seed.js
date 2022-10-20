const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.otherCharge.upsert({
    where:{
        name:'delivery'
    },
    update:{},
    create: {
      name:'delivery',
      desc:"charge for delivery",
    price:100
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })