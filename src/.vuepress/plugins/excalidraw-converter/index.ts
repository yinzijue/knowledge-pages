// /src/.vuepress/plugins/excalidraw-converter/index.ts
import { Markdown } from "vuepress/markdown";

export const excalidrawConverter = (options, app) => {
    return {
        name: "vuepress-plugin-excalidraw-convert",
        extendsMarkdown(md: Markdown) {
            md.core.ruler.after('block','excalidraw--to-svg',(state)=>{
                const tokens = state.tokens;
                for (let i = tokens.length - 1; i >= 0; i--){
                    const token = tokens[i];
                    if (token.type === 'fence' && token.info === 'compressed-json'){
                        const jsonData = token.content.trim();
                        // if (app.page){
                        //     app.page.data.extractedJsonData = jsonData;
                        // }
                        state.src="<ExcalidrawSvg content='`${jsonData}`'></ExcalidrawSvg>"
                    }
                    
                }
                console.log(state.src);
            })

        }
    }
}
