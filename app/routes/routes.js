function router(app){   
    app.use("/auth",require("./modules/auth/authContoller"))
    app.use("/users",require("./modules/user/userController"))
    app.use("/product",require("./modules/product/productController"))
    app.use("/vendor",require("./modules/vendor/vendorContoller"))
    app.use("/cart",require("./modules/cart/cartContoller"))
    app.use("/review",require("./modules/review/reviewContoller"))
    app.use("/question",require("./modules/question/questionContoller"))

}

exports.router=router