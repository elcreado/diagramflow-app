import { useState, useCallback, useRef } from 'react';
import {
    type Node,
    type Edge,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type ReactFlowInstance,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { DiagramType } from '../types';

export function useDiagram() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [diagramType, setDiagramType] = useState<DiagramType>('concept');
    const [diagramTitle, setDiagramTitle] = useState('Mi Diagrama');
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

    // ── Node data helpers ──
    const updateNodeLabel = useCallback(
        (nodeId: string, label: string) => {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, label } } : node
                )
            );
        },
        [setNodes]
    );

    const addImageToNode = useCallback(
        (nodeId: string, image: string) => {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, image } } : node
                )
            );
        },
        [setNodes]
    );

    const removeImageFromNode = useCallback(
        (nodeId: string) => {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === nodeId
                        ? { ...node, data: { ...node.data, image: undefined } }
                        : node
                )
            );
        },
        [setNodes]
    );

    // ── Create node factory ──
    const createNode = useCallback(
        (type: string, position: { x: number; y: number }): Node | null => {
            const id = uuidv4();
            const baseData = {
                label: '',
                onLabelChange: updateNodeLabel,
            };

            switch (type) {
                case 'concept':
                    return {
                        id,
                        type: 'concept',
                        position,
                        data: { ...baseData },
                    };
                case 'mindmap-central':
                    return {
                        id,
                        type: 'mindmap',
                        position,
                        data: { ...baseData, variant: 'central' },
                    };
                case 'mindmap-branch':
                    return {
                        id,
                        type: 'mindmap',
                        position,
                        data: { ...baseData, variant: 'branch' },
                    };
                case 'mindmap-leaf':
                    return {
                        id,
                        type: 'mindmap',
                        position,
                        data: { ...baseData, variant: 'leaf' },
                    };
                default:
                    return null;
            }
        },
        [updateNodeLabel]
    );

    // ── Add node (centered or at click) ──
    const addNode = useCallback(
        (type: string) => {
            const viewport = reactFlowInstance.current?.getViewport();
            const centerX = viewport
                ? (-viewport.x + window.innerWidth / 2 - 130) / (viewport.zoom || 1)
                : 300;
            const centerY = viewport
                ? (-viewport.y + window.innerHeight / 2 - 50) / (viewport.zoom || 1)
                : 300;

            // Offset to avoid stacking
            const offset = (nodes.length % 5) * 40;
            const node = createNode(type, {
                x: centerX + offset,
                y: centerY + offset,
            });
            if (!node) return;
            setNodes((nds) => [...nds, node]);
        },
        [createNode, setNodes, nodes.length]
    );

    // ── Connect edges ──
    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) =>
                addEdge(
                    {
                        ...connection,
                        type: 'smoothstep',
                        animated: diagramType === 'mindmap',
                        style: { strokeWidth: 2 },
                    },
                    eds
                )
            );
        },
        [setEdges, diagramType]
    );

    // ── Delete selected ──
    const deleteSelected = useCallback(() => {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
    }, [setNodes, setEdges]);

    // ── Zoom controls ──
    const zoomIn = useCallback(() => {
        reactFlowInstance.current?.zoomIn();
    }, []);

    const zoomOut = useCallback(() => {
        reactFlowInstance.current?.zoomOut();
    }, []);

    const fitView = useCallback(() => {
        reactFlowInstance.current?.fitView({ padding: 0.2 });
    }, []);

    // ── Init ──
    const onInit = useCallback((instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance;
    }, []);

    return {
        // State
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        diagramType,
        setDiagramType,
        diagramTitle,
        setDiagramTitle,
        reactFlowInstance,

        // Actions
        addNode,
        createNode,
        onConnect,
        deleteSelected,
        updateNodeLabel,
        addImageToNode,
        removeImageFromNode,

        // Zoom
        zoomIn,
        zoomOut,
        fitView,
        onInit,
    };
}
