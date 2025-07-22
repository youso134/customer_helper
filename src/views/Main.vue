<template>
  <div class="main-layout">
    <el-container>
      <MainAside />

      <el-container>
        <el-header>
          <MainHeader />
        </el-header>

        <el-main>
          <router-view />

          <!--  仅在 /main 显示图表 -->
          <ConsumerRankingTable v-if="isMainRoot" />
          <TypePieChart v-if="isMainRoot" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts" name="Main">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainAside from '../components/MainAside.vue'
import MainHeader from '../components/MainHeader.vue'
import TypePieChart from '../components/TypePieChart.vue'

const route = useRoute()

//  当前完整路径是 "/main" 时才展示图表（不含任何子路径）
const isMainRoot = computed(() => route.path === '/main')
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  background-color: #EFF0F2;
  overflow: auto;

  .el-container {
    height: 100%;
  }

  .el-header,
  .el-main {
    padding: 0;
  }
}
</style>
