<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="search">
      <!-- 搜索框 -->
      <el-input maxlength="15" show-word-limit v-model="sendData.searchText" placeholder="请输入关键字搜索" clearable
        class="search-input" />

      <!-- 分类筛选 -->
      <div class="filter-category">
        <el-select v-model="sendData.category" placeholder="请选择分类" clearable>
          <el-option v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
        </el-select>
      </div>

      <el-button type="primary" @click="handleSearch">Search</el-button>
    </div>

    <!-- 内容展示区域 -->
    <div class="content">
      <el-table :data="filteredData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="message" label="消息内容" />
        <el-table-column prop="category" label="分类" />
      </el-table>
    </div>

    <div class="demo-pagination-block">
      <el-pagination v-model:current-page="sendData.currentPage" v-model:page-size="sendData.pageSize"
        :page-sizes="[5, 10, 20, 40]" size="small" :disabled="false" :background="false" :pager-count="7"
        layout="total, sizes, prev, pager, next, jumper" :total="allLog.totalAmount" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script lang="ts" setup name="AllChatLog">
import { ref, onMounted } from 'vue'
import { initAllLog } from '@/stores'

const sendData = ref({ pageSize: 10, currentPage: 2, category: '', searchText:'' })

const allLog = ref(initAllLog())
const rawData = allLog.value.content

// 所有分类选项（也可以动态生成）
const categoryOptions = Array.from(new Set(rawData.map(item => item.category)))

let filteredData = ref()

const handleSizeChange = (val: number) => {
  sendData.value.pageSize = val
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  sendData.value.currentPage = val
  console.log(`current page: ${val}`)
}

const handleSearch = () => {
  filteredData.value = rawData.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(sendData.value.searchText.toLowerCase()) ||
      item.message.toLowerCase().includes(sendData.value.searchText.toLowerCase())
    const matchCategory =
      !sendData.value.category || item.category === sendData.value.category
    return matchSearch && matchCategory
  })
}

onMounted(() => {
  filteredData.value = rawData
})
</script>

<style scoped lang="scss">
.container {
  .search {
    height: 60px;
    width: 90%;
    margin: 20px;
    display: flex;
    align-items: center;
    gap: 20px;

    .search-input {
      width: 300px;
    }

    .filter-category {
      width: 200px;
    }
  }

  .content {
    width: 90%;
    margin: 20px;
    overflow: auto;
  }

  .demo-pagination-block{
    margin: 20px;
  }

}
</style>
