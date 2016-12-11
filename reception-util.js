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
