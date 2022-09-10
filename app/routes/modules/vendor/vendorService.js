const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const includeObj={
    _count:{
        select:{
            productGroups:true,
            products:true,
            users:true
        }
    },
    users:true
}

module.exports={
    async create(req, res){
        try {
            let vendor= await prisma.vendor.findMany({
                where:{
                    OR:[
                        {
                            email:req.body.email
                        },
                        {
                            pan:req.body.pan
                        },
                    ]
                }
            })
            if(vendor){
                throw "Email or pan already exists"
            }
            let data={...req.body}
            return await prisma.vendor.create({
                data
            })
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            return await prisma.vendor.findMany({
                include:includeObj
            })
        } catch (error) {
            throw error
        }
    },
    async findById(req,res){
        try {
            return await prisma.vendor.findUnique({
                where:{
                    id:Number(req.params.id)
                },
                include:includeObj
            })
        } catch (error) {
            throw error
        }
    },
    async update(req,res){
        try {
            const data={...req.body}
            return await prisma.vendor.update({
                where:{
                    id:Number(req.params.id)
                },
                data,
                include:includeObj
            })
        } catch (error) {
            throw error
        }
    },
    async delete(req,res){
        try {
            return "delete"
        } catch (error) {
            throw error
        }
    }
}