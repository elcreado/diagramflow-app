import {
    Plus,
    Trash2,
    ZoomIn,
    ZoomOut,
    Maximize,
} from 'lucide-react';

type ToolbarProps = {
    title: string;
    onTitleChange: (title: string) => void;
    onAddNode: () => void;
    onDeleteSelected: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitView: () => void;
    nodeCount: number;
    edgeCount: number;
};

export default function Toolbar({
    title,
    onTitleChange,
    onAddNode,
    onDeleteSelected,
    onZoomIn,
    onZoomOut,
    onFitView,
    nodeCount,
    edgeCount,
}: ToolbarProps) {
    return (
        <div className="toolbar">
            <input
                className="toolbar-title-input"
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Nombre del diagrama..."
            />

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button className="toolbar-btn" onClick={onAddNode} title="Agregar nodo">
                    <Plus size={18} />
                </button>
                <button className="toolbar-btn" onClick={onDeleteSelected} title="Eliminar seleccionado">
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button className="toolbar-btn" onClick={onZoomIn} title="Acercar">
                    <ZoomIn size={18} />
                </button>
                <button className="toolbar-btn" onClick={onZoomOut} title="Alejar">
                    <ZoomOut size={18} />
                </button>
                <button className="toolbar-btn" onClick={onFitView} title="Ajustar vista">
                    <Maximize size={18} />
                </button>
            </div>

            <div className="toolbar-spacer" />

            <div className="toolbar-badge">
                {nodeCount} nodos · {edgeCount} conexiones
            </div>
        </div>
    );
}
