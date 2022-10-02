// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient()

// async function excludePasswordMiddleware(params, next) {
//   const result = await next(params)
//   if (params?.model === 'Users' && params?.args?.select?.password !== true) {
//     delete result.password
//   }
//   return result
// }



async function prismaMiddleware(req,res,next){
    // console.log("sadgiuasdglisabglisadb")
    // prisma.$use(excludePasswordMiddleware)  
    next()
}
module.exports={prismaMiddleware}