function router(app){   
    app.use("/auth",require("./modules/auth/authContoller"))
    app.use("/users",require("./modules/user/userController"))
    app.use("/product",require("./modules/product/productController"))
    app.use("/vendor",require("./modules/vendor/vendorContoller"))

}

exports.router=router