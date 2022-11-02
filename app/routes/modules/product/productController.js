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
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/",authorize(["VISITOR"]),async (req, res) => {
  try {
    console.log(req.query)
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
router.get("/:id",authorize(["VISITOR"]), async (req, res) => {
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
 *               images:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: dasgas
 *                     public_url:
 *                       type: string
 *                       example: sadgsd
 *                     desc:
 *                       type: string
 *                       example: this is desc for image
 *               tags:
 *                 type: array
 *                 items: 
 *                   type: string
 *                   exmaple : ["Men's Fashion"]
 * 
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.post("/",authorize(["VENDOR"]), async (req, res) => {
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
 *               images:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: dasgas
 *                     public_url:
 *                       type: string
 *                       example: sadgsd
 *                     desc:
 *                       type: string
 *                       example: this is desc for image
 *               tags:
 *                 type: array
 *                 items: 
 *                   type: string
 *                   exmaple : ["Men's Fashion"]
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
 * /product/image/{id}:
 *   delete:
 *     deprecated: false
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
router.delete("/image/:id",authorize([]), async (req, res) => {
  try {
    const data =await service.deleteImage(req)
    response.successResponse(res,data,200)
  } catch (error) {
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


/**
 * @swagger
 * /product/addImage:
 *   post:
 *     summary: Edit Product
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
 *               productId:
 *                 type: number
 *                 example: 1
 *               url:
 *                 type: string
 *                 example: dasgas
 *               public_url:
 *                 type: string
 *                 example: sadgsd
 *               desc:
 *                 type: string
 *                 example: this is desc for image
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
 router.post("/addImage",authorize([]), async (req, res) => {
  try {
    const data =await service.addImage(req)
    response.successResponse(res,data,200)
  } catch (error) {
    console.log(error)
    response.errorResponse(res, error, 400)
  }
});




module.exports = router;
