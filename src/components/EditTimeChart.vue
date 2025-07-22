<template>
  <el-card shadow="always" style="width: 50vw; height: 25vh">
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getclientId } from '@/apis/chartApi.ts'

const chartRef = ref(null)
let chartInstance = null

// 将 UTC 时间转北京时间，格式 MM-DD HH:mm
function convertToBeijingTime(utcString) {
  const utcDate = new Date(utcString)
  const beijingOffset = 8 * 60
  const beijingDate = new Date(utcDate.getTime() + beijingOffset * 60 * 1000)

  const month = String(beijingDate.getMonth() + 1).padStart(2, '0')
  const day = String(beijingDate.getDate()).padStart(2, '0')
  const hour = String(beijingDate.getHours()).padStart(2, '0')
  const minute = String(beijingDate.getMinutes()).padStart(2, '0')

  return `${month}-${day} ${hour}:${minute}`
}

// 聚合每分钟消息数量
function aggregateByTime(data) {
  const map = new Map()
  data.forEach(item => {
    const timeKey = convertToBeijingTime(item.editTime)
    map.set(timeKey, (map.get(timeKey) || 0) + 1)
  })
  const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  return sorted.map(([time, value]) => ({ time, value }))
}

// 等待 chartRef 元素尺寸准备好
async function waitForChartContainerReady(maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (chartRef.value?.clientWidth > 0 && chartRef.value?.clientHeight > 0) {
      return true
    }
  }
  console.warn('容器尺寸始终为0，跳过图表初始化')
  return false
}

// 初始化图表
function initChart(data) {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const option = {
    title: {
      text: 'Edit Time 折线图（每分钟消息数）',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.time),
      axisLabel: {
        fontSize: 10,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '消息数量',
      axisLabel: {
        fontSize: 10
      }
    },
    series: [
      {
        data: data.map(item => item.value),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.1
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 加载数据并初始化图表
onMounted(async () => {
  try {
    const res = await getclientId()
    const rawData = Array.isArray(res?.data?.data) ? res.data.data : []
    const processedData = aggregateByTime(rawData)

    await nextTick()
    const ready = await waitForChartContainerReady()
    if (ready) {
      initChart(processedData)
      window.addEventListener('resize', () => {
        chartInstance && chartInstance.resize()
      })
    }
  } catch (error) {
    console.error('图表加载失败：', error)
  }
})
</script>
