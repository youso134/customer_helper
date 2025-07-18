<template>
  <div class="login-container">
    <div class="left-panel">
      <h1 class="welcome-title">Welcome!</h1>
      <p class="welcome-subtitle">聊天信息管理系统</p>
    </div>

    <div class="right-panel">
      <el-card class="login-card">
        <h2 class="login-title">咕咕叫工作室</h2>
        <p class="login-subtitle">Cluck & Co.</p>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          hide-required-asterisk
          status-icon
        >
          <el-form-item label="账户" prop="userAccount">
            <el-input
              v-model="loginForm.userAccount"
              placeholder="请输入账号"
              clearable
              autofocus
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="userPassword">
            <el-input
              v-model="loginForm.userPassword"
              type="password"
              show-password
              placeholder="请输入密码"
              clearable
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="remember">
            <el-checkbox v-model="isRemember">记住我</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
            <el-button
              class="register-button"
              type="default"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
 <script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { loginUser } from '../apis/userApi.ts'
import { useUserStore } from '../stores/index.ts'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  userAccount: '',
  userPassword: '',
})
const isRemember = ref(false)
const loading = ref(false)

const loginRules = reactive<FormRules>({
  userAccount: [
    { required: true, message: '请输入账户', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
})

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const res: any = await loginUser(loginForm)
        if (res && res.userAccount) {
          userStore.setUser(res)
          localStorage.setItem('user', JSON.stringify(res))
          ElMessage.success('登录成功')
          router.push('/main')
        } else {
          ElMessage.error('登录失败，请检查账号密码')
        }
      } catch (error) {
        ElMessage.error('登录请求出错，请稍后再试')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleRegister = () => {
  router.push('/register')
}



onMounted(() => {
  const cache = localStorage.getItem('user')
  if (cache) {
    const res = JSON.parse(cache)
    userStore.setUser(res)
    router.push('/main')
  }
})
</script>
<style scoped lang="scss">
.login-container {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .left-panel {
    flex: 1;
    background-image: url('https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')  ;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    // &::after {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   right: -60px;
    //   width: 250px;
    //   height: 100%;
    //   background-color: #182c41;
    //   border-top-left-radius: 20px;
    //   border-bottom-left-radius: 20px;
    // }

    .welcome-title {
      font-size: 36px;
      margin-bottom: 10px;
    }

    .welcome-subtitle {
      font-size: 18px;
      margin-bottom: 40px;
    }
  }

  .right-panel {
    flex: 1;
    background: linear-gradient(to bottom right, #1f2c3a, #f8f8f8);
    display: flex;
    justify-content: center;
    align-items: center;

    .login-card {
      width: 360px;
      padding: 30px 25px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      background-color: #fff;

      .login-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 6px;
        color: #333;
      }

      .login-subtitle {
        text-align: center;
        color: #888;
        margin-bottom: 24px;
        font-size: 14px;
      }

      .el-form-item {
        margin-bottom: 20px;
      }

      .login-button,
      .register-button {
        display: block;
        width: 100%;
        height: 42px;
        font-size: 15px;
        font-weight: 500;
        margin: 10px 0 0 0;
        border-radius: 6px;
        text-align: center;
      }

      .login-button {
        background-color: #1f2c3a;
        color: white;

        &:hover {
          background-color: #304257;
        }
      }

      .register-button {
        background-color: #e6a23c;
        color: white;
        border: none;

        &:hover {
          background-color: #d8931f;
        }
      }
    }
  }
}
</style>
