<template>
  <div class="login-container">
    <div class="logo">
      <img src="@/assets/logo.png" alt="Company Logo" />
    </div>
    <div class="login-form">
      <a-input
        v-model="username"
        placeholder="请输入账号"
        prefix-icon="user"
        class="input-field"
        :error="loginError"
        @focus="handleFocus"
      />
      <a-input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        prefix-icon="lock"
        class="input-field"
        :error="loginError"
        allow-clear
        @focus="handleFocus"
      />
      <div class="form-item">
        <a-checkbox v-model="rememberMe">记住密码</a-checkbox>
      </div>
      <div class="form-item">
        <a-button type="primary" block @click="handleLogin" long>登录</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';

const userStore = useUserStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const loginError = ref(false);

const handleLogin = async () => {
  try {
    loginError.value = false;
    await userStore.login({
      username: username.value,
      password: password.value
    });

    if (rememberMe.value) {
      localStorage.setItem('username', username.value);
      localStorage.setItem('password', password.value);
      localStorage.setItem('isRemeber',"true")
    }

    Message.success('登录成功');
    router.push('/');
  } catch (error) {
    console.error('登录失败:', error);
    loginError.value = true;
    Message.error('登录失败：账号或密码错误' );
  }
};

const handleFocus = () => {
  loginError.value = false;
};

onMounted(() => {
  const savedUsername = localStorage.getItem('username');
  const savedPassword = localStorage.getItem('password');
  const isRemeber = localStorage.getItem('isRemeber');
  if (savedUsername) {
    username.value = savedUsername;
  }
  if (savedPassword) {
    password.value = savedPassword;
  }
  if (isRemeber) {
    rememberMe.value = true;
  }

});
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.cube {
  position: absolute;
  top: 80vh;
  left: 45vw;
  width: 10px;
  height: 10px;
  border: solid 1px rgba(255, 255, 255, 0.2);
  transform-origin: top left;
  transform: scale(0) rotate(0deg) translate(-50%, -50%);
  animation: cube 12s ease-in forwards infinite;
}

.cube:nth-child(2) {
  animation-delay: 2s;
  left: 25vw;
  top: 40vh;
}

.cube:nth-child(3) {
  animation-delay: 4s;
  left: 75vw;
  top: 50vh;
}

.cube:nth-child(4) {
  animation-delay: 6s;
  left: 90vw;
  top: 10vh;
}

.cube:nth-child(5) {
  animation-delay: 8s;
  left: 10vw;
  top: 85vh;
}

@keyframes cube {
  from {
    transform: scale(0) rotate(0deg) translate(-50%, -50%);
    opacity: 1;
  }
  to {
    transform: scale(20) rotate(960deg) translate(-50%, -50%);
    opacity: 0;
  }
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 400px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
}

.login-form:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
}

.input-field {
  margin-bottom: 20px;
  width: 100%;
}

.input-field :deep(.ant-input) {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.input-field :deep(.ant-input:hover) {
  border-color: #1890ff;
  background: #fff;
}

.input-field :deep(.ant-input:focus) {
  border-color: #1890ff;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-item {
  margin-bottom: 20px;
  width: 100%;
}

.form-item :deep(.ant-checkbox-wrapper) {
  color: #333;
}

.form-item :deep(.ant-btn) {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  border: none;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.form-item :deep(.ant-btn:hover) {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

/* 添加响应式设计 */
@media (max-width: 576px) {
  .login-form {
    width: 90%;
    padding: 30px 20px;
  }
  
  .logo img {
    width: 140px;
  }
}

.error-text {
  color: #f53f3f;  /* Arco Design 的错误色 */
  font-size: 14px;
  margin-top: 6px;
}
</style>
