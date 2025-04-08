import {
  JsonWorkflow,
  CanvasWorkflow,
  WebAction,
  WebEvent,
  Node,
  Edge,
  EventCategory,
} from "@/types/workflow";
import { MarkerType } from "@xyflow/react";
import { isValidUUID } from "./utils";

const xGap = 200;
const yGap = 150;

export const setSubordinates = (event: WebEvent): WebEvent => {
  const processNode = (node: WebEvent): WebEvent => {
    // Count all descendants (children + their children)
    const countChildren = (n: WebEvent): number => {
      if (!n.children || n.children.length === 0) return 0;
      return (
        n.children.length +
        n.children.reduce((sum, child) => sum + countChildren(child), 0)
      );
    };

    // Recursively process children first (post-order traversal)
    const processedChildren = node.children?.map(processNode) || [];

    return {
      ...node,
      subordinates: countChildren({ ...node, children: processedChildren }),
      children: processedChildren,
    };
  };

  return processNode(event);
};

export const serializerEvents = (
  event: WebEvent,
  x = 0,
  y = 0,
  withChildren = false
): Node[] => {
  const nodes: Node[] = [
    {
      id: event.id,
      type: event.event_type,
      position: { x: event.position_x ?? x, y: event.position_y ?? y },
      data: {
        label: event.name,
        description: event.description,
        type: event.event_type,
        properties: {
          event_type: event.event_type,
          category: event.category,
          parent_id: event.parent_id,
          parent: event.parent,
          actions: event.actions?.map((action) => action.id),
        },
      },
    },
  ];

  if (withChildren) {
    event.children?.forEach((child, index) => {
      nodes.push(
        ...serializerEvents(
          child,
          x + xGap,
          y + yGap + index > 0
            ? yGap * ((event.children?.[index - 1]?.subordinates ?? 0) + 1)
            : 0
        )
      );
    });
  }

  return nodes;
};

export const serializerActions = (
  event: WebEvent,
  actions: WebAction[],
  withChildren = false
): WebAction[] => {
  event.actions?.forEach((action) => {
    actions.push(action);
  });

  if (withChildren) {
    event.children?.forEach((child) => {
      serializerActions(child, actions);
    });
  }

  return actions;
};

export const jsonToCanvasWorkflow = (
  jsonWorkflow: JsonWorkflow
): CanvasWorkflow => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const actions: WebAction[] = [];

  jsonWorkflow.events.forEach((event) => {
    nodes.push(...serializerEvents(event));

    if (event.parent_id) {
      edges.push({
        id: `${event.id}-${event.parent_id}`,
        source: event.parent_id,
        target: event.id,
        type: "smoothstep",
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    }
  });

  jsonWorkflow.events.forEach((event) => {
    serializerActions(event, actions);
  });

  return {
    id: jsonWorkflow.id,
    name: jsonWorkflow.name,
    description: jsonWorkflow.description,
    nodes: nodes,
    edges: edges,
    actions: actions,
    created_at: jsonWorkflow.created_at,
    updated_at: jsonWorkflow.updated_at,
  };
};

export const canvasToJsonWorkflow = (
  canvasWorkflow: CanvasWorkflow
): JsonWorkflow => {
  // Reconstruct the WebEvent hierarchy from nodes and edges
  const buildEventTree = (nodeId: string): WebEvent => {
    const node = canvasWorkflow.nodes.find((n) => n.id === nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);

    // Find all child edges (where this node is the source)
    const childEdges = canvasWorkflow.edges.filter((e) => e.source === nodeId);

    // Recursively build children
    const children = childEdges.map((edge) => buildEventTree(edge.target));

    // Find associated actions
    const actionIds = node.data.properties?.actions || [];
    const actions = canvasWorkflow.actions.filter((a) =>
      actionIds.includes(a.id)
    );

    return {
      id: node.id,
      name: node.data.label,
      description: node.data.description,
      category: node.data.properties.category,
      event_type: node.type || node.data.type,
      parent_id: node.data.properties.parent_id,
      children: children.length > 0 ? children : undefined,
      actions: actions.length > 0 ? actions : undefined,
      created_at: node.data.properties.created_at || canvasWorkflow.created_at,
      updated_at: node.data.properties.updated_at || canvasWorkflow.updated_at,
      position_x: node.position?.x,
      position_y: node.position?.y,
      // These will be recalculated when setSubordinates is called
      subordinates: 0,
    };
  };

  // Find root nodes (nodes that aren't targets of any edges)
  const rootNodes = canvasWorkflow.nodes.filter(
    (node) => !canvasWorkflow.edges.some((edge) => edge.target === node.id)
  );

  // Build the event tree for each root node
  const events = rootNodes.map((rootNode) => {
    const event = buildEventTree(rootNode.id);
    return setSubordinates(event); // Recalculate subordinates
  });

  return {
    id: canvasWorkflow.id,
    name: canvasWorkflow.name,
    description: canvasWorkflow.description,
    live_status: false, // Default value
    is_active: true, // Default value
    events,
    created_at: canvasWorkflow.created_at,
    updated_at: canvasWorkflow.updated_at,
  };
};

export const canvasToJsonNode = (
  node: Node,
  edges: Edge[],
  actions: WebAction[]
): WebEvent => {
  const parent = edges.find((edge) => edge.target === node.id);
  const nodeActions = actions
    .filter((action) => node.data.properties.actions?.includes(action.id))
    .map((action) => ({
      ...action,
      id: isValidUUID(action.id) ? action.id : undefined,
    }));

  return {
    id: isValidUUID(node.id) ? node.id : undefined,
    name: node.data.label,
    description: node.data.description,
    event_type: node.data.type || node.type,
    parent_id: parent?.source || node.data.properties.parent_id || null,
    actions: nodeActions,
    created_at: node.data.properties.created_at,
    updated_at: node.data.properties.updated_at,
    position_x: node.position?.x,
    position_y: node.position?.y,
    category: node.data.properties.category || ("web" as EventCategory),
  };
};

export const canvasToJsonNodes = (
  nodes: Node[],
  edges: Edge[],
  actions
): WebEvent[] => {
  console.log(nodes, edges, actions);
  return nodes.map((node) => canvasToJsonNode(node, edges, actions));
};
