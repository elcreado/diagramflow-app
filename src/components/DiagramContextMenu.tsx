import { useEffect, useRef } from 'react';

interface DiagramContextMenuProps {
    x: number;
    y: number;
    hasImage: boolean;
    onAddImage: () => void;
    onRemoveImage: () => void;
    onClose: () => void;
}

export default function DiagramContextMenu({
    x,
    y,
    hasImage,
    onAddImage,
    onRemoveImage,
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
            className="context-menu"
            style={{ left: x, top: y }}
        >
            <button className="context-menu-item" onClick={onAddImage}>
                Agregar imagen
            </button>
            {hasImage && (
                <>
                    <div className="context-menu-divider" />
                    <button
                        className="context-menu-item danger"
                        onClick={onRemoveImage}
                    >
                        Quitar imagen
                    </button>
                </>
            )}
        </div>
    );
}
