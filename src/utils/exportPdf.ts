import type { Edge, Node, ReactFlowInstance } from '@xyflow/react';
import { jsPDF } from 'jspdf';
import { captureDiagramAsPng } from './captureDiagram';

type ExportPdfOptions = {
    nodes: Node[];
    edges: Edge[];
    reactFlowInstance?: ReactFlowInstance | null;
};

export async function exportToPdf(
    element: HTMLElement,
    title: string = 'Diagrama',
    options: ExportPdfOptions
): Promise<void> {
    try {
        const { dataUrl, width, height } = await captureDiagramAsPng({
            element,
            nodes: options.nodes,
            edges: options.edges,
            reactFlowInstance: options.reactFlowInstance,
        });

        const isLandscape = width > height;
        const pdf = new jsPDF({
            orientation: isLandscape ? 'landscape' : 'portrait',
            unit: 'px',
            format: [width, height],
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
        pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
}
