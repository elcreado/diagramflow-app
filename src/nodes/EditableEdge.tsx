import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type EdgeProps, type XYPosition, useReactFlow } from '@xyflow/react';

type EditableEdgeData = {
    points?: XYPosition[];
    onPointsChange?: (edgeId: string, points: XYPosition[]) => void;
};

const POINT_INSERT_MIN_DISTANCE = 12;

function buildPath(points: XYPosition[]): string {
    if (points.length === 0) return '';
    const [start, ...rest] = points;
    return `M ${start.x},${start.y} ${rest.map((point) => `L ${point.x},${point.y}`).join(' ')}`;
}

function distanceToSegment(point: XYPosition, start: XYPosition, end: XYPosition): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    if (dx === 0 && dy === 0) {
        return Math.hypot(point.x - start.x, point.y - start.y);
    }

    const t = Math.max(
        0,
        Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy))
    );
    const projection = {
        x: start.x + t * dx,
        y: start.y + t * dy,
    };

    return Math.hypot(point.x - projection.x, point.y - projection.y);
}

function distanceBetween(a: XYPosition, b: XYPosition): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function EditableEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    selected,
    markerEnd,
}: EdgeProps) {
    const edgeData = (data || {}) as EditableEdgeData;
    const points = edgeData.points || [];
    const reactFlow = useReactFlow();
    const pointsRef = useRef(points);
    const onPointsChangeRef = useRef(edgeData.onPointsChange);
    const dragPointIndexRef = useRef<number | null>(null);
    const activePointerIdRef = useRef<number | null>(null);
    const stopDraggingRef = useRef<() => void>(() => undefined);
    const [isDraggingPoint, setIsDraggingPoint] = useState(false);

    useEffect(() => {
        pointsRef.current = points;
    }, [points]);

    useEffect(() => {
        onPointsChangeRef.current = edgeData.onPointsChange;
    }, [edgeData.onPointsChange]);

    const fullPathPoints = useMemo<XYPosition[]>(
        () => [{ x: sourceX, y: sourceY }, ...points, { x: targetX, y: targetY }],
        [sourceX, sourceY, targetX, targetY, points]
    );

    const path = useMemo(() => buildPath(fullPathPoints), [fullPathPoints]);

    const updatePoints = useCallback(
        (nextPoints: XYPosition[]) => {
            pointsRef.current = nextPoints;
            onPointsChangeRef.current?.(id, nextPoints);
        },
        [id]
    );

    const onWindowPointerMove = useCallback(
        (event: PointerEvent) => {
            const pointerId = activePointerIdRef.current;
            if (pointerId !== null && event.pointerId !== pointerId) return;

            const pointIndex = dragPointIndexRef.current;
            if (pointIndex === null) return;

            const flowPosition = reactFlow.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const nextPoints = [...pointsRef.current];
            if (!nextPoints[pointIndex]) return;

            nextPoints[pointIndex] = flowPosition;
            updatePoints(nextPoints);
        },
        [reactFlow, updatePoints]
    );

    const onWindowPointerUp = useCallback(() => {
        stopDraggingRef.current();
    }, []);

    const onWindowBlur = useCallback(() => {
        stopDraggingRef.current();
    }, []);

    const stopDragging = useCallback(() => {
        dragPointIndexRef.current = null;
        activePointerIdRef.current = null;
        setIsDraggingPoint(false);
        window.removeEventListener('pointermove', onWindowPointerMove);
        window.removeEventListener('pointerup', onWindowPointerUp);
        window.removeEventListener('pointercancel', onWindowPointerUp);
        window.removeEventListener('blur', onWindowBlur);
    }, [onWindowPointerMove, onWindowPointerUp, onWindowBlur]);

    useEffect(() => {
        stopDraggingRef.current = stopDragging;
    }, [stopDragging]);

    useEffect(() => {
        return () => stopDraggingRef.current();
    }, []);

    const startDrag = useCallback(
        (pointIndex: number, pointerId: number, target?: EventTarget | null) => {
            stopDraggingRef.current();
            dragPointIndexRef.current = pointIndex;
            activePointerIdRef.current = pointerId;
            setIsDraggingPoint(true);

            if (target instanceof Element && 'setPointerCapture' in target) {
                try {
                    target.setPointerCapture(pointerId);
                } catch {
                    // Ignore capture errors in environments that reject capture on SVG.
                }
            }

            window.addEventListener('pointermove', onWindowPointerMove);
            window.addEventListener('pointerup', onWindowPointerUp);
            window.addEventListener('pointercancel', onWindowPointerUp);
            window.addEventListener('blur', onWindowBlur);
        },
        [onWindowPointerMove, onWindowPointerUp, onWindowBlur]
    );

    const isPointTooClose = useCallback(
        (point: XYPosition) =>
            points.some(
                (existingPoint) => distanceBetween(existingPoint, point) < POINT_INSERT_MIN_DISTANCE
            ),
        [points]
    );

    const insertPoint = useCallback(
        (segmentIndex: number, point: XYPosition, pointerId: number, target?: EventTarget | null) => {
            if (isPointTooClose(point)) return;

            const nextPoints = [...points];
            nextPoints.splice(segmentIndex, 0, point);
            updatePoints(nextPoints);
            startDrag(segmentIndex, pointerId, target);
        },
        [points, updatePoints, startDrag, isPointTooClose]
    );

    const handleLinePointerDown = useCallback(
        (event: React.PointerEvent<SVGPathElement>) => {
            if (!selected) return;

            event.stopPropagation();
            event.preventDefault();

            const flowPosition = reactFlow.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            let bestSegmentIndex = 0;
            let minDistance = Number.POSITIVE_INFINITY;

            for (let segmentIndex = 0; segmentIndex < fullPathPoints.length - 1; segmentIndex += 1) {
                const distance = distanceToSegment(
                    flowPosition,
                    fullPathPoints[segmentIndex],
                    fullPathPoints[segmentIndex + 1]
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    bestSegmentIndex = segmentIndex;
                }
            }

            insertPoint(bestSegmentIndex, flowPosition, event.pointerId, event.currentTarget);
        },
        [selected, reactFlow, fullPathPoints, insertPoint]
    );

    const handleExistingPointPointerDown = useCallback(
        (pointIndex: number) => (event: React.PointerEvent<SVGCircleElement>) => {
            event.stopPropagation();
            event.preventDefault();
            startDrag(pointIndex, event.pointerId, event.currentTarget);
        },
        [startDrag]
    );

    const handleExistingPointDoubleClick = useCallback(
        (pointIndex: number) => (event: React.MouseEvent<SVGCircleElement>) => {
            event.stopPropagation();
            event.preventDefault();
            if (!points[pointIndex]) return;

            const nextPoints = points.filter((_, index) => index !== pointIndex);
            updatePoints(nextPoints);
        },
        [points, updatePoints]
    );

    const handleMidpointPointerDown = useCallback(
        (segmentIndex: number, midpoint: XYPosition) => (event: React.PointerEvent<SVGCircleElement>) => {
            event.stopPropagation();
            event.preventDefault();
            insertPoint(segmentIndex, midpoint, event.pointerId, event.currentTarget);
        },
        [insertPoint]
    );

    return (
        <g>
            <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                style={{ pointerEvents: 'stroke' }}
                className="react-flow__edge-interaction"
                onPointerDown={handleLinePointerDown}
            />
            <path
                d={path}
                fill="none"
                stroke={selected ? '#7c3aed' : '#5b5b7a'}
                strokeWidth={selected ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={markerEnd}
                style={{ pointerEvents: 'none' }}
            />

            {selected && (
                <>
                    <circle
                        cx={sourceX}
                        cy={sourceY}
                        r={4}
                        fill="#f5f3ff"
                        stroke="#7c3aed"
                        strokeWidth={1.6}
                        style={{ pointerEvents: 'none' }}
                    />
                    <circle
                        cx={targetX}
                        cy={targetY}
                        r={4}
                        fill="#f5f3ff"
                        stroke="#7c3aed"
                        strokeWidth={1.6}
                        style={{ pointerEvents: 'none' }}
                    />
                </>
            )}

            {selected &&
                points.map((point, pointIndex) => (
                    <circle
                        key={`${id}-point-${pointIndex}`}
                        cx={point.x}
                        cy={point.y}
                        r={5}
                        fill="#a78bfa"
                        stroke="#f5f3ff"
                        strokeWidth={1.4}
                        style={{ cursor: 'grab' }}
                        onPointerDown={handleExistingPointPointerDown(pointIndex)}
                        onDoubleClick={handleExistingPointDoubleClick(pointIndex)}
                    />
                ))}

            {selected &&
                fullPathPoints.slice(0, -1).map((point, segmentIndex) => {
                    const nextPoint = fullPathPoints[segmentIndex + 1];
                    const midpoint = {
                        x: (point.x + nextPoint.x) / 2,
                        y: (point.y + nextPoint.y) / 2,
                    };

                    return (
                        <circle
                            key={`${id}-mid-${segmentIndex}`}
                            cx={midpoint.x}
                            cy={midpoint.y}
                            r={isDraggingPoint ? 0 : 3.5}
                            fill="#e9d5ff"
                            stroke="#7c3aed"
                            strokeWidth={1}
                            style={{ cursor: 'crosshair' }}
                            onPointerDown={handleMidpointPointerDown(segmentIndex, midpoint)}
                        />
                    );
                })}
        </g>
    );
}
