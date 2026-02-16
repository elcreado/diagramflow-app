import { toPng } from 'html-to-image';
import type { Edge, Node, ReactFlowInstance, XYPosition } from '@xyflow/react';

const HIDDEN_SELECTOR =
    '.react-flow__controls, .react-flow__minimap, .react-flow__attribution, .react-flow__background';
const EXPORT_PADDING = 96;

type ExportCaptureOptions = {
    element: HTMLElement;
    nodes: Node[];
    edges: Edge[];
    reactFlowInstance?: ReactFlowInstance | null;
};

type Bounds = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

export type CaptureDiagramResult = {
    dataUrl: string;
    width: number;
    height: number;
};

function isValidPoint(value: unknown): value is XYPosition {
    if (!value || typeof value !== 'object') return false;
    const point = value as Record<string, unknown>;
    return typeof point.x === 'number' && Number.isFinite(point.x) &&
        typeof point.y === 'number' && Number.isFinite(point.y);
}

function getNodeBounds(nodes: Node[], reactFlowInstance?: ReactFlowInstance | null): Bounds | null {
    if (!nodes.length) return null;

    const instanceBounds = reactFlowInstance?.getNodesBounds(nodes);
    if (
        instanceBounds &&
        Number.isFinite(instanceBounds.x) &&
        Number.isFinite(instanceBounds.y) &&
        Number.isFinite(instanceBounds.width) &&
        Number.isFinite(instanceBounds.height)
    ) {
        return {
            minX: instanceBounds.x,
            minY: instanceBounds.y,
            maxX: instanceBounds.x + instanceBounds.width,
            maxY: instanceBounds.y + instanceBounds.height,
        };
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    nodes.forEach((node) => {
        const width =
            (node.measured?.width as number | undefined) ??
            (node.width as number | undefined) ??
            180;
        const height =
            (node.measured?.height as number | undefined) ??
            (node.height as number | undefined) ??
            80;

        minX = Math.min(minX, node.position.x);
        minY = Math.min(minY, node.position.y);
        maxX = Math.max(maxX, node.position.x + width);
        maxY = Math.max(maxY, node.position.y + height);
    });

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
        return null;
    }

    return { minX, minY, maxX, maxY };
}

function mergeBounds(base: Bounds | null, next: Bounds): Bounds {
    if (!base) return next;
    return {
        minX: Math.min(base.minX, next.minX),
        minY: Math.min(base.minY, next.minY),
        maxX: Math.max(base.maxX, next.maxX),
        maxY: Math.max(base.maxY, next.maxY),
    };
}

function getEdgePointBounds(edges: Edge[]): Bounds | null {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let hasPoint = false;

    edges.forEach((edge) => {
        const data = (edge.data as Record<string, unknown> | undefined) ?? {};
        const points = Array.isArray(data.points) ? data.points : [];

        points.forEach((point) => {
            if (!isValidPoint(point)) return;
            hasPoint = true;
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
    });

    if (!hasPoint) return null;
    return { minX, minY, maxX, maxY };
}

function computeExportBounds(
    element: HTMLElement,
    nodes: Node[],
    edges: Edge[],
    reactFlowInstance?: ReactFlowInstance | null
) {
    const nodeBounds = getNodeBounds(nodes, reactFlowInstance);
    const edgeBounds = getEdgePointBounds(edges);
    const mergedBounds = mergeBounds(nodeBounds, edgeBounds ?? nodeBounds ?? {
        minX: 0,
        minY: 0,
        maxX: element.clientWidth || 1,
        maxY: element.clientHeight || 1,
    });

    const width = Math.max(1, Math.ceil(mergedBounds.maxX - mergedBounds.minX + EXPORT_PADDING * 2));
    const height = Math.max(1, Math.ceil(mergedBounds.maxY - mergedBounds.minY + EXPORT_PADDING * 2));
    const translateX = -(mergedBounds.minX - EXPORT_PADDING);
    const translateY = -(mergedBounds.minY - EXPORT_PADDING);

    return { width, height, translateX, translateY };
}

export async function captureDiagramAsPng({
    element,
    nodes,
    edges,
    reactFlowInstance,
}: ExportCaptureOptions): Promise<CaptureDiagramResult> {
    const viewport = element.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (!viewport) {
        throw new Error('No se encontro el viewport de React Flow para exportar.');
    }

    const { width, height, translateX, translateY } = computeExportBounds(
        element,
        nodes,
        edges,
        reactFlowInstance
    );

    const hiddenElements = Array.from(element.querySelectorAll(HIDDEN_SELECTOR)) as HTMLElement[];
    const previousDisplays = new Map<HTMLElement, string>();
    const previousTransform = viewport.style.transform;
    const previousTransformOrigin = viewport.style.transformOrigin;
    const previousBackground = element.style.background;

    try {
        hiddenElements.forEach((hiddenElement) => {
            previousDisplays.set(hiddenElement, hiddenElement.style.display);
            hiddenElement.style.display = 'none';
        });

        element.style.background = 'transparent';
        viewport.style.transformOrigin = '0 0';
        viewport.style.transform = `translate(${translateX}px, ${translateY}px) scale(1)`;

        const dataUrl = await toPng(element, {
            pixelRatio: 2,
            backgroundColor: 'transparent',
            width,
            height,
            style: {
                width: `${width}px`,
                height: `${height}px`,
            },
            filter: (node) => {
                if (!node.classList) return true;

                return (
                    !node.classList.contains('react-flow__controls') &&
                    !node.classList.contains('react-flow__minimap') &&
                    !node.classList.contains('react-flow__attribution') &&
                    !node.classList.contains('react-flow__background')
                );
            },
        });

        return { dataUrl, width, height };
    } finally {
        hiddenElements.forEach((hiddenElement) => {
            const previousDisplay = previousDisplays.get(hiddenElement);
            hiddenElement.style.display = previousDisplay ?? '';
        });
        viewport.style.transform = previousTransform;
        viewport.style.transformOrigin = previousTransformOrigin;
        element.style.background = previousBackground;
    }
}
