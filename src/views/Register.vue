<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">用户注册</h2>
      
      <div class="form-scroll-container">
        <el-form 
          ref="registerForm"
          :model="form" 
          :rules="rules" 
          @submit.prevent="handleSubmit"
          label-position="top"
          class="register-form"
        >
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="form.userName"
              placeholder="请输入1-16位用户名(支持中文)"
              clearable
            />
          </el-form-item>

          <!-- 账号 -->
          <el-form-item label="登录账号" prop="userAccount">
            <el-input
              v-model="form.userAccount"
              placeholder="请输入4-16位字母或数字"
              clearable
            />
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="userPassword">
            <el-input
              v-model="form.userPassword"
              type="password"
              placeholder="请输入6-20位密码(需包含大写字母、小写字母和数字)"
              show-password
            />
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>

          <!-- 性别 -->
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 手机号 -->
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入11位手机号"
              clearable
            />
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入有效邮箱地址"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              native-type="submit" 
              :loading="isSubmitting"
              class="submit-btn"
            >
              {{ isSubmitting ? '注册中...' : '立即注册' }}
            </el-button>
          </el-form-item>
          
          <div class="login-link">
            已有账号？<router-link to="/login">立即登录</router-link>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { loginUser,registerUser } from '@/apis/userApi'


const router = useRouter()
const registerForm = ref(null)

const form = reactive({
  userName: '',
  userAccount: '',
  userPassword: '',
  confirmPassword: '',
  gender: 'male',
  phone: '13800000000',
  email: '123@qq.com'
})

const rules = reactive({
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,16}$/, message: '用户名必须为1-16位(支持中文、字母、数字)', trigger: 'blur' }
  ],
  userAccount: [
    { required: true, message: '登录账号不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{4,16}$/, message: '账号必须为4-16位字母或数字', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!/[A-Z]/.test(value)) {
          callback(new Error('密码必须包含至少一个大写字母'))
        } else if (!/[a-z]/.test(value)) {
          callback(new Error('密码必须包含至少一个小写字母'))
        } else if (!/[0-9]/.test(value)) {
          callback(new Error('密码必须包含至少一个数字'))
        } else if (/[\u4e00-\u9fa5]/.test(value)) {
          callback(new Error('密码不能包含中文'))
        } else {
          callback()
        }
      },
    trigger: 'blur'
    },
    { min: 6, max: 20, message: '密码长度应为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== form.userPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的11位手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
})

const isSubmitting = ref(false)

const mockApiCall = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('注册信息:', form)
      resolve({ success: true })
    }, 1500)
  })
}

const handleSubmit = async () => {
  try {
    await registerForm.value.validate()
    isSubmitting.value = true
    const { data } = await registerUser(form)
      ElMessage.success('注册成功！')
      setTimeout(() => {
        router.push('/')
      }, 100)
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请检查表单或网络')
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  animation: fadeIn 0.6s ease-out;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-title {
  text-align: center;
  color: var(--el-text-color-primary);
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.form-scroll-container {
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  padding-right: 10px;
  margin-right: -10px;
}

.form-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.form-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.form-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.form-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.login-link a {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .register-card {
    padding: 30px 20px;
    max-height: 85vh;
  }
  
  .form-scroll-container {
    max-height: calc(85vh - 100px);
  }
}
</style>