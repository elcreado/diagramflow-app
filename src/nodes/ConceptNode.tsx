import { memo, useCallback, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ImagePlus, X } from 'lucide-react';

export type ConceptNodeData = {
    label: string;
    image?: string;
    color?: string;
    onLabelChange?: (id: string, label: string) => void;
    onImageAdd?: (id: string, image: string) => void;
    onImageRemove?: (id: string) => void;
};

function ConceptNode({ id, data, selected }: NodeProps) {
    const nodeData = data as unknown as ConceptNodeData;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLabelChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            nodeData.onLabelChange?.(id, e.target.value);
        },
        [id, nodeData]
    );

    const handleImageSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    nodeData.onImageAdd?.(id, ev.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        [id, nodeData]
    );

    return (
        <div className={`custom-node concept-node ${selected ? 'selected' : ''}`}>
            {nodeData.color && (
                <div className="node-color-bar" style={{ background: nodeData.color }} />
            )}
            <div className="node-header">
                <span className="node-header-label">Concepto</span>
            </div>
            <div className="node-content">
                <Handle type="target" position={Position.Top} />
                <textarea
                    className="node-label"
                    value={nodeData.label || ''}
                    onChange={handleLabelChange}
                    placeholder="Escribe aquí..."
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />
                {nodeData.image && (
                    <div className="node-inline-image">
                        <img src={nodeData.image} alt="Imagen del nodo" />
                        <button
                            className="image-remove-btn"
                            onClick={() => nodeData.onImageRemove?.(id)}
                        >
                            <X size={10} />
                        </button>
                    </div>
                )}
                {!nodeData.image && (
                    <>
                        <button
                            className="add-image-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImagePlus size={12} /> Imagen
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageSelect}
                        />
                    </>
                )}
                <Handle type="source" position={Position.Bottom} />
            </div>
        </div>
    );
}

export default memo(ConceptNode);
