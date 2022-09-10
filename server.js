const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { router } = require("./app/routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const {  swaggerDocs, swaggerOptions } = require("./swaggerOptions");

//configs
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs)
});
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
