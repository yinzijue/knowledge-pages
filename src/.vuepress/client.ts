// /src/.vuepress/client.ts
import {defineClientConfig} from "vuepress/client";
import ExcalidrawSvg from "./components/ExcalidrawSvg.vue"
export default defineClientConfig({
    enhance({app}) {
        app.component("ExcalidrawSvg", ExcalidrawSvg)
    }
})