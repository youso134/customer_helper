<template>
  <el-aside :class="{ collapsed: isCollapse }">
    <!-- 顶部图标和标题 -->
    <div class="top-info">
      <el-icon :size="30" color="rgb(220, 214, 214)"><Shop /></el-icon>
      <transition name="fade-slide">
        <h3 class="system-title" v-if="!isCollapse">聊天信息管理系统</h3>
      </transition>
    </div>

    <!-- 收缩/展开按钮 -->
    <div class="toggle-btn" @click="isCollapse = !isCollapse">
      <el-icon><component :is="isCollapse ? Expand : Fold" /></el-icon>
    </div>

    <!-- 菜单区域 -->
    <el-menu
      :default-active="currentAside"
      active-text-color="#42A5F5"
      text-color="#cfd8dc"
      background-color="transparent"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="1" @click="handleMenu('/main', '1')">
        <el-icon><House /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">个人信息</span>
        </transition>
      </el-menu-item>

      <el-menu-item index="2" @click="handleMenu('/main/allchatlog', '2')">
        <el-icon><Document /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">查看全部聊天记录</span>
        </transition>
      </el-menu-item>

      <el-menu-item index="3" @click="handleMenu('/main/chatlog', '3')">
        <el-icon><UploadFilled /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">上传聊天记录</span>
        </transition>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts" name="MainAside">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Fold, Expand, House, Document, UploadFilled, Shop } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const currentAside = ref('')

// 设置当前菜单项
const checkMenu = () => {
  const savedIndex = localStorage.getItem('activeMenuIndex')
  if (savedIndex) {
    currentAside.value = savedIndex
  } else {
    const path = router.currentRoute.value.path
    if (path.includes('/main/allchatlog')) currentAside.value = '2'
    else if (path.includes('/main/chatlog')) currentAside.value = '3'
    else currentAside.value = '1'
  }
}

const handleMenu = (item: string, curr: string) => {
  currentAside.value = curr
  localStorage.setItem('activeMenuIndex', curr)
  router.push(item)
}

const handleOpen = () => {}
const handleClose = () => {}

onMounted(() => {
  checkMenu()
})

watch(() => route.path, () => {
  checkMenu()
})
</script>


<style scoped lang="scss">
.container {
  height: 100vh;
  transition: width 0.3s ease;
  width: 200px;
  overflow: hidden;
  background:linear-gradient(to bottom right, #479db0, #92a7aa);
  // border-right: 1px solid rgba(255, 255, 255, 0.05);

  &.collapsed {
    width: 64px;
  }

  .top-info {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:#479db0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.04);

    .system-title {
      margin-left: 8px;
      font-size: 16px;
      font-weight: 600;
      color:rgb(220, 214, 214);
      white-space: nowrap;
    }
  }

  .toggle-btn {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    color:rgb(220, 214, 214);
    background-color:rgba(36, 98, 148, 0.15);
    cursor: pointer;
    // border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: background-color 0.3s;  

    &:hover {
      background-color: rgba(2, 37, 94, 0.15);
    }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }

  .el-menu {
    background-color: transparent;
    border-right: none;
    padding-top: 10px;

    .el-menu-item {
      transition: all 0.2s ease;
      font-size: 14px;
      padding-left: 18px;

      &:hover {
        background-color: rgba(29, 78, 117, 0.08) !important;
      }

      &.is-active {
        background-color: rgba(21, 83, 135, 0.15) !important;
        color: #325777 !important;
        border-left: 3px solid rgba(21, 83, 135, 0.15);
      }

      .el-icon {
        margin-right: 8px;
      }

      span {
        font-weight: 500;
      }
    }
  }
}
</style>
