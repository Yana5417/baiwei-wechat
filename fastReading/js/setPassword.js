$(function(){
	var regPassword = /^[a-zA-Z0-9]\w{5,19}$/;
	var newPassVal,
		newPass1Val,
		phoneVal,
		codeVal;
	$('#pass').attr('disabled','disabled');
	//获取验证码
	$("#getCode").on('click',function(){
	  phoneVal = localStorage.getItem("phone",phoneVal);
		console.log(phoneVal);					
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
	});
	//判断密码格式
	$("#newPass").on('blur',function(){
		newPassVal = $("#newPass").val();
		if(regPassword.test(newPassVal) == false){
			$("#passwordMsg").show();
		}else{
			$("#passwordMsg").hide();
		}
	});
	//判断两次密码是否输入一致
	$("#newPass1").on('blur',function(){
		newPassVal = $("#newPass").val();
		newPass1Val = $("#newPass1").val();
		console.log(newPassVal == newPass1Val);
		if(newPassVal == newPass1Val){
			$("#passwordMsg1").hide();
		}else{
			$("#passwordMsg1").show();
		}
	});
	//确定按钮是否可用
	$("input").change(function(){
		codeVal=$("#code").val();
		newPassVal = $("#newPass").val();
		newPass1Val = $("#newPass1").val();
		if(regPassword.test(newPassVal) == true) {		
			if(newPassVal == newPass1Val){
				if($("#code").val() != ""){
					$('#pass').attr('disabled',false);
				}else{
					$('#pass').attr('disabled','disabled');
				}
			}else{
				$('#pass').attr('disabled','disabled');
			}
			
		}else{
			$('#pass').attr('disabled','disabled');
		}
	});
	//点击按钮,验证验证码
	$("#pass").on("click",function(){
		$.ajax({
			type:"post",
			url:urlBaseQ + "health/v2_0/consumer/checkCode",
			async:false,
			data:{
				mobile:localStorage.getItem("phone",phoneVal),
				code:$("#code").val()
			},
			dataType:'json',
			success:function(response){
				console.log(response);
				if(response.message == "成功!"){
				//	alert("11");
					success();
				}else{
					layer.msg(response.message);
				}
			},
			error:function(response){
				alert("error");
			}
		});
	});
	//修改密码成功，拿到用户信息
	function success(){
		$.ajax({
			type:"post",
			url:urlBaseQ + "health/v2_0/consumer/quicklogin",
			async:false,
			data:{
				mobile:localStorage.getItem("phone",phoneVal),
				code:$("#code").val(),		
				type:3
			},
			dataType:'json',
			success:function(response){
				console.log(response);
			//alert("22");
				localStorage.setItem("userInfo",JSON.stringify(response.map.object));
				localStorage.setItem("_token",response.map.token);
				window.location.href = "home.html";
			},
			error:function(response){
				alert("登录失败");
			}
		});
	}
});
