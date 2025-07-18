<template>
  <div class="header">
    <div class="l-content">
      <el-button size="small" class="menu-btn">
        <component class="icons" is="menu"></component>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/main' }">主页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=Mackenzie"
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
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { onMounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const handleUser = () => {
  localStorage.setItem('activeMenuIndex', '1')
  router.push({ path: '/main' })
}

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('activeMenuIndex')
  userStore.clearUser()
  router.push('/')
}

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

  background: linear-gradient(90deg, #479db0, #8cb7e3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .l-content {
    display: flex;
    align-items: center;

    .menu-btn {
      margin-right: 20px;
      background-color: #33889b;
      border: none;
      color: #fff;
      border-radius: 6px;
      transition: background 0.3s;

      &:hover {
        background-color: #1e5a68;
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
        border: 2px solid #1b5e6d;
        margin-right: 10px;
        object-fit: cover;
      }

      .username {
        font-size: 14px;
        color: #032f39;
        margin-right: 6px;
        font-weight: 500;
      }

      .el-icon--right {
        color: #032f39;
        font-size: 14px;
      }
    }
  }
}
</style>
