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
        layout="total, sizes, prev, pager, next, jumper" :total="allLog.totalAmount" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-model="dialogVisible" title="聊天记录详情" width="1000px" :close-on-click-modal="false">
      <ChatDetail :chatList="chatList" :highLight="highLight" />
    </el-dialog>

  </div>
</template>

<script lang="ts" setup name="AllChatLog">
import { ref, reactive, onMounted } from 'vue'
import { initAllLog } from '@/stores'
import { getDialog, getDialogDetail } from '@/apis/api'
import type { Chat } from '@/stores/types'



interface ChatItem {
  type: 'C' | 'U'  // 明确指定只能是这两种值
  content: string
}
const sendData = ref({ pageSize: 10, currentPage: 2, category: '', searchText: '' })
const allLog = initAllLog()
let contentData = ref(allLog.content)
// 所有分类选项（也可以动态生成）
const categoryOptions = Array.from(new Set(contentData.value.map(item => item.category)))
const dialogVisible = ref(false)
const rawData = "C: 您好，这里是电信客服，请问有什么可以帮您？U: 我家网络用不了了，WiFi连不上网。C: 请您先查看光猫指示灯状态，现在是什么颜色？U: 光信号灯是红色的，已经重启过还是不行。U: 你有什么方法可以解决吗？C: 这可能是光纤信号中断，请您检查下光纤线是否插好？U: 我重新插拔了光纤线，现在灯变绿色了。C: 网络恢复了吗？可以正常上网了吗？U: 可以了，网速也正常了。C: 好的，如有其他问题请随时联系我们，祝您生活愉快！"

const chatList = ref<ChatItem[]>([])
const highLight = ref<string[]>([])
let currentMsg = reactive<Chat>({ type: '默认值' }) as Chat



// const newChat: Chat = {
//   content: rawData,
//   highLight: "[\"信号\"]",
//   type: '',
//   createTime: '',
//   editTime: ''
// }


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
  dialogVisible.value = true
  console.log(index, row)
}
const goDelete = (index: any, row: any) => {
  console.log(index, row)
}

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

  try {
    const res = await getDialogDetail({ did: 111 })
    console.log('222', res)
  } catch (error) {
    console.log(error)
  }





  const newChat: Chat = {
    content: rawData,
    highLight: "[\"信号\",\"光纤\",\"网络\"]",
    type: '',
    createTime: '',
    editTime: ''
  }
  Object.assign(currentMsg, newChat) // 响应式赋值
  highLight.value = JSON.parse(newChat.highLight || '')
  parseChatData(newChat.content || '')
  ElMessage.success('聊天记录已导入默认值')

}

onMounted(() => {
  // parseChatData(rawData)
  getChatMessage()
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
    // width: 500px;
  }

}
</style>
