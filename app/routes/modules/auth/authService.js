const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cookie = require('cookie')
// const {prisma}=require("../../../middlewares/excludePassword")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async register(req,res) {
    const { name, email, password, number, vendorId } = req.body;
    const { slug }=req.params
    try {
      let user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        throw "Email already exists";
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      console.log(req.params)
      const data = {
        name,
        email,
        password: hashPassword,
        number: number ? number : null,
        vendorId: vendorId ? Number(vendorId) : null,
        role: slug ? "ADMIN" : "USER"

      };
      user = await prisma.user.create({ data });
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          vendorId: user.vendorId,
          name: user.name,
        },
        process.env.SECRET_KEY
      );
      delete user.password;
      return { token, ...user };
    } catch (error) {
      throw error;
    }
  },
  async login(req,res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!user) {
        throw "Email or password is not correct";
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw "Email or password is not correct";
      }
      console.log(user)
      const payload = {
        id: user.id,
        role: user.role,
        vendorId: user.vendorId,
        name: user.name,
      }
      const token = jwt.sign(payload,process.env.SECRET_KEY);
      delete user.password;
      // res.setHeader(
      //   "Set-Cookie",
      //   cookie.serialize("token", token, {
      //     // httpOnly: true,
      //     // secure: process.env.NODE_ENV !== "development",
      //     // maxAge:  60 * 60,
      //     // sameSite: "strict",
      //     // path: "/",
      //   })
      // );
      return { token, ...user };
    } catch (error) {
      throw error;
    }
  },
};
