const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./Service")
const authorize = require("../../../middlewares/authorize");

//exchange ModelName with model name
//exchange routeName with base route name

/**
 * @swagger
 * components:
 *   schemas:
 *     ModelName:
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
 *   name: ModelName
 *   description: ModelName
 */

/**
 * @swagger
 * /routeName/:
 *   get:
 *     summary: get ModelName
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [ModelName]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModelName'
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
 * /routeName/{id}:
 *   get:
 *     summary: Get the ModelName by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [ModelName]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *         example: 1
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         example: asdjgioasdb
 *         description: The book id `sadfgasdg` or `asdgsadgas`
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModelName'
 *       404:
 *         description: The book was not found
 */
router.get("/:id",authorize([]), async (req, res) => {
  try {
    const data =await service.findById(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /routeName/:
 *   post:
 *     summary: Create ModelName
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [ModelName]
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
 *               $ref: '#/components/schemas/ModelName'
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
 * /routeName/{id}:
 *   put:
 *     summary: Edit ModelName
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [ModelName]
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
 *               $ref: '#/components/schemas/ModelName'
 *       500:
 *         description: Some server error
 */
router.put("/:id",authorize([]), async (req, res) => {
  try {
    const data =await service.update(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /routeName/{id}:
 *   delete:
 *     summary: Delete ModelName
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [ModelName]
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
 *               $ref: '#/components/schemas/ModelName'
 */
router.delete("/:id",authorize([]), async (req, res) => {
  try {
    const data =await service.delete(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});



module.exports = router;
