import LZString from 'lz-string';
import type { ExcalidrawData } from './types';
/**
 * 使用 LZ-String 解析 Obsidian Excalidraw 数据
 */
export function parseExcalidrawCompressed(compressedData: string): ExcalidrawData | null {
    try {
        // 1. 清理字符串
        const cleanData = compressedData.replace(/\s/g, '');
        // 2. 使用 LZString 解压 (一步完成 Base64 解码 + 解压)
        // 注意：如果是 Obsidian 插件生成的，通常使用 decompressFromBase64
        const decompressedString = LZString.decompressFromBase64(cleanData);
        if (!decompressedString) {
            throw new Error("解压结果为空，数据格式可能不匹配或数据已损坏");
        }
        // 3. JSON Parse
        // 注意：如果解压出来不是 JSON，说明数据源本身可能是二进制文本格式
        const jsonContent: ExcalidrawData = JSON.parse(decompressedString);
        return jsonContent;
    } catch (error) {
        console.error('解析失败:', error);
        // 如果 LZString 解压失败，可能需要检查是否是纯文本格式
        return null;
    }
}

export function extractTextElements(data: ExcalidrawData) {
    if (!data || !data.elements) return [];

    return data.elements
        .filter(el => el.type === 'text' && el.text)
        .map(el => ({
            id: el.id,
            text: el.text,
            position: { x: el.x, y: el.y }
        }));
}