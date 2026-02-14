import { memo, useCallback } from 'react';
import type { NodeProps } from '@xyflow/react';
import ConnectionHandles from './ConnectionHandles';
import { getReadableTextColor, hexToRgba } from '../utils/color';

export type MindMapNodeData = {
    label: string;
    variant: 'central' | 'branch' | 'leaf';
    image?: string;
    color?: string;
    onLabelChange?: (id: string, label: string) => void;
};

function MindMapNode({ id, data, selected }: NodeProps) {
    const nodeData = data as unknown as MindMapNodeData;
    const variant = nodeData.variant || 'branch';
    const hasCustomColor = Boolean(nodeData.color);
    const textColor = hasCustomColor ? getReadableTextColor(nodeData.color!) : undefined;

    const handleLabelChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            nodeData.onLabelChange?.(id, e.target.value);
        },
        [id, nodeData]
    );

    return (
        <div
            className={`rounded-xl border-[1.5px] min-w-[120px] max-w-[280px] transition-fast cursor-default relative
                ${hasCustomColor
                    ? ''
                    : variant === 'central'
                        ? 'bg-gradient-to-br from-accent-primary to-[#6d28d9] border-transparent shadow-glow text-white hover:shadow-[0_0_28px_var(--accent-glow-strong)]'
                        : variant === 'branch'
                            ? 'bg-gradient-to-br from-success/5 to-success/5 border-success/25 hover:border-success/40'
                            : 'bg-gradient-to-br from-info/5 to-info/5 border-info/20 hover:border-info/40 min-w-[100px]'}
                ${selected && variant !== 'central' ? (variant === 'branch' ? '!border-success shadow-[0_0_0_2px_rgba(52,211,153,0.2)]' : '!border-info shadow-[0_0_0_2px_rgba(96,165,250,0.2)]') : ''}
                ${selected && variant === 'central' ? 'ring-2 ring-white/30' : ''}
            `}
            style={
                hasCustomColor
                    ? {
                        background: `linear-gradient(135deg, ${hexToRgba(nodeData.color!, 0.18)}, ${hexToRgba(nodeData.color!, 0.42)})`,
                        borderColor: hexToRgba(nodeData.color!, 0.58),
                        color: textColor,
                    }
                    : undefined
            }
        >
            <ConnectionHandles />

            <div className="p-3">
                <textarea
                    className={`text-[13px] font-medium text-center w-full bg-transparent border-none outline-none font-sans resize-none overflow-hidden leading-snug placeholder:text-text-muted block
                        ${variant === 'central' && !hasCustomColor ? 'text-white placeholder:text-white/50 text-[15px] font-semibold' : 'text-text-primary'}`}
                    style={hasCustomColor ? { color: textColor } : undefined}
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
                    <div className="w-full mt-2 rounded-sm overflow-hidden relative group">
                        <img src={nodeData.image} alt="Imagen" className="w-full max-h-[140px] object-cover block rounded-sm" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(MindMapNode);
