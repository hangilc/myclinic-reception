var kanjidate = require("kanjidate");
var moment = require("moment");

exports.birthdayAsKanji = function(birthday){
	if( !birthday || birthday === "0000-00-00" ){
		return "???";
	}
	return kanjidate.format(kanjidate.f2, birthday);
};

exports.calcAge = function(birthday){
	if( !birthday || birthday === "0000-00-00" ){
		return "??";
	}
	var bd = moment(birthday);
	return moment().diff(bd, "years");
};

exports.sexAsKanji = function(sex){
	switch(sex){
		case "M": return "男";
		case "F": return "女";
		default: return "??";
	}
};

exports.todayAsSqlDate = function(){
	return moment().format("YYYY-MM-DD");
};

exports.makeNode = function(html){
	var dom = document.createElement("div");
	dom.innerHTML = html;
	return dom.firstChild;
};

exports.makeNodeList = function(html){
	var dom = document.createElement("div");
	dom.innerHTML = html;
	return dom.childNodes;
};

