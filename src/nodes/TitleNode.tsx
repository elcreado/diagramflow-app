import { memo, useCallback } from 'react';
import type { NodeProps } from '@xyflow/react';
import ConnectionHandles from './ConnectionHandles';
import { getReadableTextColor, hexToRgba } from '../utils/color';

type TitleNodeData = {
    label: string;
    color?: string;
    onLabelChange?: (id: string, label: string) => void;
};

function TitleNode({ id, data, selected }: NodeProps) {
    const nodeData = data as unknown as TitleNodeData;
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
            className={`rounded-md min-w-[220px] max-w-[540px] transition-fast cursor-default relative border
                ${hasCustomColor ? '' : 'bg-gradient-to-r from-warning/10 to-accent-primary/10 border-warning/30'}
                ${selected ? 'shadow-[0_0_0_2px_var(--accent-glow)]' : ''}
            `}
            style={
                hasCustomColor
                    ? {
                        background: `linear-gradient(90deg, ${hexToRgba(nodeData.color!, 0.18)}, ${hexToRgba(nodeData.color!, 0.35)})`,
                        borderColor: hexToRgba(nodeData.color!, 0.52),
                        color: textColor,
                    }
                    : undefined
            }
        >
            <ConnectionHandles />
            <div className="px-4 py-3">
                <textarea
                    className="w-full bg-transparent border-none outline-none resize-none overflow-hidden text-center font-bold tracking-tight leading-tight text-[22px] text-text-primary"
                    style={hasCustomColor ? { color: textColor } : undefined}
                    value={nodeData.label || ''}
                    onChange={handleLabelChange}
                    placeholder="Titulo"
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                />
            </div>
        </div>
    );
}

export default memo(TitleNode);
