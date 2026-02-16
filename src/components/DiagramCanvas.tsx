import { useCallback, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    BackgroundVariant,
    type ReactFlowInstance,
    type NodeMouseHandler,
    type OnConnectStart,
    type OnConnectEnd,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ConceptNode from '../nodes/ConceptNode';
import MindMapNode from '../nodes/MindMapNode';
import TitleNode from '../nodes/TitleNode';
import EditableEdge from '../nodes/EditableEdge';

import { Network } from 'lucide-react';

const nodeTypes = {
    concept: ConceptNode,
    mindmap: MindMapNode,
    title: TitleNode,
};

const edgeTypes = {
    editable: EditableEdge,
};

type DiagramCanvasProps = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    onDrop: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
    onInit: (instance: ReactFlowInstance) => void;
    onNodeContextMenu: (nodeId: string, x: number, y: number) => void;
    onPaneClick: () => void;
    onConnectStart: OnConnectStart;
    onConnectEnd: OnConnectEnd;
};

export default function DiagramCanvas({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    onInit,
    onNodeContextMenu,
    onPaneClick,
    onConnectStart,
    onConnectEnd,
}: DiagramCanvasProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            onDrop(event);
        },
        [onDrop]
    );

    const handleNodeContextMenu = useCallback<NodeMouseHandler<Node>>(
        (event, node) => {
            event.preventDefault();
            onNodeContextMenu(node.id, event.clientX, event.clientY);
        },
        [onNodeContextMenu]
    );

    return (
        <div className="flex-1 relative overflow-hidden h-full w-full" ref={reactFlowWrapper}>
            {nodes.length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                    <div className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-40">
                        <Network size={64} />
                    </div>
                    <h3 className="text-lg font-semibold text-text-muted mb-1.5">Comienza tu diagrama</h3>
                    <p className="text-[13px] text-text-muted opacity-70">Arrastra un elemento desde la barra lateral o haz clic en "+" para comenzar</p>
                </div>
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={handleDrop}
                onDragOver={onDragOver}
                onInit={onInit}
                onNodeContextMenu={handleNodeContextMenu}
                onPaneClick={onPaneClick}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                snapToGrid
                snapGrid={[16, 16]}
                deleteKeyCode={['Backspace', 'Delete']}
                multiSelectionKeyCode="Shift"
                elevateEdgesOnSelect
                defaultEdgeOptions={{
                    type: 'editable',
                    animated: false,
                    style: { strokeWidth: 2 },
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="rgba(255,255,255,0.04)"
                />
                <Controls
                    showZoom={false}
                    showFitView={false}
                    showInteractive={false}
                    className="!bg-bg-secondary !border-border !rounded-md !shadow-md overflow-hidden [&>button]:!bg-bg-secondary [&>button]:!border-none [&>button]:!border-b [&>button]:!border-border [&>button]:!text-text-secondary [&>button]:!fill-text-secondary hover:[&>button]:!bg-bg-hover"
                />
                <MiniMap
                    nodeStrokeWidth={3}
                    position="bottom-right"
                    style={{
                        width: 160,
                        height: 100,
                    }}
                    maskColor="rgba(22, 22, 30, 0.7)"
                    nodeColor={(node) => ((node.data as Record<string, unknown>)?.color as string) || '#7c3aed'}
                    className="!bg-bg-secondary !border-border !rounded-md overflow-hidden"
                />
            </ReactFlow>
        </div>
    );
}
