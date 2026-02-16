import { useCallback, useRef, useState } from 'react';
import type { OnConnectStart, OnConnectEnd, OnConnect } from '@xyflow/react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import DiagramCanvas from './components/DiagramCanvas';
import TitleBar from './components/TitleBar';
import WelcomeModal from './components/WelcomeModal';
import DiagramContextMenu from './components/DiagramContextMenu';
import { useDiagram } from './hooks/useDiagram';
import { useContextMenu } from './hooks/useContextMenu';
import { useFileIO } from './hooks/useFileIO';

function App() {
    const {
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        diagramType, setDiagramType,
        diagramTitle, setDiagramTitle,
        addNode, createNode,
        onConnect, deleteSelected,
        zoomIn, zoomOut, fitView,
        onInit,
        reactFlowInstance,
        updateNodeLabel,
        updateNodeColor,
        addImageToNode, removeImageFromNode,
        withEditableEdgeData
    } = useDiagram();

    const {
        contextMenu,
        setContextMenu,
        onNodeContextMenu,
        onPaneClick,
        closeContextMenu
    } = useContextMenu();

    const [filePickerNodeId, setFilePickerNodeId] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [activeTool, setActiveTool] = useState<'pointer' | 'connect'>('pointer');
    const [isConnecting, setIsConnecting] = useState(false);

    const { handleSave, handleLoad, handleExportAs, handleNewDiagram } = useFileIO({
        nodes, edges, diagramTitle, diagramType,
        setNodes, setEdges, setDiagramTitle, setDiagramType,
        reactFlowInstance, updateNodeLabel, withEditableEdgeData, setContextMenu, setFilePickerNodeId
    });

    // ── Image Handling ──
    const handleAddImageFromContextMenu = useCallback(() => {
        if (!contextMenu) return;
        setFilePickerNodeId(contextMenu.nodeId);
        closeContextMenu();
        requestAnimationFrame(() => {
            imageInputRef.current?.click();
        });
    }, [contextMenu, closeContextMenu]);

    const handleRemoveImageFromContextMenu = useCallback(() => {
        if (!contextMenu) return;
        removeImageFromNode(contextMenu.nodeId);
        closeContextMenu();
    }, [contextMenu, removeImageFromNode, closeContextMenu]);

    const handleNodeColorChange = useCallback(
        (color: string) => {
            if (!contextMenu) return;
            updateNodeColor(contextMenu.nodeId, color);
        },
        [contextMenu, updateNodeColor]
    );

    const handleImageInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file || !filePickerNodeId) {
                setFilePickerNodeId(null);
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                addImageToNode(filePickerNodeId, ev.target?.result as string);
                setFilePickerNodeId(null);
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        },
        [filePickerNodeId, addImageToNode]
    );

    // ── Drag and Drop ──
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type || !reactFlowInstance.current) return;
            if (type === 'connection') {
                const dropTarget = (event.target as HTMLElement | null)?.closest('.react-flow__node');
                if (!dropTarget) return;
                setActiveTool('connect');
                return;
            }

            const position = reactFlowInstance.current.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const node = createNode(type, position);
            if (!node) return;
            setNodes((nds) => [...nds, node]);
        },
        [createNode, reactFlowInstance, setNodes]
    );

    // ── Default add for current diagram type ──
    const handleAddDefaultNode = useCallback(() => {
        if (diagramType === 'concept') {
            addNode('concept');
        } else {
            addNode('mindmap-branch');
        }
    }, [diagramType, addNode]);

    const selectedContextNode = contextMenu
        ? nodes.find((node) => node.id === contextMenu.nodeId)
        : null;
    const selectedContextNodeHasImage = Boolean(
        selectedContextNode &&
        (selectedContextNode.data as Record<string, unknown>).image
    );

    const onConnectStart: OnConnectStart = useCallback(() => {
        setIsConnecting(true);
    }, []);

    const onConnectEnd: OnConnectEnd = useCallback(() => {
        setIsConnecting(false);
    }, []);

    const handleConnect: OnConnect = useCallback(
        (connection) => {
            onConnect(connection);
            setIsConnecting(false);
            setActiveTool('pointer');
        },
        [onConnect]
    );

    return (
        <div className="flex h-screen w-screen bg-bg-primary flex-col overflow-hidden text-text-primary font-sans antialiased">
            <TitleBar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    diagramType={diagramType}
                    onDiagramTypeChange={setDiagramType}
                    onAddNode={addNode}
                    onActivateConnectTool={() => setActiveTool('connect')}
                    onExportAs={handleExportAs}
                    onNewDiagram={handleNewDiagram}
                    onSave={handleSave}
                    onLoad={handleLoad}
                />
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <Toolbar
                        title={diagramTitle}
                        onTitleChange={setDiagramTitle}
                        onAddNode={handleAddDefaultNode}
                        onDeleteSelected={deleteSelected}
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onFitView={fitView}
                        nodeCount={nodes.length}
                        edgeCount={edges.length}
                        activeTool={activeTool}
                        setActiveTool={setActiveTool}
                    />
                    <div className={`flex-1 h-full w-full relative ${activeTool === 'connect' ? 'mode-connect' : ''} ${isConnecting ? 'is-connecting' : ''}`}>
                        <DiagramCanvas
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={handleConnect}
                            onConnectStart={onConnectStart}
                            onConnectEnd={onConnectEnd}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onInit={onInit}
                            onNodeContextMenu={onNodeContextMenu}
                            onPaneClick={onPaneClick}
                        />
                    </div>
                </div>
            </div>
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageInputChange}
            />
            {contextMenu && (
                <DiagramContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    hasImage={selectedContextNodeHasImage}
                    nodeColor={((selectedContextNode?.data as Record<string, unknown>)?.color as string) || '#7c3aed'}
                    onAddImage={handleAddImageFromContextMenu}
                    onRemoveImage={handleRemoveImageFromContextMenu}
                    onChangeColor={handleNodeColorChange}
                    onClose={closeContextMenu}
                />
            )}
            {showWelcomeModal && (
                <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
            )}
        </div>
    );
}

export default App;
