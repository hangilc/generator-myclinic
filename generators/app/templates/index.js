"use strict";
var path = require("path");

exports.staticDir = path.join(__dirname, "static");

function initApp(app, config) {
	app.set("view engine", "ejs");
	app.set("views", __dirname + "/views");
	app.get("/", function(req, res){
		res.render("index", { params: req.query });
	});
	<% if( usePrinter) { %>
	app.get("/preview", function(req, res){
		res.render("preview", {
			data: {x:10, y:20}
		});
	});
	<% } %>
    app.get("/config", function (req, res) {
        res.set({
            "Content-Type": "text/javascript"
        });
        res.send("var config = " + JSON.stringify(config) + ";");
    });
}
exports.initApp = initApp;
