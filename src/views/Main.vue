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
import { onMounted } from 'vue'
import MainAside from '../components/MainAside.vue';
import MainHeader from '../components/MainHeader.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

onMounted(() => {
  const savedIndex = localStorage.getItem('activeMenuIndex')
  if(savedIndex === '2'){
    router.push({ name: 'allchatlog' })
  }else if(savedIndex === '3') {
    // router.push('/main/allchatlog')
    router.push({ name: 'chatlog' })
  }

  let res = localStorage.getItem('user')
  // console.log(res !== null ? JSON.parse(res) : '本地没有user')
  if (res === null) {
    console.log('本地没有user，跳转回登录页面')
    router.push('/login')
  }
})

</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  // width: 100vw;

  .el-header,
  .el-main {
    padding: 0;
  }

}
</style>