var mongoose = require( 'mongoose' );
var gracefulShutdown;
var dbURI = 'mongodb://localhost/Loc8r';
if(process.env.NODE_ENV === 'production') {
	dbURI = 'mongodb://Loc8r:7282bugg@ds015902.mlab.com:15902/heroku_l2156wv3';
	//dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);

var readLine = require("readline");
if (process.platform == "win32"){
	var rl = readLine.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.on("SIGINT", function(){
		process.emit("SIGINT");
	});
}

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

// For nodemon restarts
process.once('SIGUSR2', function(){
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});
// For app termination
process.once('SIGINT', function(){
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
});
// For Heroku app termination
process.once('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});

require('./locations');