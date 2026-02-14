import { useState, useCallback } from 'react';

export interface ContextMenuState {
    nodeId: string;
    x: number;
    y: number;
}

export function useContextMenu() {
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    const onNodeContextMenu = useCallback(
        (nodeId: string, x: number, y: number) => {
            setContextMenu({ nodeId, x, y });
        },
        []
    );

    const onPaneClick = useCallback(() => {
        setContextMenu(null);
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    return {
        contextMenu,
        setContextMenu,
        onNodeContextMenu,
        onPaneClick,
        closeContextMenu,
    };
}
