/**
 * Created by wlx on 2016/9/27.
 */
//获取url里特定字段值
function GetRequest(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return(r[2]);
	return null;
}
//将数字转换成对应中文
function replaceReg(str) {
	var reg = /\d/g;
	arr = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
	return str.replace(reg, function(m) {
		return arr[m];
	})

}
//获取具体cookie
function getCookie(name) {
	var cookies = document.cookie.split(";");
	for(var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var cookieStr = cookie.split("=");
		if(cookieStr && cookieStr[0].trim() == name) {
			return decodeURI(cookieStr[1]);
		}
	}
}

function checkMobileValidation(mobile) {
	var isPhone = /^0{0,1}(1[3-9])[0-9]{9}$/;
	if(!isPhone.test(mobile)) {
		//hintPopService.popOut("请输入正确的手机号!", 1000, 500);
		return false;
	}
	return true;
}

//将时间戳转换为时间格式
function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).Format("yyyy-MM-dd");
}
Date.prototype.Format = function(fmt) { //author: meizz   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//全局变量

//var urlBaseQ = 'http://139.196.105.113:80/health/',
//  urlBaseW = 'http://139.196.105.113:8848/zobj/?';
var urlBaseQ = 'http://139.196.200.113:80/health/',
	urlBaseW = 'http://139.196.200.113:8848/zobj/?';
var token = GetRequest('token');
token = '474a6fa9ea049293f728aa500ce117d3a6b53751653bcb5545ec98d2e1d3f6e8f286bbcc34074486f1c12b2a5fabde00';