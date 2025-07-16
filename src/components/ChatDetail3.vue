<template>

  <div class="detail-container">
    <div class="chat-detail">

      <div v-if="isEmpty">当前没有数据哦</div>


      <!-- <div v-if="!isEmpty">
      <el-switch v-model="isHighlight" width="80px" inline-prompt active-text="高亮开启" inactive-text="高亮关闭"
        style="margin-bottom: 10px; display: inline-flex;" />
    </div> -->

      <div v-if="!isEmpty" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <span style="font-size: 14px;">关键词高亮：</span>
        <el-switch v-model="isHighlight" width="80px" inline-prompt active-text="开启" inactive-text="关闭" />
      </div>

      <el-scrollbar class="chat-scrollbar" v-if="!isEmpty">
        <div v-for="(item, index) in chatList" :key="index" class="message-item"
          :class="item.type === 'U' ? 'customer' : 'service'">
          <!-- :class="{ 'customer': item.type === 'U', 'service': item.type === 'C' }"> -->
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
              <div v-html="highlightText(item.content, highLight as string[])"></div>
            </el-card>
          </div>
        </div>
      </el-scrollbar>

    </div>

    <!-- 右侧分类区域 -->
    <div class="classify">
      <div class="classify-section">
        <span class="label">当前聊天记录分类：</span>
        <el-tag type="primary" size="small">{{ currentMsg.type }}</el-tag>
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


</template>

<script lang='ts' setup name='ChatDetail'>
import { ref, computed, onMounted, reactive } from 'vue'
// import type { PropType } from 'vue'
import type { Chat } from '@/stores/types'

interface ChatItem {
  type: 'C' | 'U'  // 明确指定只能是这两种值
  content: string
}

const rawData = [
  {
    "cid": "1001",
    "did": "111",
    "consumerId": 233,
    "clientId": 233,
    "content": "您好，保修期是多少",
    "role": "客户",
    "sensitiveReason": "测试1",
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


const props = defineProps({
  chatList: {
    type: Array as () => ChatItem[],
    default: () => []
  },
  highLight: {
    type: Array as () => string[],
  },
  currentMsg: {
    type: Object as () => Chat
  }
})
let currentMsg = reactive<Chat>({ type: '默认值' }) as Chat


const isEmpty = computed(() => !props.chatList || props.chatList.length === 0)
const isHighlight = ref(true)  // 默认开启高亮

const highlightText = (text: string, keywords: string[]) => {
  if (!isHighlight.value || !keywords || keywords.length === 0) return text

  const regex = new RegExp(
    keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'g'
  )
  return text.replace(regex, '<span class="highlight">$&</span>')
}
const formatDate = (str: string) => {
  if (!str) return ''
  const date = new Date(str)
  return date.toLocaleString() // 根据浏览器本地时间显示
}

onMounted(() => {
})

</script>

<style scoped lang="scss">
.detail-container {
  width: 100%;
  height: 90%;
  display: flex;
  padding: 0px;
  margin: 5px;

  .chat-detail {
    width: 65%;
    // width: 800px;
    height: 500px;
    padding: 15px;
    border: 1px solid #DBDDE3;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    // margin-bottom: 80px;
    // margin: 10px auto;

    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
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
          border-radius: 8px 0 8px 8px !important;
        }
      }

      &.service {
        .message-card {
          background-color: #f4f4f5;
          border-radius: 0 8px 8px 8px !important;
        }
      }

      .avatar {
        margin: 0 15px;
        flex-shrink: 0;
      }

      .content {
        display: flex;
        flex-direction: column;
        max-width: 70%;
        // flex-grow: 1;

        .name {
          font-size: 12px;
          color: #472c95;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .message-card {
          border: none;
          word-break: break-word;


        }
      }
    }

    :deep(.highlight) {
      // background-color: #ffeb3b;
      color: #ff3b3b;
      padding: 0 2px;
      border-radius: 2px;
      font-weight: bold;
    }
  }

  .classify {
    width: 30%;
    height: 500px;
    margin-left: 20px;
    padding: 20px;
    background-color: #FFF;
    border-radius: 8px;
    // margin: 10px auto;

    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }


    .classify-section {
      margin-bottom: 16px;

      .label {
        font-weight: 600;
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
</style>