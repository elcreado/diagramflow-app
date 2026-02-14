import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export type ConceptNodeData = {
    label: string;
    image?: string;
    onLabelChange?: (id: string, label: string) => void;
};

function ConceptNode({ id, data, selected }: NodeProps) {
    const nodeData = data as unknown as ConceptNodeData;

    const handleLabelChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            nodeData.onLabelChange?.(id, e.target.value);
        },
        [id, nodeData]
    );

    return (
        <div className={`custom-node concept-node ${selected ? 'selected' : ''}`}>
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
                    </div>
                )}
                <Handle type="source" position={Position.Bottom} />
            </div>
        </div>
    );
}

export default memo(ConceptNode);
