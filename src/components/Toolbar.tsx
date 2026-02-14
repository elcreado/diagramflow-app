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
        <div className="h-toolbar bg-bg-secondary border-b border-border flex items-center px-4 gap-2 select-none shrink-0">
            <input
                className="bg-transparent border border-transparent rounded-sm px-2.5 py-1.5 text-sm font-semibold text-text-primary w-[240px] transition-fast hover:border-border focus:outline-none focus:border-accent-primary focus:bg-bg-tertiary"
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Nombre del diagrama..."
            />

            <div className="w-px h-7 bg-border mx-1" />

            <div className="flex items-center gap-0.5">
                <button className="flex items-center justify-center w-9 h-9 border-none rounded-sm bg-transparent text-text-secondary cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary active:scale-95" onClick={onAddNode} title="Agregar nodo">
                    <Plus size={18} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 border-none rounded-sm bg-transparent text-text-secondary cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary active:scale-95" onClick={onDeleteSelected} title="Eliminar seleccionado">
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="w-px h-7 bg-border mx-1" />

            <div className="flex items-center gap-0.5">
                <button className="flex items-center justify-center w-9 h-9 border-none rounded-sm bg-transparent text-text-secondary cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary active:scale-95" onClick={onZoomIn} title="Acercar">
                    <ZoomIn size={18} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 border-none rounded-sm bg-transparent text-text-secondary cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary active:scale-95" onClick={onZoomOut} title="Alejar">
                    <ZoomOut size={18} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 border-none rounded-sm bg-transparent text-text-secondary cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary active:scale-95" onClick={onFitView} title="Ajustar vista">
                    <Maximize size={18} />
                </button>
            </div>

            <div className="flex-1" />

            <div className="text-[11px] text-text-muted px-2.5 py-1 bg-bg-tertiary rounded-xl border border-border">
                {nodeCount} nodos · {edgeCount} conexiones
            </div>
        </div>
    );
}
