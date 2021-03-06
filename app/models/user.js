'use strict';

var mongoose 	= require('mongoose');
var bcrypt 		= require('bcrypt-nodejs');
var Schema 		= mongoose.Schema;

var userSchema = new Schema({
	local: {
		email: String,
		password: String
	}
 	//todos : [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);