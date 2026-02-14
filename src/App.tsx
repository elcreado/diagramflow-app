import { useCallback, useRef, useState } from 'react';
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
        addImageToNode, removeImageFromNode
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

    const { handleSave, handleLoad, handleExportPdf, handleNewDiagram } = useFileIO({
        nodes, edges, diagramTitle, diagramType,
        setNodes, setEdges, setDiagramTitle, setDiagramType,
        reactFlowInstance, updateNodeLabel, setContextMenu, setFilePickerNodeId
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

            const position = reactFlowInstance.current.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const node = createNode(type, position);
            if (!node) return;
            setNodes((nds) => [...nds, node]);
        },
        [createNode, setNodes]
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

    return (
        <div className="app-layout" style={{ flexDirection: 'column' }}>
            <TitleBar />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar
                    diagramType={diagramType}
                    onDiagramTypeChange={setDiagramType}
                    onAddNode={addNode}
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
                        onDeleteSelected={deleteSelected}
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onFitView={fitView}
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
                        onNodeContextMenu={onNodeContextMenu}
                        onPaneClick={onPaneClick}
                    />
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
                    onAddImage={handleAddImageFromContextMenu}
                    onRemoveImage={handleRemoveImageFromContextMenu}
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
