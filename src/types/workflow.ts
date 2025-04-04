
import { MarkerType } from '@xyflow/react';

interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description?: string;
    type: string;
    properties: Record<string, any>;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  markerEnd?: {
    type: MarkerType;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  status?: 'draft' | 'active' | 'paused';
  triggers?: string[];
  stats?: {
    triggered?: number;
    completed?: number;
    active?: number;
  };
  nodes: Node[];
  edges: Edge[];
}
