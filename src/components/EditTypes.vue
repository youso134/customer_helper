<template>
  <div class="container">
    <el-button class="mt-4" style="width: 100px; margin-bottom: 20px;" @click="onAddItem">
      添加分类
    </el-button>

    <el-table :data="innerTableData" style="width: 100%" max-height="250">
      <el-table-column prop="tid" label="id" width="60" />

      <el-table-column label="分类名" width="240">
        <template #default="scope">
          <!-- 编辑态 -->
          <template v-if="isEditing(scope.row)">
            <el-input v-model="editValue" size="small" autofocus @keyup.enter="confirmEdit(scope.row)"
              @keyup.esc="cancelEdit" @blur="cancelEdit" />
          </template>

          <!-- 展示态 -->
          <template v-else>
            {{ scope.row.type }}
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="editRow(scope.row)">
            编辑
          </el-button>
          <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup name="EditTypes">
import { ref, watch, toRefs } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import type { Type } from '@/stores/types'
import { addType, updateType, deleteType } from '@/apis/typeApi'


/** ---------- Props ---------- */
const props = defineProps({
  categoryOptions: {
    type: Array as () => Type[],
    required: true,
  },
})
const { categoryOptions } = toRefs(props)

/** ---------- Emits ---------- */
const emit = defineEmits<{
  (e: 'update:categoryOptions', value: Type[]): void
  (e: 'changed'): void
}>()

/** ---------- 内部数据 ---------- */
const innerTableData = ref<Type[]>([])
let isAdd = ref(false)

// 同步 props -> 内部数据
watch(
  categoryOptions,
  (newVal) => {
    innerTableData.value = [...newVal]
  },
  { immediate: true, deep: true }
)

/** ---------- 编辑状态 ---------- */
const editingId = ref<number | null>(null)
const editValue = ref('')
let originalValue = ''

/** 判断当前行是否在编辑中 */
const isEditing = (row: Type) => row.tid === editingId.value

/** 进入编辑模式 */
function editRow(row: Type) {
  editingId.value = row.tid
  editValue.value = row.type
  originalValue = row.type
}

function cancelEdit() {
  if (editingId.value !== null) {
    const row = innerTableData.value.find((r) => r.tid === editingId.value)
    if (row) row.type = originalValue
  }
  editingId.value = null
  editValue.value = ''
}

function validateName(name: string, currentId: number): boolean {
  if (!name.trim()) {
    ElMessage.warning('分类名不能为空！')
    return false
  }
  const dup = innerTableData.value.some(
    (r) => r.tid !== currentId && r.type.trim() === name.trim()
  )
  if (dup) {
    ElMessage.warning('分类名已存在！')
    return false
  }
  if (name.length > 20) {
    ElMessage.warning('分类名不能超过20个字符！')
    return false
  }
  return true
}

/** 确认编辑 */
async function confirmEdit(row: Type) {
  if (!validateName(editValue.value, row.tid)) return

  const loading = ElLoading.service({
    lock: true,
    text: '保存中...',
    background: 'rgba(0, 0, 0, 0.3)',
  })

  try {
    if (isAdd.value === true) {
      const res = await addType({ 'type': editValue.value })
      row.tid = res.tid
      row.createTime = res.createTime
      row.editTime = res.editTime
      isAdd.value = false
    }
    else {
      await updateType({ oldType: originalValue, newType: editValue.value })
    }
    // 更新本地数据
    row.type = editValue.value
    emit('update:categoryOptions', [...innerTableData.value])

    ElMessage.success('修改成功！')
    editingId.value = null
    editValue.value = ''
  } catch (err: any) {
    row.type = originalValue
    ElMessage.error(`修改失败：${err?.message || '未知错误'}`)
  } finally {
    loading.close()
  }
}

function onAddItem() {
  const newRow: Type = {
    tid: 0,
    type: '新分类',
  }
  innerTableData.value.push(newRow)
  editRow(newRow)
  isAdd.value = true
}

function deleteRow(row: Type) {
  if (!row) return

  ElMessageBox.confirm(`确定要删除分类「${row.type}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
    .then(async () => {
      const res = await deleteType({ 'type': row.type })
      const idx = innerTableData.value.findIndex((r) => r.tid === row.tid)
      if (idx > -1) {
        innerTableData.value.splice(idx, 1)
      }
      if (editingId.value === row.tid) {
        cancelEdit()
      }
      emit('update:categoryOptions', [...innerTableData.value])

      ElMessage.success('删除成功！')
    })
    .catch(() => { })
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  padding: 0;
}
</style>
