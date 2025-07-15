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
      <el-table :data="contentData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="message" label="消息内容" />
        <el-table-column prop="category" label="分类" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="goDetail(scope.$index, scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
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
import { getDialog } from '@/apis/api'

const sendData = ref({ pageSize: 10, currentPage: 2, category: '', searchText: '' })

const allLog = initAllLog()
let contentData = ref(allLog.content)

// 所有分类选项（也可以动态生成）
const categoryOptions = Array.from(new Set(contentData.value.map(item => item.category)))


const handleSizeChange = (val: number) => {
  sendData.value.pageSize = val
  handleSearch()
}
const handleCurrentChange = (val: number) => {
  sendData.value.currentPage = val
  handleSearch()
}

const handleSearch = async () => {
  const res = await getDialog(sendData.value) as { reply: any }
  contentData.value = res.reply
}
const goDetail = (index: any, row: any) => {
  console.log(index,row)
}

onMounted(() => {
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

  .demo-pagination-block {
    margin: 20px;
  }

}
</style>
