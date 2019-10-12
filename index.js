const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
//importing files

const appConfig = require('./app/config/appConfig');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));



const modelsPath = './app/models';
const controllersPath = './app/controllers';
const libsPath = './app/libs';
const routesPath = './app/routes';

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  next();
});

//Bootstrap models
fs.readdirSync(modelsPath).forEach(function(file) {
  if (~file.indexOf('.js')) require(modelsPath + '/' + file)
});
// end Bootstrap models

// Bootstrap route
fs.readdirSync(routesPath).forEach(function(file) {
  if (~file.indexOf('.js')) {
    let route = require(routesPath + '/' + file);
    route.setRouter(app);
  }
});
// end bootstrap route

// calling global 404 handler after route


// end global 404 handler

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
// start listening to http server
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

// end server listening code




// end socketio connection handler

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
    throw error;
  }


  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    default:
      logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
      throw error;
  }
}

/*const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setSocketServer(server);
*/

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {

  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  ('Listening on ' + bind);
  console.log('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
  let db = mongoose.connect(appConfig.db.uri, {
    //useMongoClient: true
  });
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


/**
 * database connection settings
 */
mongoose.connection.on('error', function(err) {
  console.log('database connection error');
  console.log(err)

}); // end mongoose connection error

mongoose.connection.on('open', function(err) {
  if (err) {
    console.log("database error");
    console.log(err);
  } else {
    console.log("database connection open success");

  }
  //process.exit(1)
}); // enr mongoose connection open handler



// end socketio connection handler



module.exports = app;