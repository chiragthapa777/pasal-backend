const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createCart=async (req)=>{
    try {
        let cart = await prisma.cart.findUnique({
            where:{
                userId : req.user.id
            }
        })
        if(! cart){
            cart = await prisma.cart.create({
                data:{
                    userId:req.user.id
                }
            })
        }
        return cart
    } catch (error) {
        throw error
    }
}

const getCartDetails=async(req)=>{
    try {
        await createCart(req)
            const cart = await prisma.cart.findUnique({
                where:{
                    userId:req.user.id
                },
                include:{
                    cartDetails:{
                        where:{
                            active : true
                        }
                    }
                }
            })
            return cart
    } catch (error) {
        throw error
    }
}

const verifyProductReq=async (productId, quantity)=>{
    try {
        const product = await prisma.product.findUnique({
            where:{
                id : Number(productId)
            }
        })
        if(!product){
            throw "Cannot find the product"
        }
        if(product.quantity < quantity){
            throw `Sorry, there is only ${product.quantity} ${product.unit} left`
        }
    } catch (error) {
        throw error
    }
}

module.exports={
    async create(req){
        try {
            return await createCart(req)
        } catch (error) {
            throw error
        }
    },
    async find(req){
        try {
            return await getCartDetails(req)
        } catch (error) {
            throw error
        }
    },
    async addProduct(req){
        try {
            const {productId, quantity}= req.body
            const find= await prisma.cartDetails.findMany({
                where:{
                    active:true,
                    userId:req.user.id,
                    productId:Number(productId)
                }
            })
            if(find.length>0){
                throw "already exists in the cart"
            }
            await verifyProductReq(productId, quantity)
            const cart=await getCartDetails(req)
            if(Number(quantity)<1) throw "Quantity should be greater than 0"
            await prisma.cartDetails.create({
                data:{
                    productId : Number(productId),
                    quantity : Number(quantity),
                    userId:req.user.id,
                    cartId:cart.id
                }
            })
            return await getCartDetails(req)
        } catch (error) {
            throw error
        }
    },
    async removeProduct(req){
        try {
            const {productId}=req.params
            const find= await prisma.cartDetails.findMany({
                where:{
                    active:true,
                    userId:req.user.id,
                    productId:Number(productId)
                }
            })
            if(find.length!==1) throw "Cannot find the product in the cart"
            await prisma.cartDetails.update({
                where:{
                    id:find[0].id
                },
                data:{
                    active:false
                }
            })
            return await getCartDetails(req)
        } catch (error) {
            throw error
        }
    },
    async editProduct(req){
        try {
            const {productId}=req.params
            const {quantity}= req.body
            if(Number(quantity)<1) throw "Quantity should be greater than 0"
            const find= await prisma.cartDetails.findMany({
                where:{
                    active:true,
                    userId:req.user.id,
                    productId:Number(productId)
                }
            })
            if(find.length!==1){
                throw "Cannot find cart in the item"
            }
            if(Number(quantity)!==find.quantity){
                await verifyProductReq(productId, quantity)
                await prisma.cartDetails.update({
                    where:{
                        id:find[0].id
                    },
                    data:{
                        quantity:Number(quantity)
                    }
                })
            }
            return await getCartDetails(req)
        } catch (error) {
            throw error
        }
    },
}