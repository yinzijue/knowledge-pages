export interface ExcalidrawElement {
    id: string;
    type: string;
    text?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    [key: string]: any;
}

export interface ExcalidrawData {
    type: string;
    version: number;
    elements: ExcalidrawElement[];
    appState: Record<string, any>;
}