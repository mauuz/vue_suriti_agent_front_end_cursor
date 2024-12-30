import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/requests'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref({})
  const loading = ref(false)

  // 登录方法
  const login = async ({ username, password }) => {
    loading.value = true
    try {
      const response = await request({
        url: '/auth/token',
        method: 'POST',
        data: {
          username,
          password
        },
        headers: {
          'Content-Type': 'application/json'
        },
        // 登录接口不需要token验证
        requiresAuth: false
      })

      // 解构实际返回的数据结构
      const { 
        access_token, 
        user_id, 
        user_full_name 
      } = response.data

      // 更新 store 中的状态
      token.value = access_token
      userInfo.value = {
        userId: user_id,
        fullName: user_full_name
      }

      // 存储 token 到 localStorage
      localStorage.setItem('access_token', access_token)
        
      return Promise.resolve(response)
    } catch (error) {
      // 统一错误处理
      console.error('Login failed:', error)
      return Promise.reject(error)
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    userInfo,
    loading,
    login
  }
})
