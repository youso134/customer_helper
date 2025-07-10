<template>
  <div class="chat-detail">
    <el-scrollbar class="chat-scrollbar">
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
          <!-- <el-card shadow="hover" class="message-card">
            {{ item.content }}
          </el-card> -->
          <el-card shadow="hover" class="message-card">
            <!-- 使用 v-html 渲染高亮后的内容 -->
            <div v-html="highlightText(item.content, highLight as string[])"></div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang='ts' setup name='ChatDetail'>
import { } from 'vue'
// import type { PropType } from 'vue'

interface ChatItem {
  type: 'C' | 'U'  // 明确指定只能是这两种值
  content: string
}

defineProps({
  chatList: {
    type: Array as () => ChatItem[],
  },
  highLight: {
    type: Array as () => string[],
  }
})


// 高亮处理函数
const highlightText = (text: string, keywords: string[]) => {
  if (!keywords || keywords.length === 0) return text

  // 创建正则表达式（避免特殊字符影响）
  const regex = new RegExp(
    keywords
      .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|'),
    'g'
  )

  return text.replace(
    regex,
    '<span class="highlight">$&</span>'
  )
}



</script>

<style scoped lang="scss">
.chat-detail {
  width: 50%;
  height: 500px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin-bottom: 80px;
  // background-color: rgba(92, 201, 220, 0.5);

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
        color: #08080a;
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
</style>