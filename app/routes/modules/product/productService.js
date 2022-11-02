const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const {prisma}=require("../../../middlewares/excludePassword")
const {
	productIncludeObject: includeObj,
} = require("../../../utils/modelInclude");
const { deleteImage } = require("../uploads/uploadService");

const roundOffFunction = (avg) => {
	const difference = avg - Math.floor(avg);
	if(difference === 0){
		return avg
	}else if (difference > 0.5) {
		return Math.floor(avg) + 0.5;
	} else {
		return Math.floor(avg) + 1;
	}
};
/**
 * 
 * @param {[string]} tags 
 * @param {number} productId 
 * @param {prisma} prisma 
 */
const addTagsToProduct=async (tags,productId,prisma)=>{
	await prisma.product_Tag.deleteMany({
		where:{
			productId
		}
	})
	for(const tag of tags){
		const checkTag = await prisma.tag.findUnique({
			where:{
				name:tag
			}
		})
		if(!checkTag){
			throw `Cannot find tag with name ${tag}`
		}
		await prisma.product_Tag.create({
			data:{
				productId,
				tagId:checkTag.id
			}
		})
	}
}
/**
 * 
 * @param {[{url:string,public_url:string,desc:string}]} images 
 * @param {product} product
 * @param {prisma} prisma 
 */
const addImagesToProduct=async (images,product,prisma)=>{
	for(const image of images){
		await prisma.productImage.create({
			data:{
				public_url:image.public_url,
				url:image.url,
				desc:image?.desc || product.name,
				productId:product.id
			}
		})
	}
}

module.exports = {
	async create(req) {
		try {
			const data = { ...req.body };
			const tags = data?.tags || []
			if(data?.tags || tags.length>0){
				delete data.tags
				if(tags.length>5) throw "A product can have atmost 5 tags"
			}
			const images = data?.images || []
			if(data?.images || images.length>0){
				delete data.images
			}
			if (!req.user.vendorId) {
				throw "You cannot create product, become seller first.";
			}
			data.userId = Number(req.user.id);
			data.vendorId = Number(req.user.vendorId);
			let result = {}
			return await prisma.$transaction(async(tx)=>{
				//create product
				let refetchData = false
				const product = await tx.product.create({
					data,
					include: includeObj,
				});
				result = product
				if(tags.length>0){
					await addTagsToProduct(tags,product.id,tx)
					refetchData = true
				}
				if(images.length>0){
					await addImagesToProduct(images,product,tx)
					refetchData = true
				}
				if(refetchData){
					result = await tx.product.findUnique({
						where:{
							id:product.id
						},
						include:includeObj,
					})
				}
				return result
			})
		} catch (error) {
			throw error;
		}
	},
	async find(req) {
		try {
			const { search, vendor, tag } = req.query;
			let whereObj = {};
			if (search) {
				whereObj.OR = [
					{
						name: {
							contains: search,
							mode: "insensitive",
						},
					},
					{
						desc: {
							contains: search,
							mode: "insensitive",
						},
					},
				];
			}
            if(tag){
                whereObj={
                    productTags:{
                        some:{
                            tag:{
                                name:tag
                            }
                        }
                    }
                }
            }
            if(vendor){
                whereObj={
                    vendor:{
						name:vendor
					}
                }
            }
			let orderByObj = {};
			const products = await prisma.product.findMany({
				where: whereObj,
				include: includeObj,
				orderBy: orderByObj,
			});
			for (let p in products) {
				let averageRating = 0;
				let total = 0;
				const length = products[p]?.reviews?.length
					? products[p].reviews.length !== 0
						? products[p].reviews.length
						: 0
					: 0;
				for (let review of products[p]?.reviews) {
					total += review.rating;
				}
				averageRating = length!==0 ? total / length : 0;
				products[p] = {
					...products[p],
					averageRating: roundOffFunction(averageRating),
				};
			}
			return products;
		} catch (error) {
			throw error;
		}
	},
	async findById(req) {
		try {
			let averageRating = 0;

			let whereObj = {
				id: Number(req.params.id),
			};
			const product = await prisma.product.findUnique({
				where: whereObj,
				include: includeObj,
			});
			let total = 0;
			const length = product?.reviews?.length
				? product.reviews.length !== 0
					? product.reviews.length
					: 0
				: 0;
			for (let review of product?.reviews) {
				total += review.rating;
			}
			averageRating = length!==0 ? total / length : 0;
			return {
				...product,
				averageRating: roundOffFunction(averageRating),
			};
		} catch (error) {
			throw error;
		}
	},
	async update(req) {
		try {
			console.log(req.params, req.body);
			const data = { ...req.body };
			const tags = data?.tags || [];
			if (data?.tags || tags.length > 0) {
				delete data.tags;
				if (tags.length > 5) throw "A product can have atmost 5 tags";
			}
			const images = data?.images || [];
			if (data?.images || images.length > 0) {
				delete data.images;
			}
			let product = await prisma.product.findUnique({
				where: {
					id: Number(req.params.id),
				},
			});
			if (!product) {
				throw "Cannot find the product";
			}
			let result = {};
			if(tags.length>0){
				await addTagsToProduct(tags,product.id,prisma)
			}
			if(images.length>0){
				await addImagesToProduct(images,product,prisma)
			}
			result = await prisma.product.update({
				where: {
					id: Number(req.params.id),
				},
				data,
				include: includeObj,
			});
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
	async delete(req) {
		try {
			let product = await prisma.product.findUnique({
				where: {
					id: Number(req.params.id),
				},
			});
			if (!product) {
				throw "Cannot find the product";
			}
			return await prisma.product.update({
				where: {
					id: Number(req.params.id),
				},
				data: {
					active: false,
				},
				include: includeObj,
			});
		} catch (error) {
			throw error;
		}
	},
	async addImage(req) {
		try {
			const { productId, url, public_url, desc } = req.body;
			let product = await prisma.product.findUnique({
				where: {
					id: Number(productId),
				},
			});
			if (!product) {
				throw "cannot find product";
			}
			
			const productImage = await prisma.productImage.create({
				data: {
					productId: Number(productId),
					url,
					public_url,
					desc,
				},
			});
			return productImage;
		} catch (error) {
			throw error;
		}
	},
	async deleteImage(req) {
		try {
			const { id } = req.params;
			let product = await prisma.productImage.findUnique({
				where: {
					id: Number(id),
				},
			});
			if (!product) {
				throw "cannot find productImage";
			}
			const { public_url } = product;
			await deleteImage({ body: { public_id: public_url } }, {});
			const productImage = await prisma.productImage.delete({
				where: {
					id: Number(id),
				},
			});
			return productImage;
		} catch (error) {
			throw error;
		}
	},
};
