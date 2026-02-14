import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export type MindMapNodeData = {
    label: string;
    variant: 'central' | 'branch' | 'leaf';
    image?: string;
    onLabelChange?: (id: string, label: string) => void;
};

function MindMapNode({ id, data, selected }: NodeProps) {
    const nodeData = data as unknown as MindMapNodeData;
    const variant = nodeData.variant || 'branch';

    const handleLabelChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            nodeData.onLabelChange?.(id, e.target.value);
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
                    </div>
                )}
                <Handle type="source" position={Position.Right} />
            </div>
        </div>
    );
}

export default memo(MindMapNode);
