export type DiagramType = 'concept' | 'mindmap';

export interface DiagramData {
    title: string;
    diagramType: DiagramType;
    nodes: any[]; // specific types from react-flow
    edges: any[];
}
