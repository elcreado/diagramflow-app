import { memo, useCallback, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ImagePlus, X } from 'lucide-react';

export type MindMapNodeData = {
    label: string;
    variant: 'central' | 'branch' | 'leaf';
    image?: string;
    onLabelChange?: (id: string, label: string) => void;
    onImageAdd?: (id: string, image: string) => void;
    onImageRemove?: (id: string) => void;
};

function MindMapNode({ id, data, selected }: NodeProps) {
    const nodeData = data as unknown as MindMapNodeData;
    const variant = nodeData.variant || 'branch';
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
        <div
            className={`custom-node mindmap-node ${variant} ${selected ? 'selected' : ''}`}
        >
            <div className="node-content">
                <Handle type="target" position={Position.Left} />
                <textarea
                    className="node-label"
                    value={nodeData.label || ''}
                    onChange={handleLabelChange}
                    placeholder={
                        variant === 'central'
                            ? 'Tema central...'
                            : variant === 'branch'
                                ? 'Idea principal...'
                                : 'Detalle...'
                    }
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />
                {nodeData.image && (
                    <div className="node-inline-image">
                        <img src={nodeData.image} alt="Imagen" />
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
                <Handle type="source" position={Position.Right} />
            </div>
        </div>
    );
}

export default memo(MindMapNode);
