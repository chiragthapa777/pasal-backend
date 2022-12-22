const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./orderService")
const authorize = require("../../../middlewares/authorize");

//exchange Order with model name
//exchange order with base route name

// get order --> query (date from to, by user, isPaid, status  )
// get order by id
// create order by cart
// create order by req body
// get orderItems ---> (date from to, by vendor, status)
// get orderitem by id 
// update order
// order update orderItem


/**
 * @swagger
 * /order/:
 *   post:
 *     summary: Create Order by body
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 1
 *               items:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: number
 *                       example : 1
 *                     quantity:
 *                       type: number
 *                       example : 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
 router.post("/",authorize([]), async (req, res) => {
  try {
    const data =await service.create(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
  });
  
/**
 * @swagger
 * /order/byCart:
 *   post:
 *     summary: Create Order by cart
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 example: 1
 *               clearCart:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
 router.post("/byCart",authorize([]), async (req, res) => {
  try {
    const data =await service.createByCart(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
  });

/**
 * @swagger
 * /order/:
 *   get:
 *     summary: get Order
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         required: false
 *         example: 1
 *         description: order by user id
 *       - in: query
 *         name: isPaid
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: false
 *         description: The book id `true` or `false`
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *         required: false
 *         example: asdjgioasdb
 *         description: js date format
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *         required: false
 *         example: asdjgioasdb
 *         description: js date format
 *       - in: query
 *         name: today
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: false
 *         description: today's record only
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *         required: false
 *         example: asdjgioasdb
 *         description: js date format
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLACED, PROCESSING, WAREHOUSED, DELIVERING, COMPLETED]
 *         required: false
 *         description: status filter
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/",authorize([]), async (req, res) => {
  try {
    const {status, toDate, fromDate, today, userId, isPaid } = req.query
    console.log(req.query)
    const data =await service.find(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});


/**
 * @swagger
 * /order/items:
 *   get:
 *     summary: get Order items
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: vendorId
 *         schema:
 *           type: number
 *         required: false
 *         example: 1
 *         description: order by vendor id
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *         required: false
 *         example: asdjgioasdb
 *         description: js date format
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *         required: false
 *         example: asdjgioasdb
 *         description: js date format
 *       - in: query
 *         name: today
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: false
 *         description: today's record only
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLACED, PROCESSING, WAREHOUSED, DELIVERING, COMPLETED]
 *         required: false
 *         description: status filter
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
 router.get("/items",authorize([]), async (req, res) => {
  try {
    const {status, toDate, fromDate, today, vendorId } = req.query
    console.log(req.query)
    const data =await service.findOrderItems(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /order/items/{id}:
 *   get:
 *     summary: Get the Order items by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *         example: 1
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: The book was not found
 */
 router.get("/items/:id",authorize([]), async (req, res) => {
  try {
    const {id}=req.params
    if(!id || isNaN(id)){
      throw "Invalid request"
    }
    const data =await service.findOrderItemsById(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get the Order by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *         example: 1
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: The book was not found
 */
router.get("/:id",authorize([]), async (req, res) => {
  try {
    const {id}=req.params
    if(!id || isNaN(id)){
      throw "Invalid request"
    }
    const data =await service.findById(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});


/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: update the status of order by admin
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: WAREHOUSED
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
router.put("/:id",authorize(["ADMIN"]), async (req, res) => {
  try {
    const {id}=req.params
    const {status}=req.body
    const OrderStatusEnumForAdmin =["WAREHOUSED","DELIVERING","COMPLETED"]
    if(!OrderStatusEnumForAdmin.includes(status)){
      throw "Invalid status provided"
    }
    if(!id || isNaN(id)){
      throw "Invalid request"
    }
    const data =await service.update(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /order/{id}/items:
 *   put:
 *     summary: update the status of order items by vendors
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: PROCESSING
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
router.put("/:id/items",authorize(["VENDOR"]), async (req, res) => {
  try {
    const {id}=req.params
    console.log(req.body)
    const {status}=req.body
    const OrderStatusEnumForVendor =["PROCESSING","PLACED"]
    if(!OrderStatusEnumForVendor.includes(status)){
      throw "Invalid status provided"
    }
    if(!id || isNaN(id)){
      throw "Invalid request"
    }
    const data =await service.updateOrderItem(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});


module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The book title
 *         active:
 *           type: boolean
 *           description: The book author
 *       example:
 *         id: 1
 *         name: The New Turing Omnibus
 *         active: true
 */

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order
 */

