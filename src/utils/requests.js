import axios from 'axios';

// 创建一个 Axios 实例
const instance = axios.create({
    baseURL: 'https://api.agent.jellon.store/api/v1/', // 请替换为你的基础URL
    timeout: 10000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(config => {
    // 检查请求是否需要认证
    if (config.requiresAuth !== false) {  
        // 从 localStorage 获取 access_token
        const accessToken = localStorage.getItem('access_token');
        
        // 如果存在 access_token，则将其添加到请求头中
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
    return response.data; // 直接返回数据
}, error => {
    return Promise.reject(error);
});

// 导出 Axios 实例
export default instance;
