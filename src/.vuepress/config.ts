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
      optimizeDeps: {
        esbuildOptions: {
          plugins: [
            {
              name: 'fix-open-color-json',
              setup(build) {
                build.onLoad({ filter: /open-color\.json$/ }, async (args) => {
                  // 使用 fs 读取文件内容（esbuild 环境支持）
                  const fs = await import('fs/promises');
                  const content = await fs.readFile(args.path, 'utf-8');
                  return {
                    contents: `export default ${content}`,
                    loader: 'js',
                  };
                });
              },
            },
          ],
        },
      },
    },
  }),
});
