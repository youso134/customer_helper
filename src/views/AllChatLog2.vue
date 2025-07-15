<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="search">
      <!-- 搜索框 -->
      <el-input maxlength="15" show-word-limit v-model="searchText" placeholder="请输入关键字搜索" clearable class="search-input" /> 

      <!-- 分类筛选 -->
      <div class="filter-category">
        <el-select v-model="selectedCategory" placeholder="请选择分类" clearable>
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
  </div>
</template>

<script lang="ts" setup name="AllChatLog">
import { ref, computed, onMounted } from 'vue'
import { initAllLog } from '@/stores'


const allLog = initAllLog()
// 原始数据
const rawData = ref(allLog.content)

// 搜索关键词和分类选中项
const searchText = ref('')   // 现在是在name和message中一起搜索
const selectedCategory = ref('')

// 所有分类选项（也可以动态生成）
const categoryOptions = Array.from(new Set(rawData.value.map(item => item.category)))

// 过滤逻辑
// const filteredData = computed(() => {
//   return rawData.value.filter((item) => {
//     const matchSearch =
//       item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
//       item.message.toLowerCase().includes(searchText.value.toLowerCase())

//     const matchCategory =
//       !selectedCategory.value || item.category === selectedCategory.value

//     return matchSearch && matchCategory
//   })
// })
let filteredData = ref()

const handleSearch = () => {
  filteredData.value = rawData.value.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.message.toLowerCase().includes(searchText.value.toLowerCase())
    const matchCategory =
      !selectedCategory.value || item.category === selectedCategory.value
    return matchSearch && matchCategory
  })
}

onMounted(() => {
  filteredData.value = rawData.value
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
      // flex: 1;
      width: 300px;
    }

    .filter-category {
      width: 200px;
    }
  }

  .content {
    width: 90%;
    height: 600px;
    margin: 20px;
    overflow: auto;
  }
}
</style>
