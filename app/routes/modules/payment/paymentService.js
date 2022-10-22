const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// replace payment
const includeObj={}

module.exports={
    async create(req,res){
        try {
            const {amount, orderId, mode, remark}=req.body
            let returnAmount = 0
            const payments=[]
            const order = await prisma.order.findUnique({
                where:{
                    id : Number(orderId)
                },
                include:{
                    payments:true
                }
            })
            if(!order){
                throw "Cannot find the order"
            }
            if(order.isPaid){
                throw "Bill is already cleared"
            }
            const billedAmount = order.grandTotal
            let paidAmount=order.payments.reduce((acc,next)=>acc + next.amount,0)
            payments.push({
                amount:amount,
                remark:`Bill paid for order id : ${order.id} through ${mode}`,
                addedBy:req.user.id,
                mode,
                orderId:order.id
            })
            if(amount > billedAmount-paidAmount){
                payments.push({
                    amount:(billedAmount-paidAmount)-amount,
                    remark:`CHANGE`,
                    addedBy:req.user.id,
                    mode,
                    orderId:order.id
                })
                returnAmount = (billedAmount-paidAmount)-amount
            }
            await prisma.$transaction(async tx=>{
                console.log(billedAmount,"=====", paidAmount + payments.reduce((acc,next)=>acc + next.amount,0))
                if(paidAmount + payments.reduce((acc,next)=>acc + next.amount,0)>=billedAmount){
                    await tx.order.update({
                        where:{
                            id: order.id
                        },
                        data:{
                            isPaid:true
                        }
                    })
                }
                await tx.payment.createMany({
                    data:payments
                })
            })
            return {returnAmount}
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            const {orderId}=req.query
            let whereObj={}
            if(orderId && !isNaN(orderId)){
                whereObj.orderId=Number(orderId)
            }
            const result = await prisma.payment.findMany({
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
            const payment= await prisma.payment.findUnique({
                where:{
                    id:Number(id)
                }
            })
            return payment
        } catch (error) {
            throw error
        }
    },
    
    async update(req,res){
        try {
            const {id}=req.params
            const data=req.body
            const payment= await prisma.payment.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!payment){
                throw "Cannot find payment"
            }
            const result=await prisma.payment.findUnique({
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
            const payment= await prisma.payment.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!payment){
                throw "Cannot find payment"
            }
            const result=await prisma.payment.delete({
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