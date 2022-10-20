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
 * /order/:
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
 * /order/:
 *   get:
 *     summary: get Order
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         example: asdjgioasdb
 *         description: The book id `sadfgasdg` or `asdgsadgas`
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
    const data =await service.find(req,res)
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
 *     summary: Edit Order
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
 *               name:
 *                 type: string
 *                 example: chirag
 *               age:
 *                 type: number
 *                 example: 1
 *               active:
 *                 type: boolean
 *                 example: true
 *               orders:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     orderName:
 *                       type: string
 *                       example : aoshdgoiash
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
router.put("/:id",authorize([]), async (req, res) => {
  try {
    const {id}=req.params
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
 * /order/{id}:
 *   delete:
 *     summary: Delete Order
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
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.delete("/:id",authorize([]), async (req, res) => {
  try {
    const {id}=req.params
    if(!id || isNaN(id)){
      throw "Invalid request"
    }
    const data =await service.delete(req,res)
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

