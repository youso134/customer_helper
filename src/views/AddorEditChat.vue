<template>
  <div class="container">
    <!-- 顶部按钮区 -->
    <div class="inputs">


      <span>客服id：</span>
      <el-input v-model="clientId" style="width: 120px; margin-right: 5px;" placeholder="请输入客服id"
        :disabled="clientLocked" />
      <el-button :disabled="clientLocked" @click="confirmLocked(2)">锁定</el-button>


      <span style="margin-left: 40px;">顾客id：</span>
      <el-input v-model="consumerId" style="width: 120px; margin-right: 5px;" placeholder="请输入顾客id"
        :disabled="consumerLocked" />
      <el-button :disabled="consumerLocked" @click="confirmLocked(1)">锁定</el-button>

    </div>

    <div class="button-bar">
      <el-button type="primary" @click="addChat">添加消息</el-button>
      <!-- <el-button type="danger" @click="deleteDialogVisible = true">删除消息</el-button> -->
      <el-button type="info" @click="clearAll">恢复默认</el-button>
      <el-button type="success" @click="confirmSubmitChats">确认上传</el-button>
      <!-- <el-checkbox v-model="checked2">上传后自动解析</el-checkbox> -->

    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <ChatDetail :rawDialogData="rawDialogData" :rawChatData="rawChatData" />
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


<script lang='ts' setup name="AddorEditChat">
import { onMounted, ref } from 'vue'
// import { Avatar, User } from '@element-plus/icons-vue'
import { addOrUpdateChatByBatch } from '@/apis/chatApi'
import { getDialogueDetailByDid } from '@/apis/dialogApi'
import type { Chat } from '@/stores/types'
import ChatDetail from '@/components/ChatDetail.vue'
// import { useDialogStore } from '@/stores/index'
import { useRoute } from 'vue-router'
// import { ElMessageBox, ElLoading } from 'element-plus'
import 'element-plus/theme-chalk/el-overlay.css';
import 'element-plus/theme-chalk/el-message-box.css';


const inputmsg = ref<string>('')
const addDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const checked2 = ref()
const roleList = ['顾客', '客服']
const route = useRoute()
const did = route.params.did as string

let consumerId = ref()
let clientId = ref()
let role = ref('顾客')
let consumerLocked = ref(false)
let clientLocked = ref(false)



const rawDialogData = ref({})
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
    did: 0,
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

// 锁定前判断是否有数据
const confirmLocked = (num: number) => {
  if (num === 1) {
    if (!consumerId.value || isNaN(Number(consumerId.value))) {
      ElMessage.info('请确认顾客id（必须是数字）');
      return;
    } else {
      consumerLocked.value = true;
    }
  }
  else if (num === 2) {
    if (!clientId.value || isNaN(Number(clientId.value))) {
      ElMessage.info('请确认客服id（必须是数字）');
      return;
    } else {
      clientLocked.value = true;
    }
  }
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
  if (clientLocked.value && consumerId.value) addDialogVisible.value = true
  else ElMessage.info('请锁定客服id和顾客id')

}
// 清除数据 恢复默认
const clearAll = () => {
  rawChatData.value = []
  rawDialogData.value = []
  consumerId.value = ''
  consumerLocked.value = false
  clientId.value = ''
  clientLocked.value = false
}

const confirmSubmitChats = () => {
  if (!rawChatData.value || rawChatData.value.length === 0) {
    ElMessage.warning('聊天记录不能为空，请先上传或添加数据')
    return
  }
  ElMessageBox.confirm(
    '确认上传聊天记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const loading = ElLoading.service({
        lock: true,
        text: '保存中...',
        background: 'rgba(0, 0, 0, 0.3)',
      })

      try {
        const res = await addOrUpdateChatByBatch(rawChatData.value)
        console.log(res)
        rawDialogData.value = res

        ElMessage.success('上传成功！')
      } catch (error) {
        ElMessage.error('上传失败。')
      } finally {
        loading.close()
      }
    })
    .catch(() => {
      ElMessage.info('已取消上传')
    })
}

const getChats = async (did: String) => {
  try {
    const res = await getDialogueDetailByDid({ did: did })
    rawDialogData.value = res.dialogueVO
    rawChatData.value = res.chatVOList
    consumerId.value = rawChatData.value[0].consumerId
    clientId.value = rawChatData.value[0].clientId
    consumerLocked.value = true
    clientLocked.value = true

  } catch (error) {
  }
}

onMounted(() => {
  if (did === '') { }
  else {
    getChats(did)
  }

})

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