var Wqueue = require("./wqueue.js");
var service = require("myclinic-service-api");

document.getElementById("update-wqueue-button").addEventListener("click", function(){
	var dom = document.getElementById("wqueue-table");
	Wqueue.render(dom);
});
