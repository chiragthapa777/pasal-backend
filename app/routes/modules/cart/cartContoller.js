const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./cartService")
const authorize = require("../../../middlewares/authorize");

//add item to cart
//remove item to cart : active : false
//change quantity of cart

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
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
 *   name: Cart
 *   description: Cart
 */

/**
 * @swagger
 * /cart/:
 *   get:
 *     summary: get Cart
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */
router.get("/",authorize([]), async (req, res) => {
  try {
    const data =await service.find(req)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /cart/:
 *   post:
 *     summary: Create Cart
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some server error
 */
router.post("/",authorize([]), async (req, res) => {
try {
  const data =await service.create(req)
  response.successResponse(res,data,200)
} catch (error) {
  response.errorResponse(res, error, 400)
}
});

/**
 * @swagger
 * /cart/addProduct:
 *   put:
 *     summary: add product in cart
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 example: 1
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some server error
 */
 router.put("/addProduct",authorize([]), async (req, res) => {
  try {
    const {productId, quantity}= req.body
    if(!productId || !quantity){
      throw "Invalid option"
    }
    const data =await service.addProduct(req)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /cart/removeProduct/{productId}:
 *   delete:
 *     summary: add product in cart
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some server error
 */
 router.delete("/removeProduct/:productId",authorize([]), async (req, res) => {
  try {
    const data =await service.removeProduct(req)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /cart/editProduct/{productId}:
 *   put:
 *     summary: Edit Cart
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some server error
 */
router.put("/editProduct/:productId",authorize([]), async (req, res) => {
  try {
    const data =await service.editProduct(req)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});




module.exports = router;
