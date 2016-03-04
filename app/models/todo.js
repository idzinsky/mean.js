'use strict';

var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;

var todoSchema = new Schema({
	text: String,
	_creator: { type: Number, ref: 'User' }
});

module.exports = mongoose.model('Todo', todoSchema);