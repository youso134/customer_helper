<template>
  <div class="container">
    <!-- 顶部按钮区 -->
    <div class="inputs">

      <span>客服id：</span>
      <el-input v-model="clientId" style="width: 120px; margin-right: 5px;" placeholder="请输入客服id" />

      <span style="margin-left: 40px;">顾客id：</span>
      <el-input v-model="consumerId" style="width: 120px; margin-right: 5px;" placeholder="请输入顾客id" />

      <span style="margin-left: 40px;">聊天记录id：</span>
      <el-input v-model="did" style="width: 120px; margin-right: 5px;" placeholder="请输入聊天id" />
    </div>

    <div class="button-bar">
      <el-button type="primary" @click="addChat">添加消息</el-button>
      <!-- <el-button type="danger" @click="deleteDialogVisible = true">删除消息</el-button> -->
      <!-- <el-button type="info" @click="clearAll">恢复默认</el-button> -->
      <el-button type="success" @click="submitChats">确认上传</el-button>
      <el-button type="default" @click="uploadChat">本地上传</el-button>
      <input ref="fileInput" type="file" accept=".xls,.xlsx" style="display: none" @change="handleFileChange" />
      <el-checkbox v-model="checked2">上传后自动解析</el-checkbox>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- <ChatDetail :chatList="chatList" :highLight="highLight" :currentMsg="currentMsg" /> -->

      <el-table :data="rawChatData" style="width: 80%">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column prop="cid" label="CID" width="80" /> -->
        <el-table-column prop="did" label="聊天记录DID" width="120" />
        <el-table-column prop="clientId" label="客服id" width="80" />
        <el-table-column prop="consumerId" label="顾客id" width="80" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="role" label="角色" width="80" />
        <!-- <el-table-column prop="createTime" label="创建时间" width="160" /> -->
        <el-table-column prop="createTimeFmt" label="创建时间" width="160" />
        <el-table-column prop="editTimeFmt" label="编辑时间" width="160" />
      </el-table>

    </div>

    <!-- 添加的窗口 -->
    <el-dialog v-model="addDialogVisible" title="手动输入聊天记录" width="600px" :close-on-click-modal="false">
      <el-input v-model="inputmsg" type="textarea" :autosize="{ minRows: 8, maxRows: 12 }" placeholder="请输入聊天信息"
        resize="none" />
      <el-select v-model="role" placeholder="请选择分类" clearable style="margin-top: 20px;">
        <el-option v-for="cat in roleList" :key="cat" :label="cat" :value="cat" />
      </el-select>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAndClose">确认</el-button>
      </template>
    </el-dialog>

    <!-- 删除的窗口 -->
    <el-dialog v-model="deleteDialogVisible" title="删除消息" width="700px" :close-on-click-modal="false">
      <el-table :data="rawChatData" style="width: 100%" @selection-change="handleSelectionChange" ref="deleteTable"
        :row-key="row => row.content" tooltip-effect="dark" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="cid" label="消息ID" width="100"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="role" label="角色" width="100"></el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteSelectedMessages">删除选中</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script lang='ts' setup name="AllChats">
import { onMounted, ref, defineExpose } from 'vue'
import { addDialogueByBatch } from '@/apis/dialogApi'
import type { Chat } from '@/stores/types'
import * as XLSX from 'xlsx'


const inputmsg = ref<string>('')
const addDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const checked2 = ref()
const roleList = ['顾客', '客服']

let consumerId = ref()
let clientId = ref()
let did = ref()
let role = ref('顾客')



// const currentDg = useDialogStore()
const rawDialogData = ref({
})
const rawChatData = ref<Chat[]>([
  // {
  //   "cid": 0,
  //   "did": 0,
  //   "consumerId": consumerId.value,
  //   "clientId": clientId.value,
  //   "content": "您好，有什么问题吗？",
  //   "role": "客服",
  //   "sensitiveReason": "质量",
  //   "editTime": "2025-07-16T00:52:27.000+00:00",
  //   "createTime": "2023-05-10T01:16:30.000+00:00"
  // },
  // {
  //   "cid": 0,
  //   "did": 0,
  //   "consumerId": consumerId.value,
  //   "clientId": clientId.value,
  //   "content": "没事，和你聊聊天",
  //   "role": "顾客",
  //   "sensitiveReason": null,
  //   "editTime": "2025-07-16T00:52:27.000+00:00",
  //   "createTime": "2023-05-10T01:16:30.000+00:00"
  // },
])
// 关闭弹出窗口
const submitAndClose = () => {
  if (!inputmsg.value || !role.value) {
    ElMessage.info('请确认输入数据和角色')
    return
  }
  const newItem = {
    cid: 0,
    did: did.value,
    consumerId: consumerId.value,
    clientId: clientId.value,
    content: inputmsg.value,
    role: role.value,
    sensitiveReason: null,
    editTime: new Date().toISOString(),
    createTime: new Date().toISOString()
  }
  rawChatData.value.push(newItem)

  inputmsg.value = ''
  role.value = ''
  addDialogVisible.value = false
}



// 用来保存选中的行数据
const selectedDeleteRows = ref<Chat[]>([])
function handleSelectionChange(val: Chat[]) {
  selectedDeleteRows.value = val
}
function deleteSelectedMessages() {
  if (selectedDeleteRows.value.length === 0) {
    // 提示没选中
    ElMessage.info('请至少选择一项')
    return
  }
  // 过滤掉被选中的消息
  const selectedIds = new Set(selectedDeleteRows.value.map(item => item.content))
  rawChatData.value = rawChatData.value.filter(item => !selectedIds.has(item.content))

  selectedDeleteRows.value = []
  deleteDialogVisible.value = false
}

const addChat = () => {
  if (clientId.value && consumerId.value && did.value) addDialogVisible.value = true
  else ElMessage.info('请输入客服id，顾客id，聊天id')

}
// 清除数据 恢复默认
const clearAll = () => {
  rawChatData.value = []
  rawDialogData.value = []
  consumerId.value = ''
  clientId.value = ''
  did.value = ''
}


// 提交chats
const submitChats = async () => {
  if (!rawChatData.value || rawChatData.value.length === 0) {
    ElMessage.warning('聊天记录不能为空，请先上传或添加数据')
    return
  }
  try {
    const res = await addDialogueByBatch({ 'chatList': rawChatData.value })
    console.log(res)
    ElMessage.success('上传成功！')
  } catch (error) {
  }
}

const uploadChat = () => {
  fileInput.value?.click()
}
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null
  if (!file) return

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) // defval 空值填 ''

      // 目标字段
      // const requiredFields = [
      //   'cid',
      //   'did',
      //   'consumerId',
      //   'clientId',
      //   'content',
      //   'role',
      //   'sensitiveReason',
      //   'editTime',
      //   'createTime'
      // ]

      // 映射 Excel 数据到 rawChatData
      const mappedData = (jsonData as any[]).map(row => {
        return {
          cid: row['cid'] || 0,
          did: row['did'] || 0,
          consumerId: row['consumerId'] || '',
          clientId: row['clientid'] || row['clientId'] || '',
          content: row['content'] || '',
          role: row['role'] || '',
          sensitiveReason: null,
          editTime: new Date().toISOString(),
          createTime: new Date().toISOString()
        }
      })

      rawChatData.value = mappedData
      consumerId.value = rawChatData.value[0].consumerId
      clientId.value = rawChatData.value[0].clientId
      ElMessage.success('Excel 数据已成功加载！')
    }

    reader.readAsBinaryString(file)
  } catch (error) {
    console.error('文件读取错误', error)
    ElMessage.error('文件读取失败，请检查文件格式')
  }
}


// onMounted(() => {
//   clearAll()
// })

</script>

<style scoped lang="scss">
.container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  // align-items: center;

  .inputs {
    display: flex;
    // gap: 20px;
    height: 30px;
    line-height: 30px;
    align-items: center;

    .el-input {
      margin: 0;
      padding: 0;
    }
  }

  .button-bar {
    width: 800px;
    display: flex;
    justify-content: flex-start;
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .main-content {
    display: flex;
    width: 100%;
    // max-width: 1000px;
    margin-top: 20px;
  }


}
</style>