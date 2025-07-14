<template>
  <div class='container'>
    <div class="input-container">
      <el-input v-model="inputmsg" class="custom-textarea" :autosize="{ minRows: 5, maxRows: 5 }" type="textarea"
        placeholder="请输入聊天记录" resize="none" />
      <div class="button-group">
        <el-button type="primary" @click="submitInput(inputmsg)" class="submit-btn">确定提交</el-button>
        <el-button class="upload-btn" @click="uploadChat">本地上传</el-button>
        <input ref="fileInput" type="file" accept=".xls,.xlsx" style="display: none" @change="handleFileChange" />
      </div>
    </div>

    <div class="main-content">
      <ChatDetail :chatList="chatList" :highLight="highLight" />

      <div class="classify">
        <div class="classify-section">
          <span class="label">当前聊天记录分类：</span>
          <el-tag type="info" size="small">{{ currentMsg.type }}</el-tag>
        </div>

        <div class="classify-section">
          <span class="label">高亮词汇：</span>
          <div class="highlight-tags">
            <el-tag v-for="(word, index) in highLight" :key="index" type="success" size="small" effect="light"
              class="highlight-tag">
              {{ word }}
            </el-tag>
          </div>
        </div>

        <div class="classify-section">
          <span class="label">创建时间：</span>
          <span class="value">{{ formatDate(currentMsg.createTime || '') }}</span>
        </div>

        <div class="classify-section">
          <span class="label">编辑时间：</span>
          <span class="value">{{ formatDate(currentMsg.editTime || '') }}</span>
        </div>
      </div>
    </div>

  </div>

</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue'
// import { Avatar, User } from '@element-plus/icons-vue'
import { getChat } from '../apis/api'
import type { Chat } from '../stores/types'
import ChatDetail from '../components/ChatDetail.vue'
import * as XLSX from 'xlsx'

const inputmsg = ref<string>('')

let currentMsg = reactive<Chat>({ type: '默认值' }) as Chat

// const rawData = "C: 您好，这里是电信客服，请问有什么可以帮您？U: 我家网络用不了了，WiFi连不上网。C: 请您先查看光猫指示灯状态，现在是什么颜色？U: 光信号灯是红色的，已经重启过还是不行。U: 你有什么方法可以解决吗？C: 这可能是光纤信号中断，请您检查下光纤线是否插好？U: 我重新插拔了光纤线，现在灯变绿色了。C: 网络恢复了吗？可以正常上网了吗？U: 可以了，网速也正常了。C: 好的，如有其他问题请随时联系我们，祝您生活愉快！"

interface ChatItem {
  type: 'C' | 'U'  // 明确指定只能是这两种值
  content: string
}

const chatList = ref<ChatItem[]>([])
const highLight = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)


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
const formatDate = (str: string) => {
  if (!str) return ''
  const date = new Date(str)
  return date.toLocaleString() // 根据浏览器本地时间显示
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

const getChatMessage = async () => {
  const queryPara = {
    cid: 1001,
    consumerId: 101,
    clientId: 201
  }

  let res: any = await getChat(queryPara)
  Object.assign(currentMsg, res[0]); // 合并属性到原响应式对象 防止丢失响应性
  highLight.value = JSON.parse(currentMsg.highLight || '')

  parseChatData(currentMsg.content || '')
}
const submitInput = (inputmsg: string) => {
  parseChatData(inputmsg)
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
      highLight: "[\"信号\"]",
      type: '',
      createTime: '',
      editTime: ''
    }
    Object.assign(currentMsg, newChat) // 响应式赋值
    highLight.value = JSON.parse(newChat.highLight || '')
    parseChatData(newChat.content || '')
    ElMessage.success('Excel 聊天记录已导入')

  } catch (error) {
    console.error('读取 Excel 失败:', error)
  }


  // 清空 input，否则无法连续选择同一文件
  target.value = ''
}


onMounted(() => {
  getChatMessage()
  console.log(currentMsg)
})

</script>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  padding: 20px;

  .input-container {
    width: 800px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .custom-textarea {
      width: 100%;
      margin-bottom: 15px;

      .el-textarea__inner {
        font-size: 14px;
        line-height: 1.5;
        border-radius: 4px;
        transition: border-color 0.3s;

        &:focus {
          border-color: #409eff;
          outline: none;
        }
      }
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 15px;

      .submit-btn {
        background-color: #409eff;
        border-color: #409eff;

        &:hover {
          opacity: 0.8;
        }
      }

      .upload-btn {
        background-color: #67c23a;
        border-color: #67c23a;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .main-content {
    display: flex;
    width: 100%;

    .classify {
      padding: 15px;
      width: 40%;
      height: 500px;
      margin-left: 20px;
      border: 1px solid #ebeef5;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      // background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 16px;

      .classify-section {
        font-size: 14px;
        color: #333;

        .label {
          font-weight: 500;
          color: #000000;
          margin-right: 5px;
        }

        .value {
          color: #222;
        }

        .highlight-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .highlight-tag {
          cursor: default;
        }
      }
    }
  }



}
</style>