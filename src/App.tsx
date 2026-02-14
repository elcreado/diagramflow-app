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
import Sidebar, { type DiagramType } from './components/Sidebar';
import Toolbar from './components/Toolbar';
import DiagramCanvas from './components/DiagramCanvas';
import TitleBar from './components/TitleBar';
import WelcomeModal from './components/WelcomeModal';
import { exportToPdf } from './utils/exportPdf';

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [diagramType, setDiagramType] = useState<DiagramType>('concept');
    const [diagramTitle, setDiagramTitle] = useState('Mi Diagrama');
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

    // ── Node data helpers ──
    const updateNodeLabel = useCallback(
        (nodeId: string, label: string) => {
            setNodes((nds: Node[]) =>
                nds.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, label } } : node
                )
            );
        },
        [setNodes]
    );

    const addImageToNode = useCallback(
        (nodeId: string, image: string) => {
            setNodes((nds: Node[]) =>
                nds.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, image } } : node
                )
            );
        },
        [setNodes]
    );

    const removeImageFromNode = useCallback(
        (nodeId: string) => {
            setNodes((nds: Node[]) =>
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
        (type: string, position: { x: number; y: number }): Node => {
            const id = uuidv4();
            const baseData = {
                label: '',
                onLabelChange: updateNodeLabel,
                onImageAdd: addImageToNode,
                onImageRemove: removeImageFromNode,
            };

            switch (type) {
                case 'concept':
                    return {
                        id,
                        type: 'concept',
                        position,
                        data: { ...baseData, color: '#7c3aed' },
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
                case 'image':
                    return {
                        id,
                        type: 'image',
                        position,
                        data: { ...baseData },
                    };
                default:
                    return {
                        id,
                        type: 'concept',
                        position,
                        data: { ...baseData },
                    };
            }
        },
        [updateNodeLabel, addImageToNode, removeImageFromNode]
    );

    // ── Add node (centered or at click) ──
    const handleAddNode = useCallback(
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
            setNodes((nds: Node[]) => [...nds, node]);
        },
        [createNode, setNodes, nodes.length]
    );

    // ── Default add for current diagram type ──
    const handleAddDefaultNode = useCallback(() => {
        if (diagramType === 'concept') {
            handleAddNode('concept');
        } else {
            handleAddNode('mindmap-branch');
        }
    }, [diagramType, handleAddNode]);

    // ── Add image node ──
    const handleAddImageNode = useCallback(() => {
        handleAddNode('image');
    }, [handleAddNode]);

    // ── Connect edges ──
    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds: Edge[]) =>
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

    // ── Drag and drop from sidebar ──
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type || !reactFlowInstance.current) return;

            const position = reactFlowInstance.current.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const node = createNode(type, position);
            setNodes((nds: Node[]) => [...nds, node]);
        },
        [createNode, setNodes]
    );

    // ── Delete selected ──
    const handleDeleteSelected = useCallback(() => {
        setNodes((nds: Node[]) => nds.filter((n) => !n.selected));
        setEdges((eds: Edge[]) => eds.filter((e) => !e.selected));
    }, [setNodes, setEdges]);

    // ── Zoom controls ──
    const handleZoomIn = useCallback(() => {
        reactFlowInstance.current?.zoomIn();
    }, []);

    const handleZoomOut = useCallback(() => {
        reactFlowInstance.current?.zoomOut();
    }, []);

    const handleFitView = useCallback(() => {
        reactFlowInstance.current?.fitView({ padding: 0.2 });
    }, []);

    // ── Export PDF ──
    const handleExportPdf = useCallback(async () => {
        const el = document.querySelector('.react-flow') as HTMLElement;
        if (el) {
            await exportToPdf(el, diagramTitle);
        }
    }, [diagramTitle]);

    // ── New diagram ──
    const handleNewDiagram = useCallback(() => {
        setNodes([]);
        setEdges([]);
        setDiagramTitle('Mi Diagrama');
    }, [setNodes, setEdges]);

    // ── Save to JSON ──
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

    // ── Load from JSON ──
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

                    const loadedNodes: Node[] = data.nodes.map(
                        (n: Record<string, unknown>) => ({
                            ...n,
                            data: {
                                ...(n.data as Record<string, unknown>),
                                onLabelChange: updateNodeLabel,
                                onImageAdd: addImageToNode,
                                onImageRemove: removeImageFromNode,
                            },
                        })
                    );

                    setNodes(loadedNodes);
                    setEdges(data.edges || []);

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
    }, [setNodes, setEdges, updateNodeLabel, addImageToNode, removeImageFromNode]);

    // ── Init ──
    const onInit = useCallback((instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance;
    }, []);

    return (
        <div className="app-layout" style={{ flexDirection: 'column' }}>
            <TitleBar />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar
                    diagramType={diagramType}
                    onDiagramTypeChange={setDiagramType}
                    onAddNode={handleAddNode}
                    onExportPdf={handleExportPdf}
                    onNewDiagram={handleNewDiagram}
                    onSave={handleSave}
                    onLoad={handleLoad}
                />
                <div className="main-area">
                    <Toolbar
                        title={diagramTitle}
                        onTitleChange={setDiagramTitle}
                        onAddNode={handleAddDefaultNode}
                        onAddImage={handleAddImageNode}
                        onDeleteSelected={handleDeleteSelected}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onFitView={handleFitView}
                        nodeCount={nodes.length}
                        edgeCount={edges.length}
                    />
                    <DiagramCanvas
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onInit={onInit}
                    />
                </div>
            </div>
            {showWelcomeModal && (
                <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
            )}
        </div>
    );
}

export default App;
