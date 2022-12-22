const { PrismaClient } = require("@prisma/client");
const { todayDateRange } = require("../../../utils/date");
const prisma = new PrismaClient();

// replace order
const includeObj = {
	orderItems: {
		include: {
			product: {
				include:{
					vendor:true
				}
			},
			othercharges: true,
		},
	},
	user:{
		include:{
			shipping:true
		}
	},
	payments:true
};

const itemsIncludeobj ={
	product:true
}

/**
 *
 * @param {number} userId
 * @param {[{productId:number,quantity:number, product:Product}]}  items
 * @returns {orderitemsArray} orderitemsArray
 */
async function orderItemReducer(userId, items) {
	return items.map((item) => {
		const total = item.quantity * item.product.price;
		let discount = 0;
		let discountPercent = 0;
		let vatPercent = 0;
		if (item.product?.discounts.length > 0) {
			discountPercent = item.product.discounts[0].percent;
			discount = (discountPercent / 100) * total;
		}
		const totalAfterDiscount = total - discount;
		const vat = 0;
		const totalWithVat = totalAfterDiscount + vat;
		const grandTotal = totalWithVat;
		return {
			productId: item.product.id,
			userId: Number(userId),
			total,
			discount,
			totalAfterDiscount,
			vat,
			totalWithVat,
			grandTotal,
			quantity: item.quantity,
			rate: item.product.price,
			discountPercent,
			vatPercent,
		};
	});
}

async function orderCalculator(items, userId) {
	const total = items.reduce((acc, next) => {
		if (next?.productId && !isNaN(next.productId)) {
			return acc + next.total;
		} else {
			return acc;
		}
	}, 0);
	const discount = items.reduce((acc, next) => {
		if (next?.productId && !isNaN(next.productId)) {
			return acc + next.discount;
		} else {
			return acc;
		}
	}, 0);
	const totalAfterDiscount = items.reduce((acc, next) => {
		if (next?.productId && !isNaN(next.productId)) {
			return acc + next.totalAfterDiscount;
		} else {
			return acc;
		}
	}, 0);
	const vat = items.reduce((acc, next) => {
		if (next?.productId && !isNaN(next.productId)) {
			return acc + next.vat;
		} else {
			return acc;
		}
	}, 0);
	const totalWithVat = items.reduce((acc, next) => {
		if (next?.productId && !isNaN(next.productId)) {
			return acc + next.totalWithVat;
		} else {
			return acc;
		}
	}, 0);
	const otherCharge = items.reduce((acc, next) => {
		if (next?.otherChargeId && !isNaN(next.otherChargeId)) {
			return acc + next.grandTotal;
		} else {
			return acc;
		}
	}, 0);
	return {
		userId: Number(userId),
		total,
		discount,
		totalAfterDiscount,
		vat,
		totalWithVat,
		otherCharge,
		grandTotal: totalWithVat + otherCharge,
	};
}

async function addDelivery(items, prisma, userId) {
	const delivery = await prisma.otherCharge.findUnique({
		where: {
			name: "delivery",
		},
	});
	if (!delivery) {
		throw "delivery charge is not seeded yet";
	}
	items.push({
		otherChargeId: delivery.id,
		userId: Number(userId),
		total: delivery.price,
		discount: 0,
		totalAfterDiscount: delivery.price,
		vat: 0,
		totalWithVat: delivery.price,
		grandTotal: delivery.price,
		quantity: 1,
		rate: delivery.price,
	});
}

const reduceStockOfProduct= async (tx, items)=>{
	for(const item of items){
		if(item.productId){
			const product =await tx.product.findUnique({
				where:{
					id:item.productId
				}
			})
			if(!product || !product.active){
				throw "Cannot find the product"
			}
			if(product.quantity < item.quantity){
				throw "Product's stock is not enough"
			}
			await tx.product.update({
				where:{
					id:item.productId
				},
				data:{
					quantity:product.quantity-item.quantity
				}
			})
		}
	}
}

/**
 *
 * @param {number} userId
 * @param {[{productId:number,quantity:number, product:Product}]}  items
 * @returns {order}
 */
async function generateOrder(userId, items) {
	try {
		return await prisma.$transaction(async (tx) => {
			const orderItemReduced = await orderItemReducer(userId, items);
			await addDelivery(orderItemReduced, prisma, userId);
			const orderData = await orderCalculator(orderItemReduced, userId);
			const order = await tx.order.create({
				data: orderData,
			});
			for (const i in orderItemReduced) {
				orderItemReduced[i] = {
					...orderItemReduced[i],
					orderId: order.id,
				};
			}
			const orderItems = await tx.orderItems.createMany({
				data: orderItemReduced,
			});
			await reduceStockOfProduct(tx,orderItemReduced)
			return tx.order.findUnique({
				where: {
					id: order.id,
				},
				include: includeObj,
			});
		});
	} catch (error) {
		console.log("generateOrder ERROR : ", error);
		throw error;
	}
}

module.exports = {
	async create(req, res) {
		try {
			let { items, userId } = req.body;
			//check item and quantity
			for (const i in items) {
				const product = await prisma.product.findUnique({
					where: {
						id: Number(items[i].productId),
					},
					include: {
						discounts: {
							where: {
								isValid: true,
							},
						},
					},
				});
				if (!product || !product.active) {
					throw "Cannot find the product";
				}
				if (items[i].quantity > product.quantity) {
					throw `Demanded quantity is more than available stock for ${product.name}`;
				}
				items[i].product = product;
			}
			//check user
			const user = await prisma.user.findUnique({
				where: {
					id: Number(userId),
				},
			});
			if (!user) {
				throw "Invalid user";
			}
			const result = await generateOrder(userId, items);
			console.log("ORDER : ", result);
			return result;
		} catch (error) {
			throw error;
		}
	},
	async createByCart(req, res) {
		try {
			let { userId, clearCart } = req.body;
			//check user
			const user = await prisma.user.findUnique({
				where: {
					id: Number(userId),
				},
			});
			if (!user) {
				throw "Invalid user";
			}
			const cart = await prisma.cart.findUnique({
				where: {
					userId: user.id,
				},
				include: {
					cartDetails: {
						where: {
							active: true,
						},
					},
				},
			});
			if (!cart || !cart.cartDetails.length > 0) {
				throw "Your cart is empty";
			}
			const items = [];
			for (const i in cart.cartDetails) {
				const product = await prisma.product.findUnique({
					where: {
						id: Number(cart.cartDetails[i].productId),
					},
					include: {
						discounts: {
							where: {
								isValid: true,
							},
						},
					},
				});
				if (!product || !product.active) {
					throw "Cannot find the product";
				}
				items[i] = {
					productId: cart.cartDetails[i].productId,
					quantity: cart.cartDetails[i].quantity,
				};
				if (cart.cartDetails[i].quantity > product.quantity) {
					throw `Demanded quantity is more than available stock for ${product.name}`;
				}
				items[i].product = product;
			}

			const result = await generateOrder(userId, items);
			if (result && clearCart) {
				await prisma.cartDetails.updateMany({
					where: {
						active: true,
						userId: user.id,
					},
					data: {
						active: false,
					},
				});
			}
			return result;
		} catch (error) {
			console.log("Create by cart : ", error);
			throw error;
		}
	},
	async find(req, res) {
		try {
			const { status, toDate, fromDate, today, userId, isPaid } =
				req.query;
			let whereObj = {};
			if (status) {
				whereObj.status = status;
			}
			if (toDate && fromDate) {
				whereObj.createdAt = {
					lte: new Date(toDate),
					gte: new Date(fromDate),
				};
			}
			if (today === "true") {
				const dateRange = todayDateRange();
				whereObj.createdAt = {
					lte: new Date(dateRange[1]),
					gte: new Date(dateRange[0]),
				};
			}
			if (userId) {
				whereObj.userId = Number(userId);
			}
			if (isPaid === "true" || isPaid === "false") {
				whereObj.isPaid = isPaid === "true" ? true : false;
			}
			const result = await prisma.order.findMany({
				where: whereObj,
				include: includeObj,
			});
			return result;
		} catch (error) {
			throw error;
		}
	},
	async findOrderItems(req, res) {
		try {
			const { status, toDate, fromDate, today, vendorId } = req.query;
			let whereObj = {};
			if (status) {
				whereObj.status = status;
			}
			if (toDate && fromDate) {
				whereObj.createdAt = {
					lte: new Date(toDate),
					gte: new Date(fromDate),
				};
			}
			if (today === "true") {
				const dateRange = todayDateRange();
				whereObj.createdAt = {
					lte: new Date(dateRange[1]),
					gte: new Date(dateRange[0]),
				};
			}
			if (vendorId) {
				whereObj.product ={
					vendorId:Number(vendorId)
				} ;
			}
			const result = await prisma.orderItems.findMany({
				where: whereObj,
				include:itemsIncludeobj
			});
			return result;
		} catch (error) {
			throw error;
		}
	},
	async findById(req, res) {
		try {
			const { id } = req.params;
			const order = await prisma.order.findUnique({
				where: {
					id: Number(id),
				},
				include: includeObj,
			});
			return order;
		} catch (error) {
			throw error;
		}
	},
	async findOrderItemsById(req, res) {
		try {
			const { id } = req.params;
			const order = await prisma.orderItems.findUnique({
				where: {
					id: Number(id),
				},
				include:itemsIncludeobj
			});
			return order;
		} catch (error) {
			throw error;
		}
	},

	async update(req, res) {
		try {
			const { id } = req.params;
			const { status } = req.body;
			const order = await prisma.order.findUnique({
				where: {
					id: Number(id),
				},
				include: includeObj,
			});
			if (!order) {
				throw "Cannot find order";
			}
			const updateFunction = async (status) => {
				return await prisma.$transaction(async (tx) => {
					await tx.orderItems.updateMany({
						where: {
							orderId: order.id,
						},
						data: {
							status,
						},
					});
					return await tx.order.update({
						where: {
							id: Number(id),
						},
						data: {
							status,
						},
						include: includeObj,
					});
				});
			};
			const orderStatus = order.status;
			let result = {};
			switch (orderStatus) {
				case "PLACED": {
					throw "First all items from vendor should be in `PROCESSING`";
				}
				case "PROCESSING": {
					if (status !== "WAREHOUSED") {
						throw "First the order and its all item should be `WAREHOUSED`";
					}
					result = await updateFunction(status);
					break;
				}
				case "WAREHOUSED": {
					if (status !== "DELIVERING") {
						throw "First the order should be `DELIVERING`";
					}
					result = await updateFunction(status);
					break;
				}
				case "DELIVERING": {
					if (status !== "COMPLETED") {
						throw "`COMPLETED` is only the option";
					}
					result = await updateFunction(status);
					break;
				}
				default: {
					throw "Something went wrong with order";
				}
			}
			return result;
		} catch (error) {
			throw error;
		}
	},
	async updateOrderItem(req, res) {
		try {
			const { id } = req.params;
			const { status } = req.body;
			let item = await prisma.orderItems.findUnique({
				where: {
					id: Number(id),
				},
				include: itemsIncludeobj,
			});
			if (!item) {
				throw "Cannot find order";
			}
			// if (item.status !== "PLACED") {
			// 	throw "You are not authorized";
			// }
			if(item.status !== "PROCESSING" && status==="PLACED"){
				throw "You cannot revert after item's are warehoused"
			}
			await prisma.$transaction(async (tx) => {	
				item = await tx.orderItems.update({
					where: {
						id:item.id
					},
					include:itemsIncludeobj,
					data: {
						status,
					},
				});
                const otherItems = await prisma.orderItems.findMany({
                    where:{
                        orderId:item.orderId
                    }
                })
                let updateOrder=true
                for(const i of otherItems){
                    if(!i.otherChargeId && i.status!=="PROCESSING" && i.id !== item.id){
                        updateOrder=false
                        break
                    }
                }
                if(updateOrder){
                    await tx.order.update({
                        where:{
                            id:item.orderId
                        },
                        data:{
                            status:"PROCESSING"
                        }
                    })
                }
			});
            return item;
		} catch (error) {
			throw error;
		}
	},
};
