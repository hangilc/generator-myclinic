var web = require("myclinic-web");
var subapp = require("./index.js");

var sub = {
	name: "<%= subapp %>",
	module: subapp,
	configKey: "<%= subapp %>"
};

web.cmd.runFromCommand([sub], {port: 9004, usePrinter: <%= usePrinter %>});
