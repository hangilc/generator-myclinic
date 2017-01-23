"use strict";

var Generator = require("yeoman-generator");
var fs = require("fs");
var path = require("path");
var latestVersion = require("latest-version");

var gConfig = {
	year: new Date().getFullYear()
};

module.exports = Generator.extend({
	constructor: function(args, opts){
		Generator.call(this, args, opts);

		this.option("use-printer", {type: Boolean, default: false});
	},

	initializing: function(){
		gConfig.usePrinter = this.options["use-printer"];
	},

	prompting: function(){
		var self = this;
		return self.prompt([{
			type: "input",
			name: "name",
			message: "Your project name:",
			default: self.appname
		}]).then(function(ans){
			gConfig.name = ans.name;
			var subapp = gConfig.name.replace(/^myclinic-/, "");
			return self.prompt([{
				type: "input",
				name: "subapp",
				message: "subpath name:",
				default: subapp
			}]);
		}).then(function(ans){
			gConfig.subapp = ans.subapp;
			return self.prompt([{
				type: "input",
				name: "description",
				message: "Project desctioption:",
			}, {
				type: "input",
				name: "githubAccount",
				message: "Your github account name:",
				store: true
			}, {
				type: "input",
				name: "authorFullName",
				message: "Your full name:",
				store: true
			}]);
		}).then(function(answers){
			for(var key in answers ){
				gConfig[key] = answers[key];
			}
		})
	},

	writing: function(){
		var self = this;
		return makePackageJson(gConfig)
		.then(function(pkg){
			self.fs.writeJSON(
				self.destinationPath("package.json"),
				pkg
			);
		})
		.then(function(){
			var files = [".gitignore", "browser-src/main.ts", "browser-src/preview-main.ts", "browser-src/request.ts",
				"browser-src/service.ts",
				"static/app.css", "static/bundle.js", "static/preview-bundle.js", "views/index.ejs", "views/preview.ejs"];
			if( gConfig.usePrinter ){
				files.push("static/drawer-svg.js");
			}
			files.forEach(function(src){
				self.fs.copy(self.templatePath(src), self.destinationPath(src));
			})
		})
		.then(function(){
			var files = ["README.md", "LICENSE.txt", "test-server.js", "browser-src/tsconfig.json",
				"index.js"];
			files.forEach(function(file){
				self.fs.copyTpl(
					self.templatePath(file),
					self.destinationPath(file),
					gConfig
				);
			})
		})
	}
})

function makePackageJson(conf){
	var pkg = {
		name: conf.name,
		version: "1.0.0",
		description: conf.description,
		main: "index.js",
		scripts: {
			"compile": "tsc -p browser-src --watch",
		    "bundle": "webpack browser-src/main.js static/bundle.js --watch",
		    "bundle-preview": "webpack browser-src/preview-main.js static/preview-bundle.js --watch",
		    "test": "echo \"Error: no test specified\" && exit 1"
		},
		repository: {
		    "type": "git",
		    "url": "git+ssh://git@github.com/" + conf.githubAccount + "/" + conf.name + ".git"
		},
		author: conf.authorFullName,
		license: "MIT",
		bugs: {
		    "url": "https://github.com/" + conf.githubAccount + "/" + conf.name + "/issues"
		},
		homepage: "https://github.com/" + conf.githubAccount + "/" + conf.name + "#readme"
	};
	var deps = [
		"ejs"
	];
	var devDeps = [
		"typescript",
		"webpack",
	    "@types/express",
	    "@types/jquery",
	    "@types/node",
	    "jquery",
	    "kanjidate",
	    "moment",
	    "myclinic-consts",
	    "myclinic-web",
	    "raw-loader",
	];
	if( gConfig.usePrinter ){
		devDeps.push("myclinic-drawer-print-server", "myclinic-drawer")
	}
	return Promise.all(deps.map(function(dep){
		return latestVersion(dep)
			.then(function(ver){
				return {
					dep: dep,
					ver: ver
				}
			})
	})).then(function(list){
		var deps = {};
		list.forEach(function(bind){
			deps[bind.dep] = "^" + bind.ver;
		});
		pkg.dependencies = deps;
		return Promise.all(devDeps.map(function(dep){
			return latestVersion(dep)
				.then(function(ver){
					return {
						dep: dep,
						ver: ver
					}
				})
		}));
	}).then(function(list){
		var deps = {};
		list.forEach(function(bind){
			deps[bind.dep] = "^" + bind.ver;
		});
		pkg.devDependencies = deps;
		return pkg;
	})
}