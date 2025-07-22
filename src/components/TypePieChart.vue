<template>
  <div class="chart-container">
    <div ref="chartRef" class="pie-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getTypeCount } from '@/apis/chartApi.ts'

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = (data: { name: string; value: number }[]) => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    title: {
      text: '客服类型统计',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      left: 'center'
    },
    series: [
      {
        name: '类型',
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

const loadChartData = async () => {
  try {
    const res = await getTypeCount()
    const rawData = res.data || res
    const chartData = Object.entries(rawData || {})
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))

    if (!chartData.length) {
      ElMessage.warning('暂无可展示的图表数据')
      return
    }

    await nextTick()
    initChart(chartData)
  } catch (err: any) {
    console.error(err)
    ElMessage.error('加载图表失败: ' + (err.message || '未知错误'))
  }
}

onMounted(() => {
  loadChartData()
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  // padding: 20px;
}

.pie-chart {
  width: 100%;
  height: 300px;
}
</style>
