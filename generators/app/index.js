"use strict";

var Generator = require("yeoman-generator");
var fs = require("fs");
var path = require("path");

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
			default: path.basename(process.cwd())
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
		self.fs.writeJSON(
			self.destinationPath("package.json"),
			makePackageJson(gConfig)
		);
		var staticFiles = [".gitignore", "browser-src/main.ts", "browser-src/request.ts",
			"browser-src/typed-dom.ts",
			"static/app.css", "views/index.ejs"];
		if( gConfig.usePrinter ){
			staticFiles.push("browser-src/preview-main.ts", "browser-src/print-util.ts", "views/preview.ejs")
		}
		staticFiles.forEach(function(src){
			self.fs.copy(self.templatePath(src), self.destinationPath(src));
		})
		var tmplFiles = ["README.md", "LICENSE.txt", "test-server.js", "browser-src/tsconfig.json",
			"index.js"];
		if( gConfig.usePrinter ){
			tmplFiles.push("browser-src/service.ts")
		}
		tmplFiles.forEach(function(file){
			self.fs.copyTpl(
				self.templatePath(file),
				self.destinationPath(file),
				gConfig
			);
		})
	},

	install: function(){
		if( this.skipInstall ){
			return;
		}
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
		var self = this;
		deps.forEach(function(dep){
			self.npmInstall(dep, {"save": true});
		})
		devDeps.forEach(function(dep){
			self.npmInstall(dep, {"save-dev": true});
		})
	},

	end: function(){
		this.spawnCommandSync("npm", ["run", "build"]);
	}
})

function makePackageJson(conf){
	var scripts = {
		"build": "npm run compile && npm run bundle",
		"compile": "tsc -p browser-src",
	    "test": "echo \"Error: no test specified\" && exit 1"
	};
	if( conf.usePrinter ){
		scripts["bundle"] = "npm run bundle-main && npm run bundle-preview";
		scripts["bundle-main"] = "webpack browser-src/main.js static/bundle.js";
		scripts["bundle-preview"] = "webpack browser-src/preview-main.js static/preview-bundle.js";
	} else {
		scripts["bundle"] = "npm run bundle-main";
		scripts["bundle-main"] = "webpack browser-src/main.js static/bundle.js";
	}
	scripts["test"] = "echo \"Error: no test specified\" && exit 1";
	return {
		name: conf.name,
		version: "1.0.0",
		description: conf.description,
		main: "index.js",
		scripts: scripts,
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
}