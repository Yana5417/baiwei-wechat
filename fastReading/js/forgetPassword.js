//忘记密码
$(function(){
	var regPhone = /^1[34578]\d{9}$/;
	var phoneVal;
	$('#nextstep').attr('disabled','disabled');
	$("#phoneMsg").hide();
     phoneVal = $('#phone').val();
		console.log(phoneVal);
	$("#phone").on('blur', function() {
		if(regPhone.test(phoneVal) == false) {
			$("#phoneMsg").show();
		}else {
			$("#phoneMsg").hide();
		}
		});
//判断手机号是否注册过
	$("#nextstep").on('click',function(){	 
			$.ajax({
				type:"post",
				url:urlBaseQ + "health/v2_0/consumer/forgetCheckPhone",
				async:false,
				data:{
					mobile:phoneVal,
				},
				dataType:'json',
				success:function(response){
					console.log(response.message); 
					if(response.message == "成功!"){
						localStorage.setItem("phone",phoneVal);
						window.location.href = "setPassword.html";
					}else{
						layer.msg("您尚未注册,无法重置密码"); 
					}					
				},
				error:function(response){
					alert('error');
				}
			});
		
	});
	//确定按钮是否可用
	$("input").change(function(){
		phoneVal = $('#phone').val();
		console.log('phone',regPhone.test(phoneVal));
		if(regPhone.test(phoneVal) == true ) {
			$('#nextstep').attr('disabled',false);
		}else{
			$('#nextstep').attr('disabled','disabled');
		}
	});
	
	
});
