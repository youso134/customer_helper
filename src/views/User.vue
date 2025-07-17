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
          <h2 class="username">{{ userInfo.username }}</h2>
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
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="userInfo.username" 
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
              <el-button 
                type="primary" 
                @click="enterEditMode"
                :icon="Edit"
              >编辑信息</el-button>
            </template>
            
            <template v-else>
              <el-button 
                type="primary" 
                @click="saveProfile"
                :icon="Check"
              >保存修改</el-button>
              <el-button 
                @click="cancelEdit"
                :icon="Close"
              >取消</el-button>
            </template>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { Camera, Edit, Check, Close } from '@element-plus/icons-vue'

const editMode = ref(false)
const originalInfo = ref({}) // 用于存储原始数据
const tempInfo = ref({})    // 用于存储编辑时的临时数据
const fileInput = ref(null)
const userForm = ref(null)

const userInfo = reactive({
  username: '张三',
  userRole: '客服主管',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  gender: '男',
  phone: '13800138000',
  email: 'zhangsan@example.com'
})

// 自定义验证规则
const validatePhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  if (!/^1[3-9]\d{9}$/.test(value)) {
    return callback(new Error('手机号格式不正确'))
  }
  callback()
}

const validateEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'))
  }
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
    return callback(new Error('邮箱格式不正确'))
  }
  callback()
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ]
})

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理头像变更
const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  // 验证文件类型
  if (!/^image\/(jpeg|png|gif|jpg)$/.test(file.type)) {
    ElMessage.error('请上传图片文件 (JPEG/PNG/GIF)')
    return
  }
  
  // 验证文件大小
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }
  
  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.avatar = e.target.result
    ElMessage.success('头像已更新')
  }
  reader.readAsDataURL(file)
}

// 进入编辑模式
const enterEditMode = () => {
  // 保存当前数据到临时变量
  tempInfo.value = JSON.parse(JSON.stringify(userInfo))
  editMode.value = true
}

// 保存个人信息
const saveProfile = async () => {
  try {
    await userForm.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存时更新原始数据
    originalInfo.value = JSON.parse(JSON.stringify(userInfo))
    editMode.value = false
    ElMessage.success('个人信息已保存')
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error('请检查表单填写是否正确')
    }
  } finally {
    ElLoading.service().close()
  }
}

// 取消编辑
const cancelEdit = () => {
  // 恢复编辑前的数据
  Object.assign(userInfo, JSON.parse(JSON.stringify(tempInfo.value)))
  editMode.value = false
}

// 初始化时保存原始数据
onMounted(() => {
  originalInfo.value = JSON.parse(JSON.stringify(userInfo))
  tempInfo.value = JSON.parse(JSON.stringify(userInfo))
})
</script>

<style scoped lang="scss">
.app-container {
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--el-bg-color-page);
}

.profile-card {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  padding: 30px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--el-box-shadow-dark);
  }
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color-light);
  text-align: center;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px dashed var(--el-border-color);
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 20px;
  
  &:hover {
    transform: scale(1.05);
    
    .avatar-overlay {
      opacity: 1;
    }
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  span {
    font-size: 12px;
    margin-top: 5px;
  }
}

.file-input {
  display: none;
}

.user-info {
  .username {
    font-size: 22px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }
  
  .user-role {
    font-size: 14px;
  }
}

.form-section {
  .form-row {
    display: flex;
    gap: 20px;
    
    .el-form-item {
      flex: 1;
    }
  }
  
  .el-form-item {
    margin-bottom: 22px;
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 15px;
}

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
}
</style>