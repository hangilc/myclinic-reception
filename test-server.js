var web = require("myclinic-web");
var subapp = require("./index.js");

var sub = {
	name: "reception",
	module: subapp,
	configKey: "reception"
};

web.cmd.runFromCommand([sub], 9003);

