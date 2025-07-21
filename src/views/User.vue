<template>
  <div class="app-container">
    <div class="profile-card-wrapper" @click="toggleChart">
      <el-card class="profile-card">
        <h1 class="page-title">个人信息中心</h1>

        <!-- 头像和 UID -->
        <div class="avatar-section column-layout">
          <AvatarUpload v-model:avatarUrl="userInfo.avatar" :size="100" @click.stop/>
          <div class="basic-info">
            <p class="uid">UID:{{ userInfo.uid }}</p>
            <p class="role">身份: {{ userInfo.userRole }}</p>
          </div>
        </div>

        <!-- 信息展示区域 -->
        <div class="info-display">
          <p>
            <strong>用户名：</strong>
            <template v-if="!editMode">{{ userInfo.userName }}</template>
            <template v-else>
              <el-input v-model="userInfo.userName" size="small" style="width: 200px" />
            </template>
          </p>

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

          <p>
            <strong>手机号：</strong>
            <template v-if="!editMode">{{ userInfo.phone }}</template>
            <template v-else>
              <el-input v-model="userInfo.phone" size="small" style="width: 200px" />
            </template>
          </p>

          <p>
            <strong>邮箱：</strong>
            <template v-if="!editMode">{{ userInfo.email }}</template>
            <template v-else>
              <el-input v-model="userInfo.email" size="small" style="width: 250px" />
            </template>
          </p>

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
            <el-button type="primary" @click.stop="enterEditMode" :icon="Edit">编辑信息</el-button>
            <el-button type="warning" @click.stop="showPasswordDialog = true" :icon="Lock">修改密码</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click.stop="saveProfile" :icon="Check">保存修改</el-button>
            <el-button @click.stop="cancelEdit" :icon="Close">取消</el-button>
          </template>
        </div>
      </el-card>

      <!-- 饼图悬浮框 -->
      <div class="chart-overlay" v-show="isChartVisible" @click.stop>
        <div ref="chartRef" class="pie-chart"></div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <PasswordDialog v-model="showPasswordDialog" @submit="handlePasswordChange" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import { ElMessage, ElLoading } from 'element-plus'
import { Edit, Check, Close, Lock } from '@element-plus/icons-vue'
import { useUserProfile } from '@/components/useUserProfile'
import AvatarUpload from '@/components/AvatarUpload.vue'
import PasswordDialog from '@/components/PasswordDialog.vue'
import { updateUser, getTypeCount } from '@/apis/userApi'

const { 
  editMode,
  userInfo,
  enterEditMode,
  cancelEdit,
  saveProfile
} = useUserProfile()

const showPasswordDialog = ref(false)
const isChartVisible = ref(false)
const chartRef = ref(null)
let chartInstance = null

const pieData = ref([])

// 初始化 ECharts 饼图
const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    title: {
      text: '客服类型',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      left: 'center'
    },
    series: [
      {
        name: '类型',
        type: 'pie',
        radius: '50%',
        data: pieData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

watch(isChartVisible, (val) => {
  if (!val && chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})

// 点击卡片切换饼图
const toggleChart = async () => {
  if (isChartVisible.value) {
    isChartVisible.value = false
    return
  }

  try {
    const res = await getTypeCount()
    const rawData = res.data || res
    if (rawData && typeof rawData === 'object') {
      const chartData = Object.entries(rawData)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }))

      if (!chartData.length) {
        ElMessage.warning('暂无可展示的数据')
        return
      }

      pieData.value = chartData
      isChartVisible.value = true
      await nextTick()
      initChart()
    } else {
      console.warn('接口结构异常:', res)
      ElMessage.error('接口返回异常')
    }
  } catch (err) {
    console.error('接口调用失败:', err)
    ElMessage.error('获取类型统计失败: ' + err.message)
  }
}


// 修改密码
const handlePasswordChange = async ({ currentPassword, newPassword }) => {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '修改密码中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const res = await updateUser({
      uid: userInfo.uid,
      userPassword: currentPassword,
      userNewPassword: newPassword
    })

    if (res && res.success !== false) {
      ElMessage.success('密码修改成功')
    } else {
      ElMessage.error(res?.message || '修改失败，请检查原密码是否正确')
    }

    loading.close()
  } catch (err) {
    ElMessage.error(err.message || '修改密码失败')
  }
}
</script>

<style scoped lang="scss">
/* 样式保持不变，与原贴相同 */
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 40px;
}

.profile-card-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.profile-card {
  width: 100%;
  min-width: 800px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 50px rgba(0, 0, 0, 0.15);
  }
}

.chart-overlay {
  position: absolute;
  top: 20px;
  right: -260px;
  width: 240px;
  height: 240px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 10;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.pie-chart {
  width: 100%;
  height: 100%;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 30px;
  text-align: center;
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;

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

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #ecf0f1;
}

.column-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.basic-info {
  margin-top: 10px;

  .uid {
    font-size: 14px;
    color: #7f8c8d;
  }

  .role {
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 5px;
  }
}

.info-display {
  margin-top: 30px;
  line-height: 2;
  font-size: 16px;
  color: #34495e;
  padding: 0 20px;

  p {
    margin: 15px 0;
    display: flex;
    align-items: center;

    strong {
      min-width: 100px;
      text-align: right;
      margin-right: 15px;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;
}

.el-button {
  border-radius: 8px;
  padding: 10px 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.el-button--primary {
    background-color: #3498db;
    border: none;
    color: white;

    &:hover {
      background-color: #2980b9;
    }
  }
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

  .info-display p {
    flex-direction: column;
    align-items: flex-start;

    strong {
      text-align: left;
      margin-bottom: 5px;
    }
  }

  .chart-overlay {
    position: static;
    margin-top: 20px;
  }
}
</style>
