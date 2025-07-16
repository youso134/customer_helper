<template>

  <div class="detail-container">
    <div class="chat-detail">

      <div v-if="isEmpty">当前没有数据哦</div>


      <!-- <div v-if="!isEmpty">
      <el-switch v-model="isHighlight" width="80px" inline-prompt active-text="高亮开启" inactive-text="高亮关闭"
        style="margin-bottom: 10px; display: inline-flex;" />
    </div> -->

      <div v-if="!isEmpty">

        <div v-if="!isEmpty2" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="font-size: 14px;">关键词高亮：</span>
          <el-switch v-model="isHighlight" width="80px" inline-prompt active-text="开启" inactive-text="关闭" />
          <span style="font-size: 14px;">敏感词高亮：</span>
          <el-switch v-model="isSensitive" width="80px" inline-prompt active-text="开启" inactive-text="关闭" />
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
                <div v-html="highlightText(item.content || '', sensitive, highlight)"></div>
              </el-card>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 右侧分类区域 -->
    <div v-if="!isEmpty2" class="classify">
      <div class="classify-section">
        <span class="label">当前聊天记录分类：</span>
        <el-tag type="primary" size="small">{{ currentMsg.role }}</el-tag>
      </div>
      <div class="classify-section">
        <span class="label">高亮词汇：</span>
        <div class="highlight-tags">
          <el-tag v-for="(word, index) in highlight" :key="index" type="success" size="small" effect="light"
            class="highlight-tag">
            {{ word }}
          </el-tag>
        </div>
      </div>
      <div class="classify-section">
        <span class="label">敏感词汇：</span>
        <div class="sensitive-tags">
          <el-tag v-for="(word, index) in sensitive" :key="index" type="success" size="small" effect="light"
            class="sensitive-tag">
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
import { ref, computed, toRefs, onMounted } from 'vue'
import type { Chat } from '@/stores/types'



const props = defineProps({
  rawDialogData: {
    type: Object,
    required: true
  },
  rawChatData: {
    type: Array as () => Chat[],
    required: true
  }
})

// 注意这里直接解构的话，返回的数据失去了响应性
const { rawChatData, rawDialogData } = toRefs(props)

// 原始数据

const isHighlight = ref(true)
const isSensitive = ref(true)
const isEmpty = computed(() => chatList.value.length === 0)
const isEmpty2 = computed(() => Object.keys(rawDialogData.value).length === 0)


// 把原始数据转换为组件可用的 chatList
const chatList = computed<Chat[]>(() =>
  rawChatData.value.map(item => ({
    type: item.role === '客服' ? 'C' : 'U',
    content: item.content
  }))
)

// 从 sensitiveReason 中提取敏感关键词（非 null 的）
const sensitive = computed<string[]>(() =>
  rawChatData.value.map(item => item.sensitiveReason).filter(reason => reason !== null) as string[]
)

const highlight = computed(() => {
  const word = rawDialogData.value.highlight
  return word ? [word] : []
})

const currentMsg = ref({
  type: '示例类型',
  createTime: rawDialogData?.value.createTime || '',
  editTime: rawDialogData?.value.editTime || ''
}) as unknown as Chat


// 高亮文本
const highlightText = (text: string, sensitiveWords: string[], highlightWords: string[]) => {
  // 提取所有关键词，去重合并（包括敏感词和高亮词）
  const allWords = [...new Set([...sensitiveWords, ...highlightWords])]

  // 如果两个开关都关了，直接返回原文本
  if ((!isSensitive.value && !isHighlight.value) || allWords.length === 0) {
    return text
  }

  // 构造正则匹配
  const regex = new RegExp(
    allWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'g'
  )

  // 执行替换
  return text.replace(regex, (matched) => {
    const classList = []
    if (isSensitive.value && sensitiveWords.includes(matched)) {
      classList.push('sensitive-word')
    }
    if (isHighlight.value && highlightWords.includes(matched)) {
      classList.push('highlight-word')
    }
    return `<span class="${classList.join(' ')}">${matched}</span>`
  })
}

// 格式化日期
const formatDate = (str: string) => {
  if (!str) return ''
  const date = new Date(str)
  return date.toLocaleString()
}


onMounted(() => {
  // rawChatData.value = []


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

    :deep(.sensitive-word) {
      background-color: #ffecec;
      color: #d70000;
      padding: 0 3px;
      border-radius: 3px;
      font-weight: bold;
    }

    :deep(.highlight-word) {
      background-color: #e6f7ff;
      color: #0050b3;
      padding: 0 3px;
      border-radius: 3px;
      font-weight: bold;
    }

    /* 两者叠加时，可覆盖样式或混合效果 */
    :deep(.sensitive-word.highlight-word) {
      background-color: #ffe6ff; // 混合颜色或优先某一类
      color: #800080; // 紫色代表叠加
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

      .sensitive-tags,
      .highlight-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }

      .highlight-tag {
        background-color: #e6f7ff;
        color: #0050b3;
        border: 1px solid #91d5ff;
      }

      .sensitive-tag {
        background-color: #ffecec;
        color: #d70000;
        border: 1px solid #f5c2c2;
      }

    }
  }
}
</style>