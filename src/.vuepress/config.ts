import path from 'path';
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme.js";
import { addTitleByFilename, autoFrontmatterPlugin } from '@vuepress/plugin-auto-frontmatter'
import { excalidrawConverter } from './plugins/excalidraw-converter/index.js'
import { obsidianAdapter } from './plugins/obsidian-adapter/index.js'

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "学习笔记",
  description: "vuepress-theme-hope 的文档演示",
  source: "docs",
  port: 8083,

  plugins: [
    autoFrontmatterPlugin(
      (data, context) => {
        addTitleByFilename(data, context)
        return data
      }),
    // rightAnchorPlugin({ name: 'right-anchor', showDepth: 4 }),
    excalidrawConverter({}),
    obsidianAdapter(),

  ],
  theme,
  // 和 PWA 一起启用
  // shouldPrefetch: false,
  bundler: viteBundler({
    viteOptions: {
      build: {
        rollupOptions: {
          plugins: [
            {
              name: 'fix-open-color-json',
              resolveId(id) {
                if (id.includes('open-color')) {
                  return id;
                }
              },
              load(id) {
                if (id.includes('open-color/open-color.json')) {
                  // 直接导出 JSON 对象
                  const fs = require('fs');
                  const json = JSON.parse(fs.readFileSync(id, 'utf-8'));
                  return `export default ${JSON.stringify(json)}`;
                }
              }
            }
          ]
        }
      }
    }
  }),
});
