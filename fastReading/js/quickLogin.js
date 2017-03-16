//    快速登陆

$(function(){
	var regPhone = /^1[34578]\d{9}$/;
	var phoneVal;
	$('#log').attr('disabled','disabled');
	$("#phoneMsg").hide();	
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
					type:3
				},
				dataType:'json',
				success:function(response){
					console.log(response.object); 
					if(response.object == "ok"){
						layer.msg("短信已发送");  
						var _time = 60;						
						var count = setInterval(function(){
							$("#getCode").html(_time--+'s后重试');
							if(_time == 0){
								$("#getCode").html("获取验证码");
								clearInterval(count);
								_time = 60;
							}
						},1000);
					}else{
						layer.msg(response.object); 
					}					
				},
				error:function(response){
					alert('error');
				}
			});
		}
	});
		
	//确定按钮是否可用
	$("input").change(function(){
		phoneVal = $('#phone').val();
		console.log('phone',regPhone.test(phoneVal));
		console.log('code',$("#code").val());
		if((regPhone.test(phoneVal) == true) && ($("#code").val() != "") ) {
			$('#log').attr('disabled',false);
		}else{
			$('#log').attr('disabled','disabled');
		}
	});
	//点击登陆按钮,验证验证码
	$("#log").on("click",function(){
		$.ajax({
			type:"post",
			url:urlBaseQ + "health/v2_0/consumer/checkCode",
			async:false,
			data:{
				mobile:$('#phone').val(),
				code:$("#code").val()
			},
			dataType:'json',
			success:function(response){
				console.log(response);
				if(response.message == "成功!"){
					log();
				}else{
					layer.msg(response.message);
				}
			},
			error:function(response){
				alert("error");
			}
		});
	});
	//登陆
	function log(){
		$.ajax({
			type:"post",
			url:urlBaseQ + "health/v2_0/consumer/quicklogin",
			async:false,
			data:{
				mobile:$('#phone').val(),
				code:$("#code").val(),		
				type:3
			},
			dataType:'json',
			success:function(response){
				console.log(response);
				localStorage.setItem("userInfo",JSON.stringify(response.map.object));
				localStorage.setItem("_token",response.map.token);
				window.location.href = "home.html?noRefresh=yes";
			},
			error:function(response){
				alert("登录失败");
			}
		});
	}
	
	
	
	$('.wx-login').on('click', function() {
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf49c6b60fade7ed2&redirect_uri=http://www.kuaizhan.com&response_type=code&scope=snsapi_userinfo&state=baiwei#wechat_redirect";
	});
});
