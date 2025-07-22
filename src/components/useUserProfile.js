// src/composables/useUserProfile.js
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getUser, updateUser } from '@/apis/userApi'
import { useUserStore } from '@/stores/index'

export function useUserProfile() {
  const userStore = useUserStore()
  const editMode = ref(false)
  const originalInfo = ref({})
  const tempInfo = ref({})

  const userInfo = reactive({
    userName: '',
    userRole: '',
    uid: '',
    avatar: 'https://plus.unsplash.com/premium_photo-1752155109947-539988d49e5d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    signature: ''
  })

  const validateBeforeSave = () => {
    const phoneReg = /^1[3-9]\d{9}$/
    const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

    if (!userInfo.userName) {
      ElMessage.error('用户名不能为空')
      return false
    }
    if (!phoneReg.test(userInfo.phone)) {
      ElMessage.error('手机号格式不正确')
      return false
    }
    if (!emailReg.test(userInfo.email)) {
      ElMessage.error('邮箱格式不正确')
      return false
    }
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
      const payload = { ...userInfo }
      const res = await updateUser(payload)

      if (res && res.uid) {
        originalInfo.value = JSON.parse(JSON.stringify(userInfo))
        editMode.value = false
        userStore.setUser(res)
        localStorage.setItem('user', JSON.stringify(res))
        ElMessage.success('个人信息已保存')
      } else {
        ElMessage.error('保存失败')
      }
    } catch (e) {
      ElMessage.error('保存失败: ' + (e.message || '未知错误'))
    } finally {
      loading.close()
    }
  }

  const fetchUserInfo = async () => {
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
      const data = res?.data || res

      if (data && data.uid) {
        // 转换后端传来的 UTC 时间为北京时间字符串
        if (data.birthDate) {
          data.birthDate = convertToBeijingDate(data.birthDate)
        }

        Object.assign(userInfo, data)
        originalInfo.value = JSON.parse(JSON.stringify(userInfo))
      } else {
        ElMessage.error('后端数据结构不符合预期')
      }
    } catch (err) {
      console.error('请求错误:', err)
      ElMessage.error('获取用户信息出错')
    }
  }

  function convertToBeijingDate(isoStr) {
    if (!isoStr) return ''
    const date = new Date(isoStr)
    // 转成北京时间对应的时间戳（UTC+8）
    const beijingTime = new Date(date.getTime() + 8 * 3600 * 1000)

    const y = beijingTime.getUTCFullYear()
    const m = String(beijingTime.getUTCMonth() + 1).padStart(2, '0')
    const d = String(beijingTime.getUTCDate()).padStart(2, '0')

    return `${y}-${m}-${d}`
  }

  onMounted(fetchUserInfo)

  return {
    editMode,
    userInfo,
    enterEditMode,
    cancelEdit,
    saveProfile
  }
}
