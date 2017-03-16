/**
 *create by lyn on 20117/3/3. 
 */

//params
var domain,
	uptoken,
	imgKey,
	imgNumber,
	imgKeyList;

//获取七牛的uptoken
function getUptoken() {
	var url = "http://139.196.200.113/health/health/v2_0/qiniu/getQiniuToken";
	$.ajax({
		type: "post",
		url: url,
		async: false,
		data: {},
		dataType: 'json',
		success: function(response) {
			if(response.message == "成功") {
				domain = response.object.domain;
				uptoken = response.object.uptoken;
			}
		},
		error: function(response) {
			alert('error');
		}
	});
}
getUptoken();

//获取七牛的key
/*function getKey(uptoken,num) {
	var getKeyUrl = urlBaseQ + "/health/v2_0/qiniu/getQiniuKeys";
	var req = {
		token: uptoken,
		number: 3,
		type: 1
	};
	$.ajax({
		type: "post",
		url: getKeyUrl,
		async: false,
		data: req,
		dataType: 'json',
		success: function(response) {
			console.log(response);
			if(response.message == "成功!") {
				imgKeyList = response.object;
			}
		},
		error: function(response) {
			alert('error');
		}
	});
}*/



//创建上传的图片显示dom
function createNewImg(ele, src) {
	var imgStr = '<img src="' + src + '" alt="上传图片" class="addImg" />'
	$("#" + ele).append(imgStr);
}

//初始化uploader
var uploader = Qiniu.uploader({
	runtimes: 'html5,flash,html4', 			//上传模式，依次退化
	browse_button: 'cvs', 					//上传选择的按钮，必需
	uptoken: uptoken, 						//uptoken是上传凭证，由其他程序生成
	uptoken_url: urlBaseQ + "/health/v2_0/qiniu/getQiniuToken", //ajax请求uptoken的url
	get_new_uptoken: false,					//设置上传文件的时候是否每次都重新获取新的uptoken
	unique_names: false, 					//默认false，key为文件名，若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
	save_key: false, 						//默认false，若在服务器生成uptoken的上传策略中指定了save_key,则开启，SDK在前端将不对key进行任何处理
	domain: domain, 						//bucket域名，下载资源时用到，必需
	container: 'upload', 					//上传区域DOM ID，默认是browser_button
	max_file_size: '10mb', 				    //最大文件体积限制
	max_retries: 3, 						//上传失败最大重试次数
	dragdrop: false, 						//开启可拖拽上传
	chunk_size: '4mb', 						//分块上传时，每块的体积
	auto_start: true, 						//选择文件后自动上传，若关闭需要自己绑定事件触发上传ge files"pg,jpeg,gif,png"}
	init: {
		'FilesAdded': function(up, files) {// 文件添加进队列后，处理相关的事情
			plupload.each(files, function(file) {
				
			});
		},
		'BeforeUpload': function(up, file) {// 每个文件上传前，处理相关的事情
			
		},
		'UploadProgress': function(up, file) {// 每个文件上传时，处理相关的事情
			
		},
		'FileUploaded': function(up, file, info) {// 每个文件上传成功后，处理相关的事情
			
			// 其中info是文件上传成功后，服务端返回的json，形式如：
			// {
			//    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
			//    "key": "gogopher.jpg"
			//  }
			// 查看简单反馈
			// var domain = up.getOption('domain');
//			alert("info:", info);
			console.log("info:", info);
			var res = JSON.parse(info);
			var sourceLink = domain + "/" + res.key; //获取上传成功后的文件的Url
			
			sourceLink = "http://" + sourceLink;
			
			//处理多次上传的时候，自动创建img标签
			createNewImg('imgContainerFromUp', sourceLink);
		},
		'Error': function(up, err, errTip) {//上传出错时，处理相关的事情
			
			alert("该图片已经存在！");
		},
		'UploadComplete': function() {//队列文件处理完毕后，处理相关的事情
			
		}
	},
});