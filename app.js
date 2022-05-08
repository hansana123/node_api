const express = require("express"); // to create our server
const cors = require("cors"); //to allow and redirect request resourse
const router = require("./routes"); // where our API routes will be defined
const AppError = require("./utils/appError"); // for global error handler fuction
const errorHandler = require("./utils/errorHandler");

let app = express();
/* create express instant express class*/

app.use(express.json());
/* express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body  */

app.use("/api", router);
/* redirect all resuest that come though '/api/' to router */

app.all("*", (req, res, next) => {
 next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});
/* The app.all() function is used to routing all types of HTTP request that not matched to '/api'. Like if we have POST, GET, PUT, DELETE, etc. then response 404 not found error */

app.use(errorHandler);
/* Express apps have a use() function. This function adds a new middleware to the app. */

const PORT = 3000;
/* this is the port that server going to start */

app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`); 
});
/* Finally, we will configure our application to listen to port 3000.*/

module.exports = app;

