var kanjidate = require("kanjidate");
var moment = require("moment");

function DateInput(dom){
	this.dom = dom;
}

DateInput.prototype.setGengou = function(gengou){
	var dom = this.dom;
	dom.querySelector("select[name=gengou] option[value=" + gengou + "]").selected = true;
};

DateInput.prototype.setNen = function(nen){
	this.dom.querySelector("input[name='nen']").value = nen;
	return this;
};

DateInput.prototype.setMonth = function(month){
	this.dom.querySelector("input[name='month']").value = month;
	return this;
};

DateInput.prototype.setDay = function(day){
	this.dom.querySelector("input[name='day']").value = day;
	return this;
};

DateInput.prototype.set = function(d){
	if( d === "0000-00-00" || !d ){
		this.setNen("");
		this.setMonth("");
		this.setDay("");
		return this;	
	}
	var m = moment(d);
	var year = m.year();
	var month = m.month() + 1;
	var day = m.date();
	var g = kanjidate.toGengou(year, month, day);
	this.setGengou(g.gengou);
	this.setNen(g.nen);
	this.setMonth(month);
	this.setDay(day);
	return this;
};

DateInput.prototype.getGengou = function(){
	return this.dom.querySelector("select[name='gengou'] option:checked").value;
};

DateInput.prototype.getNen = function(){
	return this.dom.querySelector("input[name='nen']").value;
};

DateInput.prototype.getMonth = function(){
	return this.dom.querySelector("input[name='month']").value;
};

DateInput.prototype.getDay = function(){
	return this.dom.querySelector("input[name='day']").value;
};

DateInput.prototype.getValues = function(){
	return {
		gengou: this.getGengou(),
		nen: this.getNen(),
		month: this.getMonth(),
		day: this.getDay()
	}
}

DateInput.prototype.getSqlDate = function(){
	var values = this.getValues();
	this.errors = [];
	if( values.nen === "" && values.month === "" && values.day === "" ){
		return "0000-00-00";
	}
	var gengou = values.gengou;
	var nen, month, day;
	if( values.nen === "" ){
		this.errors.push("年が入力されていません。");
	} else if( !values.nen.match(/^\d+$/) ){
		this.errors.push("年の入力が不適切です。");	
	} else {
		nen = +values.nen;
	}
	if( values.month === "" ){
		this.errors.push("月が入力されていません。");
	} else if( !values.month.match(/^\d+$/) ){
		this.errors.push("月の入力が不適切です。");	
	} else {
		month = +values.month;
	}
	if( values.day === "" ){
		this.errors.push("日が入力されていません。");
	} else if( !values.day.match(/^\d+$/) ){
		this.errors.push("日の入力が不適切です。");	
	} else {
		day = +values.day;
	}
	var year = kanjidate.fromGengou(gengou, nen);
	var m = moment({year: year, month: month-1, day: day});
	if( values.nen !== "" && values.month !== "" && values.day !== "" && !m.isValid() ){
		this.errors.push("日付が適切でありません。");
	}
	if( this.errors.length > 0 ){
		return null;
	}
	return m.format("YYYY-MM-DD");
};

module.exports = DateInput;
