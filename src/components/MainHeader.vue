<template>
  <div class="header">
    <div class="l-content">
      <el-button size="small">
        <component class="icons" is='menu'></component>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/main' }">主页</el-breadcrumb-item>
        <!-- <el-breadcrumb-item v-if="current" :to="current.path">{{current.label}}</el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=Mackenzie" class="user" />
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

<script setup name='MainHeader' lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores';
import { onMounted } from 'vue';


const router = useRouter()
const userStore = useUserStore()


const handleUser = () => {
  localStorage.setItem('activeMenuIndex', '1')
  router.push({ name: 'user' })
}

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('activeMenuIndex')
  userStore.clearUser()
  router.push('/')
}


onMounted(() => {
  let res: any = localStorage.getItem('user')
  if (res !== null) {
    res = JSON.parse(res)
    userStore.setUser(res)
  }
  else{
    // ElMessage.error('未读取到浏览器缓存User')
    console.log('mianheader没读取到user')
  }
})
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #474b4e;
  // background-color: #2B3037;

  .l-content {
    display: flex;
    align-items: center;
    padding-left: 20px;

    .el-button {
      margin-right: 20px;
    }

    .icons {
      height: 20px;
      width: 20px;
    }
  }

  .r-content {

    // flex-direction: row;

    .el-dropdown-link {
      display: flex;
      align-items: center;

      &:hover,
      &:focus {
        outline: none;
        box-shadow: none;
      }

      .username {
        font-size: 16px;
        color: #FFF;
        margin: 10px;
      }

      .el-icon--right {
        color: #FFF;
      }

      .user {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }

  }
}


:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>