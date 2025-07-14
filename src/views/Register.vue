<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">用户注册</h2>
      
      <div class="form-scroll-container">
        <form @submit.prevent="handleSubmit" class="register-form">
          <!-- 用户名 -->
          <div class="form-group">
            <label for="userName">用户名</label>
            <input
              type="text"
              id="userName"
              v-model="form.userName"
              @blur="validateUserName"
              placeholder="请输入1-16位用户名(支持中文)"
              class="form-input"
            />
            <span class="error-message" v-if="errors.userName">{{ errors.userName }}</span>
          </div>

          <!-- 账号 -->
          <div class="form-group">
            <label for="userAccount">登录账号</label>
            <input
              type="text"
              id="userAccount"
              v-model="form.userAccount"
              @blur="validateUserAccount"
              placeholder="请输入4-16位字母或数字"
              class="form-input"
            />
            <span class="error-message" v-if="errors.userAccount">{{ errors.userAccount }}</span>
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label for="userPassword">密码</label>
            <input
              type="password"
              id="userPassword"
              v-model="form.userPassword"
              @blur="validateUserPassword"
              placeholder="请输入6-20位密码"
              class="form-input"
            />
            <span class="error-message" v-if="errors.userPassword">{{ errors.userPassword }}</span>
          </div>

          <!-- 确认密码 -->
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              @blur="validateConfirmPassword"
              placeholder="请再次输入密码"
              class="form-input"
            />
            <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
          </div>
          <!-- 性别 -->
          <div class="form-group">
            <label>性别</label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="form.gender"
                  value="male"
                  checked
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                <span class="radio-text">男</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="form.gender"
                  value="female"
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                <span class="radio-text">女</span>
              </label>
            </div>
          </div>

          <!-- 手机号 -->
          <div class="form-group">
            <label for="phone">手机号</label>
            <input
              type="text"
              id="phone"
              v-model="form.phone"
              @blur="validatePhone"
              placeholder="请输入11位手机号"
              class="form-input"
            />
            <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
          </div>

          <!-- 邮箱 -->
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              @blur="validateEmail"
              placeholder="请输入有效邮箱地址"
              class="form-input"
            />
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? '注册中...' : '立即注册' }}
          </button>
          
          <div class="login-link">
            已有账号？<router-link to="/login">立即登录</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      form: {
        userName: '',
        userAccount: '',
        userPassword: '',
        confirmPassword: '',
        gender: 'male',
        phone: '',
        email: ''
      },
      errors: {
        userName: '',
        userAccount: '',
        userPassword: '',
        confirmPassword: '',
        phone: '',
        email: ''
      },
      isSubmitting: false
    }
  },
  methods: {
    validateUserName() {
      const userNameReg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,16}$/
      if (!this.form.userName.trim()) {
        this.errors.userName = '用户名不能为空'
      } else if (!userNameReg.test(this.form.userName)) {
        this.errors.userName = '用户名必须为1-16位(支持中文、字母、数字)'
      } else {
        this.errors.userName = ''
      }
    },
    validateUserAccount() {
      const accountReg = /^[a-zA-Z0-9]{4,16}$/
      if (!this.form.userAccount.trim()) {
        this.errors.userAccount = '登录账号不能为空'
      } else if (!accountReg.test(this.form.userAccount)) {
        this.errors.userAccount = '账号必须为4-16位字母或数字'
      } else {
        this.errors.userAccount = ''
      }
    },
    validateUserPassword() {
      if (!this.form.userPassword) {
        this.errors.userPassword = '密码不能为空'
      } else if (this.form.userPassword.length < 6 || this.form.userPassword.length > 20) {
        this.errors.userPassword = '密码长度应为6-20位'
      } else {
        this.errors.userPassword = ''
        if (this.form.confirmPassword) {
          this.validateConfirmPassword()
        }
      }
    },
    validateConfirmPassword() {
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = '请确认密码'
      } else if (this.form.userPassword !== this.form.confirmPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致'
      } else {
        this.errors.confirmPassword = ''
      }
    },
    validatePhone() {
      const phoneReg = /^1[3-9]\d{9}$/
      if (!this.form.phone) {
        this.errors.phone = '手机号不能为空'
      } else if (!phoneReg.test(this.form.phone)) {
        this.errors.phone = '请输入有效的11位手机号'
      } else {
        this.errors.phone = ''
      }
    },
    validateEmail() {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email) {
        this.errors.email = '邮箱不能为空'
      } else if (!emailReg.test(this.form.email)) {
        this.errors.email = '请输入有效的邮箱地址'
      } else {
        this.errors.email = ''
      }
    },
    validateForm() {
      this.validateUserName()
      this.validateUserAccount()
      this.validateUserPassword()
      this.validateConfirmPassword()
      this.validatePhone()
      this.validateEmail()
      
      return Object.values(this.errors).every(error => error === '')
    },
    mockApiCall() {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('注册信息:', this.form)
          resolve({ success: true })
        }, 1500)
      })
    },
    showNotification(message, type = 'info') {
      const titleMap = {
        success: '成功',
        warning: '警告',
        error: '错误',
        info: '提示'
      }
      
      // 使用Element UI的通知
      if (this.$notify) {
        this.$notify({
          title: titleMap[type] || '提示',
          message: message,
          type: type,
          duration: 2000
        })
      } else {
        // 备用方案
        alert(`${titleMap[type] || '提示'}: ${message}`)
      }
    },
    navigateBack() {
      if (this.$router) {
        if (window.history.length > 1) {
          this.$router.go(-1)
        } else {
          this.$router.push('/')
        }
      } else {
        console.warn('Router not available')
        window.location.href = '/' // 备用方案
      }
    },
    async handleSubmit() {
      if (this.isSubmitting) return
      
      if (!this.validateForm()) {
        this.showNotification('请正确填写所有字段', 'warning')
        return
      }

      this.isSubmitting = true

      try {
        // 模拟API请求 - 实际项目中替换为真实API调用
        await this.mockApiCall()
        
        this.showNotification('注册成功！', 'success')
        
        // 延迟0.1秒后返回
        setTimeout(() => {
          this.navigateBack()
        }, 100)
        
      } catch (error) {
        console.error('注册失败:', error)
        this.showNotification('注册失败，请稍后重试', 'error')
      } finally {
        this.isSubmitting = false
      }
    }
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
  background: white;
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
  color: #2c3e50;
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

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-input:focus {
  border-color: #3498db;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  outline: none;
}

.form-input::placeholder {
  color: #bdc3c7;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 28px;
  user-select: none;
}

.radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-custom {
  position: absolute;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #f8f9fa;
  border-radius: 50%;
  border: 2px solid #bdc3c7;
  transition: all 0.3s ease;
}

.radio-label:hover .radio-custom {
  border-color: #3498db;
}

.radio-input:checked ~ .radio-custom {
  background-color: #3498db;
  border-color: #3498db;
}

.radio-input:checked ~ .radio-custom::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.radio-text {
  margin-left: 8px;
  color: #34495e;
  font-size: 14px;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  display: block;
  margin-top: 6px;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.submit-btn {
  background: linear-gradient(to right, #3498db, #2ecc71);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #2980b9;
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
