<template>
  <div class="header">
    <div class="l-content">
      <el-button size="small" class="menu-btn">
        <component class="icons" is="menu"></component>
      </el-button>

      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbList"
          :key="index"
          :to="item.path"
        >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img
            src="https://plus.unsplash.com/premium_photo-1752155109947-539988d49e5d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            class="user-avatar"
          />
          <span class="username">{{ userStore.user.userName }}</span>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleUser">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts" name="MainHeader">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute, RouteRecordNormalized } from 'vue-router'
import { useUserStore } from '../stores'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const handleUser = () => {
  localStorage.setItem('activeMenuIndex', '1')
  router.push({ path: '/main/user' })
}

const handleLogout = () => {
  localStorage.removeItem('user')
  userStore.clearUser()
  router.push('/')
}

// 生成面包屑列表
const breadcrumbList = computed(() => {
  return route.matched.filter((r: RouteRecordNormalized) => r.meta && r.meta.title)
})

onMounted(() => {
  const res = localStorage.getItem('user')
  if (res !== null) {
    userStore.setUser(JSON.parse(res))
  } else {
    console.log('MainHeader 未读取到 user')
  }
})
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  box-sizing: border-box;

  background-color:#3a4047;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .l-content {
    display: flex;
    align-items: center;

    .menu-btn {
      margin-right: 20px;
      background-color: #e4e4e4;
      border: none;
      color: #3a4047;
      border-radius: 6px;
      transition: background 0.3s;

      &:hover {
        background-color: #55575a;
      }
    }

    .icons {
      width: 20px;
      height: 20px;
    }

    .bread {
      font-size: 16px;
      color: #cfd8dc;

      ::v-deep(.el-breadcrumb__inner) {
        color: #cfd8dc !important;
      }

      ::v-deep(.el-breadcrumb__item) {
        font-weight: 500;
      }
    }
  }

  .r-content {
    display: flex;
    align-items: center;
    height: 100%;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;

      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        margin-right: 10px;
        object-fit: cover;
      }

      .username {
        font-size: 14px;
        color: #cccdce;
        margin-right: 6px;
        font-weight: 500;
      }

      .el-icon--right {
        color: #cccdce;
        font-size: 14px;
      }
    }
  }
}
</style>
