const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./discountService")
const authorize = require("../../../middlewares/authorize");

//exchange Discount with model name
//exchange discount with base route name


/**
 * @swagger
 * /discount/:
 *   post:
 *     summary: Create Discount
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Discount]
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
 *               percent:
 *                 type: number
 *                 example: 10
 *               isValid:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       500:
 *         description: Some server error
 */
 router.post("/",authorize(["VENDOR"]), async (req, res) => {
  try {
    let {percent, isValid, productId}=req.body
    if(percent>100 || percent<1){
      throw "percent should be between 0 to 100"
    }
    const data =await service.create(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
  });

/**
 * @swagger
 * /discount/:
 *   get:
 *     summary: get Discount
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Discount]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: number
 *         required: false
 *         description: product id
 *       - in: query
 *         name: isValid
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: false
 *         description: isValid
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discount'
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
 * /discount/{id}:
 *   get:
 *     summary: Get the Discount by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Discount]
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
 *               $ref: '#/components/schemas/Discount'
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
 * /discount/{id}:
 *   put:
 *     summary: Edit Discount
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Discount]
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
 *               percent:
 *                 type: number
 *                 example: 10
 *               isValid:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
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
 * /discount/{id}:
 *   delete:
 *     deprecated: true
 *     summary: Delete Discount
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Discount]
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
 *               $ref: '#/components/schemas/Discount'
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
 *     Discount:
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
 *   name: Discount
 *   description: Discount
 */

