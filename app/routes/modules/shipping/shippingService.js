const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// replace shipping
const includeObj={}

module.exports={
    async create(req,res){
        try {
            let data={
                ...req.body,
                userId:req.user.id
            }
            const result = await prisma.shipping.create({
                data
            })
            return result
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            let whereObj={}
            const {userId}=req.query
            if(userId){
                whereObj.userId=Number(userId)
            }
            const result = await prisma.shipping.findMany({
                where:whereObj
            })
            return result
        } catch (error) {
            throw error
        }
    },
    async findById(req,res){
        try {
            const {id}=req.params
            const shipping= await prisma.shipping.findUnique({
                where:{
                    id:Number(id)
                }
            })
            return shipping
        } catch (error) {
            throw error
        }
    },
    
    async update(req,res){
        try {
            const data=req.body
            const shipping= await prisma.shipping.findUnique({
                where:{
                    userId:Number(req.user.id)
                }
            })
            if(!shipping){
                throw "Cannot find shipping"
            }
            const result=await prisma.shipping.update({
                where:{
                    id:Number(shipping.id)
                },
                data
            })
            return result
        } catch (error) {
            throw error
        }
    }
}