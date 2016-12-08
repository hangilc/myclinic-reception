var hogan = require("hogan.js");
var tmplSrc = require("raw!./wqueue.html");
var tmpl = hogan.compile(tmplSrc);
var mConsts = require("myclinic-consts");

exports.render = function(dom, wqueue){
	var list = wqueue.map(function(wq){
		return {
			state_as_alpha: wqueueStateToAlpha(wq.wait_state),
			state_as_kanji: wqueueStateToKanji(wq.wait_state),
			patient_id_rep: padNumber(wq.patient_id),
			last_name: wq.last_name,
			first_name: wq.first_name,	
			last_name_yomi: wq.last_name_yomi,
			first_name_yomi: wq.first_name_yomi,	
			visit_id: wq.visit_id
		};
	});
	dom.innerHTML = tmpl.render({ list: list });
};

function padNumber(num){
	return ("0000" + num).substr(-4);
}

function wqueueStateToKanji(wqState){
	switch(wqState){
		case mConsts.WqueueStateWaitExam: return "診待";
		case mConsts.WqueueStateInExam: return "診中";
		case mConsts.WqueueStateWaitCashier: return "会待";
		case mConsts.WqueueStateWaitDrug: return "薬待";
		case mConsts.WqueueStateWaitReExam: return "再待";
		case mConsts.WqueueStateWaitAppoint: return "予待";
		default: return "不明";
	}
};

function wqueueStateToAlpha(wqState){
	switch(wqState){
		case mConsts.WqueueStateWaitExam: return "wait-exam";
		case mConsts.WqueueStateInExam: return "in-exam";
		case mConsts.WqueueStateWaitCashier: return "wait-cashier";
		case mConsts.WqueueStateWaitDrug: return "wait-drug";
		case mConsts.WqueueStateWaitReExam: return "wait-re-exam";
		case mConsts.WqueueStateWaitAppoint: return "wait-appointed-exam";
		default: return "unknown";
	}
};
