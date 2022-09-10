const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { router } = require("./app/routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { options } = require("./swaggerOptions");

//configs
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
//varibles
const port = process.env.PORT;

//routing
router(app);

//server
app.listen(port, async () => {
  console.log(
    `\n. . . . . . . . . . . . . . . . . . . . . . . .\n|__________Welcome to Pasal server____________| \n|       http://localhost:${port}/api-docs        |\n. . . . . . . . . . . . . . . . . . . . . . . .\n`
  );
});
