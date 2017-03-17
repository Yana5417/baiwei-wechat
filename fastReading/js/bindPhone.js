//    快速登陆

$(function() {

	/**
	 *微信用户登录获取用户信息 
	 * 最后拿到的是tid
	 */
	function getUserInfo(code, state) {
		var weUserInfo;
		$.ajax({
			type: "post",
			url: "http://139.196.200.113/health/health/wx/wxCallBack",
			async: false,
			data: {
				code: code,
				state: state
			},
			dataType: 'json',
			success: function(response) {
				localStorage.setItem("openId", response.openId);
				weUserInfo = response;
			},
			error: function(response) {

			}
		});
		console.log(weUserInfo);
		$.ajax({
			type: "post",
			url: "http://139.196.200.113/health/health/wx/wxLogin",
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
				console.log(response);
				localStorage.setItem("weLoginInfo", response.map);
			},
			error: function(response) {

			}
		});
	}

	//根据tid,token
	getUserInfo(GetRequest("code"), GetRequest("state"));

	//绑定手机号
	var regPhone = /^1[34578]\d{9}$/;
	var phoneVal;
	$('#log').attr('disabled', 'disabled');
	$("#phoneMsg").hide();
	//获取验证码
	$("#getCode").on('click', function() {
		phoneVal = $('#phone').val();
		console.log(phoneVal);
		if(regPhone.test(phoneVal) == false) {
			$("#phoneMsg").show();
		} else {
			$("#phoneMsg").hide();
			$.ajax({
				type: "post",
				url: urlBaseQ + "health/v2_0/consumer/getRegistCode",
				async: false,
				data: {
					mobile: phoneVal,
					type: 3
				},
				dataType: 'json',
				success: function(response) {
					console.log(response.object);
					if(response.object == "ok") {
						layer.msg("短信已发送");
						var _time = 60;
						var count = setInterval(function() {
							$("#getCode").html(_time-- + 's后重试');
							if(_time == 0) {
								$("#getCode").html("获取验证码");
								clearInterval(count);
								_time = 60;
							}
						}, 1000);
					} else {
						layer.msg(response.object);
					}
				},
				error: function(response) {
					alert('error');
				}
			});
		}
	});

	//确定按钮是否可用
	$("input").change(function() {
		phoneVal = $('#phone').val();
		console.log('phone', regPhone.test(phoneVal));
		console.log('code', $("#code").val());
		if((regPhone.test(phoneVal) == true) && ($("#code").val() != "")) {
			$('#log').attr('disabled', false);
		} else {
			$('#log').attr('disabled', 'disabled');
		}
	});
	//登陆
	$("#log").on('click', function() {
		var mobile = $('#phone').val(),
			code = $("#code").val(),
			tid = localStorage.getItem("we-tid");
		$.ajax({
			type: "post",
			url: urlBaseQ + "health/v2_0/consumer/bindPhoneCheck",
			async: false,
			data: {
				mobile: mobile,
				code: code,
				type: 3,
				tid: tid
			},
			dataType: 'json',
			success: function(response) {
				console.log(response);

				if(response.message == "成功!") {
					localStorage.setItem("_token",response.map.token);
					window.location.href = "home.html?noRefresh=yes";
				} else if(response.message == "该微信用户已绑定手机号,不可重复绑定"){
					window.location.href = "home.html?noRefresh=yes";
				}else {
					layer.msg(response.message);
				}
			},
			error: function() {
				layer.msg("请求超时");
			}
		});
	});
});