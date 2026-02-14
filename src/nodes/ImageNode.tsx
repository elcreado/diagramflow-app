import { memo, useCallback, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ImagePlus, X } from 'lucide-react';

export type ImageNodeData = {
    label: string;
    image?: string;
    onLabelChange?: (id: string, label: string) => void;
    onImageAdd?: (id: string, image: string) => void;
    onImageRemove?: (id: string) => void;
};

function ImageNode({ id, data, selected }: NodeProps) {
    const nodeData = data as unknown as ImageNodeData;
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
        <div className={`custom-node image-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Top} />
            <div className="node-image-wrapper">
                {nodeData.image ? (
                    <>
                        <img className="node-image" src={nodeData.image} alt={nodeData.label || 'Imagen'} />
                        <button
                            className="image-remove-btn"
                            onClick={() => nodeData.onImageRemove?.(id)}
                        >
                            <X size={12} />
                        </button>
                    </>
                ) : (
                    <div
                        className="node-image-placeholder"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImagePlus size={28} />
                        <span>Click para agregar imagen</span>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageSelect}
                />
            </div>
            <div className="node-content">
                <textarea
                    className="node-label"
                    value={nodeData.label || ''}
                    onChange={handleLabelChange}
                    placeholder="Pie de imagen..."
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export default memo(ImageNode);
