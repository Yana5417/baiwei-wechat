$(function(){
	var regPassword = /^[a-zA-Z0-9]\w{5,19}$/,
		newPassVal = $("#newPass").val();
	$('#pass').attr('disabled','disabled');
	if(regPassword.test(newPassVal) == false){
		$("#passwordMsg").show();
	}else{
		$("#passwordMsg").hide();
	}
	$("#pass").on('click',function(){
		$.ajax({
			type:"post",
			url:urlBaseQ + "health/v2_0/consumer/bindPhoneCheck",
			async:false,
			data:{
				mobile:GetRequest("mobile"),
				code:GetRequest("code"),		
				type:3,
				tid:GetRequest("tid"),
				password:$("#Pass").val()
			},
			dataType:'json',
			success:function(response){
				console.log(response);
			},
			error:function(){
				layer.msg("请求超时");
			}
		});
	});
});