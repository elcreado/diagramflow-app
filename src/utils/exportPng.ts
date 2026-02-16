import type { Edge, Node, ReactFlowInstance } from '@xyflow/react';
import { captureDiagramAsPng } from './captureDiagram';

type ExportPngOptions = {
    nodes: Node[];
    edges: Edge[];
    reactFlowInstance?: ReactFlowInstance | null;
};

export async function exportToPng(
    element: HTMLElement,
    title: string = 'Diagrama',
    options: ExportPngOptions
): Promise<void> {
    const { dataUrl } = await captureDiagramAsPng({
        element,
        nodes: options.nodes,
        edges: options.edges,
        reactFlowInstance: options.reactFlowInstance,
    });

    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = `${title.replace(/\s+/g, '_')}.png`;
    anchor.click();
}
