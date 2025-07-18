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
    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="🔒 修改密码"
      width="450px"
      class="password-dialog"
      :close-on-click-modal="false"
      @close="resetPasswordDialog"
    >
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-position="top"
        class="password-form"
      >
        <el-form-item label="原密码" prop="userPassword">
          <el-input
            v-model="passwordForm.userPassword"
            type="password"
            placeholder="请输入原密码"
            size="medium"
            clearable
          />
        </el-form-item>
        <el-form-item label="新密码" prop="userNewPassword">
          <el-input
            v-model="passwordForm.userNewPassword"
            type="password"
            placeholder="请输入新密码"
            size="medium"
            clearable
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="再次输入新密码"
            size="medium"
            clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="password-dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="submitPasswordChange">确认修改</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { Camera, Edit, Check, Close, Lock } from '@element-plus/icons-vue'
import { getUser, updateUser } from '@/apis/userApi'
import { useUserStore } from '../stores/index.ts'

const editMode = ref(false)
const fileInput = ref(null)
const originalInfo = ref({})
const tempInfo = ref({})
const userStore = useUserStore()
const userInfo = reactive({
  userName: '',
  userRole: '',
  uid: '',
  avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mackenzie',
  gender: '',
  birthdate: '',
  phone: '',
  email: '',
  signature: ''
})

const resetPasswordDialog = () => {
  passwordForm.userPassword = ''
  passwordForm.userNewPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.resetFields()
}

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
    const payload = {
    ...userInfo,
    // userAccount: 'Cj1234',
    // userAccount: localStorage.getItem('userAccount')
    }
    const res = await updateUser(payload)
    if (res && res.uid) { // 判断是否返回了有效用户数据
      originalInfo.value = JSON.parse(JSON.stringify(userInfo))
      editMode.value = false
      userStore.setUser(res)
      localStorage.setItem('user', JSON.stringify(res))
      ElMessage.success('个人信息已保存')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
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
  userPassword: '',
  userNewPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  userPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  userNewPassword:[
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value === passwordForm.userPassword) {
        callback(new Error('新密码不能与原密码相同'))
      }else if (!/[A-Z]/.test(value)) {
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
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.userNewPassword) {
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
  passwordForm.userPassword = ''
  passwordForm.userNewPassword = ''
  passwordForm.confirmPassword = ''
  showPasswordDialog.value = true

  // ✨ 清空校验状态和错误提示
  nextTick(() => {
    passwordFormRef.value?.resetFields()
  })
}
const submitPasswordChange = async () => {
  try {
    await passwordFormRef.value.validate()

    const loading = ElLoading.service({
      lock: true,
      text: '修改中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const userStr = localStorage.getItem('user')
    if (!userStr) throw new Error('用户未登录，请重新登录')

    const user = JSON.parse(userStr)

    const payload = {
      uid: user.uid,
      userPassword: passwordForm.userPassword,
      userNewPassword: passwordForm.userNewPassword
    }

    const res = await updateUser(payload)

    if (res && res.success !== false) {
      ElMessage.success('密码修改成功')
      showPasswordDialog.value = false
    } else {
      ElMessage.error(res?.message || '修改失败，请检查原密码是否正确')
    }

    loading.close()
  } catch (err) {
    ElMessage.error(err.message || '修改失败')
    ElLoading.service().close()
  }
}


const getUserInfo = async () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    ElMessage.warning('未找到用户信息，请重新登录')
    return
  }
  let userAccount = ''
  try {
    const user = JSON.parse(userStr)
    userAccount = user?.userAccount || ''
  } catch (e) {
    ElMessage.error('用户信息解析失败')
    return
  }
  if (!userAccount) {
    ElMessage.warning('用户账号缺失')
    return
  }
  try {
    const res = await getUser(userAccount)
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
  // height: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 40px;

  /* 背景图 + 混合渐变层 */
  background: 
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(240, 248, 255, 0.9)),
    url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')
      no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}


/* 卡片样式 */
.profile-card {
  width: 100%;
  max-width: 800px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0); /* 半透明 */
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(10px); /* 关键模糊效果 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 50px rgba(0, 0, 0, 0.15);
  }
}


/* 标题样式 */
.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 30px;
  text-align: center;
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 4px;
    background-color: #3498db;
    margin: 10px auto 0;
    border-radius: 2px;
  }
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
.password-dialog {
  .el-dialog__header {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #2c3e50;
  }

  .password-form {
    padding: 10px 5px;

    .el-form-item {
      margin-bottom: 20px;

      .el-input {
        width: 100%;
      }
    }
  }

  .password-dialog-footer {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 0;
  }
}

</style>
