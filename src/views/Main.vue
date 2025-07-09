<template>
  <div class="main-layout">
    <el-container>
      <!-- 左边侧边栏 -->
      <MainAside />

      <!-- 右侧 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header>
          <MainHeader />
        </el-header>

        <!-- 核心内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang='ts' setup name='Main'>
import { } from 'vue'
import MainAside from '../components/MainAside.vue';
import MainHeader from '../components/MainHeader.vue';

</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  // width: 100vw;

  .el-header, .el-main{
    padding: 0;
  }
 
}
</style>