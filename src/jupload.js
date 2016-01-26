export default class JUpload{
	constructor(el,options){
		//测试分支合并 冲突解决
		let that = this;
		that.$el = document.querySelector(el);
		that.settings = {
			maxSize: "",
			name: "uploadFileName",

			/**
			 * 文件筛选
			 * audio/* 可以接受所有的音频文件
			 * video/*	可以接受所有的视频文件
			 * image/*	可以接受所有的图片文件
			 */
			accept: "",
			postUrl: "",
			onClientLoad: null,
			onServerProgress: null,
			onServerReadyStateChange: null,

			onError: res => {
				alert(`file upload error code = ${res.code} message = ${res.message}`);
			},
			/**
			 * 成功回调函数
			 */
			onSuccess: () => {
				console.log(`upload success1`);
			},
			/**
			 * 点击事件前验证
			 * @returns true | false
			 */
			onBeforeClick: () => {
				return true;
			}
		};

		that.settings = Object.assign(that.settings, options);


		that.$el.style.cssText = "position:relative;";

		let input = document.createElement("input");
		input.id = "__upload_input__";
		input.type = "file";
		input.accept = that.settings.accept;
		input.style.cssText = "position:absolute;left:-10000px;top:-10000px;";

		that.$el.appendChild(input);

		that.$el.onclick = () => {
			if (that.settings.onBeforeClick()) {
				input.click();
			}
		};
		input.onchange = () => {
			var len = input.files.length;
			for(var i = 0 ; i < len ; i++){
				that.fileHandler(input.files[i]);
			}
		};
	}

	fileHandler(file) {
			var that = this;
			if (that.settings.maxSize != '' && file.size > that.settings.maxSize) {
				var obj = {
					code: 4001,
					message: "文件大小超出限制"
				};
				if (that.settings.onError) that.settings.onError(obj);
				console.log(JSON.stringify(obj));
				return;
			}

			if ('FileReader' in window) {
				var fileReader = new FileReader();
				fileReader.onload = e => {
					if (that.settings.onClientLoad) {
						that.settings.onClientLoad(e, file, this);
					}
				};
				fileReader.readAsDataURL(file);
			} else {
				console.log("FileReader is not defined");
			}

			var xmlHttpRequest = new XMLHttpRequest();

			xmlHttpRequest.upload.onprogress = e => {
				if (that.settings.onServerProgress) {
					that.settings.onServerProgress(e, file);
				}
			};
			xmlHttpRequest.onreadystatechange = e => {
				if (that.settings.onServerReadyStateChange) {
					that.settings.onServerReadyStateChange(e, file, xmlHttpRequest.readyState);
				}
				if (that.settings.onSuccess && xmlHttpRequest.readyState == 4 &&
					xmlHttpRequest.status == 200) {
					that.settings.onSuccess(e, file, xmlHttpRequest.responseText);
				}
			};

			var url = that.settings.postUrl;
			if (typeof that.settings.postUrl === "function")
				url = that.settings.postUrl();
			xmlHttpRequest.open("POST", url, true);

			var formData = new FormData();
			formData.append(that.settings.name, file);
			xmlHttpRequest.send(formData);
		}
}