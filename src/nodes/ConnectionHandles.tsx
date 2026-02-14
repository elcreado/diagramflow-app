import { Handle, Position } from '@xyflow/react';

const sides = [
    { id: 'top', position: Position.Top, modifier: 'top' },
    { id: 'right', position: Position.Right, modifier: 'right' },
    { id: 'bottom', position: Position.Bottom, modifier: 'bottom' },
    { id: 'left', position: Position.Left, modifier: 'left' },
] as const;

export default function ConnectionHandles() {
    return (
        <>
            {sides.map((side) => (
                <Handle
                    key={`source-${side.id}`}
                    id={side.id}
                    type="source"
                    position={side.position}
                    className={`custom-side-handle custom-side-handle--${side.modifier} custom-source-handle`}
                />
            ))}
            {sides.map((side) => (
                <Handle
                    key={`target-${side.id}`}
                    id={side.id}
                    type="target"
                    position={side.position}
                    className={`custom-side-handle custom-side-handle--${side.modifier} custom-target-handle`}
                />
            ))}
        </>
    );
}
