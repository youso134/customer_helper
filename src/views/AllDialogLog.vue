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
      <el-table :data="contentData" style="width: 100%">
        <el-table-column label="序号" width="80">
          <template #default="scope">
            {{ (sendData.currentPage - 1) * sendData.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="did" label="DID" width="80" />
        <el-table-column prop="clientId" label="客服id" width="80" />
        <el-table-column prop="consumerId" label="顾客id" width="80" />
        <el-table-column prop="resume" label="简要概括" />
        <el-table-column prop="createTimeFmt" label="创建时间" width="160" />
        <el-table-column prop="editTimeFmt" label="编辑时间" width="160" />
        <el-table-column prop="type" label="分类" width="80" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="goDetail(scope.$index, scope.row)">
              详情
            </el-button>
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

    <div class="footer">

    </div>

    <el-dialog v-model="dialogVisible" title="聊天记录详情" width="1000px" :close-on-click-modal="false">
      <ChatDetail :rawDialogData="rawDialogData" :rawChatData="rawChatData" />
    </el-dialog>

  </div>
</template>

<script lang="ts" setup name="AllDialogLog">
import { ref, onMounted } from 'vue'
import { getDialoguePage, getDialogueDetailByDid, deleteByDid, getTypes } from '@/apis/dialogApi'
import type { DialogueItem } from '@/stores/types'
import { useRouter } from 'vue-router'
// import { useDialogStore } from '@/stores/index'


interface ChatItem {
  type: 'C' | 'U'  // 明确指定只能是这两种值
  content: string
}
const router = useRouter()

const sendData = ref({ pageSize: 5, currentPage: 1, type: '', searchContent: null })
let contentData = ref<DialogueItem[]>([])
// 所有分类选项（也可以动态生成）
let categoryOptions = ref<string[]>([])
const dialogVisible = ref(false)

const chatList = ref<ChatItem[]>([])
const highLight = ref<string[]>([])
const totalAmount = ref(0)
// const currentDg = useDialogStore()


const rawDialogData = ref({
  "did": 111,
  "consumerId": 233,
  "clientId": 233,
  "editTime": "2025-07-16T00:38:36.000+00:00",
  "createTime": "2025-07-15T01:20:02.000+00:00",
  "type": "投诉",
  "resume": "客户进行了投诉",
  "highlight": "投诉"
})
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

const getCate = async () => {
  console.log('111')
  const res = await getTypes();
  categoryOptions.value = [...res.filter((item: any) => item !== null)
    .map((item: any) => item.type)]
}
const handleSizeChange = (val: number) => {
  sendData.value.pageSize = val
  handleSearch()
}
const handleCurrentChange = (val: number) => {
  sendData.value.currentPage = val
  handleSearch()
}

const handleSearch = async () => {
  // if(sendData.value.type === '') sendData.value.type = null
  if (sendData.value.searchContent === '') sendData.value.searchContent = null
  const res = await getDialoguePage(sendData.value)
  // console.log(res)
  contentData.value = res.records
  totalAmount.value = Number(res.total)

  contentData.value = contentData.value.map(item => {
    return {
      ...item,
      createTimeFmt: formatDate(item.createTime || ''),
      editTimeFmt: formatDate(item.editTime || ''),
    }
  })
}
const goDetail = async (index: any, row: any) => {
  dialogVisible.value = true
  try {
    const res = await getDialogueDetailByDid({ did: row.did })
    console.log(res)
    rawDialogData.value = res.dialogueVO
    rawChatData.value = res.chatVOList
  } catch (error) {
    // console.log(error)
  }

}
const goEdit = (index: any, row: any) => {
  localStorage.setItem('activeMenuIndex', '3')
  // currentDg.setCurrentDialog(row)
  router.push({
    name: 'chatlog', params: {
      did: row.did
    }
  })
}
const goDelete = async (index: any, row: any) => {
  try {
    const res = await deleteByDid({ did: row.did })
    console.log(res)
    handleSearch()
  } catch (error) {
  }
}

const formatDate = (str: string) => {
  if (!str) return ''
  const date = new Date(str)
  return date.toLocaleString()
}

// const parseChatData = (rawData: string) => {
//   // 使用正则表达式分割，匹配 "C:" 或 "U:" 开头的内容
//   const pattern = /([CU]):\s([^CU]*)/g
//   let match
//   const result: ChatItem[] = []

//   while ((match = pattern.exec(rawData)) !== null) {
//     const type = match[1] as 'C' | 'U'
//     result.push({
//       type,
//       content: match[2].trim()
//     })
//   }
//   chatList.value = result
// }

onMounted(() => {
  // parseChatData(rawData)
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
