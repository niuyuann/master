// require('es6-promise').polyfill();
// require('isomorphic-fetch');
import 'whatwg-fetch' 
import 'es6-promise'



export default function ajaxApi(url, option = {}) {
  
  let
    params = {},
    method = option.method || 'get',
    data = option.data || {};
  switch (method) {
    case 'get':
      url = url + (data ? '?' + formDataCode(data) : '');
      break;
    case 'post':
      params.headers = {};
      params.method='POST';
    //   params.mode='no-cors';
      params.body = formDataCode(data);
      
      params.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
      
      
    default:
  }
  return fetch(url, params).then(callback).catch(errHandle);
}
//创建修改参数格式的方法，改成提交的Form Data格式
function formDataCode(data) {
  let str = '';
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      str = str + i + "=" + data[i] + '&';
    }
  }
  return str ? str.substring(0, str.length - 1) : '';
}
//创建fetch中then方法的回调
function callback(res) {
  return res.json().then(response => {
    if (!response) {
      throw "服务器返回参数错误"
    } else if (response.errcode == 40001) {
      throw "token失效，请刷新页面"
    } else if (response.errcode == -1) {
      return response
    }
    return response;
  })
}
//创建容错方法
function errHandle(res) {
  if (res.errcode == -1) {
    alert(res.errmsg)
  }
}
