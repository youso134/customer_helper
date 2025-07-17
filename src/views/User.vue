<template>
  <div class="app-container">
    <el-card class="profile-card">
      <h1 class="page-title">个人信息中心</h1>

      <!-- 头像和 UID -->
      <div class="avatar-section column-layout">
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
          />
        </div>
        <div class="basic-info">
          <!-- UID 保留显示 -->
          <p class="uid">UID:{{ userInfo.uid }}</p>
          <p class="role">身份: {{ userInfo.userRole }}</p>
        </div>
      </div>

      <!-- 信息展示区域 -->
      <div class="info-display">
        <!-- 用户名 -->
        <p>
          <strong>用户名：</strong>
          <template v-if="!editMode">{{ userInfo.userName }}</template>
          <template v-else>
            <el-input v-model="userInfo.userName" size="small" style="width: 200px" />
          </template>
        </p>

        <!-- 性别 -->
        <p>
          <strong>性别：</strong>
          <template v-if="!editMode">{{ userInfo.gender }}</template>
          <template v-else>
            <el-select v-model="userInfo.gender" placeholder="请选择" size="small" style="width: 150px">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
              <el-option label="保密" value="保密" />
            </el-select>
          </template>
        </p>

        <!-- 出生年月 -->
        <p>
          <strong>出生年月：</strong>
          <template v-if="!editMode">{{ userInfo.birthdate }}</template>
          <template v-else>
            <el-date-picker
              v-model="userInfo.birthdate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择日期"
              size="small"
              style="width: 180px"
            />
          </template>
        </p>

        <!-- 手机号 -->
        <p>
          <strong>手机号：</strong>
          <template v-if="!editMode">{{ userInfo.phone }}</template>
          <template v-else>
            <el-input v-model="userInfo.phone" size="small" style="width: 200px" />
          </template>
        </p>

        <!-- 邮箱 -->
        <p>
          <strong>邮箱：</strong>
          <template v-if="!editMode">{{ userInfo.email }}</template>
          <template v-else>
            <el-input v-model="userInfo.email" size="small" style="width: 250px" />
          </template>
        </p>

        <!-- 个性签名 -->
        <p>
          <strong>个性签名：</strong>
          <template v-if="!editMode">{{ userInfo.signature }}</template>
          <template v-else>
            <el-input
              v-model="userInfo.signature"
              type="textarea"
              :rows="2"
              maxlength="100"
              show-word-limit
              style="width: 100%"
            />
          </template>
        </p>
      </div>

      <!-- 按钮区域 -->
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
    </el-card>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px" :close-on-click-modal="false">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-position="top">
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
import { Camera, Edit, Check, Close, Lock } from '@element-plus/icons-vue'
import { getuser, updateUser } from '@/apis/api'

const editMode = ref(false)
const fileInput = ref(null)
const originalInfo = ref({})
const tempInfo = ref({})

const userInfo = reactive({
  userName: '',
  userRole: '',
  uid: '',
  avatar: '',
  gender: '',
  birthdate: '',
  phone: '',
  email: '',
  signature: ''
})

const validateBeforeSave = () => {
  const phoneReg = /^1[3-9]\d{9}$/
  const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!userInfo.userName) return ElMessage.error('用户名不能为空')
  if (!phoneReg.test(userInfo.phone)) return ElMessage.error('手机号格式不正确')
  if (!emailReg.test(userInfo.email)) return ElMessage.error('邮箱格式不正确')
  return true
}

const enterEditMode = () => {
  tempInfo.value = JSON.parse(JSON.stringify(userInfo))
  editMode.value = true
}

const cancelEdit = () => {
  Object.assign(userInfo, JSON.parse(JSON.stringify(tempInfo.value)))
  editMode.value = false
}

const saveProfile = async () => {
  if (!validateBeforeSave()) return
  const loading = ElLoading.service({
    lock: true,
    text: '保存中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await updateUser(userInfo)
    if (res.data?.code === 200 || res.code === 200) {
      originalInfo.value = JSON.parse(JSON.stringify(userInfo))
      editMode.value = false
      ElMessage.success('个人信息已保存')
    } else {
      ElMessage.error(res.data?.message || '保存失败')
    }
  } catch {
    ElMessage.error('保存失败')
  } finally {
    loading.close()
  }
}

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

// 修改密码
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

    // 模拟密码验证
    if (passwordForm.oldPassword !== '123456') {
      throw new Error('原密码错误')
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
    loading.close()
  } catch (err) {
    ElMessage.error(err.message || '修改失败')
    ElLoading.service().close()
  }
}

const getUserInfo = async () => {
  const userAccount = 'Cj1234'
  try {
    const res = await getuser(userAccount)
    console.log('后端响应结果:', res)
    // 判断方式：直接判断是否存在 uid 或 userName 等关键字段
    const data = res?.data || res
    if (data && data.uid) {
      Object.assign(userInfo, data)
      originalInfo.value = JSON.parse(JSON.stringify(userInfo))
      console.log('用户信息已加载')
    } else {
      ElMessage.error('后端数据结构不符合预期')
    }
  } catch (err) {
    console.error('请求错误:', err)
    ElMessage.error('获取用户信息出错')
  }
}

onMounted(() => {
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
.column-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.basic-info {
  margin-top: 10px;

  .userName {
    font-size: 22px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  .role {
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 5px;
  }

  .uid {
    font-size: 14px;
    color: #7f8c8d;
  }
}

.info-display {
  margin-top: 30px;
  line-height: 2;
  font-size: 16px;
  color: #34495e;
  padding: 0 20px;

  p {
    margin: 5px 0;
  }
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
