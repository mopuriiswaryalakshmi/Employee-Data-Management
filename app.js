/*
 * Import external packages here
 */
const express = require("express");
require('dotenv-flow').config();
const http = require("http");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");

/*
 * Import database modules here;
 */
const makeDatabaseConnection = require("./src/connections/db-connection");

/*
 *  Import route modules here;
 */
const employeeRouter = require("./src/routes/employee");
const swaggerDocument = require("./docs/api/openapi");

/*
 * Import configuration here;
 */
const {
  apiPathDetails: { apiVersion, basePath },
} = require("./config");

/*
 * Import Logs here;
 */
const { getLogger } = require("./src/utility/logs");

process.on("exit", (code) => {
  console.log(`Exiting with code ${code}`);
  mongoose.disconnect();
});

makeDatabaseConnection()
  .then((connection) => {
    console.log("Connected to the database");

    const app = express();
    app.set("PORT", process.env.LOCALHOST_PORT);

    app.use(express.json());
   

    app.use((request, response, next) => {
      request.logger = getLogger();
      next();
    });
  


    app.use(`${basePath}/${apiVersion}`, employeeRouter);
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


    app.use((error, request, response, next) => {
      if (typeof error === "string") {
        // custom application error
        return response.status(400).json({
          status: false,
          error: {
            error: "Generic Error",
            message: error,
          },
        });
      }

      if (error.code == "permission denied") {
        return response.status(403).json({
          status: false,
          error: {
            error: "Forbidden Error",
            message: "You don't have enough permisssion to access the API.",
          },
        });
      }

      if (error.name === "UnauthorizedError") {
        // jwt authentication error
        return response.status(401).json({
          status: false,
          error: {
            error: error.name,
            message: "Invalid Token.",
          },
        });
      }

      // default to 500 server error
      return response.status(500).json({
        status: false,
        error: {
          error: error.name,
          message: error.message,
        },
      });
    });

    http.createServer(app).listen(app.get("PORT"), (err) => {
      if (err) {
        console.log(`Error while start up the server, ${err}`);
        process.exit(2);
      }
      console.log(`HTTP server running on ${app.get("PORT")}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(2);
  });
