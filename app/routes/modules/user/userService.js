const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");


const includeObj={
    vendor:true,
    _count:{
        select:{
            products:true,
        }
    }
}

module.exports={
    async getUsers(req){
        try {
            let whereObj={}
            let users=await prisma.user.findMany({
                where:whereObj,
                include:includeObj
            })
            users=users.map(u=>{
                delete u.password
                return u
            })
            return users
        } catch (error) {
            throw error
        }
    },
    async getUserById(req){
        try {
            const {id}=req.params
            let whereObj={
                id:Number(id)
            }
            let user=await prisma.user.findUnique({
                where:whereObj,
                include:includeObj
            })
            delete user?.password
            return user
        } catch (error) {
            throw error
        }
    },
    async editUser(req){
        try {
            const { id }=req.params
            const { password, name, email, vendorId, number } = req.body;
            let user= await prisma.user.findUnique({
                where:{
                    id:Number(id)
                }
            })
            if(email && user.email!==email){
                let user= await prisma.user.findUnique({
                    where:{
                        email
                    }
                })
                if(user){
                    throw "Email already exists"
                }
            }
            if(!user){
                throw "Cannot find the user"
            }
            if(Number(id)!==req.user.id){
                throw "You are not authorized to edit this account"
            }
            const data={
                name,
                email,
                number,
                vendorId
            }
            if(password){
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
                data.password=hashPassword
            }
            user=await prisma.user.update({
                where:{
                    id:Number(id)
                },
                data
            })
            return user
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}