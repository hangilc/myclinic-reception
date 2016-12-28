"use strict";

var tmplSrc = require("raw!./search-patient.html");
var rUtil = require("../reception-util.js");
var service = require("myclinic-service-api");
var PatientSearchResult = require("./patient-search-result.js");

exports.create = function(callbacks){
	var html = tmplSrc;
	var dom = rUtil.makeNode(html);
	bindSearch(dom, callbacks);
	bindClose(dom, callbacks.onClose);
	return dom;
};

function bindClose(dom, callback){
	dom.querySelector(".close-panel").addEventListener("click", function(){
		callback();
	});
}

function bindSearch(dom, callbacks){
	dom.querySelector(".search-form").addEventListener("submit", function(event){
		var form = event.target;
		var text = form.querySelector("input[name='search-text']").value;
		text = text.trim();
		if( text === "" ){
			return;
		}
		service.searchPatient(text, function(err, result){
			if( err ){
				alert(err);
				return;
			}
			var searchResult = PatientSearchResult.create(result, callbacks);
			var wrapper = dom.querySelector(".result-box");
			wrapper.innerHTML = "";
			wrapper.appendChild(searchResult);
			wrapper.style.display = "";
		});
	});
}
