const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// replace tag
const includeObj={}

module.exports={
    async create(req,res){
        try {
            let data=req.body
            const result = await prisma.tag.create({
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
            const result = await prisma.tag.findMany({
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
            const tag= await prisma.tag.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            return tag
        } catch (error) {
            throw error
        }
    },
    
    async update(req,res){
        try {
            const {id}=req.params
            const data=req.body
            const tag= await prisma.tag.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!tag){
                throw "Cannot find tag"
            }
            const result=await prisma.tag.findUnique({
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
            const tag= await prisma.tag.findUnique({
                where:{
                    id:Number(id)
                },
                include:includeObj
            })
            if(!tag){
                throw "Cannot find tag"
            }
            const result=await prisma.tag.delete({
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