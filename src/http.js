import axios from 'axios'
import Qs from 'qs'

// axios 配置
axios.defaults.timeout = 20000;
axios.defaults.baseURL = '/';
axios.defaults.withCredentials = true;
axios.defaults.transformRequest = function(data) {
	// 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
	if(data instanceof FormData){
		return data;
	}
	return Qs.stringify(data);
}
axios.defaults.paramsSerializer = function(params) {
	return Qs.stringify(params)
}

// http request 拦截器
axios.interceptors.request.use(
	config => {
		// if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
		//     config.headers.Authorization = `token ${store.state.token}`;
		// }
		return config;
	},
	err => {
		return Promise.reject({
			msg: err,
			statusCode: -1
		})
	});

// http response 拦截器

axios.interceptors.response.use(
	response => {
		//      console.log(response)
		return response;
	},
	error => {
		console.log("response error: " + error)
		if(error.response) {
			switch(error.response.status) {
				case 400:
					error.message = '请求错误'
					break

				case 401:
					error.message = '未授权，请登录'
					break

				case 403:
					error.message = '拒绝访问'
					break

				case 404:
					error.message = '请求地址出错'
					break

				case 408:
					error.message = '请求超时'
					break

				case 500:
					error.message = '网络错误'
					break

				case 501:
					error.message = '服务未实现'
					break

				case 502:
					error.message = '网关错误'
					break

				case 503:
					error.message = '服务不可用'
					break

				case 504:
					error.message = '网关超时'
					break

				case 505:
					error.message = 'HTTP版本不受支持'
					break
			}

			return Promise.reject({
				msg: error.message ? error.message : error,
				statusCode: error.response.status
			})
		} else {
			if(error.message) {
				return Promise.reject({
					msg: error.message,
					statusCode: 0
				})
			} else {
				return Promise.reject({
					msg: error,
					statusCode: 0
				})
			}
		}
		// console.log(JSON.stringify(error));//console : Error: Request failed with status code 402

	});

export default axios;