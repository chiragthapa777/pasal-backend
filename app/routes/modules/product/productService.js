const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const {prisma}=require("../../../middlewares/excludePassword")
const {productIncludeObject: includeObj} = require("../../../utils/modelInclude")

const roundOffFunction=(avg)=>{
    const difference=avg-Math.floor(avg)
    if(difference > 0.5){
        return Math.floor(avg)+0.5
    }else{
        return Math.floor(avg)+1
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
            const products = await prisma.product.findMany({
                where:whereObj,
                include:includeObj,
                orderBy:orderByObj
            })
            for(let p in products){
                let averageRating = 0
                let total = 0
                const length = products[p]?.reviews?.length ? products[p].reviews.length!==0 ? products[p].reviews.length : 1 : 1
                for(let review of products[p]?.reviews){
                    total += review.rating
                }
                averageRating = total/length
                products[p]={...products[p],averageRating:roundOffFunction(averageRating)}
            }
            return products
        } catch (error) {
            throw error
        }
    },
    async findById(req){
        try {
            let averageRating = 0

            let whereObj={
                id:Number(req.params.id)
            }
            const product =await  prisma.product.findUnique({
                where:whereObj,
                include:includeObj
            })
            let total = 0
            const length = product?.reviews?.length ? product.reviews.length!==0 ? product.reviews.length : 1 : 1
            for(let review of product?.reviews){
                    total += review.rating
            }
            averageRating = total/length
            return {...product,averageRating:roundOffFunction(averageRating)}
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
                data:{
                    active:false
                },
                include:includeObj
            })
        } catch (error) {
            throw error
        }
    }
}