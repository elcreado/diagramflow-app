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
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Network size={20} />
                    </div>
                    <div className="sidebar-logo-text">
                        <h1>DiagramFlow</h1>
                        <span>Mapas y Diagramas</span>
                    </div>
                </div>
            </div>

            {/* Diagram Type Selector */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">Tipo de diagrama</div>
                <div className="diagram-type-group">
                    <button
                        className={`diagram-type-btn ${diagramType === 'concept' ? 'active' : ''}`}
                        onClick={() => onDiagramTypeChange('concept')}
                    >
                        <Network size={14} />
                        Conceptual
                    </button>
                    <button
                        className={`diagram-type-btn ${diagramType === 'mindmap' ? 'active' : ''}`}
                        onClick={() => onDiagramTypeChange('mindmap')}
                    >
                        <GitBranch size={14} />
                        Mental
                    </button>
                </div>
            </div>

            {/* Node Palette */}
            <div className="sidebar-section sidebar-scroll-section">
                <div className="sidebar-section-title">Elementos</div>
                <div className="node-palette">
                    {diagramType === 'concept' ? (
                        <>
                            <div
                                className="node-palette-item"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'concept')}
                                onClick={() => onAddNode('concept')}
                            >
                                <div className="node-palette-icon concept">
                                    <BoxSelect size={16} />
                                </div>
                                <div>
                                    <div className="node-palette-label">Concepto</div>
                                    <div className="node-palette-desc">Nodo rectangular</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="node-palette-item"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'mindmap-central')}
                                onClick={() => onAddNode('mindmap-central')}
                            >
                                <div className="node-palette-icon mindmap">
                                    <CircleDot size={16} />
                                </div>
                                <div>
                                    <div className="node-palette-label">Tema Central</div>
                                    <div className="node-palette-desc">Nodo raíz del mapa</div>
                                </div>
                            </div>
                            <div
                                className="node-palette-item"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'mindmap-branch')}
                                onClick={() => onAddNode('mindmap-branch')}
                            >
                                <div className="node-palette-icon mindmap">
                                    <GitBranch size={16} />
                                </div>
                                <div>
                                    <div className="node-palette-label">Rama</div>
                                    <div className="node-palette-desc">Idea principal</div>
                                </div>
                            </div>
                            <div
                                className="node-palette-item"
                                draggable
                                onDragStart={(e) => onDragStart(e, 'mindmap-leaf')}
                                onClick={() => onAddNode('mindmap-leaf')}
                            >
                                <div className="node-palette-icon image">
                                    <Circle size={16} />
                                </div>
                                <div>
                                    <div className="node-palette-label">Hoja</div>
                                    <div className="node-palette-desc">Detalle o subtema</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="sidebar-actions">
                <button className="sidebar-btn" onClick={onNewDiagram}>
                    <FilePlus size={16} /> Nuevo diagrama
                </button>
                <button className="sidebar-btn" onClick={onSave}>
                    <Save size={16} /> Guardar (JSON)
                </button>
                <button className="sidebar-btn" onClick={onLoad}>
                    <FolderOpen size={16} /> Cargar diagrama
                </button>
                <button className="sidebar-btn primary" onClick={onExportPdf}>
                    <FileDown size={16} /> Exportar PDF
                </button>
            </div>
        </aside>
    );
}
