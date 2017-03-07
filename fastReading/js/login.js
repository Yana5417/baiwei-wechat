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
			$("#phoneMsg").html("手机号输入错误，请重新输入！");
		} else {
			$("#phoneMsg").hide();
		}
	});
	//密码验证
	$("#password").on('blur', function() {
		var reg = /^[a-zA-Z0-9]\w{6,12}$/,
			val = $("#password").val();
		console.log(val)
		if(reg.test(val) == false) {
			$("#passwordMsg").show();
			$("#passwordMsg").html("密码为6-12位字母和数字、下划线");
		} else {
			$("#passwordMsg").hide();
		}
	});
	//密码是否可见
	$(".pass-eyes").on('click', function() {
		if($("#password").attr('type') == 'password') {
			$("#password").attr('type', 'text');
		} else {
			$("#password").attr('type', 'password');
		}
		console.log($("#password").attr('type'));
	});

	/**
	 *登录模块js实现 
	 */

	//登录实现
	$("#nextstep").on('click', function() {
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
				'password': password
			},
			success: function(response) {
				console.log(response);
				if(response.message == "成功！") {
					window.location.href = "home.html";
				}
			},
			error: function(response) {

			}
		});
	});

	//微信登录
	$('.wx-login').on('click', function() {
		
	});
});