//问诊人
function getPatient() {
	var peopleYear = localStorage.getItem("YMyear");
	var PeopleSex = localStorage.getItem("quickPeopleSex");
	var peopleName = localStorage.getItem("peopleName");
	console.log(peopleYear);
	console.log(PeopleSex);
	console.log(peopleName);
	var _date = new Date;
	var _year = _date.getFullYear();
	if(peopleYear && PeopleSex && peopleName) {
		var peopleAge = parseInt(_year) - parseInt(peopleYear);
		$("#PeopleSex").html(PeopleSex);
		$("#peopleName").html(peopleName);
		$("#peopleAge").html(peopleAge);
	}
}
getPatient();

//电子档案
function getErecord() {
	var HealthListId = localStorage.getItem("HealthListId");
	var HealthListName = localStorage.getItem("HealthListName");
	if(HealthListName) {
		$("#HealthListName").html(HealthListName);
	}
	//是否上传图片
	if(HealthListName) {
		//	input1.setAttribute('disabled', 'disabled');
		$('.uploadImg').removeAttr('id');
		layer.msg("您已经上传了电子档案只需要上传一个");
	} else {
		//	input1.removeAttribute('disabled');
		$('.uploadImg').attr('id', 'upload');
	}
}
getErecord();

//症状描述
function getDescribe(){
	var describe = localStorage.getItem("describe");
	$("#mark").html(describe);
}
getDescribe();
/**
 *微信用户登录获取用户信息 
 * 最后拿到的是tid,token,rongToken
 */
function getUserInfo(code, state) {
	var weUserInfo;
	$.ajax({
		type: "post",
		url:urlBaseQ + "health/wx/wxCallBack",
		async: false,
		data: {
			code: code,
			state: state
		},
		dataType: 'json',
		success: function(response) {
			localStorage.setItem("openId", response.openId);
			weUserInfo = response;
			console.log("weUserInfo",weUserInfo);
		},
		error: function(response) {

		}
	});
	console.log(weUserInfo);
	$.ajax({
		type: "post",
		url:urlBaseQ + "health/wx/wxLogin",
		async: false,
		data: {
			nickname: weUserInfo.nickname,
			openid: weUserInfo.openId,
			headimgurl: weUserInfo.headImgUrl,
			sex: weUserInfo.sex,
			country: weUserInfo.country,
			province: weUserInfo.province,
			city: weUserInfo.city,
			unionid: weUserInfo.unionid
		},
		dataType: 'json',
		success: function(response) {
			localStorage.setItem("weLoginInfo",JSON.stringify(response.map));
			console.log("weLoginInfo:",response);
		},
		error: function(response) {

		}
	});
}

//根据tid拿到token
if(GetRequest("noRefresh") == "yes") {
	
}else{
	getUserInfo(GetRequest("code"), GetRequest("state"));
}
//alert(GetRequest("code"));

//alert("code");