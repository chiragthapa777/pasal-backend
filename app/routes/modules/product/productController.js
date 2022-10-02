const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./productService")
const authorize = require("../../../middlewares/authorize");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
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
 *       product:
 *         id: 1
 *         name: The New Turing Omnibus
 *         active: true
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product
 */

/**
 * @swagger
 * /product/:
 *   get:
 *     summary: get product
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         product: asdjgioasdb
 *         description: The book id `sadfgasdg` or `asdgsadgas`
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", authorize([]),async (req, res) => {
  try {
    const data =await service.find(req)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get the product by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The product id
 *         product: 1
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The book was not found
 */
router.get("/:id",authorize([]), async (req, res) => {
  try {
    const data =await service.findById(req)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /product/:
 *   post:
 *     summary: Create Product
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: pant
 *               desc:
 *                 type: string
 *                 example: pant
 *               price:
 *                 type: number
 *                 example: 1000
 *               groupId:
 *                 type: number
 *                 example: 
 *               active:
 *                 type: boolean
 *                 example: true
 *               quantity:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 * /product/{id}:
 *   put:
 *     summary: Edit Product
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: pant
 *               desc:
 *                 type: string
 *                 example: pant
 *               price:
 *                 type: number
 *                 example: 1000
 *               groupId:
 *                 type: number
 *                 example: 
 *               active:
 *                 type: boolean
 *                 example: true
 *               quantity:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.put("/:id",authorize([]), async (req, res) => {
  try {
    const data =await service.update(req)
    response.successResponse(res,data,200)
  } catch (error) {
    console.log(error)
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     deprecated: true
 *     summary: Delete Product
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.delete("/:id",authorize([]), async (req, res) => {
  try {
    const data =await service.delete(req)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});



module.exports = router;
