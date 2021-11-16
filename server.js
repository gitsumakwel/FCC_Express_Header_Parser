// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

//11-13-2021
var bodyParser = require('body-parser');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');


//11-13-2021
//log all request
//request object, response object, next function
const posthandler = (req,res,next) => {
    //log the request
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    // you need to declare, coz your server will get stuck
    next();
}

//11-14-2021
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Time Stamp",
      description: "FCC Backend Project - Timestamp Microservice",
      contact: {
        name: "Brill Jasper Amisola Rayel"
      },
    }
  },
  // ['.routes/*.js']
  apis: ["server.js"]
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//API - /api/whoami
const getWhoAmI = (req,res) => {
    //console.log(req);
    //console.log(req.headers);
    //req.headers["accept-language"]
    //req.headers['x-forwarded-for']
    res.json({ipaddress: req.ip, language: req.headers['accept-language'], software: req.headers['user-agent']});
}


//app.use - only for GET request
//use to include static assets needed by your application (stylesheets, scripts, images)
app.use('/public',express.static(__dirname + '/public'));
app.use('/src',express.static(__dirname + '/src'));
// will be called for any request
// use for loging request
app.use(posthandler); 
// use for 'POST' request
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


/**
 * @swagger
*  /api/whoami:
*    get:
*      description: API to describe the ip, language, software of a client
*      responses:
*        '200':
*          description: Success
*          content:
*            application/json; charset=utf-8:
*              schema:
*                type: string
*              examples: {}
*      servers:
*        - url: https://boilerplate-project-timestamp.gitsumakwel.repl.co
*    servers:
*      - url: https://boilerplate-project-timestamp.gitsumakwel.repl.co
 */
app.route('/api/whoami').get(getWhoAmI);


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

