const express = require("express");
const router = express.Router();
const response=require("../../../utils/responseInterceptor")
const service=require("./uploadService")
const authorize = require("../../../middlewares/authorize");
const fs=require("fs")


const removeTmp=(path)=>{
    try {
        
        fs.unlink(path,err=>{
            if(err) throw err;
        })
    } catch (error) {
        console.log(error)
    }
}

//exchange Review with model name
//exchange review with base route name

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: file upload in cloudinary
 */

/**
 * @swagger
 * /upload/uploadImage:
 *   post:
 *     summary: get Review
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.post("/uploadImage",authorize([]), async (req, res) => {
  try {
    //checking if file exists
    if (!req.files || Object.keys(req.files).length === 0) {
        throw "No files where uploaded"
      }
      const file = req.files.file; //file is the name of key files
      //less than 5 mb
      if (file.size > 1025 * 1025*5) {
          removeTmp(file.tempFilePath)
          throw "size is large" 
      }
      //file type
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
          removeTmp(file.tempFilePath)
          throw "file type/format not acceptable" 
      }   
    const data =await service.uploadImage(req,res)
    response.successResponse(res,data,200)
  } catch (error) {
    response.errorResponse(res, error, 400)
  }
});


/**
 * @swagger
 * /upload/deleteImage:
 *   post:
 *     summary: delete image
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               public_id:
 *                 type: string
 *                 example: pasal/xrheztamrt2ctiyjsvtv
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       500:
 *         description: Some server error
 */
 router.post("/deleteImage",authorize([]), async (req, res) => {
    try {
      const {public_id}=req.body
      if(!public_id ){
        throw "public_id is needed"
      }
      const data =await service.deleteImage(req,res)
      response.successResponse(res,data,200)
    } catch (error) {
      response.errorResponse(res, error, 400)
    }
    });



module.exports = router;

