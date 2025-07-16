<template>
  <div class="container">
    <!-- 顶部按钮区 -->
    <div class="button-bar">
      <el-button type="primary" @click="dialogVisible = true">添加消息</el-button>
      <el-button type="success">确认上传</el-button>
      <el-button type="default" @click="uploadChat">本地上传</el-button>
      <el-checkbox v-model="checked2">上传后自动解析</el-checkbox>
      <input ref="fileInput" type="file" accept=".xls,.xlsx" style="display: none" @change="handleFileChange" />
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- <ChatDetail :chatList="chatList" :highLight="highLight" :currentMsg="currentMsg" /> -->
      <ChatDetail :rawDialogData="rawDialogData" :rawChatData="rawChatData" />

    </div>

    <!-- 弹出手动输入窗口 -->
    <el-dialog v-model="dialogVisible" title="手动输入聊天记录" width="600px" :close-on-click-modal="false">
      <el-input v-model="inputmsg" type="textarea" :autosize="{ minRows: 8, maxRows: 12 }"
        placeholder="请输入聊天记录（例如：C: 欢迎光临；U: 网络不好）" resize="none" />
      <el-select v-model="role" placeholder="请选择分类" clearable>
        <el-option v-for="cat in roleList" :key="cat" :label="cat" :value="cat" />
      </el-select>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAndClose">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue'
// import { Avatar, User } from '@element-plus/icons-vue'
import { getChat } from '@/apis/api'
import type { Chat } from '@/stores/types'
import ChatDetail from '@/components/ChatDetail.vue'
import * as XLSX from 'xlsx'

interface ChatItem {
  type: 'C' | 'U'  // 明确指定只能是这两种值
  content: string
}

const inputmsg = ref<string>('')
const dialogVisible = ref(false)
let currentMsg = reactive<Chat>({}) as Chat
const chatList = ref<ChatItem[]>([])
const highLight = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const checked2 = ref()
const roleList = ['顾客','客户']
let role = ref()



const rawDialogData = {
  "did": "111",
  "consumerId": 233,
  "clientId": 233,
  "editTime": "2025-07-16T00:38:36.000+00:00",
  "createTime": "2025-07-15T01:20:02.000+00:00",
  "type": "投诉",
  "resume": "客户进行了投诉",
  "highlight": "投诉"
}
const rawChatData = [
  {
    "cid": "1001",
    "did": "111",
    "consumerId": 233,
    "clientId": 233,
    "content": "您好，保修期是多少",
    "role": "客户",
    "sensitiveReason": "保修",
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:15:22.000+00:00"
  },
  {
    "cid": "1002",
    "did": "111",
    "consumerId": 233,
    "clientId": 233,
    "content": "我们的产品保修期是1年，如果有任何质量问题可以联系我们。",
    "role": "客服",
    "sensitiveReason": "质量",
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:16:30.000+00:00"
  },
  {
    "cid": "1003",
    "did": "111",
    "consumerId": 233,
    "clientId": 233,
    "content": "好的。另外我想问下付款方式。我可以用信用卡吗？",
    "role": "客户",
    "sensitiveReason": null,
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:18:45.000+00:00"
  },
  {
    "cid": "1004",
    "did": "111",
    "consumerId": 233,
    "clientId": 233,
    "content": "客服将在2分钟内回复您的问题，请稍候...",
    "role": "客服",
    "sensitiveReason": null,
    "editTime": "2025-07-16T00:52:27.000+00:00",
    "createTime": "2023-05-10T01:19:00.000+00:00"
  }
]

// 解析原始数据
const parseChatData = (rawData: string) => {
  // 使用正则表达式分割，匹配 "C:" 或 "U:" 开头的内容
  const pattern = /([CU]):\s([^CU]*)/g
  let match
  const result: ChatItem[] = []

  while ((match = pattern.exec(rawData)) !== null) {
    const type = match[1] as 'C' | 'U'
    result.push({
      type,
      content: match[2].trim()
    })
  }
  chatList.value = result
}
const readExcel = (file: File): Promise<any[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]
        resolve(json)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (err) => {
      reject(err)
    }
    reader.readAsArrayBuffer(file)
  })
}
// 关闭弹出窗口
const submitAndClose = () => {
  // 这里还有要加的东西，要将用户的输入传到后端，让后端判断出分类等词汇后传回前端。 本地上传也需要这一步  这里可以加一个选项：上传后自动判断
  parseChatData(inputmsg.value)
  dialogVisible.value = false
}
const getChatMessage = async () => {
  // const queryPara = {
  //   cid: 1001,
  //   consumerId: 101,
  //   clientId: 201
  // }

  // let res: any = await getChat(queryPara)
  // Object.assign(currentMsg, res[0]); // 合并属性到原响应式对象 防止丢失响应性
  // highLight.value = JSON.parse(currentMsg.highLight || '')

  // parseChatData(currentMsg.content || '')
}

const uploadChat = () => {
  fileInput.value?.click()
}
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 判断文件类型（可选）
  if (!/\.xlsx?$/.test(file.name)) {
    ElMessage.error('请上传 Excel 文件（.xls 或 .xlsx）')
    return
  }

  try {
    const data = await readExcel(file)
    const newChat: Chat = {
      content: data[0][0],
      createTime: '',
      editTime: ''
    }
    Object.assign(currentMsg, newChat) // 响应式赋值
    highLight.value = JSON.parse(newChat.highLight || '')
    parseChatData(newChat.content || '')
    ElMessage.success('Excel 聊天记录已导入')

  } catch (error) {
    ElMessage.error('读取失败')
    console.error('读取 Excel 失败:', error)
  }


  // 清空 input，否则无法连续选择同一文件
  target.value = ''
}


onMounted(() => {
  getChatMessage()
})

</script>

<style scoped lang="scss">
.container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  // align-items: center;

  .button-bar {
    width: 800px;
    display: flex;
    justify-content: flex-start;
    gap: 15px;
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