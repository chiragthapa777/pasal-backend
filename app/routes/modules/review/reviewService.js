const { PrismaClient } = require("@prisma/client");
const {  reviewIncludeObject } = require("../../../utils/modelInclude");
const prisma = new PrismaClient()


module.exports={
    async create(req,res){
        try {
            // todo : if user has bought the product then only he can give the review
            const {userId, productId}=req.body
            if(Number(userId)!==req.user.id){
                throw "Invalid user"
            }
            const product=await prisma.product.findUnique({
                where:{
                    id:Number(productId)
                }
            })
            if(!product){
                throw "Cannot find the product"
            }
            const review = await prisma.review.create({
                data:req.body,
                include:reviewIncludeObject
            })
            return review
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            const whereObj={}
            const reviews= await prisma.review.findMany({
                where:whereObj,
                include:reviewIncludeObject
            })
            return reviews
        } catch (error) {
            throw error
        }
    },
    async findById(req,res){
        try {
            const {id}=req.params
            return await prisma.review.findUnique({
                where:{
                    id:Number(id)
                },
                include:reviewIncludeObject
            })
        } catch (error) {
            throw error
        }
    },
    async update(req,res){
        try {
            const {id}=req.params
            let review = await prisma.review.findUnique({
                where:{
                    id:Number(id)
                }
            })
            if(!review){
                throw "Cannot find the review"
            }
            review=await prisma.review.update({
                data:{...req.body},
                where:{
                    id:Number(id)
                },
                include:reviewIncludeObject
            })
            return review
        } catch (error) {
            throw error
        }
    },
    async delete(req,res){
        try {
            const {id}=req.params
            let review = await prisma.review.findUnique({
                where:{
                    id:Number(id)
                }
            })
            if(!review){
                throw "Cannot find the review"
            }
            review=await prisma.review.delete({
                where:{
                    id:Number(id)
                },
                include:reviewIncludeObject
            })
            return review
        } catch (error) {
            throw error
        }
    }
}