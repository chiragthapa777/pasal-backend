const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./shippingService")
const authorize = require("../../../middlewares/authorize");

//exchange Shipping with model name
//exchange shipping with base route name


/**
 * @swagger
 * /shipping/:
 *   post:
 *     summary: Create Shipping
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
  *               country:
 *                 type: string
 *                 example : Nepal
 *               province:
 *                 type: string
 *                 example : Bagmati
 *               district:
 *                 type: string
 *                 example : lalitpur
 *               ward:
 *                 type: string
 *                 example : 14
 *               street:
 *                 type: string
 *                 example : Ranibu
 *               phone:
 *                 type: string
 *                 example : 9810338573
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipping'
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
 * /shipping/:
 *   get:
 *     summary: get Shipping
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Shipping]
 *     parameters:
 *       - in: query
 *         name: userId
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
 *                 $ref: '#/components/schemas/Shipping'
 */
router.get("/",authorize([]), async (req, res) => {
  try {
    const {userId}=req.query
    if(userId && isNaN(userId)){
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
 * /shipping/{id}:
 *   get:
 *     summary: Get the Shipping by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Shipping]
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
 *               $ref: '#/components/schemas/Shipping'
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
 * /shipping:
 *   put:
 *     summary: Edit Shipping
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example : Nepal
 *               province:
 *                 type: string
 *                 example : Bagmati
 *               district:
 *                 type: string
 *                 example : lalitpur
 *               ward:
 *                 type: string
 *                 example : 14
 *               street:
 *                 type: string
 *                 example : Ranibu
 *               phone:
 *                 type: string
 *                 example : 9810338573
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipping'
 *       500:
 *         description: Some server error
 */
router.put("/",authorize([]), async (req, res) => {
  try {
    const data =await service.update(req,res)
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
 *     Shipping:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the book
 *       country:
 *         type: string
 *         example : Nepal
 *       province:
 *         type: string
 *         example : Bagmati
 *       district:
 *         type: string
 *         example : lalitpur
 *       ward:
 *         type: string
 *         example : 14
 *       street:
 *         type: string
 *         example : Ranibu
 *       phone:
 *         type: string
 *         example : 9810338573
 */

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Shipping
 */

