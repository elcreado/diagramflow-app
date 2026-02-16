import { useCallback, type MutableRefObject } from 'react';
import { Edge, Node, ReactFlowInstance, XYPosition } from '@xyflow/react';
import { exportToPng } from '../utils/exportPng';
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
    reactFlowInstance: MutableRefObject<ReactFlowInstance | null>;
    updateNodeLabel: (id: string, label: string) => void;
    withEditableEdgeData: (edge: Edge) => Edge;
    setContextMenu: (menu: any) => void;
    setFilePickerNodeId: (id: string | null) => void;
}

type ExportFormat = 'png' | 'pdf';

function isValidPoint(value: unknown): value is XYPosition {
    if (!value || typeof value !== 'object') return false;
    const point = value as Record<string, unknown>;
    return typeof point.x === 'number' && Number.isFinite(point.x) &&
        typeof point.y === 'number' && Number.isFinite(point.y);
}

function extractEdgePoints(edge: Edge): XYPosition[] {
    const edgeData = (edge.data as Record<string, unknown> | undefined) ?? {};
    const rawPoints = Array.isArray(edgeData.points) ? edgeData.points : [];
    return rawPoints.filter(isValidPoint);
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
    withEditableEdgeData,
    setContextMenu,
    setFilePickerNodeId,
}: UseFileIOProps) {
    const handleExportAs = useCallback(
        async (format: ExportFormat) => {
            const element = document.querySelector('.react-flow') as HTMLElement | null;
            if (!element) return;

            const exportOptions = {
                nodes,
                edges,
                reactFlowInstance: reactFlowInstance.current,
            };

            if (format === 'png') {
                await exportToPng(element, diagramTitle, exportOptions);
                return;
            }

            await exportToPdf(element, diagramTitle, exportOptions);
        },
        [diagramTitle, nodes, edges, reactFlowInstance]
    );

    const handleSave = useCallback(() => {
        const data = {
            title: diagramTitle,
            diagramType,
            nodes: nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position,
                data: {
                    label: (node.data as Record<string, unknown>).label,
                    variant: (node.data as Record<string, unknown>).variant,
                    color: (node.data as Record<string, unknown>).color,
                    image: (node.data as Record<string, unknown>).image,
                },
            })),
            edges: edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
                type: edge.type,
                animated: edge.animated,
                markerEnd: edge.markerEnd,
                data: {
                    points: extractEdgePoints(edge),
                },
            })),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${diagramTitle.replace(/\s+/g, '_')}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    }, [diagramTitle, diagramType, nodes, edges]);

    const handleLoad = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                try {
                    const data = JSON.parse(readerEvent.target?.result as string);
                    setDiagramTitle(data.title || 'Mi Diagrama');
                    setDiagramType(data.diagramType || 'concept');

                    const rawNodes = Array.isArray(data.nodes) ? data.nodes : [];
                    const rawEdges = Array.isArray(data.edges) ? data.edges : [];

                    const loadedNodes: Node[] = rawNodes
                        .filter((node: Record<string, unknown>) => node.type !== 'image')
                        .map((node: Record<string, unknown>) => ({
                            ...(node as Node),
                            data: {
                                ...(node.data as Record<string, unknown>),
                                onLabelChange: updateNodeLabel,
                            },
                        }));

                    const availableNodeIds = new Set(loadedNodes.map((node) => node.id));
                    const loadedEdges: Edge[] = rawEdges
                        .filter(
                            (edge: Record<string, unknown>) =>
                                availableNodeIds.has(edge.source as string) &&
                                availableNodeIds.has(edge.target as string)
                        )
                        .map((edge: Record<string, unknown>) => {
                            const edgeData =
                                (edge.data as Record<string, unknown> | undefined) ?? {};
                            const points = Array.isArray(edgeData.points)
                                ? edgeData.points.filter(isValidPoint)
                                : [];

                            return withEditableEdgeData({
                                ...(edge as Edge),
                                type: 'editable',
                                data: {
                                    ...edgeData,
                                    points,
                                },
                            });
                        });

                    setNodes(loadedNodes);
                    setEdges(loadedEdges);

                    setTimeout(() => {
                        reactFlowInstance.current?.fitView({ padding: 0.2 });
                    }, 100);
                } catch (error) {
                    console.error('Error loading diagram:', error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }, [
        setNodes,
        setEdges,
        updateNodeLabel,
        withEditableEdgeData,
        setDiagramTitle,
        setDiagramType,
        reactFlowInstance,
    ]);

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
        handleExportAs,
        handleNewDiagram,
    };
}
