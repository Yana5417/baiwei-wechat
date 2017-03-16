/**
 * 注册
 */
$(function(){
	
	//正则表达式验证
	var regPhone = /^1[34578]\d{9}$/,
		regPassword = /^[a-zA-Z0-9]\w{5,19}$/;
	var phoneVal,//手机号
		passwordVal;//密码
	
	$('#register').attr('disabled','disabled');//确定按钮
	$("#phoneMsg").hide();
	$("#passwordMsg").hide();
	
	//获取验证码
	$("#getCode").on('click',function(){
		phoneVal = $('#phone').val();
		console.log(phoneVal);
		if(regPhone.test(phoneVal) == false) {
			$("#phoneMsg").show();
		}else {
			$("#phoneMsg").hide();
			$.ajax({
				type:"post",
				url:urlBaseQ + "health/v2_0/consumer/getRegistCode",
				async:false,
				data:{
					mobile:phoneVal,
					type:1
				},
				dataType:'json',
				success:function(response){
					
					if(response.message == "该手机号已注册"){
						layer.msg("该手机号已注册，请直接登录！");
					}else if(response.message == "距离上次获取验证码时间未过1分钟，请1分钟后再试"){
						layer.msg("距离上次获取验证码时间未过1分钟，请1分钟后再试");
					}else{
						$("#getCode").html("短信已发送");
						var _time = 60;
						
						var count = setInterval(function(){
							$("#getCode").html(_time--+'s后重试');
							if(_time == 0){
								$("#getCode").html("获取验证码");
								clearInterval(count);
								_time = 60;
							}
						},1000);
					}
					console.log(response);
				},
				error:function(response){
					alert('error');
				}
			});
		}
	});
	$("#password").on('blur',function(){
		passwordVal = $("#password").val();
		if(regPassword.test(passwordVal) == false){
			$("#passwordMsg").show();
		}else{
			$("#passwordMsg").hide();
		}
	});
	
	//注册
	function register(){
		//注册
		$.ajax({
			type:"post",
			url:urlBaseQ + "health/v2_0/consumer/regist",
			async:false,
			data:{
				mobile:phoneVal,
				code:$("#code").val(),
				password:passwordVal,
				type:3
			},
			dataType:'json',
			success:function(response){
				console.log(response);
				window.location.href = "home.html?noRefresh=yes";
			},
			error:function(response){
				
			}
		});
	}
	
	//确定按钮是否可用
	$("input").change(function(){
		console.log('phone',regPhone.test(phoneVal));
		console.log('code',$("#code").val());
		console.log('password',regPassword.test(passwordVal));
		console.log('agree',$("#agree").attr("checked"));
		if((regPhone.test(phoneVal) == true) && (regPassword.test(passwordVal) == true) && ($("#code").val() != "") && $("#agree").attr("checked") == "checked") {
			$('#register').attr('disabled',false);
		}else{
			$('#register').attr('disabled','disabled');
		}
	});
	
	
	//验证验证码，注册
	$("#register").on("click",function(){
		$.ajax({
			type:"post",
			url:urlBaseQ + "health/v2_0/consumer/checkCode",
			async:false,
			data:{
				mobile:phoneVal,
				code:$("#code").val()
			},
			dataType:'json',
			success:function(response){
				console.log(response);
				if(response.message == "成功!"){
					register();
				}else{
					layer.msg(response.message);
				}
			},
			error:function(response){
				
			}
		});
	});
});