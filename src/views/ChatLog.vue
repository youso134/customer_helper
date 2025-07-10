<template>
  <div class='container'>
    <div class="input-container">
      <el-input v-model="inputmsg" class="custom-textarea" :autosize="{ minRows: 5, maxRows: 5 }" type="textarea"
        placeholder="请输入聊天记录" resize="none" />
      <div class="button-group">
        <el-button type="primary" @click="submitInput(inputmsg)" class="submit-btn">确定提交</el-button>
        <el-button class="upload-btn">本地上传</el-button>
      </div>
    </div>

    <div class="main-content">
      <ChatDetail :chatList="chatList" :highLight="highLight" />

      <div class="classify">
        当前聊天记录分类为：{{ currentMsg.type }}
      </div>
    </div>

    

    <!-- <div class="classify">
      当前聊天记录分类为：{{ currentMsg.type }}
    </div> -->

  </div>

</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue'
// import { Avatar, User } from '@element-plus/icons-vue'
import { getChat } from '../apis/api'
import type { Chat } from '../stores/types'
import ChatDetail from '../components/ChatDetail.vue'

const inputmsg = ref<string>('')

let currentMsg = reactive<Chat>({ type: '默认值' }) as Chat

// const rawData = "C: 您好，这里是电信客服，请问有什么可以帮您？U: 我家网络用不了了，WiFi连不上网。C: 请您先查看光猫指示灯状态，现在是什么颜色？U: 光信号灯是红色的，已经重启过还是不行。U: 你有什么方法可以解决吗？C: 这可能是光纤信号中断，请您检查下光纤线是否插好？U: 我重新插拔了光纤线，现在灯变绿色了。C: 网络恢复了吗？可以正常上网了吗？U: 可以了，网速也正常了。C: 好的，如有其他问题请随时联系我们，祝您生活愉快！"

interface ChatItem {
  type: 'C' | 'U'  // 明确指定只能是这两种值
  content: string
}

// 处理对话数据
const chatList = ref<ChatItem[]>([])

const highLight = ref<string[]>([])


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
  // chatList = result

}

const getChatMessage = async () => {
  const queryPara = {
    cid: 1001,
    consumerId: 101,
    clientId: 201
  }

  let res: any = await getChat(queryPara)
  console.log(res)
  Object.assign(currentMsg, res[0]); // 合并属性到原响应式对象 防止丢失响应性
  highLight.value = JSON.parse(currentMsg.highLight || '')
  
  parseChatData(currentMsg.content || '')
}

const submitInput = (inputmsg: string) => {
  parseChatData(inputmsg)
}


onMounted(() => {
  // parseChatData(rawData)  // 初始化时解析数据
  getChatMessage()
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

  .inputmsg {
    display: flex;
    height: 150px;
    margin-bottom: 10px;

    .el-button {
      margin: auto 50px;
    }
  }

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


    .classify{
      margin-left: 20px;
      margin-bottom: 80px;
      width: 40%;
      border: 1px solid #000;

    }


  }



}
</style>