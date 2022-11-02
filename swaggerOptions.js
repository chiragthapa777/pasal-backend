// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "PASAL SERVER",
//       version: "0.1.0",
//       description:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6IlVTRVIiLCJ2ZW5kb3JJZCI6bnVsbCwibmFtZSI6ImNoaXJhZyB0aGFwYSIsImlhdCI6MTY2MjExNjU2NH0.I3FNj3dgPOHPA43fJeniSFgcKgQeshq_O99h79SPuRI",
//       license: {
//         name: "Chirag Thapa",
//         url: "https://github.com/chiragthapa777",
//       }
//     },
//     servers: [
//       {
//         url: "http://localhost:9898",
//       },
//     ],
//   },
//   apis: ["./app/routes/modules/*/*.js"],
//   persistAuthorization: true

// };
// module.exports={
//   options
// }


// DOC for swaggerUI
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocs = swaggerJsDoc({
    swagger: "2.0",
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            title: "PASAL API",
            version: process.env.version,
            description: 'Api documentation for the Pasal API',
            contact: {
                name: 'chirag thapa',
                email: 'chiragthapa777@gmail.com'
            }
        },
        // components: {
        //     securitySchemes: {
        //         jwt: {
        //             type: 'http',
        //             scheme: 'bearer',
        //             in: 'header',
        //             bearerFormat: 'JWT',
        //         }
        //     }
        // },
        security: [{
            jwt: []
        }],
        schemes: [
            'http'
        ],
        servers: [
            {
                "url": "http://localhost:9898"
            }
        ]
    },
    apis: ["./app/routes/modules/*/*.js"],
});
// swagger options
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none } ',
    customSiteTitle: "Pasal API Documentation",
    // customfavIcon: "../images/favicon_red.ico",
    swaggerOptions: {docExpansion: "none",persistAuthorization: false},
}

module.exports = {
    swaggerDocs,
    swaggerOptions
};