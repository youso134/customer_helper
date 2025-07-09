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
          <img src="@/assets/images/bird.png" class="user" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup name='MainHeader' lang="ts">
import { useRouter } from 'vue-router';


const router = useRouter()

const handleLogout = ()=>{
  router.push('/')
}

</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: rgba(86, 170, 222, 0.8);


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
    .el-dropdown-link {
      &:hover,
      &:focus {
        outline: none ;
        box-shadow: none;
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