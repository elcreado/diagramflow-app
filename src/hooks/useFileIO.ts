import { useCallback } from 'react';
import { Node, Edge, ReactFlowInstance } from '@xyflow/react';
import { exportToPdf } from '../utils/exportPdf';
import { DiagramType } from '../types';

interface UseFileIOProps {
    nodes: Node[];
    edges: Edge[];
    diagramTitle: string;
    diagramType: DiagramType;
    setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
    setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
    setDiagramTitle: (title: string) => void;
    setDiagramType: (type: DiagramType) => void;
    reactFlowInstance: React.MutableRefObject<ReactFlowInstance | null>;
    updateNodeLabel: (id: string, label: string) => void;
    setContextMenu: (menu: any) => void; // Add this to reset context menu
    setFilePickerNodeId: (id: string | null) => void;
}

export function useFileIO({
    nodes,
    edges,
    diagramTitle,
    diagramType,
    setNodes,
    setEdges,
    setDiagramTitle,
    setDiagramType,
    reactFlowInstance,
    updateNodeLabel,
    setContextMenu,
    setFilePickerNodeId
}: UseFileIOProps) {

    const handleExportPdf = useCallback(async () => {
        const el = document.querySelector('.react-flow') as HTMLElement;
        if (el) {
            await exportToPdf(el, diagramTitle);
        }
    }, [diagramTitle]);

    const handleSave = useCallback(() => {
        const data = {
            title: diagramTitle,
            diagramType,
            nodes: nodes.map((n) => ({
                id: n.id,
                type: n.type,
                position: n.position,
                data: {
                    label: (n.data as Record<string, unknown>).label,
                    variant: (n.data as Record<string, unknown>).variant,
                    color: (n.data as Record<string, unknown>).color,
                    image: (n.data as Record<string, unknown>).image,
                },
            })),
            edges: edges.map((e) => ({
                id: e.id,
                source: e.source,
                target: e.target,
                type: e.type,
                animated: e.animated,
            })),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${diagramTitle.replace(/\s+/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [diagramTitle, diagramType, nodes, edges]);

    const handleLoad = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target?.result as string);
                    setDiagramTitle(data.title || 'Mi Diagrama');
                    setDiagramType(data.diagramType || 'concept');

                    const rawNodes = Array.isArray(data.nodes) ? data.nodes : [];
                    const rawEdges = Array.isArray(data.edges) ? data.edges : [];

                    const loadedNodes: Node[] = rawNodes
                        .filter((n: Record<string, unknown>) => n.type !== 'image')
                        .map((n: Record<string, unknown>) => ({
                            ...n,
                            data: {
                                ...(n.data as Record<string, unknown>),
                                onLabelChange: updateNodeLabel,
                            },
                        }));

                    const availableIds = new Set(loadedNodes.map((node) => node.id));
                    const loadedEdges: Edge[] = rawEdges.filter(
                        (e: Record<string, unknown>) =>
                            availableIds.has(e.source as string) &&
                            availableIds.has(e.target as string)
                    ) as Edge[];

                    setNodes(loadedNodes);
                    setEdges(loadedEdges);

                    setTimeout(() => {
                        reactFlowInstance.current?.fitView({ padding: 0.2 });
                    }, 100);
                } catch (err) {
                    console.error('Error loading diagram:', err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }, [setNodes, setEdges, updateNodeLabel, setDiagramTitle, setDiagramType, reactFlowInstance]);

    const handleNewDiagram = useCallback(() => {
        setNodes([]);
        setEdges([]);
        setDiagramTitle('Mi Diagrama');
        setContextMenu(null);
        setFilePickerNodeId(null);
    }, [setNodes, setEdges, setDiagramTitle, setContextMenu, setFilePickerNodeId]);

    return {
        handleSave,
        handleLoad,
        handleExportPdf,
        handleNewDiagram
    };
}
