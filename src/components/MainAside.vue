<template>
  <el-aside>
    <el-col :span="24">
      <el-menu active-text-color="rgb(107, 178, 248)" default-active="1"
        text-color="#fff" @open="handleOpen" @close="handleClose">
        <h3 class="mb-2">系统</h3>

        <el-menu-item index="1" @click="handleMenu('/main')" >
          <el-icon><House /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="2" @click="handleMenu('/main/chatlog')">
          <el-icon><House /></el-icon>
          <span>聊天记录管理</span>
        </el-menu-item>
        
        <!-- <el-sub-menu index="2" style="background-color: rgba(84, 92, 100, 0.8);">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

        <el-menu-item index="3" disabled>
          <el-icon>
            <document />
          </el-icon>
          <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon>
            <setting />
          </el-icon>
          <span>Navigator Four</span>
        </el-menu-item> -->
      </el-menu>
    </el-col>
  </el-aside>
</template>

<script lang='ts' setup name=''>
import { } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleMenu = (item:string) =>{
  router.push(item)

}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

</script>


<style scoped lang="scss">
.el-aside {
  height: 100vh;
  width: 200px;

  .el-menu{
    height: 100vh;
    background-color: rgba(84, 92, 100, 0.8); 
    width: 100%;

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
}
</style>