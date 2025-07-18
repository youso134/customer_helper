<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="search">
      <!-- 搜索框 -->
      <el-input maxlength="15" show-word-limit v-model="sendData.searchContent" placeholder="请输入关键字搜索" clearable
        class="search-input" />

      <!-- 分类筛选 -->
      <div class="filter-category">
        <el-select v-model="sendData.type" placeholder="请选择分类" clearable>
          <el-option v-for="cate in categoryOptions" :key="cate" :label="cate" :value="cate" />
        </el-select>
      </div>

      <el-button type="primary" @click="handleSearch">Search</el-button>
    </div>

    <!-- 内容展示区域 -->
    <div class="content">
      <el-table :data="rawChatData" style="width: 100%">
        <el-table-column label="序号" width="80">
          <template #default="scope">
            {{ (sendData.currentPage - 1) * sendData.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="cid" label="CID" width="80" />
        <el-table-column prop="did" label="DID" width="80" />
        <el-table-column prop="clientId" label="客服id" width="80" />
        <el-table-column prop="consumerId" label="顾客id" width="80" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="role" label="角色" width="80" />
        <!-- <el-table-column prop="createTime" label="创建时间" width="160" /> -->
        <el-table-column prop="createTimeFmt" label="创建时间" width="160" />
        <el-table-column prop="editTimeFmt" label="编辑时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="goEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="goDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="demo-pagination-block">
      <el-pagination v-model:current-page="sendData.currentPage" v-model:page-size="sendData.pageSize"
        :page-sizes="[5, 10, 20, 40]" size="small" :disabled="false" :background="false" :pager-count="7"
        layout="total, sizes, prev, pager, next, jumper" :total="totalAmount" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>



    <el-dialog v-model="dialogVisible" title="编辑信息" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="客服ID" v-if="editForm.clientId !== undefined">
          <el-input v-model="editForm.clientId" />
        </el-form-item>
        <el-form-item label="角色" v-if="editForm.role !== undefined">

          <el-select v-model="editForm.role" placeholder="角色">
            <el-option v-for="cate in roleList" :key="cate" :label="cate" :value="cate" />
          </el-select>

        </el-form-item>
        <el-form-item label="内容" v-if="editForm.content !== undefined">
          <el-input v-model="editForm.content" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<script lang="ts" setup name="AllChats">
import { ref, onMounted } from 'vue'
import { getChatPage, deleteByCid } from '@/apis/chatApi'
import type { DialogueItem } from '@/stores/types'


const sendData = ref({ pageSize: 5, currentPage: 1, type: '', searchContent: null })
let contentData = ref<DialogueItem[]>([])
// 所有分类选项（也可以动态生成）
let categoryOptions: any = []
const dialogVisible = ref(false)
const roleList = ['顾客', '客服']

const totalAmount = ref(0)
const rawChatData = ref([
  {
    "cid": 1001,
    "did": 111,
    "consumerId": 233,
    "clientId": 233,
    "content": "您好，这里是默认的数据",
    "role": "顾客",
    "sensitiveReason": "保修",
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:15:22.000+00:00"
  },
  {
    "cid": 1002,
    "did": 111,
    "consumerId": 233,
    "clientId": 233,
    "content": "我们的产品保修期是1年，如果有任何质量问题可以联系我们。",
    "role": "客服",
    "sensitiveReason": "质量",
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:16:30.000+00:00"
  },
  {
    "cid": 1003,
    "did": 111,
    "consumerId": 233,
    "clientId": 233,
    "content": "好的。另外我想问下付款方式。我可以用信用卡吗？",
    "role": "顾客",
    "sensitiveReason": null,
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:18:45.000+00:00"
  },
  {
    "cid": 1004,
    "did": 111,
    "consumerId": 233,
    "clientId": 233,
    "content": "客服将在2分钟内回复您的问题，请稍候...",
    "role": "客服",
    "sensitiveReason": null,
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:19:00.000+00:00"
  }
])

const editForm = ref<any>({}) // 存储当前编辑的数据
let editIndex = -1 // 记录当前编辑的行

const handleSizeChange = (val: number) => {
  sendData.value.pageSize = val
  handleSearch()
}
const handleCurrentChange = (val: number) => {
  sendData.value.currentPage = val
  handleSearch()
}

const getCate = async () => {
  // const res = await getTypes();
  // categoryOptions.value = [...res.filter((item: any) => item !== null)
  //   .map((item: any) => item.type)]
}
const handleSearch = async () => {
  // if(sendData.value.type === '') sendData.value.type = null
  if (sendData.value.searchContent === '') sendData.value.searchContent = null
  try {
    const res = await getChatPage(sendData.value)
    console.log(res)
    rawChatData.value = res.records
    totalAmount.value = Number(res.total)
  } catch (error) {
    // ElMessage.error('处理数据出错')
  }
  rawChatData.value = rawChatData.value.map(item => {
    return {
      ...item,
      createTimeFmt: formatDate(item.createTime || ''),
      editTimeFmt: formatDate(item.editTime || ''),
    }
  })
  console.log(contentData.value)

}
const goEdit = (index: number, row: any) => {
  editIndex = index
  // 只取需要修改的字段
  editForm.value = {
    content: row.content,
    role: row.role
  }
  dialogVisible.value = true
}
const submitEdit = () => {
  // 只更新修改过的字段
  // Object.keys(editForm.value).forEach(key => {
  //   rawChatData.value[editIndex][key] = editForm.value[key]
  // })
  dialogVisible.value = false
  ElMessage.success('修改成功')
}

const goDelete = async (index: any, row: any) => {
  try {
    const res = await deleteByCid({ cid: row.cid })
    ElMessage.success('删除成功！')
    handleSearch()
  } catch (error) {
  }
}

const formatDate = (str: string) => {
  if (!str) return ''
  const date = new Date(str)
  return date.toLocaleString()
}

onMounted(() => {
  getCate()
  handleSearch()
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  // height: 100vh;
  padding: 20px;
  // max-height: 100%;
  // max-width: 100%;
  overflow: auto;

  .search {
    display: flex;
    // flex-shrink: 0;
    height: 60px;
    width: 90%;
    margin-bottom: 20px;
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
    height: 80%;
    width: 90%;
    overflow: auto;
  }

  .demo-pagination-block {
    height: 50px;
    display: flex;
    align-items: center;
    margin-top: 20px;

    // position: sticky; // 粘性布局
    // bottom: 0; // 粘在底部
  }

}
</style>
