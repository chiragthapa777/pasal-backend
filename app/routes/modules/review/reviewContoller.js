const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./reviewService")
const authorize = require("../../../middlewares/authorize");

//exchange Review with model name
//exchange review with base route name

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
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
 *   name: Review
 *   description: Review
 */

/**
 * @swagger
 * /review/:
 *   get:
 *     summary: get Review
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Review]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
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
 * /review/{id}:
 *   get:
 *     summary: Get the Review by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: The book was not found
 */
router.get("/:id",authorize([]), async (req, res) => {
  try {
    const {id}=req.params
    if(!id || isNaN(id)){
          throw "Invalid id provided"
    }
    const data =await service.findById(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /review/:
 *   post:
 *     summary: Create Review
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
 *                 type: string
 *                 example: i like the product
 *               productId:
 *                 type: number
 *                 example: 1
 *               userId:
 *                 type: number
 *                 example: 7
 *               rating:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Some server error
 */
router.post("/",authorize([]), async (req, res) => {
try {
  const {feedback, productId, userId, rating}=req.body
  if(!feedback || !productId || !userId || !rating || isNaN(productId) || isNaN(userId) || isNaN(rating) ){
    throw "invalid request"
  }
  if(rating>5 || rating<0){
    throw "Rating must be between 0 to 5"
  }
  const data =await service.create(req,res)
  response.successResponse(res,data,200)
} catch (error) {
  response.errorResponse(res, error, 400)
}
});

/**
 * @swagger
 * /review/{id}:
 *   put:
 *     summary: Edit Review
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Review]
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
 *               feedback:
 *                 type: string
 *                 example: new feedback
 *               rating:
 *                 type: number
 *                 example: 2

 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Some server error
 */
router.put("/:id",authorize([]), async (req, res) => {
  try {
    const {feedback, rating}=req.body
    if(rating && (rating>5 || rating<0)){
      throw "Rating must be between 0 to 5"
    }
    const {id}=req.params
    if(!id || isNaN(id)){
          throw "Invalid id provided"
    }
    const data =await service.update(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     summary: Delete Review
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Review]
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
 *               $ref: '#/components/schemas/Review'
 */
router.delete("/:id",authorize([]), async (req, res) => {
  try {
    const {id}=req.params
    if(!id || isNaN(id)){
          throw "Invalid id provided"
    }
    const data =await service.delete(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});



module.exports = router;
