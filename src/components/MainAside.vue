<template>
  <el-aside :class="{ collapsed: isCollapse }">
    <div class="toggle-btn" @click="isCollapse = !isCollapse">
      <el-icon>
        <component :is="isCollapse ? Expand : Fold" />
      </el-icon>
    </div>

    <el-menu active-text-color="rgb(107, 178, 248)" :collapse="isCollapse" :default-active="currentAside"
      text-color="#fff" @open="handleOpen" @close="handleClose">
      <h3 class="mb-2">系统</h3>

      <el-menu-item index="1" @click="handleMenu('/main', '1')">
        <el-icon>
          <House />
        </el-icon>
        <span>个人信息</span>
      </el-menu-item>
      <el-menu-item index="2" @click="handleMenu('/main/chatlog', '2')">
        <el-icon>
          <House />
        </el-icon>
        <span>上传聊天记录</span>
      </el-menu-item>
      <el-menu-item index="3" @click="handleMenu('/main/allchatlog', '3')">
        <el-icon>
          <House />
        </el-icon>
        <span>查看全部聊天记录</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script lang='ts' setup name=''>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Fold, Expand, House } from '@element-plus/icons-vue'

const router = useRouter()
let currentAside = ref('')
const isCollapse = ref(false)

const handleMenu = (item: string, curr: string) => {
  currentAside.value = curr
  localStorage.setItem('activeMenuIndex', curr)
  router.push(item)
}

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

onMounted(() => {
  const savedIndex = localStorage.getItem('activeMenuIndex')
  if (savedIndex) {
    currentAside.value = savedIndex
  } else {
    // 根据路径自动匹配一次
    const path = router.currentRoute.value.path
    if (path.includes('/main/chatlog')) currentAside.value = '2'
    else if (path.includes('/main/allchatlog')) currentAside.value = '3'
    else currentAside.value = '1'
  }
})

</script>


<style scoped lang="scss">
.el-aside {
  height: 100vh;
  background-color: rgba(84, 92, 100, 0.8);
  transition: width 0.3s;
  overflow: hidden;

  width: 200px;
  &.collapsed {
    width: 64px;
  }

  .el-menu {
    background-color: transparent;
    height: 100%; // 占满父容器高度
    overflow: hidden; // 防止菜单内容溢出
    max-width: 100%;
    overflow: hidden;

    .el-menu-item:hover {
      background-color: #5c99ea !important;
    }
  }

  .mb-2 {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #9be0e3;
  }

  .toggle-btn {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }
}
</style>