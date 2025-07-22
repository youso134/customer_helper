<template>
  <el-card shadow="hover" class="consumer-ranking-chart-card">
    <div ref="chartRef" class="chart-container"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getclientId } from '@/apis/chartApi.ts'  // 替换成你的API路径

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = (data: { clientId: string; count: number }[]) => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()

  chartInstance = echarts.init(chartRef.value)

  const option: echarts.EChartsOption = {
    title: {
      text: '客服解决问题次数排名',
      left: 'center',
      textStyle: { fontSize: 18 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(item => item.clientId),
      axisLabel: {
        rotate: 45,
        interval: 0,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: '出现次数',
      minInterval: 1,
    },
    series: [
      {
        name: '次数',
        type: 'bar',
        data: data.map(item => item.count),
        itemStyle: {
          color: '#409EFF',
        },
        emphasis: {
          itemStyle: {
            color: '#66b1ff',
          },
        },
        barWidth: '40%',
      },
    ],
  }

  chartInstance.setOption(option)
}

const fetchData = async () => {
  try {
    const rawData = await getclientId()
    if (!Array.isArray(rawData)) throw new Error('接口返回数据格式异常')

    //  按 did 升序排序
    rawData.sort((a, b) => {
      if (a.did < b.did) return -1
      if (a.did > b.did) return 1
      return 0
    })

    const countMap = new Map<string, number>()
    const seenDids = new Set<string>()

    for (const item of rawData) {
      const { did, clientId } = item
      if (!did || !clientId) continue

      if (seenDids.has(did)) continue // 跳过重复的对话
      seenDids.add(did)

      countMap.set(clientId, (countMap.get(clientId) ?? 0) + 1)
    }

    const sortedData = Array.from(countMap.entries())
      .map(([clientId, count]) => ({ clientId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    initChart(sortedData)
  } catch (err: any) {
    ElMessage.error('获取数据失败：' + (err.message || '未知错误'))
  }
}



onMounted(() => {
  fetchData()
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>

<style scoped>
.consumer-ranking-chart-card {
  padding: 20px;
  margin-top: 20px;
}

.chart-container {
  width: 100%;
  height: 350px;
}
</style>
