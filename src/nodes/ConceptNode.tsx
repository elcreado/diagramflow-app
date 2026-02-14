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
        <div className={`rounded-md border-[1.5px] border-transparent bg-bg-secondary min-w-[140px] max-w-[280px] transition-fast cursor-default relative 
            bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 
            hover:from-accent-primary/10 hover:to-accent-secondary/10 hover:shadow-md
            ${selected ? '!border-accent-primary shadow-[0_0_0_2px_var(--accent-glow),0_0_20px_var(--accent-glow)]' : ''}`}>
            <div className="p-3">
                <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-bg-active !border-2 !border-bg-secondary hover:!bg-accent-primary hover:!scale-125 transition-fast" />
                <textarea
                    className="text-[13px] font-medium text-text-primary text-center w-full bg-transparent border-none outline-none font-sans resize-none overflow-hidden leading-snug placeholder:text-text-muted block"
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
                    <div className="w-full mt-2 rounded-sm overflow-hidden relative group">
                        <img src={nodeData.image} alt="Imagen del nodo" className="w-full max-h-[140px] object-cover block rounded-sm" />
                    </div>
                )}
                <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-bg-active !border-2 !border-bg-secondary hover:!bg-accent-primary hover:!scale-125 transition-fast" />
            </div>
        </div>
    );
}

export default memo(ConceptNode);
