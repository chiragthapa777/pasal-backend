const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// replace modelName
const includeObj={}

module.exports={
    async create(req,res){
        try {
            let data=req.body
            const result = await prisma.modelName.create({
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
            const result=await prisma.modelName.update({
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