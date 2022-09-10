const  response  = require("../../../utils/responseInterceptor");
const express = require("express");
const authorize = require("../../../middlewares/authorize");
const router = express.Router();
const service=require("./userService")

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
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
 *         email:
 *           type: string
 *           description: The book title
 *         active:
 *           type: boolean
 *           description: The book author
 *         number:
 *           type: number
 *           description: 982344236
 *         vendorId:
 *           type: number
 *           description: 36
 *       example:
 *         id: 1
 *         name: chirag thapa
 *         email: chirag@gmail.com
 *         active: true
 *         number: 234634645754
 *         vendor: 1
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Users of the pasal
 */


/**
 * @swagger
 * /users/:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Get users
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         example: asdjgioasdb
 *         description: The book id `sadfgasdg` or `asdgsadgas`
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/",authorize([]), async (req, res) => {
  try {
    const data = await service.getUsers(req);
    response.successResponse(res, data, 200);
  } catch (error) {
    response.errorResponse(res, error, 400);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Get the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The book id
 *         example: 1
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The book was not found
 */
router.get("/:id",authorize([]), async (req, res) => {
  try {
    const {id}=req.params
    if(!id){
      throw "User id must be provided"
    }
    const data = await service.getUserById(req);
    response.successResponse(res, data, 200);
  } catch (error) {
    response.errorResponse(res, error, 400);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: edit
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: chirag thapa
 *               email:
 *                 type: string
 *                 example: chirag@gmail.com
 *               password:
 *                 type: string
 *                 example: Sadmin@123
 *               number:
 *                 type: string
 *                 example: "49283465"
 *               vendorId:
 *                 type: number
 *                 example:
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.put("/:id",authorize([]), async (req, res) => {
  try {
    const { password } = req.body;
    const { id }=req.params
    if(!id){
      throw "User id must be provided"
    }
    if (password &&
      !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&?@ "])[a-zA-Z0-9!#$%&@?]{8,20}$/.test(
        password
      )
    ) {
      throw "password should contain atleast one number, one special character, one capital character and length should be between 8 to 20";
    }
    const data = await service.editUser(req);
    response.successResponse(res, data, 200);
  } catch (error) {
    response.errorResponse(res, error, 400);
  }
});
module.exports = router;
