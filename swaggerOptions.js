const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PASAL SERVER",
      version: "0.1.0",
      description:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6IlVTRVIiLCJ2ZW5kb3JJZCI6bnVsbCwibmFtZSI6ImNoaXJhZyB0aGFwYSIsImlhdCI6MTY2MjExNjU2NH0.I3FNj3dgPOHPA43fJeniSFgcKgQeshq_O99h79SPuRI",
      license: {
        name: "Chirag Thapa",
        url: "https://github.com/chiragthapa777",
      }
    },
    servers: [
      {
        url: "http://localhost:9898",
      },
    ],
  },
  apis: ["./app/routes/modules/*/*.js"],
  persistAuthorization: true

};
module.exports={
  options
}