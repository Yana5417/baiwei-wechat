/**
 * Created by wlx on 2016/12/16.
 */
var payId = "zhifubao";//默认支付宝支付
var urlBaseQqq = 'http://api.baiwei120.com/health';
var weixinOrZhifubaoOrderId;
var REDIRECT_URI = "http://139.196.105.113/h5/ask.html";
var APPID = "gh_570d6b0a6cc0";
var APPID = "wxf49c6b60fade7ed2";
var SECRET = "";

//获取token?????
//从微信获取openId
function getWeixinOpenId(code){
    $.ajax({
        type: "post",
        url : "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+APPID+"&secret="+SECRET+"&code="+code+"&grant_type=authorization_code",
        dataType:'json',
        data: {} ,
        async : false,
        success: function(data){
            if(data.openid){
                localStorage.setItem("openid",data.openid);
            }
        },
        error:function(){

        }
    });
}
function weixinInit(){
    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: APPID, // 必填，公众号的唯一标识
        timestamp:timestamp , // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature,// 必填，签名，见附录1
        jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function(){
        alert("wx.ready");
    });
    wx.error(function(){
        alert("wx.ready");
    });
}
function getWeixinPay(){
    wx.chooseWXPay({
        timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: '', // 支付签名随机串，不长于 32 位
        package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: '', // 支付签名
        success: function (res) {
            // 支付成功后的回调函数
        }
    });
}


//页面逻辑
function getPayWay(){
    //var payWayStr = '<div class="grayBG"></div><form name=alipayment action=http://192.168.31.130:8081/health/health/v2_0/orders/doPost method=post id="alipaymentt">'
    var payWayStr = '<div class="grayBG"></div><form name=alipayment action=http://139.196.105.113:80/health/health/v2_0/orders/doPost method=post id="alipaymentt">'
        +'<input name="orderNumber" id="WIDtotal_fee" value="D16121800026" style="display: none;"/><input name="price" id="WIDtotal_fee" value="3" style="display: none;"/>'
        +'<div class="payContent">'
        +' <h3 class="title">选择支付方式</h3>'
        +'<div class="flx73 heighting" style="background-color: #f2f2f2;">'
        +' <div class="item" style="background-color: #f2f2f2;">'
        +'<span class="zhanghu"></span>'
        +'<span>账户余额：</span>'
        +'<span id="cusBanlance">300</span>'
        +'</div>'
        +'<div style="background-color: #f2f2f2;">'
        +'<span class="checked" id="zhanghu"></span>'
        +'</div>'
        +'</div>'
        +' <div class="flx73 heighting">'
        +'<div class="item">'
        +'<span class="weixin"></span>'
        +'<span>微信支付</span>'
        +'</div>'
        +'<div>'
        +' <span class="check" id="weixin"></span>'
        +' </div>'
        +'</div>'
        +'<div class="flx73 heighting">'
        +' <div class="item">'
        +'<span class="zhifubao"></span>'
        +' <span>支付宝</span>'
        +' </div>'
        +' <div>'
        +' <span class="check" id="zhifubao"></span>'
        +'</div>'
        +' </div>'
        +'<div class="payContainer">'
        +'<button class="payButton" type="submit">立即支付￥<span>200</span></button>'
        +' </div>'
        +' </div></form>';
    $("body").append(payWayStr);
    //加入订单号
    /*if(localStorage.getItem("orderId")){
        $("#WIDtotal_fee").attr("value",parseInt(localStorage.getItem("orderId")));
        $("#WIDtotal_fee").val(parseInt(localStorage.getItem("orderId")));
       // document.getElementById("WIDtotal_fee").value = localStorage.getItem("orderId");
    }*/
    //֧������js,��jquery֮������
    $(".payContent .flx73").on("click",function(){
        var whichWay = $(this).find(".item").find("span:nth-child(1)")[0].className;
        var isChecked = $("#"+whichWay)[0].className;
        if(isChecked == "check"){
            $("#weixin").removeClass("checked").addClass("check");
            $("#zhifubao").removeClass("checked").addClass("check");
            $("#zhanghu").removeClass("checked").addClass("check");
            $("#"+whichWay).removeClass("check").addClass("checked");
        }
        payId = whichWay;
        if(payId=="zhifubao"){//改变form表单样式
            $(".payButton").attr("type","submit");
        }else{
            $(".payButton").attr("type","888");
        }
    });
    $(".payButton").on("click",function(){//ִ�е���֧���ӿ�
        if(payId=="zhifubao"){
            zhihubaoPay();
        }else{
            getCBanlance();
        }

        //�ɹ���ɾ��ģ��
        $(".grayBG").remove();
        $(".payContent").remove();
    });
    $(".grayBG").on("click",function(){
        $(".grayBG").remove();
        $(".payContent").remove();
    })
}
function getCBanlance(){
    var url = urlBaseQqq +  "/health/v2_0/consumer/getConsumerBalance";/* + "?token="+localStorage.getItem("token")+"&api_key=getOrderHealthCoin"*/
    var obj = {
        token:localStorage.getItem("token")
    }
    $.ajax({
        type: "post",
        url : url,
        dataType:'json',
        data: obj ,
        async : false,
        success: function(data){
            //将健康币存入本地
            if(data.code==1){
                $("#cusBanlance").html(data.map.balance);
            }else{
                $("#cusBanlance").html("0");
            }
        },
        error:function(){
            $("#cusBanlance").html("0");
        }
    });
}
//定义余额支付
function balancePay(){
    var payUrl = urlBaseQqq + "/health/v2_0/orders/updateOrderCouponAndIntegral";
    var obj = {
        token:localStorage.getItem("token"),
        consumerCouponId:"",
        checkCardList:"",
        balance:localStorage.getItem("balanceL"),
        integralMoney:localStorage.getItem("integralMoney"),
        discountCodeId:localStorage.getItem("discountCodeId"),
        orderRootId:localStorage.getItem("orderId"),
    };
    $.ajax({
        type: "post",
        url : url,
        dataType:'json',
        data: obj ,
        async : false,
        success: function(data){
            //余额支付成功回掉

        },
        error:function(){

        }
    });
}
//定义支付宝支付
function zhihubaoPay(){
    //入参要重新定义
    document.getElementById('alipaymentt').submit();
}
//定义微信支付
function weixinPay(){
    //微信支付之前检查本地有没有用户token和openid,没有即获取
    get();
    if(GetRequest("code")){
        getWeixinOpenId(GetRequest("code"));
    }
    if(!localStorage.getItem("openid ")){
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APPID+"&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
    }else{
        var openid = localStorage.getItem("openid ");
        //调起微信支付功能
        getWeixinPay();
    }
}
