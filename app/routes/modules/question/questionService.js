const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {questionReviewObject : includeObj} = require("../../../utils/modelInclude")

// replace question

module.exports={
    async create(req,res){
        try {
            let data=req.body
            const product=await prisma.product.findUnique({
                where:{
                    id:Number(data.productId)
                }
            })
            if(!product){
                throw "Cannot find the product"
            }
            data={
                userId:req.user.id,
                ...data
            }
            const result = await prisma.question.create({
                data,
                include:includeObj
            })
            return result
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            const {productId, vendorId}=req.query
            let whereObj={}
            if(productId || !isNaN(productId)){
                whereObj.productId=Number(productId)
            }
            if(vendorId || !isNaN(vendorId)){
                whereObj.product={
                    vendorId:Number(vendorId)
                }
            }
            const result = await prisma.question.findMany({
                where:whereObj,
                include:includeObj
            })
            return result
        } catch (error) {
            throw error
        }
    },
    async findById(req,res){
        try {
            const {id}=req.params
            const question= await prisma.question.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            return question
        } catch (error) {
            throw error
        }
    },
    
    async update(req,res){
        try {
            const {id}=req.params
            const data=req.body
            const question= await prisma.question.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!question){
                throw "Cannot find question"
            }
            const result=await prisma.question.findUnique({
                where:{
                    id:Number(id)
                },
                data,
                include:includeObj
            })
            return result
        } catch (error) {
            throw error
        }
    },
    async delete(req,res){
        try {
            const {id}=req.params
            const data=req.body
            const question= await prisma.question.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!question){
                throw "Cannot find question"
            }
            const result=await prisma.question.delete({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            return result
        } catch (error) {
            throw error
        }
    },
    async addAnswerToQsn(req,res){
        try {
            const {questionId}=req.params
            const {answer}=req.body
            const question= await prisma.question.findUnique({
                where:{
                    id:Number(questionId)
                },
                include:includeObj
            })
            if(!question){
                throw "Cannot find question"
            }
            const data = await prisma.answer.create({
                data:{
                    questionId:Number(questionId),
                    answers:answer,
                    userId:req.user.id
                }
            })
            return data
        } catch (error) {
            throw error
        }
    }
}