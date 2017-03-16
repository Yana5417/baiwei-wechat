var payUrl = urlBaseQ + "health/v2_0/orders/doctorServicePay";

//添加问诊人信息
function addPatient() {
	var iconList = $(".addImg"),
		icon = '';
	for(var i = 0; i < $(".addImg").length; i++) {
		icon += $(".addImg")[i].src + ",";
	}
	console.log(icon);
	var sex;
	if($("#PeopleSex").html() == "男") {
		sex = 1;
	} else {
		sex = 2;
	}
	//根据token查询orderId,orderRootId
	$.ajax({
		type: "post",
		url: urlBaseQ + "health/v2_0/Inquiry/findOrderStatus",
		data: {
			token: JSON.parse(localStorage.getItem("weLoginInfo")).token || localStorage.getItem("token")
		},
		dataType: 'json',
		async: false,
		success: function(response) {
			console.log("订单id，orderRootid：",response);
			localStorage.setItem("orderInfo", JSON.stringify(response.object));
		},
		error: function() {
			layer.msg('请求失败');
		}
	});

	var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
	console.log(orderInfo);
	//添加问诊人信息
	$.ajax({
		type: "post",
		url: urlBaseQ + "health/v2_0/Inquiry/saveInquiry",
		async: false,
		data: {
			token: JSON.parse(localStorage.getItem("weLoginInfo")).token,
			name: $("#peopleName").html(),
			gender: sex,
			age: $("#peopleAge").html(),
			symptom: $("#mark").val(),
			reportId: localStorage.getItem("HealthListId"),
			reportType: 2,
			orderId: orderInfo.orderId,
			icon: icon
		},
		dataType: 'json',
		success: function(response) {
			console.log("添加问诊人信息成功：",response);
		},
		error: function(response) {

		}
	});
}

//页面逻辑
function getPayWay() {
	var userInfo = JSON.parse(localStorage.getItem("userInfo"));
	console.log(userInfo);

	if($("#peopleName").html() == "") { //问诊人
		layer.msg("问诊人不能为空");
	} else if($("#mark").val() == "") { //症状描述
		layer.msg("症状描述不能为空");
	} else if($("#HealthListName").html() == "" && $(".addImg").length == 0) { //电子档案、图片
		layer.msg("电子档案和图片必须上传一个");
	} else {
		addPatient(); //将问诊人信息保存到数据库
		if(userInfo == null){
			layer.msg("您还未登陆，请登陆");
			window.location.href = "login.html";
		}else{
			var balance = userInfo.balance;
			localStorage.setItem("balance", balance);
			var payWayStr = '<div class="grayBG"></div><div class="payContent"><h3 class="title">选择支付方式</h3>' +
				'<div class="flx73 heighting we-yu"><div class="item"><span class="zhanghu"></span><span>账户余额：</span><span id="cusBanlance">' + balance + '</span></div><div><span class="check" id="zhanghu"></span></div></div>' +
				'<div class="flx73 heighting we-code"><div class="item"><span class="kouling"></span><span>口令/优惠码支付</span></div><div><span class="check" id="kouling"></span></div></div>' +
				'<div class="flx73 heighting we-wx"><div class="item"><span class="weixin"></span><span>微信支付</span></div><div><span class="check" id="weixin"></span></div></div>' +
				'<div class="payContainer"><button class="payButton">立即支付￥<span>20</span></button></div></div></div>'
			$("body").append(payWayStr);
		}
	}

	$(".payContent .flx73").on("click", function() {
		var whichWay = $(this).find(".item").find("span:nth-child(1)")[0].className;
		var isChecked = $("#" + whichWay)[0].className;
		if(isChecked == "check") {
			$("#weixin").removeClass("checked").addClass("check");
			$("#kouling").removeClass("checked").addClass("check");
			$("#zhanghu").removeClass("checked").addClass("check");
			$("#" + whichWay).removeClass("check").addClass("checked");
		}
		payId = whichWay;
		console.log(payId);
		var str = "";
		if(payId == "zhanghu") { //输入余额支付密码
			if($('.payContent>.yu-pass').length == 0) {
				str += '<div class="flx73 yu-pass"><input id="yuPay" type="password" placeholder="请输入支付密码" /></div>';
			} else {
				str = '';
			}

			$('.payContainer').before(str);
			$('.we-code').hide();
			$('.we-wx').hide();
		} else if(payId == "kouling") { //输入口令码/优惠码
			if($('.payContent>.yu-pass').length == 0) {
				str += '<div class="flx73 yu-pass"><input  id="codePay" type="text" placeholder="请输入口令/优惠码" /></div>';
			} else {
				str = '';
			}

			$('.payContainer').before(str);
			$('.we-yu').hide();
			$('.we-wx').hide();
		}
	});
	$(".payButton").on("click", function() {
		if(payId == "zhanghu") {
			console.log($("#yuPay").val().length);
			if($("#yuPay").val().length == 6) {
				balancePay(localStorage.getItem("balance"));
			} else {
				layer.msg("密码格式输入错误");
			}

		} else if(payId == "kouling") {
			codePay();
		} else if(payId == "weixin") {
			getWeixinPay();
		}
		$(".grayBG").remove();
		$(".payContent").remove();
	});
	$(".grayBG").on("click", function() {
		$(".grayBG").remove();
		$(".payContent").remove();
	})
}

/**
 *支付模块 
 */
//调支付的接口
/**
 *param:支付方式的选择
 *val ：支付金额
 */
function getPay(param, val) {
	var obj = {
		token: JSON.parse(localStorage.getItem("weLoginInfo")).token,
		param: val,
		orderRootId: JSON.parse(localStorage.getItem("orderInfo")).orderRootId,
		type: 6
	};
	$.ajax({
		type: "post",
		url: payUrl,
		dataType: 'json',
		data: obj,
		async: false,
		success: function(data) {
			alert("开始支付~");
			//余额支付成功回调
			console.log("调支付接口：",data);
			if(data.message == "成功!") {
				localStorage.setItem("orderMsg", JSON.stringify(data.map));
			}
		},
		error: function() {

		}
	});
}
//余额支付
function balancePay() {
	getPay('balance', 20);
}

//口令/优惠码支付
function codePay() {
	getPay('discountCode', $("#codePay").val());
}

/**
 * 微信支付
 */

//微信支付回调接口,生成预订单
function getWeInfo() {
	//调医生服务的支付接口
	getPay(); //拿到orderNumber，money
	console.log("orderNumber",JSON.parse(localStorage.getItem("orderMsg")).orderNumber);
	$.ajax({
		type: "post",
		url:urlBaseQ + "health/v2_0/orders/wxPay",
		async: false,
		data: {
			orderId:JSON.parse(localStorage.getItem("orderMsg")).orderNumber,
			ip: '127.0.0.1'
		},
		dataType: 'json',
		success: function(response) {
			console.log("wePay_Info",response);
			localStorage.setItem("wePay_Info", JSON.stringify(response.object));
		},
		error: function(response) {
			layer.msg('error');
		}
	});
	/*$.ajax({
		type:"post",
		url:urlBaseQ + "health/v2_0/orders/getSign",
		async:false,
		data:{},
		dataType:'json',
		success:function(response){
			console.log("getSign",response);
			localStorage.setItem("getSign",JSON.stringify(response.object));
		}
	})*/
}
//初始化微信内容
/*function weInit(){
	getWeInfo();
	var getSign = JSON.parse(localStorage.getItem("getSign"));
	var wePay_Info = JSON.parse(localStorage.getItem("wePay_Info"));
	wx.config({
		debug: true, // 开启调试模式,调用的所有api的返回值会在客户端layer.msg出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: "wxf49c6b60fade7ed2", // 必填，公众号的唯一标识
		timestamp: getSign.timestamp, // 必填，生成签名的时间戳
		nonceStr: getSign.nonceStr, // 必填，生成签名的随机串
		signature: getSign.signature, // 必填，签名，见附录1
		jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	wx.ready(function() { // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		console.log("微信网页调用成功");
	});
}*/

function getWeixinPay() {
//	weInit();
	getWeInfo();
	var wePay_Info = JSON.parse(localStorage.getItem("wePay_Info"));
	console.log(wePay_Info);
	
	function onBridgeReady() {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', {
				"appId": "wxf49c6b60fade7ed2", //公众号名称，由商户传入     
				"timeStamp": wePay_Info.timeStamp, //时间戳，自1970年以来的秒数     
				"nonceStr": wePay_Info.nonce_str, //随机串     
				"package": 'prepay_id='+wePay_Info.prepay_id,
				"signType": "MD5", //微信签名方式：     
				"paySign": wePay_Info.sign //微信签名 
			},
			function(res) {
				if(res.err_msg == "get_brand_wcpay_request:ok") {
					WeixinJSBridge.call('closeWindow');
					localStorage.removeItem("quickPeopleYear");
					localStorage.removeItem("quickPeopleMonth");
					localStorage.removeItem("peopleName");
					localStorage.removeItem("balance");
					localStorage.removeItem("orderInfo");
				} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
			}
		);
	}
	if(typeof WeixinJSBridge == "undefined") {
		if(document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		} else if(document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
			document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		}
	} else {
		onBridgeReady();
	}
}
