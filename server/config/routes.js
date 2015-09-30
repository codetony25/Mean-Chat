/**
 * Module dependencies
 */
var config = require('./config');
var routes = require(config.serverRoot + '/app/routers/index');
var users = require(config.serverRoot + '/app/routers/users');
var messages = require(config.serverRoot + '/app/routers/messages');
var rooms = require(config.serverRoot + '/app/routers/rooms');

/**
 * Expose
 */
module.exports = function(app) {

	app.use('/', routes);
	app.use('/users', users);
	app.use('/messages', messages);
	app.use('/rooms', rooms);

	// catch 404 and forward to error handler
	// app.use(function(req, res, next) {
	//   var err = new Error('Not Found');
	//   err.status = 404;
	//   next(err);
	// });

	// /*** error handlers ***/

	// // development error handler
	// // will print stacktrace
	// if (app.get('env') === 'development') {
	//   app.use(function(err, req, res, next) {
	//     res.status(err.status || 500);
	//     res.render('error', {
	//       message: err.message,
	//       error: err
	//     });
	//   });
	// }

	// // production error handler
	// // no stacktraces leaked to user
	// app.use(function(err, req, res, next) {
	//   res.status(err.status || 500);
	//   res.render('error', {
	//     message: err.message,
	//     error: {}
	//   });
	// });
}