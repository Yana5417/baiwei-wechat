$(function() {

	/**
	 *公共正则表达式验证表单 
	 */

	//手机号验证
	$("#phone").on('blur', function() {
		var reg = /^1[34578]\d{9}$/,
			val = $("#phone").val();
		if(reg.test(val) == false) {
			$("#phoneMsg").show();
			$("#phoneMsg").html("手机号码格式错误，请重新输入！");
		} else {
			$("#phoneMsg").hide();
		}
	});
	//密码是否可见
	$(".pass-eyes").on('click', function() {
		if($("#password").attr('type') == 'password') {
			$("#password").attr('type', 'text');
			$(".pass-eyes").css('background', 'url(img/icon4@2x.png) no-repeat');
			$(".pass-eyes").css('background-size', 'cover');
		}else if($("#password").attr('type') == 'text'){
			$("#password").attr('type', 'password');
			$(".pass-eyes").css('background', 'url(img/icon3@2x.png) no-repeat');
			$(".pass-eyes").css('background-size', 'cover');
		}
		console.log($("#password").attr('type'));
	});

	/**
	 *登录模块js实现 
	 */

	//登录实现
	$("#login").on('click', function() {
		var phone = $("#phone").val(),
			password = $("#password").val();
			

		console.log(phone);
		console.log(password);

		$.ajax({
			type: "post",
			url: urlBaseQ + "health/v2_0/consumer/login",
			async: false,
			data: {
				'mobile': phone,
				'password': password,
				'tid':JSON.parse(localStorage.getItem("weLoginInfo")).tid
			},
			success: function(response) {
				console.log(response);
				if(response.message == "成功!") {
					localStorage.setItem("userInfo",JSON.stringify(response.map.object));
					localStorage.setItem("token",response.map.token);
					window.location.href = "home.html?noRefresh=yes";
				}else{
					layer.msg(response.message);
				}
			},
			error: function(response) {

			}
		});
	});
	//https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf49c6b60fade7ed2&redirect_uri=http://www.baiwei120.com/baiwei-wechat/fastReading/home.html&response_type=code&scope=snsapi_base&state=baiwei#wechat_redirect
	//微信登录
	/*$('.wx-login').on('click', function() {
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf49c6b60fade7ed2&redirect_uri=http://www.baiwei120.com/baiwei-wechat/fastReading/bindPhone.html&response_type=code&scope=snsapi_base&state=baiwei#wechat_redirect";
	});*/
});