var Wqueue = require("./wqueue.js");
var service = require("myclinic-service-api");
var conti = require("conti");

document.getElementById("update-wqueue-button").addEventListener("click", function(){
	var dom = document.getElementById("wqueue-table");
	var wqueue;
	conti.exec([
		function(done){
			service.listFullWqueue(function(err, result){
				if( err ){
					done(err);
					return;
				}
				wqueue = result;
				done();
			});
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		Wqueue.render(dom, wqueue);
	});
});

