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

    <!-- 菜单项 -->
    <el-menu
      active-text-color="rgb(107, 178, 248)"
      text-color="#fff"
      :default-active="currentAside as string"
      router
    >
      <el-menu-item index="/main/user">
        <el-icon><House /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">个人信息</span>
        </transition>
      </el-menu-item>

      <el-menu-item index="/main/alldialoglog">
        <el-icon><Document /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">查看全部聊天记录</span>
        </transition>
      </el-menu-item>

      <el-menu-item index="/main/addoreditchat">
        <el-icon><UploadFilled /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">编辑聊天记录</span>
        </transition>
      </el-menu-item>

      <el-menu-item index="/main/addchats">
        <el-icon><UploadFilled /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">批量添加聊天记录</span>
        </transition>
      </el-menu-item>

      <el-menu-item index="/main/allchats">
        <el-icon><Tickets /></el-icon>
        <transition name="fade-slide">
          <span v-if="!isCollapse">所有消息管理</span>
        </transition>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Fold, Expand, House, Document, UploadFilled, Shop, Tickets } from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)

// 通过路由动态高亮
const currentAside = computed(() => {
  return route.meta.menuIndex || route.path
})
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: #1f2c3a;
  transition: width 0.3s;
  overflow: hidden;
  width: 200px;

  &.collapsed {
    width: 64px;
  }

  .top-info {
    display: flex;
    height: 60px;
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
      color: #fff;
      white-space: nowrap;
    }
  }

  .el-menu {
    background-color: transparent;
    height: 100%;
    max-width: 100%;
    overflow: hidden;

    .el-menu-item {
      display: flex;
      align-items: center;

      &.is-active {
        background-color: #545b61;
      }

      &:hover {
        background-color: #719ed9 !important;
      }

      .el-icon {
        margin-right: 8px;
      }

      span {
        white-space: nowrap;
        transition: opacity 0.3s ease;
      }
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

  /* 给所有 span 的淡入淡出效果 */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }
}
</style>
