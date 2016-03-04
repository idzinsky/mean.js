'use strict';

var express 		= require('express');
var app				= express();
var morgan 			= require('morgan');
var mongoose 		= require('mongoose');
var passport		= require('passport');
var cookieParser 	= require('cookie-parser');
var bodyParser   	= require('body-parser');
var methodOverride  = require('method-override');
var expressSession 	= require('express-session');
var flash   		= require('connect-flash');

var config 			= require('./config');
var todoRouter		= require('./app/routes/todo');
var userRouter		= require('./app/routes/user');

require('./config/passport')(passport);

mongoose.connect(config.db.uri_string);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.set('view engine', 'ejs');

app.use(expressSession({secret: 'superSecret'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.sendFile(__dirname + '/views/index.html');
	} else {
		res.redirect('/login');
	}
});

app.get('/signup', function(req, res) {
	if (!req.isAuthenticated()) {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	} else {
		res.redirect('/');
	}
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
}));

app.get('/login', function(req, res) {
	if (!req.isAuthenticated()) {
		res.render('login', {
			message: req.flash('loginMessage')
		});
	} else {
		res.redirect('/');
	}
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get('/api/todo/all', userRouter.requiresLogin, todoRouter.getAllTodos);
app.post('/api/todo', userRouter.requiresLogin, todoRouter.createTodo);
app.delete('/api/todo/:todo_id', userRouter.requiresLogin, todoRouter.deleteTodo);

app.param('todo_id', todoRouter.getTodoById);

//app.param('todo_id', todoRouter.getTodoByID);

/*app.get('/enter', function(req, res) {
	if (!req.isAuthenticated()) {
		res.render('enter');
	} else {
		res.redirect('/');
	};
});*/

var server = app.listen(config.server.port, config.server.host, function() {
	console.log("Running at " + config.server.host + " on port " +  config.server.port);
});