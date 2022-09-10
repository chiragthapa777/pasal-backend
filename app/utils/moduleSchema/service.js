module.exports={
    async create(req,res){
        try {
            return "create"
        } catch (error) {
            throw error
        }
    },
    async find(req,res){
        try {
            return "find"
        } catch (error) {
            throw error
        }
    },
    async findById(req,res){
        try {
            return "findById"
        } catch (error) {
            throw error
        }
    },
    async update(req,res){
        try {
            return "update"
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