import { Markdown } from "vuepress/markdown";
export const obsidianAdapter = () => {
    return {
        name: "vuepress-plugin-obsidian-Adapter",
        extendsMarkdown(md: Markdown) {
            md.core.ruler.before("normalize", "markmap-convert", (state) => {
                //-------将markmind插件语法转换成markmap语法------------
                if ("mindmap-plugin" in state.env.frontmatter) {
                    state.src = "```markmap\n" + state.src + "\n```";
                }

                //-------将![[example]]语法转换成![example](/example.svg)语法------------
                const defaultRender = md.render.bind(md)
                // 重写 render 方法
                md.render = (src, env) => {
                    const newSrc = src.replace(/!\[\[(.+?)\]\]/g, (match, p1) => {
                        // console.log(`匹配到了${match}}`)
                        return `![${p1}](/${p1}.svg)`
                    })

                    // 调用原始渲染
                    return defaultRender(newSrc, env)
                }
            });
        }
    }
}