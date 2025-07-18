<template>
  <el-aside class="container" :class="{ collapsed: isCollapse }">
    <div class="top-info">
      <el-icon :size="30" color="#FFF">
        <Shop />
      </el-icon>
      <transition name="fade-slide">
        <h3 class="mb-2" v-if="!isCollapse">聊天信息管理系统</h3>
      </transition>
    </div>

    <!-- 折叠按钮 -->
    <div class="toggle-btn" @click="isCollapse = !isCollapse">
      <el-icon>
        <component :is="isCollapse ? Expand : Fold" />
      </el-icon>
    </div>

    <!-- 菜单 -->
    <el-menu
      active-text-color="rgb(107, 178, 248)"
      text-color="#fff"
      :collapse="isCollapse"
      :default-active="currentAside as string"
      router
    >
      <el-menu-item index="/main/user">
        <el-icon><House /></el-icon>
        <span>个人信息</span>
      </el-menu-item>
      <el-menu-item index="/main/alldialoglog">
        <el-icon><Document /></el-icon>
        <span>查看全部聊天记录</span>
      </el-menu-item>
      <el-menu-item index="/main/addoreditchat">
        <el-icon><UploadFilled /></el-icon>
        <span>编辑聊天记录</span>
      </el-menu-item>
      <el-menu-item index="/main/addchats">
        <el-icon><UploadFilled /></el-icon>
        <span>批量添加聊天记录</span>
      </el-menu-item>
      <el-menu-item index="/main/allchats">
        <el-icon><Tickets /></el-icon>
        <span>所有消息管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Fold, Expand} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)

const currentAside = computed(() => {
  return route.meta.menuIndex || route.path
})

onMounted(()=>{
  currentAside.value
})
</script>



<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: #2B3037;
  transition: width 0.3s;
  overflow: hidden;

  width: 200px;

  &.collapsed {
    width: 64px;
  }

  .top-info {
    display: flex;
    height: 60px;
    // background-color: #2893E5;
    overflow: hidden;
    justify-content: center;
    align-items: center;


    .fade-slide-enter-active,
    .fade-slide-leave-active {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
      opacity: 0;
      transform: translateX(-10px);
    }

    .mb-2 {
      line-height: 60px;
      text-align: center;
      color: #9be0e3;

      white-space: nowrap; // 防止换行
    }
  }



  .el-menu {
    background-color: transparent;
    height: 100%; // 占满父容器高度
    overflow: hidden; // 防止菜单内容溢出
    max-width: 100%;
    overflow: hidden;

    .el-menu-item {
      &.is-active {
        background-color: #202329;
      }
    }

    .el-menu-item:hover {
      background-color: #719ed9 !important;
    }
  }

  .toggle-btn {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
  }
}
</style>