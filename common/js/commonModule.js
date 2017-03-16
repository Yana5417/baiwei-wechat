/**
 * Created by wlx on 2016/9/27.
 */
//获取url里特定字段值
function GetRequest(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}
//将数字转换成对应中文
function replaceReg(str){
    var reg = /\d/g;
    arr=new Array("零","一","二","三","四","五","六","七","八","九");
    return str.replace(reg,function(m){return arr[m];})

}
//获取具体cookie
function getCookie (name) {
    var cookies = document.cookie.split(";");
    for(var i=0;i<cookies.length;i++) {
        var cookie = cookies[i];
        var cookieStr = cookie.split("=");
        if(cookieStr && cookieStr[0].trim()==name) {
            return  decodeURI(cookieStr[1]);
        }
    }
}


function checkMobileValidation(mobile) {
    var isPhone = /^0{0,1}(1[3-9])[0-9]{9}$/;
    if(!isPhone.test(mobile)){
        //hintPopService.popOut("请输入正确的手机号!", 1000, 500);
        return false;
    }
    return true;
}







//全局变量

//var urlBaseQ = 'http://139.196.105.113:80/health/',
//  urlBaseW = 'http://139.196.105.113:8848/zobj/?';
var urlBaseQ = 'http://139.196.200.113:80/health/',
    urlBaseW = 'http://139.196.200.113:8848/zobj/?';
var token = GetRequest('token');
//var urlBaseQ = 'http://api.baiwei120.com/health';
//token = '474a6fa9ea049293218f262ac450c5ba7d53b4ade73829ae45ec98d2e1d3f6e8e613b7c04c8cab5b5e72cf77b8d7d4ce';
//token  = '474a6fa9ea049293c3e82bf0c7d4b3687753882b2bfc081945ec98d2e1d3f6e8a44400c97ebdd9017716654060763dff';
//token = '474a6fa9ea049293218f262ac450c5ba7d53b4ade73829ae45ec98d2e1d3f6e8e613b7c04c8cab5b5e72cf77b8d7d4ce';
//token = '474a6fa9ea049293c3e82bf0c7d4b3687753882b2bfc081945ec98d2e1d3f6e8bb508e35ac385cec4a7ffed669d4a26c';
//token = '474a6fa9ea049293218f262ac450c5ba7d53b4ade73829ae45ec98d2e1d3f6e8640ced2e83efbafe32b895e55023fa76';
//token = '474a6fa9ea049293f728aa500ce117d3a6b53751653bcb5545ec98d2e1d3f6e82510f8ee902da6189039ac2e501d2f8a';
token = '474a6fa9ea049293f728aa500ce117d3a6b53751653bcb5545ec98d2e1d3f6e8f286bbcc34074486f1c12b2a5fabde00';