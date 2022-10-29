const express = require("express");
const router = express.Router();
const response = require("../../../utils/responseInterceptor");
const service = require(".//vendorService");
const authorize = require("../../../middlewares/authorize");

//exchange Example with model name
//exchange example with base route name

/**
 * @swagger
 * components:
 *   schemas:
 *     Vendor:
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
 *   name: Vendor
 *   description: Vendor
 */

/**
 * @swagger
 * /vendor/:
 *   get:
 *     summary: get example
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Vendor]
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
 *                 $ref: '#/components/schemas/Vendor'
 */
router.get("/", authorize([]), async (req, res) => {
	try {
		const data = await service.find(req, res);
		response.successResponse(res, data, 200);
	} catch (error) {
		response.errorResponse(res, error, 400);
	}
});

/**
 * @swagger
 * /vendor/{id}:
 *   get:
 *     summary: Get the example by id
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Vendor]
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
 *               $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: The book was not found
 */
router.get("/:id", authorize([]), async (req, res) => {
	try {
		const data = await service.findById(req, res);
		response.successResponse(res, data, 200);
	} catch (error) {
		response.errorResponse(res, error, 400);
	}
});

/**
 * @swagger
 * /vendor/:
 *   post:
 *     summary: Create Vendor
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ram supplier
 *               email:
 *                 type: string
 *                 example: ramsupplier@gmail.com
 *               desc:
 *                 type: string
 *                 example: we sell only branded product
 *               pan:
 *                 type: string
 *                 example: 2353445142
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       500:
 *         description: Some server error
 */
router.post("/", authorize([]), async (req, res) => {
	try {
		const data = await service.create(req, res);
		response.successResponse(res, data, 200);
	} catch (error) {
		console.log(error);
		response.errorResponse(res, error, 400);
	}
});

/**
 * @swagger
 * /vendor/{id}:
 *   put:
 *     summary: Edit Vendor
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Vendor]
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
 *                 example: Ram supplier
 *               email:
 *                 type: string
 *                 example: ramsupplier@gmail.com
 *               desc:
 *                 type: string
 *                 example: we sell only branded product
 *               pan:
 *                 type: string
 *                 example: 2353445142
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       500:
 *         description: Some server error
 */
router.put("/:id", authorize([]), async (req, res) => {
	try {
		const data = await service.update(req, res);
		response.successResponse(res, data, 200);
	} catch (error) {
		response.errorResponse(res, error, 400);
	}
});

/**
 * @swagger
 * /vendor/{vendorId}/acceptRequest:
 *   put:
 *     summary: accept vendor request by admin
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: number
 *         required: true
 *         description: The example id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       500:
 *         description: Some server error
 */
router.put("/:vendorId/acceptRequest", authorize(["ADMIN"]), async (req, res) => {
	try {
		const data = await service.acceptVendorRequest(req, res);
		response.successResponse(res, data, 200);
	} catch (error) {
		response.errorResponse(res, error, 400);
	}
});

/**
 * @swagger
 * /vendor/{id}:
 *   delete:
 *     deprecated: true
 *     summary: Delete
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Vendor]
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
 *               $ref: '#/components/schemas/Vendor'
 */
router.delete("/:id", authorize([]), async (req, res) => {
	try {
		const data = await service.delete(req, res);
		response.successResponse(res, data, 200);
	} catch (error) {
		response.errorResponse(res, error, 400);
	}
});

module.exports = router;
