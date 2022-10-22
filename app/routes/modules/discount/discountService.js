const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// replace discount
const includeObj={}

module.exports={
    async create(req,res){
        try {
            let {percent, isValid, productId}=req.body
            const product = await prisma.product.findUnique({
                where:{
                    id: productId
                },
                include:{
                    discounts:{
                        where:{
                            isValid:true
                        }
                    }
                }
            })
            if(!product){
                throw "cannot find product id"
            }
            let result={}
            await prisma.$transaction(async tx=>{
                for(const discount of product.discounts){
                    await tx.discount.update({
                        where:{
                            id:discount.id
                        },
                        data:{
                            isValid:false
                        }
                    })
                }
                result = await tx.discount.create({
                    data:{...req.body}
                })
            })
            return result
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            const {productId, isValid} = req.query
            let whereObj={}
            if(productId){
                whereObj.productId=Number(productId)
            }
            if(isValid){
                whereObj.isValid=isValid==="true"?true:false
            }
            console.log(whereObj)
            const result = await prisma.discount.findMany({
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
            const discount= await prisma.discount.findUnique({
                where:{
                    id:Number(id)
                }
            })
            return discount
        } catch (error) {
            throw error
        }
    },
    
    async update(req,res){
        try {
            const {id}=req.params
            const data=req.body
            const discount= await prisma.discount.findUnique({
                where:{
                    id:Number(id)
                }
            })
            if(!discount){
                throw "Cannot find discount"
            }
            const result=await prisma.discount.update({
                where:{
                    id:Number(id)
                },
                data
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
            const discount= await prisma.discount.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!discount){
                throw "Cannot find discount"
            }
            const result=await prisma.discount.delete({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            return result
        } catch (error) {
            throw error
        }
    }
}