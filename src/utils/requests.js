import axios from 'axios';
import router from '@/router'; // Adjust the path to your router file

// 创建一个 Axios 实例
//baseURL: 'https://api.agent.jellon.store/api/v1/'
const instance = axios.create({
    //baseURL: 'https://api.agent.jellon.store/api/v1/', // 请替换为你的基础URL
    baseURL: 'http://localhost:8000/api/v1/', // 请替换为你的基础URL
    timeout: 18000, // 请求超时时间
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
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token'); // 删除 access_token
        router.replace('/login'); // 使用 Vue Router replace 跳转到登录页面
    }
    return Promise.reject(error);
});

// 导出 Axios 实例
export default instance;
