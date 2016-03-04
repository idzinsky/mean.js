'use strict';

var Todo = require('../models/todo');

exports.getAllTodos = function(req, res) {
	if (req.xhr) {
		Todo.find({_creator: req.user}, function(error, todos) {
			if (error) {
				res.send(error);
			} else {
				res.json(todos);
			}
		});
	}
};

exports.getTodoById = function(req, res, next, id) {
	Todo.findById(id).exec(function(error, todo) {
		if (error) {
			return next(error);
		}
		if (!todo) {
			return next(new Error('Failed to load todo with ' + id));
		}

		req.todo = todo;
		next();
	});
};

exports.createTodo = function(req, res) {
	if (req.xhr  && req.body.text) {
		//var todo = new Todo(req.body);
		//todo['_creator'] = req.user['_id'];
		var todo = new Todo({
			text: req.body.text,
			_creator: req.user
		});
		todo.save(function(error) {
			if (error) {
				res.send(error);
			} else {
				Todo.find({_creator: req.user}).exec(function(error, todos) {
					if (error) {
						res.send(error);
					} else {
						res.json(todos);
					}
				})
			}
		});
	}
};

exports.deleteTodo = function(req, res) {
	if (req.xhr) {
		var todo = req.todo;
		todo.remove(function(error) {
			if (error) {
				res.send(error);
			} else {
				Todo.find({_creator: req.user}).exec(function(error, todos) {
					if (error) {
						res.send(error);
					} else {
						res.json(todos);
					}
				});	
			}
		});
	}
};