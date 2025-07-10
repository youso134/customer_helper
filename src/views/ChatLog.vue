<template>
  <div class='container'>
    <div class="inputmsg">
      <el-input v-model="inputmsg" style="width: 1000px" :autosize="{ minRows: 2, maxRows: 5 }" type="textarea"
        placeholder="请输入聊天记录" resize="none" />
      <el-button type="primary" @click="submitInput(inputmsg)">确定提交</el-button>
    </div>


    <div class="main-content">
      <div class="chatDetail">
        <el-scrollbar height="450px">
          <div v-for="(item, index) in chatList" :key="index" class="message-item"
            :class="{ 'customer': item.type === 'U', 'service': item.type === 'C' }">

            <div class="avatar">
              <el-avatar v-if="item.type === 'C'" style="background-color: #87CEFA">
                <el-icon>
                  <Service />
                </el-icon>
              </el-avatar>
              <el-avatar v-else style="background-color: #67c23a">
                <el-icon>
                  <UserFilled />
                </el-icon>
              </el-avatar>
            </div>
            <div class="content">
              <div class="name">{{ item.type === 'C' ? '客服' : '顾客' }}</div>
              <el-card shadow="hover" class="message-card">
                {{ item.content }}
              </el-card>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div class="classify">
        当前聊天记录分类为：{{ currentMsg.type }}
      </div>
      
    </div>


  </div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue'
// import { Avatar, User } from '@element-plus/icons-vue'
import {getChat} from '../apis/api'
import type {Chat} from '../stores/types'

const inputmsg = ref<string>('')

// let currentMsg = reactive<Partial<Chat>>({type:'额额'}) as Chat
let currentMsg = reactive<Chat>({type:'默认值'}) as Chat


// 处理对话数据
const chatList = ref<{ type: string, content: string }[]>([])


const rawData = "C: 您好，这里是电信客服，请问有什么可以帮您？U: 我家网络用不了了，WiFi连不上网。C: 请您先查看光猫指示灯状态，现在是什么颜色？U: 光信号灯是红色的，已经重启过还是不行。U: 你有什么方法可以解决吗？C: 这可能是光纤信号中断，请您检查下光纤线是否插好？U: 我重新插拔了光纤线，现在灯变绿色了。C: 网络恢复了吗？可以正常上网了吗？U: 可以了，网速也正常了。C: 好的，如有其他问题请随时联系我们，祝您生活愉快！"

// 解析原始数据
const parseChatData = (rawData: string) => {
  // 使用正则表达式分割，匹配 "C:" 或 "U:" 开头的内容
  const pattern = /([CU]):\s([^CU]*)/g
  let match
  const result = []

  while ((match = pattern.exec(rawData)) !== null) {
    result.push({
      type: match[1],
      content: match[2].trim()
    })
  }
  chatList.value = result
}

const getChatMessage = async () => {
  const queryPara = {
    cid:1001,
    consumerId:101,
    clientId:201
  }

  let res:any = await getChat(queryPara)
  Object.assign(currentMsg, res[0]); // 合并属性到原响应式对象 防止丢失响应性
  parseChatData(currentMsg.content || '')
}

const submitInput = (inputmsg: string) => {
  parseChatData(inputmsg)
}


onMounted(()=>{
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
    margin-bottom: 20px;

    .el-button {
      margin: auto 50px;
    }
  }

  .main-content {
    display: flex;
    width: 100%;

    .chatDetail {
      width: 60%;
      max-height: 500px;
      margin-bottom: 20px;
      margin-right: 20px;
      padding: 15px;

      border: 1px solid #ebeef5;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }

    .classify {
      width: 40%;
      margin: 0;
      padding: 15px;

      border: 1px solid #ebeef5;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }
  }




  .message-item {
    display: flex;
    margin-bottom: 20px;

    &.customer {
      flex-direction: row-reverse;

      .content {
        align-items: flex-end;
      }

      .message-card {
        background-color: #f0f9eb;
      }
    }

    &.service {
      .message-card {
        background-color: #f4f4f5;
      }
    }

    .avatar {
      margin: 0 15px;
    }

    .content {
      display: flex;
      flex-direction: column;
      max-width: 70%;

      .name {
        font-size: 12px;
        color: #090a0c;
        margin-bottom: 5px;
      }

      .message-card {
        border: none;
        border-radius: 8px;
      }
    }
  }
}
</style>