function router(app){   
    app.use("/auth",require("./modules/auth/authContoller"))
    app.use("/users",require("./modules/user/userController"))
    app.use("/product",require("./modules/product/productController"))
    app.use("/vendor",require("./modules/vendor/vendorContoller"))
    app.use("/cart",require("./modules/cart/cartContoller"))
    app.use("/review",require("./modules/review/reviewContoller"))
    app.use("/question",require("./modules/question/questionContoller"))
    app.use("/upload",require("./modules/uploads/uploadController"))
    app.use("/order",require("./modules/order/orderContoller"))
    app.use("/shipping",require("./modules/shipping/shippingContoller"))
    app.use("/payment",require("./modules/payment/paymentContoller"))
    app.use("/discount",require("./modules/discount/discountContoller"))

}

exports.router=router