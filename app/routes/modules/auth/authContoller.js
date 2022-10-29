const express = require("express");
const router = express.Router();
const response = require("../../../utils/responseInterceptor");
const service = require("./authService");


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: token
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: authentication
 */





/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: chirag@gmail.com
 *               password:
 *                 type: string
 *                 example: Sadmin@123
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
 router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if ( !email || !password) {
      throw "Complete information is not provided";
    }
    const data = await service.login(req,res);
    console.log(req.headers)
    response.successResponse(res, data, 200);
  } catch (error) {
    response.errorResponse(res, error, 400);
  }
});




/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create user and get token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: jwt token slud for admin 
 *         example: 1
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
 *                 type: number
 *                 example:
 *               vendor:
 *                 type: number
 *                 example:
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post("/register/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw "Complete information is not provided";
    }
    if (
      !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&?@ "])[a-zA-Z0-9!#$%&@?]{8,20}$/.test(
        password
      )
    ) {
      throw "password should contain atleast one number, one special character, one capital character and length should be between 8 to 20";
    }
    const data = await service.register(req,res);
    console.log(req.headers)
    response.successResponse(res, data, 200);
  } catch (error) {
    response.errorResponse(res, error, 400);
  }
});


/**
 * @swagger
 * /auth/register/{slug}:
 *   post:
 *     summary: Create a super admin and provide jwt slug
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: jwt token slud for admin 
 *         example: 1
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
 *                 type: number
 *                 example:
 *               vendor:
 *                 type: number
 *                 example:
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post("/register/:slug", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw "Complete information is not provided";
    }
    if (
      !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&?@ "])[a-zA-Z0-9!#$%&@?]{8,20}$/.test(
        password
      )
    ) {
      throw "password should contain atleast one number, one special character, one capital character and length should be between 8 to 20";
    }
    const data = await service.register(req);
    response.successResponse(res, data, 200);
  } catch (error) {
    response.errorResponse(res, error, 400);
  }
});


module.exports = router;
