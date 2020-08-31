import axios from 'axios';
import qs from 'qs';
import Modal from 'iview/src/components/modal';
import router from './router'
import { resetTokenAndClearUser } from './utils';

axios.defaults.timeout = 50000; //响应时间50秒
axios.defaults.baseURL = '/security';   //配置接口地址

// 添加请求拦截器
axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("token")
    if (token)  config.headers.token = token;  
    return config;
},(error) => {
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use((res) =>{
    if (res.request.responseType === 'blob') {
        return Promise.resolve(res.data);
    }
    if (res.data.status === '000000' || res.data.code === '000000') {
        return Promise.resolve(res.data);
    } else if (res.data.code === '800000') {
        return Modal.error({
            title: '错误',
            content: `错误码：${res.data.code}<br />错误信息：${res.data.message}`,
            onOk: () => {
                resetTokenAndClearUser();
                router.replace({name: 'login'});
            }
        });
    } else {
        Modal.error({ title: '警告', content: res.data.message });
        return Promise.reject(res.data.message);
    }
}, (error) => {
    Modal.error({ title: '错误', content: `错误码：${error.response.data.status || error.response.data.code}<br />错误信息：${error.response.data.message}` });
    return Promise.reject(error);
});

// 发送post请求
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        let param = params;
        let headers = 'application/json;charset=UTF-8'
        if (url === '/login') {
            headers = 'application/x-www-form-urlencoded';
            param = qs.stringify(params);
        }
        axios.post(url, param, { headers: { 'Content-Type': headers } })
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 发送get请求
export function fetchGet(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params})
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 发送delete请求
export function fetchDelete(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {params})
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 同时支持get/post请求;
export function fetchAll(method,url, data = {}, headers) {
    return new Promise((resolve, reject) => {
        axios({
            method: method || 'post',
            url:url,
            params: method === 'get' ? data :'',
            data: method !== 'get' ?  data :'',
            headers: headers || {'Content-Type':'application/json;charse=UTF-8'},
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(err => {
            reject(err)
        })
    })
}

export default {
    fetchPost,
    fetchGet,
    fetchDelete,
    fetchAll,
};