import {
    Network,
    GitBranch,
    BoxSelect,
    CircleDot,
    Circle,
    FileDown,
    FilePlus,
    Save,
    FolderOpen,
} from 'lucide-react';

import { DiagramType } from '../types';

type SidebarProps = {
    diagramType: DiagramType;
    onDiagramTypeChange: (type: DiagramType) => void;
    onAddNode: (type: string) => void;
    onExportPdf: () => void;
    onNewDiagram: () => void;
    onSave: () => void;
    onLoad: () => void;
};

export default function Sidebar({
    diagramType,
    onDiagramTypeChange,
    onAddNode,
    onExportPdf,
    onNewDiagram,
    onSave,
    onLoad,
}: SidebarProps) {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-sidebar h-full bg-bg-secondary border-r border-border flex flex-col select-none shrink-0 min-h-0 z-10">
            {/* Logo */}
            <div className="px-[18px] py-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-md flex items-center justify-center text-white shadow-glow">
                        <Network size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-base font-bold text-text-primary tracking-tight leading-tight">DiagramFlow</h1>
                        <span className="text-[11px] text-text-muted font-normal">Mapas y Diagramas</span>
                    </div>
                </div>
            </div>

            {/* Diagram Type Selector */}
            <div className="px-3.5 py-4 border-b border-border">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2.5 px-1">Tipo de diagrama</div>
                <div className="flex gap-1.5">
                    <button
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 border rounded-md text-xs font-medium cursor-pointer transition-fast
                        ${diagramType === 'concept'
                                ? 'border-accent-primary bg-accent-glow text-accent-tertiary shadow-glow'
                                : 'border-border bg-bg-tertiary text-text-secondary hover:border-border-hover hover:bg-bg-hover hover:text-text-primary'}`}
                        onClick={() => onDiagramTypeChange('concept')}
                    >
                        <Network size={14} />
                        Conceptual
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 border rounded-md text-xs font-medium cursor-pointer transition-fast
                        ${diagramType === 'mindmap'
                                ? 'border-accent-primary bg-accent-glow text-accent-tertiary shadow-glow'
                                : 'border-border bg-bg-tertiary text-text-secondary hover:border-border-hover hover:bg-bg-hover hover:text-text-primary'}`}
                        onClick={() => onDiagramTypeChange('mindmap')}
                    >
                        <GitBranch size={14} />
                        Mental
                    </button>
                </div>
            </div>

            {/* Node Palette */}
            <div className="px-3.5 py-4 border-b border-border flex-1 overflow-y-auto min-h-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2.5 px-1">Elementos</div>
                <div className="flex flex-col gap-1">
                    {diagramType === 'concept' ? (
                        <>
                            <div
                                className="flex items-center gap-2.5 p-2.5 rounded-sm cursor-grab transition-fast border border-transparent hover:bg-bg-hover hover:border-border-hover active:cursor-grabbing active:scale-95"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'concept')}
                                onClick={() => onAddNode('concept')}
                            >
                                <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-accent-primary/15 text-accent-secondary">
                                    <BoxSelect size={16} />
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-text-primary">Concepto</div>
                                    <div className="text-[11px] text-text-muted">Nodo rectangular</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="flex items-center gap-2.5 p-2.5 rounded-sm cursor-grab transition-fast border border-transparent hover:bg-bg-hover hover:border-border-hover active:cursor-grabbing active:scale-95"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'mindmap-central')}
                                onClick={() => onAddNode('mindmap-central')}
                            >
                                <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-success/15 text-success">
                                    <CircleDot size={16} />
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-text-primary">Tema Central</div>
                                    <div className="text-[11px] text-text-muted">Nodo raíz del mapa</div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-2.5 p-2.5 rounded-sm cursor-grab transition-fast border border-transparent hover:bg-bg-hover hover:border-border-hover active:cursor-grabbing active:scale-95"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'mindmap-branch')}
                                onClick={() => onAddNode('mindmap-branch')}
                            >
                                <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-success/15 text-success">
                                    <GitBranch size={16} />
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-text-primary">Rama</div>
                                    <div className="text-[11px] text-text-muted">Idea principal</div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-2.5 p-2.5 rounded-sm cursor-grab transition-fast border border-transparent hover:bg-bg-hover hover:border-border-hover active:cursor-grabbing active:scale-95"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'mindmap-leaf')}
                                onClick={() => onAddNode('mindmap-leaf')}
                            >
                                <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-info/15 text-info">
                                    <Circle size={16} />
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-text-primary">Hoja</div>
                                    <div className="text-[11px] text-text-muted">Detalle o subtema</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto p-3.5 border-t border-border flex flex-col gap-1.5">
                <button
                    className="flex items-center gap-2.5 p-2.5 sm:px-3.5 border border-border rounded-md bg-bg-tertiary text-text-secondary text-[13px] font-medium cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary hover:border-border-hover w-full"
                    onClick={onNewDiagram}
                >
                    <FilePlus size={16} /> Nuevo diagrama
                </button>
                <button
                    className="flex items-center gap-2.5 p-2.5 sm:px-3.5 border border-border rounded-md bg-bg-tertiary text-text-secondary text-[13px] font-medium cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary hover:border-border-hover w-full"
                    onClick={onSave}
                >
                    <Save size={16} /> Guardar (JSON)
                </button>
                <button
                    className="flex items-center gap-2.5 p-2.5 sm:px-3.5 border border-border rounded-md bg-bg-tertiary text-text-secondary text-[13px] font-medium cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary hover:border-border-hover w-full"
                    onClick={onLoad}
                >
                    <FolderOpen size={16} /> Cargar diagrama
                </button>
                <button
                    className="flex items-center gap-2.5 p-2.5 sm:px-3.5 border border-transparent rounded-md bg-gradient-to-br from-accent-primary to-[#6d28d9] text-white text-[13px] font-medium cursor-pointer transition-fast hover:shadow-[0_0_28px_var(--accent-glow-strong)] hover:-translate-y-px shadow-glow w-full"
                    onClick={onExportPdf}
                >
                    <FileDown size={16} /> Exportar PDF
                </button>
            </div>
        </aside>
    );
}
