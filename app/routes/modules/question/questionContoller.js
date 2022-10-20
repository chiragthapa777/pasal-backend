const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./questionService")
const authorize = require("../../../middlewares/authorize");

//exchange Question with model name
//exchange question with base route name


/**
 * @swagger
 * /question/:
 *   post:
 *     summary: Create Question
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: is it avaible in big size?
 *               productId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       500:
 *         description: Some server error
 */
 router.post("/",authorize([]), async (req, res) => {
  try {
    const {productId, question}=req.body
    if(!question || !productId || isNaN(productId)){
      throw "Invalid request"
    }
    const data =await service.create(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
  });

/**
 * @swagger
 * /question/:
 *   get:
 *     summary: get Question
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Question]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: number
 *         required: false
 *         example: 1
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
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
 * /question/{id}:
 *   get:
 *     summary: Get the Question by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Question]
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
 *               $ref: '#/components/schemas/Question'
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
 * /question/{id}:
 *   put:
 *     summary: Edit Question
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Question]
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
 *               $ref: '#/components/schemas/Question'
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
 * /question/{id}:
 *   delete:
 *     summary: Delete Question
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Question]
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
 *               $ref: '#/components/schemas/Question'
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

/**
 * @swagger
 * /question/{questionId}/answer:
 *   post:
 *     summary: Delete Question
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: questionId
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
 *               answer:
 *                 type: string
 *                 example: this is answer to the question
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 */
router.post("/:questionId/answer",authorize([]), async (req, res) => {
  try {
    const {questionId}=req.params
    const {answer}=req.body
    if(!questionId || isNaN(questionId) || !answer){
      throw "Invalid request"
    }
    const data =await service.addAnswerToQsn(req,res)
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
 *     Question:
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
 *   name: Question
 *   description: Question
 */

