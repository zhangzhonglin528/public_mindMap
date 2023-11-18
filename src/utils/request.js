import axios from "axios";
import router from "@/router";

const request = axios.create({
    baseURL: 'https://test-platfrom.ccops.net', //远程地址
    // baseURL: 'http://10.0.22.23:5000', //远程地址
    // baseURL: 'http://127.0.0.1:5000', //本地调试地址
    // timeout: 10000,
    withCredentials: true,
    responseType: 'json',
    headers: {
        'Accept-Encoding': 'gzip, deflate'
    }
})

// request 拦截器
/*可以在请求发送前对请求做一些处理
比如：统一加token，对请求参数统一加密等等
 */
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    let user =localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) :null
    if (user) {
        config.headers['Authorization'] = user.auth_token; //设置请求头
        /** 设置账号信息的返回（姓名为中文，使用encodeURIComponent 编码后返回）--->解码decodeURIComponent*/
        config.headers['current_user'] = encodeURIComponent(user.nickname);
    }
    // 删除 Accept-Encoding 设置
    delete config.headers['Accept-Encoding'];
    return config
}, error => {
    return Promise.reject(error)
});

//response拦截器
// 可以在接口响应后统一处理
request.interceptors.response.use(
    response => {
        let res = response.data;
        //如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res;
        }
        //兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        if (res.result === 401) {
            // 处理认证失败
            if (res.error_msg === "令牌过期") {
                // 从本地存储中获取用户信息
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const user = JSON.parse(storedUser);

                    // 发起刷新token接口
                    return request.post("/user/refreshToken", { user_id: user.user_id, username: user.username })
                        .then(refreshRes => {
                            if (refreshRes.result === 200) {
                                // 刷新成功，重新发起原始请求
                                response.config.headers['Authorization'] = refreshRes.data.auth_token;
                                localStorage.setItem("user", JSON.stringify({ ...user, auth_token: refreshRes.data.auth_token }));
                                console.log("令牌过期，重新刷新token", refreshRes.data.auth_token)
                                return request(response.config);
                            } else {
                                // 刷新失败，跳转到登录页面
                                if (router.currentRoute.path !== "/login") {
                                    router.replace("/login");
                                }
                                return Promise.reject(res);
                            }
                        });
                } else {
                    // 本地没有用户信息，直接跳转到登录页面
                    if (router.currentRoute.path !== "/login") {
                        router.replace("/login");
                    }
                    return Promise.reject(res);
                }
            } else {
                // 不是令牌过期，直接跳转到登录页面
                if (router.currentRoute.path !== "/login") {
                    router.replace("/login");
                }
            }
        }
        return res;
    },
    error => {
        // console.log('err'+ error) // for debug
        return Promise.reject(error)
    }
)

export default request