const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// replace tag
const includeObj={
    _count: {
        select: { productTags: true },
      },
}

module.exports={
    async create(req,res){
        try {
            let data=req.body
            const tag = await prisma.tag.findUnique({
                where:{
                    name:data.name
                }
            })
            if(tag){
                throw "Tag with that name already exists"
            }
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
            if(req.query.search){
                whereObj.name={
                    contains : req.query.search,
                    mode: 'insensitive'
                }
            }
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
            if(req.body?.name){
                const check = await prisma.tag.findUnique({
                    where:{
                        name:req.body.name
                    }
                })
                if(check && check.id!==tag){
                    throw `Tag with name '${req.body.name}' already exists`
                }
            }
            const result=await prisma.tag.update({
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
    }
}