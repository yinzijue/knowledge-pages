<template>
  <div class="excalidraw-svg-wrapper" v-html="svgString"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { exportToSvg } from '@excalidraw/excalidraw'
import { parseExcalidrawCompressed } from '../plugins/excalidraw-converter/parser'

// 接收插件传过来的 content 属性
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const svgString = ref('')

onMounted(async () => {
  try {
    // 解码URIComponent
    const base64Str = decodeURIComponent(props.content).trim()
    
    if (!base64Str) throw new Error("未获取到 JSON 字符串")
    console.log(`ExcalidrawSvg组件接收到base64Str:`, base64Str.substring(0, 50) + '...')
    
    const data = parseExcalidrawCompressed(base64Str);
    let elements = data.elements || []
    let appState = data.appState || {}
    let files = data.files || {}

    const svgElement = await exportToSvg({
      elements,
      appState: { exportBackground: true, viewBackgroundColor: "#ffffff", ...appState },
      files,
      exportPadding: 10
    })

    svgString.value = svgElement.outerHTML
  } catch (error) {
    console.error("转换失败:", error)
    svgString.value = `<p style="color:red;">渲染失败: ${error.message}</p>`
  }
})
</script>

<style scoped>
.excalidraw-svg-wrapper { text-align: center; margin: 20px 0; overflow-x: auto; }
.excalidraw-svg-wrapper :deep(svg) { max-width: 100%; height: auto; }
</style>
