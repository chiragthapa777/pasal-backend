const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./tagService")
const authorize = require("../../../middlewares/authorize");

//exchange Tag with model name
//exchange tag with base route name


/**
 * @swagger
 * /tag/:
 *   post:
 *     summary: Create Tag
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Tag]
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
 *               desc:
 *                 type: string
 *                 example: This is the description of tag
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Some server error
 */
 router.post("/",authorize(["ADMIN"]), async (req, res) => {
  try {
    const{name, desc}=req.body
    if(!name || name===""){
      throw "Tag/Category name much be given"
    }
    const data =await service.create(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
  });

/**
 * @swagger
 * /tag/:
 *   get:
 *     summary: get Tag
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Tag]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         example: asdjgioasdb
 *         description: The book id `sadfgasdg` or `asdgsadgas`
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
router.get("/", async (req, res) => {
  try {
    const data =await service.find(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});

/**
 * @swagger
 * /tag/{id}:
 *   get:
 *     summary: Get the Tag by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Tag]
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
 *               $ref: '#/components/schemas/Tag'
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
 * /tag/{id}:
 *   put:
 *     summary: Edit Tag
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Tag]
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
 *               desc:
 *                 type: string
 *                 example: This is the description of tag
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Some server error
 */
router.put("/:id",authorize(["ADMIN"]), async (req, res) => {
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






module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
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
 *   name: Tag
 *   description: Tag
 */

