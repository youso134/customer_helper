<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="search">
      <!-- 搜索框 -->
      <el-input maxlength="10" show-word-limit v-model="sendData.searchContent" placeholder="请输入关键字搜索" clearable
        style="width: 240px;" />
      <el-input maxlength="4" show-word-limit v-model="sendData.clientId" style="width: 120px;" placeholder="客服id"
        clearable />
      <el-input maxlength="4" show-word-limit v-model="sendData.consumerId" style="width: 120px;" placeholder="顾客id"
        clearable />


      <!-- 分类筛选 -->
      <div class="filter-category">
        <el-select v-model="sendData.type" style="width: 200px;" placeholder="请选择分类" clearable>
          <el-option v-for="cate in categoryTableData" :key="cate" :label="cate" :value="cate" />
        </el-select>
      </div>

      <div class="buttons">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="editTypesDialogVisible = true">编辑分类</el-button>
        <el-button type="default" @click="uploadDialogVisible = true">批量上传</el-button>
      </div>
    </div>

    <!-- 内容展示区域 -->
    <div class="content">

      <el-table :data="contentData" style="width: 90%">
        <el-table-column label="序号" width="80">
          <template #default="scope">
            {{ (sendData.currentPage - 1) * sendData.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="did" label="聊天记录did" width="120" />
        <el-table-column prop="clientId" label="客服id" width="80" />
        <el-table-column prop="consumerId" label="顾客id" width="80" />
        <el-table-column prop="resume" label="简要概括" width="120" />
        <el-table-column prop="sensitiveReason" label="敏感词" width="80" />

        <!-- <el-table-column prop="createTimeFmt" label="创建时间" width="160" /> -->
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
            <el-button type="danger" size="small" @click="confirmDelete(scope.$index, scope.row)">
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

    <el-dialog v-model="uploadDialogVisible" title="批量上传" width="1000px" top="5vh" :close-on-click-modal="false"
      @closed="handleBatchClosed">
      <AddChats ref="addChatsRef" @submit-success="uploadDialogVisible = false" />
    </el-dialog>

    <el-dialog v-model="editTypesDialogVisible" title="编辑分类" width="600px" :close-on-click-modal="false">
      <!-- <EditTypes :categoryOptions = "categoryOptions"/>  -->
      <EditTypes v-model:categoryOptions="categoryOptions" />
    </el-dialog>

  </div>
</template>

<script lang="ts" setup name="AllDialogLog">
import { ref, onMounted, watch } from 'vue'
import { getDialoguePage, getDialogueDetailByDid, deleteByDid } from '@/apis/dialogApi'
import { getAllType } from '@/apis/typeApi'
import type { DialogueItem, Type } from '@/stores/types'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/el-overlay.css';
import 'element-plus/theme-chalk/el-message-box.css';
// import { useDialogStore } from '@/stores/index'
import ChatDetail from '@/components/ChatDetail.vue'
import AddChats from '@/components/AddChats.vue'
import EditTypes from '@/components/EditTypes.vue'


const router = useRouter()

const sendData = ref({ pageSize: 20, currentPage: 1, type: '', searchContent: null, consumerId: null, clientId: null })
let contentData = ref<DialogueItem[]>([])
// 所有分类选项（也可以动态生成）
let categoryOptions = ref<Type[]>([])
let categoryTableData = ref<string[]>([])
const dialogVisible = ref(false)
const editTypesDialogVisible = ref(false)
const uploadDialogVisible = ref(false)

const addChatsRef = ref<InstanceType<typeof AddChats> | null>(null)
const handleBatchClosed = () => {
  addChatsRef.value?.clearAll()
  handleSearch()
}

const totalAmount = ref(0)

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
  categoryOptions.value = await getAllType()
}

watch(categoryOptions, (newVal) => {
  categoryTableData.value = [...newVal.filter((item: any) => item !== null)
    .map((item: any) => item.type)]
}, { immediate: true, deep: true })

const handleSizeChange = (val: number) => {
  sendData.value.pageSize = val
  handleSearch()
}
const handleCurrentChange = (val: number) => {
  sendData.value.currentPage = val
  handleSearch()
}

const handleSearch = async () => {
  if (sendData.value.searchContent === '') sendData.value.searchContent = null
  const res = await getDialoguePage(sendData.value)
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
const goDetail = async (_index: any, row: any) => {
  dialogVisible.value = true
  try {
    const res = await getDialogueDetailByDid({ did: row.did })
    rawDialogData.value = res.dialogueVO
    rawChatData.value = res.chatVOList
  } catch (error) {
  }

}
const goEdit = (_index: any, row: any) => {
  // localStorage.setItem('activeMenuIndex', '3')
  // currentDg.setCurrentDialog(row)
  router.push({
    name: 'addoreditchat', params: {
      did: row.did
    }
  })
}
const confirmDelete = (_index: any, row: any) => {
  ElMessageBox.confirm(
    '确认删除这条记录吗？操作不可撤销。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await deleteByDid({ did: row.did })
        ElMessage.success('删除成功')
        handleSearch() // 重新刷新列表
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
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
    display: flex;
    height: 80%;
    width: 95%;
    overflow: auto;
    gap: 40px;

    .type {
      height: 80%;
      width: 20%;
      overflow: auto;
    }


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
