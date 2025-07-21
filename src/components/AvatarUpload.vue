<!-- src/components/AvatarUpload.vue -->
<template>
  <div class="avatar-wrapper" @click="triggerFileInput">
    <el-avatar :size="size" :src="avatarUrl" class="avatar-img" />
    <div class="avatar-overlay">
      <el-icon :size="24"><Camera /></el-icon>
      <span>更换头像</span>
    </div>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      @change="handleFileChange"
      class="file-input"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'

const props = defineProps({
  avatarUrl: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['update:avatarUrl'])

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  // 验证文件类型和大小
  if (!/^image\/(jpeg|png|gif|jpg)$/.test(file.type)) {
    return ElMessage.error('请上传图片文件 (JPEG/PNG/GIF)')
  }
  
  if (file.size > 2 * 1024 * 1024) {
    return ElMessage.error('图片大小不能超过 2MB')
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:avatarUrl', e.target.result)
    ElMessage.success('头像已更新')
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    
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

.file-input {
  display: none;
}
</style>