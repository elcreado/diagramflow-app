import { useEffect, useRef } from 'react';

interface DiagramContextMenuProps {
    x: number;
    y: number;
    hasImage: boolean;
    nodeColor: string;
    onAddImage: () => void;
    onRemoveImage: () => void;
    onChangeColor: (color: string) => void;
    onClose: () => void;
}

export default function DiagramContextMenu({
    x,
    y,
    hasImage,
    nodeColor,
    onAddImage,
    onRemoveImage,
    onChangeColor,
    onClose,
}: DiagramContextMenuProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside or Escape
    useEffect(() => {
        const handleDocumentMouseDown = (event: MouseEvent) => {
            if (
                ref.current &&
                event.target instanceof Node &&
                !ref.current.contains(event.target)
            ) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleDocumentMouseDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleDocumentMouseDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="fixed bg-bg-secondary border border-border rounded-md p-1 min-w-[180px] shadow-lg z-[500] animate-[fadeIn_150ms_ease]"
            style={{ left: x, top: y }}
        >
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-[13px] text-text-secondary cursor-pointer transition-fast hover:bg-bg-hover hover:text-text-primary w-full text-left bg-transparent border-none" onClick={onAddImage}>
                Agregar imagen
            </button>
            <div className="h-px bg-border my-1" />
            <div className="flex items-center justify-between gap-2 px-3 py-2 text-[12px] text-text-muted">
                <span>Color del nodo</span>
                <input
                    type="color"
                    value={nodeColor}
                    onChange={(event) => onChangeColor(event.target.value)}
                    className="w-8 h-6 bg-transparent border border-border rounded-sm cursor-pointer"
                />
            </div>
            {hasImage && (
                <>
                    <div className="h-px bg-border my-1" />
                    <button
                        className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-[13px] text-error cursor-pointer transition-fast hover:bg-error/10 w-full text-left bg-transparent border-none"
                        onClick={onRemoveImage}
                    >
                        Quitar imagen
                    </button>
                </>
            )}
        </div>
    );
}
