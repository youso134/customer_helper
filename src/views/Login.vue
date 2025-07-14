<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">质检助手系统登录</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
        <el-form-item label="账户" prop="userAccount">
          <el-input v-model="loginForm.userAccount" style="opacity: 0.5" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="密码" style="margin-top: 40px;" prop="userPassword">
          <el-input v-model="loginForm.userPassword" style="opacity: 0.5;" type="password" placeholder="请输入密码"
            show-password />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="isRemember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <el-button type="warning" class="login-button" @click="handleRegister">
          注册
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { loginUser } from '../apis/api.ts';
import { useUserStore } from '../stores/index.ts';


const router = useRouter()  // 路由跳转
const userStore = useUserStore()  // 用户信息

const loginFormRef = ref<FormInstance>()  // 表单引用 用于校验

const loginForm = reactive({
  userAccount: '',
  userPassword: '',
})
const isRemember = ref(false)

// 加载状态 判断是否成功
const loading = ref(false)

// 验证规则
const loginRules = reactive<FormRules>({
  userAccount: [
    { required: true, message: '请输入账户', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

// 登录处理
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      loading.value = true
      try {
        let res: any = await loginUser(loginForm)
        if (res && res.userAccount) {
          userStore.setUser(res)
          localStorage.setItem('user', JSON.stringify(res))
          router.push('/main')
        }
        else {
          // ElMessage.error('登录失败，请检查账号密码')
        }
      } catch (error) {
        // ElMessage.error('登录请求出错，请稍后再试')
      } finally {
        loading.value = false
      }
      // console.log(localStorage.getItem('user'))
    }
  })
}

const handleRegister = () => {
  router.push('/register')
}

onMounted(() => {
  // 进入页面前先判断缓存中是否有用户数据，有就直接登录跳转别的页面，没有才进入登录页面。
  let res: any = localStorage.getItem('user')
  if (res !== null) {
    res = JSON.parse(res)
    userStore.setUser(res)
    router.push('/main')
  }
})


</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  overflow: hidden;
  margin: 0;

  .login-card {
    width: 400px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    /* 背后内容模糊10像素 */
    background-color: rgba(255, 255, 255, 0.2);
    /* 半透明背景增强效果 */

    .login-title {
      text-align: center;
      margin-bottom: 24px;
      color: #303133;
    }

    .login-button {
      width: 100%;
      margin-top: 10px;
    }
  }


}
</style>