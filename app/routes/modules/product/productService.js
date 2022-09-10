const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const includeObj={
    productTags:{
        include:{
            tag:true
        }
    },
    vendor:true,
    questions:{
        include:{
            answers:{
                include:{
                    user:true
                }
            }
        }
    },
    images:true,
    reviews:{
        include:{
            user:true
        }
    },
    _count:{
        select:{
            reviews:true,
            questions:true
        }
    }
}

module.exports={
    async create(req){
        try {
            const data={...req.body}
            console.log(req.user)
            if(!req.user.vendorId){
                throw "You cannot create product"
            }
            data.userId=Number(req.user.id)
            data.vendorId=Number(req.user.vendorId)
            return await prisma.product.create({
                data,
                include:includeObj})
        } catch (error) {
            throw error
        }
    },
    async find(req){
        try {
            let whereObj={}
            let orderByObj={}
            return prisma.product.findMany({
                where:whereObj,
                include:includeObj,
                orderBy:orderByObj
            })
        } catch (error) {
            throw error
        }
    },
    async findById(req){
        try {
            let whereObj={
                id:Number(req.params.id)
            }
            return prisma.product.findUnique({
                where:whereObj,
                include:includeObj
            })
        } catch (error) {
            throw error
        }
    },
    async update(req){
        try {
            console.log(req.params, req.body)
            const data={...req.body}
            let product=await prisma.product.findUnique({
                where:{
                    id:Number(req.params.id)
                }
            })
            if(!product){
                throw "Cannot find the product"
            }
            return await prisma.product.update({
                where:{
                    id:Number(req.params.id)
                },
                data,
                include:includeObj
            })
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    async delete(req){
        try {
            return "delete"
        } catch (error) {
            throw error
        }
    }
}