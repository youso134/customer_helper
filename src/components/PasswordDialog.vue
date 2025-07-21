<!-- src/components/PasswordDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="🔒 修改密码"
    width="450px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-position="top"
    >
      <el-form-item label="原密码" prop="currentPassword">
        <el-input
          v-model="formData.currentPassword"
          type="password"
          placeholder="请输入原密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="formData.newPassword"
          type="password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="再次输入新密码"
          show-password
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认修改</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref(null)
const visible = ref(false)

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validatePassword = (rule, value, callback) => {
  if (value === formData.currentPassword) {
    callback(new Error('新密码不能与原密码相同'))
  } else if (!/[A-Z]/.test(value)) {
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
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  currentPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    emit('submit', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    })
    handleClose()
  } catch (err) {
    console.error('表单验证失败:', err)
  }
}

// 监听外部modelValue变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

// 监听内部visible变化
watch(visible, (val) => {
  if (val !== props.modelValue) {
    emit('update:modelValue', val)
  }
})
</script>

<style scoped>
:deep(.el-dialog__header) {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>