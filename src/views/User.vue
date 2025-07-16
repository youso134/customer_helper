<template>
  <div class="app-container">
    <el-card class="profile-card">
      <h1 class="page-title">个人信息中心</h1>

      <!-- 用户头像部分 -->
      <div class="avatar-section">
        <div class="avatar-wrapper" @click="triggerFileInput">
          <el-avatar :size="100" :src="userInfo.avatar" class="avatar-img" />
          <div class="avatar-overlay">
            <el-icon :size="24"><Camera /></el-icon>
            <span>更换头像</span>
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleAvatarChange"
            class="file-input"
          >
        </div>
        <div class="user-info">
          <h2 class="userName">{{ userInfo.userName }}</h2>
          <el-tag type="info" class="user-role">{{ userInfo.userRole }}</el-tag>
        </div>
      </div>

      <!-- 基本信息表单 -->
      <div class="form-section">
        <el-form
          :model="userInfo"
          :rules="rules"
          ref="userForm"
          label-position="top"
        >
          <div class="form-row">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="userInfo.userName"
                placeholder="请输入用户名"
                :disabled="!editMode"
              />
            </el-form-item>

            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="userInfo.gender"
                placeholder="请选择性别"
                :disabled="!editMode"
              >
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="保密" value="保密" />
              </el-select>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="userInfo.phone"
                placeholder="请输入手机号"
                :disabled="!editMode"
              />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="userInfo.email"
                placeholder="请输入邮箱"
                :disabled="!editMode"
              />
            </el-form-item>
          </div>

          <div class="form-actions">
            <template v-if="!editMode">
              <el-button type="primary" @click="enterEditMode" :icon="Edit">编辑信息</el-button>
              <el-button type="warning" @click="openPasswordDialog" :icon="Lock">修改密码</el-button>
            </template>
            <template v-else>
              <el-button type="primary" @click="saveProfile" :icon="Check">保存修改</el-button>
              <el-button @click="cancelEdit" :icon="Close">取消</el-button>
            </template>
          </div>
        </el-form>
      </div>
    </el-card>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-position="top"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPasswordChange">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import axios from 'axios'
import { Camera, Edit, Check, Close, Lock } from '@element-plus/icons-vue'
import { updateUser, getuser } from '@/apis/api'

const editMode = ref(false)
const fileInput = ref(null)
const userForm = ref(null)

const userInfo = reactive({
  userName: '',
  userRole: '',
  avatar: '',
  gender: '',
  phone: '',
  email: ''
})

const originalInfo = ref({})
const tempInfo = ref({})

// 校验规则
const validatePhone = (rule, value, callback) => {
  if (!value) return callback(new Error('请输入手机号'))
  if (!/^1[3-9]\d{9}$/.test(value)) return callback(new Error('手机号格式不正确'))
  callback()
}

const validateEmail = (rule, value, callback) => {
  if (!value) return callback(new Error('请输入邮箱'))
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) return callback(new Error('邮箱格式不正确'))
  callback()
}

const rules = reactive({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
  ],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
})

// 文件上传
const triggerFileInput = () => fileInput.value.click()

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (!/^image\/(jpeg|png|gif|jpg)$/.test(file.type)) return ElMessage.error('请上传图片文件 (JPEG/PNG/GIF)')
  if (file.size > 2 * 1024 * 1024) return ElMessage.error('图片大小不能超过 2MB')

  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.avatar = e.target.result
    ElMessage.success('头像已更新')
  }
  reader.readAsDataURL(file)
}

// 编辑模式
const enterEditMode = () => {
  tempInfo.value = JSON.parse(JSON.stringify(userInfo))
  editMode.value = true
}

const saveProfile = async () => {
  try {
    await userForm.value.validate()
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    const res = await updateUser(userInfo)
    if (res.data?.code === 200 || res.code === 200) {
      originalInfo.value = JSON.parse(JSON.stringify(userInfo))
      editMode.value = false
      ElMessage.success('个人信息已保存')
    } else {
      ElMessage.error(res.data?.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    ElLoading.service().close()
  }
}

const cancelEdit = () => {
  Object.assign(userInfo, JSON.parse(JSON.stringify(tempInfo.value)))
  editMode.value = false
}

// 修改密码逻辑
const showPasswordDialog = ref(false)
const passwordFormRef = ref(null)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const openPasswordDialog = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showPasswordDialog.value = true
}

const submitPasswordChange = async () => {
  try {
    await passwordFormRef.value.validate()

    const loading = ElLoading.service({ lock: true, text: '修改中...', background: 'rgba(0, 0, 0, 0.7)' })

    // 模拟后端密码验证逻辑
    if (passwordForm.oldPassword !== '123456') {
      throw new Error('原密码错误') // 模拟验证失败
    }

    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 延迟
    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
    loading.close()
  } catch (err) {
    ElMessage.error(err.message || '修改失败')
    ElLoading.service().close()
  }
}

const getUserInfo = async () =>{
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    ElMessage.error('用户未登录，请重新登录')
    return
  }

  let uid = null
  try {
    const user = JSON.parse(userStr)
    uid = user?.uid
  } catch (e) {
    ElMessage.error('用户信息解析失败,请重新登录')
    return
  }

  if (!uid) {
    ElMessage.error('用户ID缺失,请重新登录')
    return
  }

  try {
    console.log(uid)
    const res = await getuser(uid)


    ElMessage.info('111')
    if (res.data?.code === 200 || res.code === 200) {
      const data = res.data?.data || res.data
      Object.assign(userInfo, data)
      originalInfo.value = JSON.parse(JSON.stringify(userInfo))
      tempInfo.value = JSON.parse(JSON.stringify(userInfo))
    } else {
      ElMessage.error(res.data?.message || '获取用户信息失败')
    }
  } catch (error) {
    ElMessage.error('获取用户信息出错')
  }
}

// 初始化数据：从 localStorage 获取 uid，并请求用户信息
onMounted(()=>{
  getUserInfo()
})
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f6f9; /* 清爽的浅灰背景 */
}

/* 卡片样式 */
.profile-card {
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 柔和阴影 */
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 50px rgba(0, 0, 0, 0.15); /* 悬停时的柔和阴影效果 */
    transform: translateY(-5px); /* 卡片浮动效果 */
  }
}

/* 标题样式 */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
  text-align: center;
  letter-spacing: 0.5px;
}

/* 头像部分 */
.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #ecf0f1;
  transition: all 0.3s ease;
}

/* 头像框 */
.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* 增加柔和的阴影 */
  
  &:hover {
    transform: scale(1.1); /* 放大效果 */
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
    
    .avatar-overlay {
      opacity: 1; /* 显示头像覆盖层 */
    }
  }
}

/* 头像图片 */
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 头像覆盖层 */
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  span {
    font-size: 14px;
    margin-top: 5px;
    font-weight: 600;
  }
}

/* 用户信息部分 */
.user-info {
  .userName {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .user-role {
    font-size: 14px;
    color: #7f8c8d;
  }
}

/* 表单部分 */
.form-section {
  .form-row {
    display: flex;
    gap: 20px;
    
    .el-form-item {
      flex: 1;
    }
  }
  
  .el-form-item {
    margin-bottom: 24px; /* 增加表单项间距 */
  }
}

/* 操作按钮 */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;
}

/* 编辑按钮 */
.el-button {
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px); /* 悬停时按钮上移 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 按钮的阴影效果 */
  }
  
  &.el-button--primary {
    background-color: #3498db; /* 按钮纯色背景 */
    border: none;
    color: white;
    
    &:hover {
      background-color: #2980b9; /* 按钮悬停时颜色变深 */
    }
  }
}

/* 媒体查询 */
@media (max-width: 768px) {
  .profile-card {
    padding: 20px;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
    
    .avatar-wrapper {
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
  
  .form-row {
    flex-direction: column;
    gap: 0 !important;
  }
  
  .el-form-item {
    margin-bottom: 15px;
  }
}

</style>
