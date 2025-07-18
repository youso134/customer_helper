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
import { onMounted} from 'vue'
import MainAside from '../components/MainAside.vue';
import MainHeader from '../components/MainHeader.vue';
// import { useRouter } from 'vue-router';


onMounted(() => {
  // const savedIndex = localStorage.getItem('activeMenuIndex')
  // if (savedIndex === '2') {
  //   router.push({ name: 'alldialoglog' })
  // } else if (savedIndex === '3') {
  //   router.push({ name: 'chatlog' })
  // }

  // let res = localStorage.getItem('user')
  // if (res === null) {
  //   ElMessage.error('没有登录记录，请返回登录。')
  //   router.push('/login')
  // }
})

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

  // .el-main{
  //   height: 80%;
  // }

}
</style>
