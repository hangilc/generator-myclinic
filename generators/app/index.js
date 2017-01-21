"use strict";

var Generator = require("yeoman-generator");

module.exports = Generator.extend({
	constructor: function(args, opts){
		Generator.call(this, args, opts);

		this.option("babel");
	},

	method1: function(){
		console.log("method 1");
	}
})