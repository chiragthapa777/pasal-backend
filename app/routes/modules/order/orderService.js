const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// replace modelName
const includeObj={}

/**
   * 
   * @param {number} userId 
   * @param {[{productId:number,quantity:number, product:Product}]}  items
   * @returns {orderitemsArray} orderitemsArray
   */
async function orderItemReducer(userId, items){
    return items.map((item)=>{
        const total = item.quantity*item.product.price
        let discount=0
        if(item?.discounts.length>0){
            discount=item.discount[0].percent/100*total
        }
        const totalAfterDiscount = total - discount
        const vat = 0
        const totalWithVat = totalAfterDiscount + vat
        const grandTotal = totalWithVat
        return {
            productId:item.product.id,
            userId:Number(userId),
            total,
            discount,
            totalAfterDiscount,
            vat,
            totalWithVat,
            grandTotal,
            quantity:item.quantity
        }
    })
}

async function orderCalculator(items, userId){
    const total = items.reduce((acc,next)=>{
        return acc + next.total
    },0)
    const discount = items.reduce((acc,next)=>{
        return acc + next.discount
    },0)
    const totalAfterDiscount = items.reduce((acc,next)=>{
        return acc + next.totalAfterDiscount
    },0)
    const vat = items.reduce((acc,next)=>{
        return acc + next.vat
    },0)
    const totalWithVat = items.reduce((acc,next)=>{
        return acc + next.totalWithVat
    },0)
    const otherCharge = items.reduce((acc,next)=>{
        if(next?.otherChargeId && !isNaN(next.otherChargeId)){
            return acc + next.otherCharge
        }else{
            return acc
        }
    },0)
    return{
        user:Number(userId),
        total,
        discount,
        totalAfterDiscount,
        vat,
        totalWithVat,
        otherCharge,
        grandTotal:totalWithVat+otherCharge
    }
}

async function addDelivery(items, prisma){
    const delivery = await prisma.otherCharge.findUnique({
        where:{
            name:"delivery"
        }
    })
    if(!delivery){
        throw "delivery charge is not seeded yet"
    }
    items.push({
            otherChargeId:delivery.id,
            userId:Number(userId),
            total:delivery.price,
            discount:0,
            totalAfterDiscount:delivery.price,
            vat:0,
            totalWithVat:delivery.price,
            grandTotal:delivery.price,
            quantity:1
        
    })
}

/**
   * 
   * @param {number} userId 
   * @param {[{productId:number,quantity:number, product:Product}]}  items
   * @returns {order}
   */
async function generateOrder(userId, items){
    try {
        prisma.$transaction(async (tx)=>{
            const orderItemReduced=await orderItemReducer(userId, items)
            // add delivery charge
            await addDelivery(orderItemReduced, prisma)
            const orderData = await orderCalculator(orderItemReduced, userId)
            const order =await tx.order.create({
                data:orderData
            })
            for(const i in orderItemReduced){
                orderItemReduced[i]={
                    ...orderItemReduced,
                    orderId:order.userId
                }
            }
            const orderItems= await tx.orderItems.createMany({
                data:orderItemReduced
            })
        })
    } catch (error) {
        console.log("generateOrder ERROR : ",error)
        throw error
    }
}

module.exports={
    async create(req,res){
        try {
            let {items, userId}=req.body
            //check item and quantity
            for(const i in items){
                const product = await prisma.product.findUnique({
                    where:{
                        id:Number(items[i].productId)
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
                    throw "Cannot find the product"
                }
                if(items[i].quantity>product.quantity){
                    throw `Demanded quantity is more than available stock for ${product.name}`
                }
                items[i].product=product
            }
            //check user
            const user = await prisma.user.findUnique({
                where:{
                    id:Number(userId)
                }
            })
            if(!user){
                throw "Invalid user"
            }
            const result = await generateOrder(userId, items)
            return result
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            let whereObj={}
            const result = await prisma.modelName.findMany({
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
            const modelName= await prisma.modelName.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            return modelName
        } catch (error) {
            throw error
        }
    },
    
    async update(req,res){
        try {
            const {id}=req.params
            const data=req.body
            const modelName= await prisma.modelName.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!modelName){
                throw "Cannot find modelName"
            }
            const result=await prisma.modelName.findUnique({
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
            const modelName= await prisma.modelName.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!modelName){
                throw "Cannot find modelName"
            }
            const result=await prisma.modelName.delete({
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