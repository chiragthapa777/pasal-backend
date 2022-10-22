const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./paymentService")
const authorize = require("../../../middlewares/authorize");
const { PAYMENT_MODE } = require("../../../utils/constants");

//exchange Payment with model name
//exchange payment with base route name


/**
 * todo
 * add payment for order - it all then update order as paid
 * 
 * get payment - query(orderId, today, datefrom dateTo)
 * 
 */


/**
 * @swagger
 * /payment/:
 *   post:
 *     summary: Create Payment
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: number
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 1
 *               mode:
 *                 type: string
 *                 example: CASH

 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Some server error
 */
 router.post("/",authorize([]), async (req, res) => {
  try {
    const {amount, orderId, mode, remark}=req.body
    if(!mode || !orderId || !amount){
      throw "Invalid request"
    }
    if(!PAYMENT_MODE.includes(mode)){
      throw "Invalid mode"
    }
    if(amount<=0){
      throw "Amount should be greater than 0"
    }
    const data =await service.create(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
  });

/**
 * @swagger
 * /payment/:
 *   get:
 *     summary: get Payment
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         required: false
 *         description: order id example 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 */
router.get("/",authorize([]), async (req, res) => {
  try {
    const {orderId}=req.query
    if(orderId && isNaN(orderId)){
      throw "Invalid request"
    }
    const data =await service.find(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /payment/{id}:
 *   get:
 *     summary: Get the Payment by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Payment]
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
 *               $ref: '#/components/schemas/Payment'
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





module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
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
 *   name: Payment
 *   description: Payment
 */

