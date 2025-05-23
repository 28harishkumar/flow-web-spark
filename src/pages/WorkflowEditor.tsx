import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import EventNode from "../components/flow/EventNode";
import ActionNode from "../components/flow/ActionNode";
import {
  CanvasWorkflow,
  Edge,
  JsonWorkflow,
  TemplateListType,
  WebAction,
  WebEvent,
  WebMessage,
} from "@/types/workflow";
import { WorkflowService } from "@/services/workflow";
import { useNavigate, useParams } from "react-router-dom";
import {
  canvasToJsonNode,
  canvasToJsonNodes,
  canvasToJsonWorkflow,
  jsonToCanvasWorkflow,
  serializerEvents,
} from "@/lib/workflow";
import ActionConfig from "@/components/workflow/ActionConfig";
import TemplateConfig from "@/components/workflow/TemplateConfig";

import { EventType, ActionType } from "@/types/workflow";
import { trackEvent } from "@/lib/tracking";

const getInitialNodes = () => [
  {
    id: "start",
    type: "event",
    position: { x: 250, y: 50 },
    data: {
      label: "Start",
      description: "Beginning of the workflow",
      type: "start",
      properties: {},
    },
  },
];

const nodeTypes: NodeTypes = {
  event: EventNode,
  action: ActionNode,
};

const WorkflowEditor: React.FC = () => {
  const { workflowId } = useParams();
  const [workflow, setWorkflow] = useState<CanvasWorkflow | null>({
    id: "",
    name: "",
    description: "",
    nodes: [],
    edges: [],
    actions: [],
  });
  const [workflowName, setWorkflowName] = useState(workflow?.name);
  const [workflowDescription, setWorkflowDescription] = useState(
    workflow.description || ""
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const initialNodes =
    workflow.nodes && workflow.nodes.length > 0
      ? workflow.nodes
      : getInitialNodes();

  const initialEdges = workflow.edges || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [actions, setActions] = useState<WebAction[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);

  const [selectedActions, setSelectedActions] = useState<WebAction[]>([]);
  const workflowService = new WorkflowService();
  const navigate = useNavigate();

  const selectedNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId)
    : null;

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
      setSelectedActions(
        actions.filter((a) => node.data.properties.actions?.includes(a.id))
      );
    },
    [actions]
  );

  useEffect(() => {
    trackEvent("WorkflowEditorViewed", {
      page: "workflow_editor",
    });
  }, []);

  useEffect(() => {
    if (workflowId) {
      workflowService.getWorkflow(workflowId).then((workflow) => {
        const canvasWorkflow = jsonToCanvasWorkflow(workflow);
        console.log(canvasWorkflow);
        setWorkflow(canvasWorkflow);
        setNodes(canvasWorkflow.nodes);
        setEdges(canvasWorkflow.edges);
        setActions(canvasWorkflow.actions);
        setWorkflowName(workflow.name);
        setWorkflowDescription(workflow.description);
      });

      workflowService.getUserEvents().then((eventTypes) => {
        setEventTypes(eventTypes);
      });

      workflowService.getActionTypes().then((actionTypes) => {
        setActionTypes(actionTypes);
      });
    }
  }, [workflowId]);

  const onConnect = useCallback(
    (params) => {
      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: "smoothstep",
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };

      console.log("newEdge", newEdge, nodes);

      const node = nodes.find((node) => node.id === params.target);
      if (node) {
        const event = canvasToJsonNode(node, edges, actions);

        if (node && event.parent_id !== params.source) {
          event.parent_id = params.source;
          setEdges((eds) => eds.filter((e) => e.target !== params.target));

          workflowService.updateEvent(event, workflowId, node.id).then((ev) => {
            setNodes((nodes) => [
              ...nodes.filter((n) => n.id !== ev.id),
              serializerEvents(ev)[0],
            ]);
            setEdges((eds) => addEdge({ ...newEdge, target: ev.id }, eds));
          });
        }
      }
    },
    [setEdges]
  );

  const addNode = (eventType: EventType) => {
    const typeName = eventType.name;
    const description = eventType.description;

    let posX = 250;
    let posY = 150;

    if (selectedNodeId) {
      const selectedNode = nodes.find((node) => node.id === selectedNodeId);
      if (selectedNode) {
        posX = selectedNode.position.x;
        posY = selectedNode.position.y + 150;
      }
    } else {
      if (nodes.length > 0) {
        const maxY = Math.max(...nodes.map((node) => node.position.y));
        posY = maxY + 150;
      }
    }

    const newNode = {
      id: `event-${Date.now()}`,
      type: typeName,
      position: { x: posX, y: posY },
      data: {
        label: typeName,
        description: description,
        type: typeName,
        properties: {},
      },
    };

    const jsonEvent = canvasToJsonNode(newNode, edges, actions);

    if (selectedNodeId) {
      jsonEvent.parent_id = selectedNodeId;
    }

    workflowService.addEvent(jsonEvent, workflowId).then((event: WebEvent) => {
      setNodes((nodes) => [...nodes, serializerEvents(event)[0]]);

      if (selectedNodeId) {
        const newEdge = {
          id: `e${selectedNodeId}-${event.id}`,
          source: selectedNodeId,
          target: event.id,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        };
        setEdges((edges) => [...edges, newEdge]);
      }

      setSelectedNodeId(event.id);
    });
  };

  const handleSave = async () => {
    const updatedWorkflow: Omit<
      JsonWorkflow,
      "id" | "created_at" | "updated_at"
    > = {
      name: workflowName,
      description: workflowDescription ?? "",
      events: canvasToJsonNodes(nodes, edges, actions),
      actions: actions,
      live_status: true,
      is_active: true,
    };

    try {
      if (workflowId && workflowId !== "new") {
        await workflowService.updateWorkflow(workflowId, {
          ...updatedWorkflow,
          id: workflowId,
        });
      } else {
        await workflowService.createWorkflow(updatedWorkflow);
      }
    } catch (error) {
      console.error("Failed to save workflow:", error);
    }
  };

  const updateNodeProperties = (
    nodeId: string,
    properties: Record<string, string | number | boolean>
  ) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              properties: {
                ...node.data.properties,
                ...properties,
              },
            },
          };
        }
        return node;
      })
    );
  };

  const addAction = (action: ActionType) => {
    // Add new action to the selected node
    const selectedNode = nodes.find((node) => node.id === selectedNodeId);
    if (selectedNode) {
      // create an action
      const newAction: Omit<WebAction, "id" | "created_at" | "updated_at"> = {
        action_type: action.id,
        action_config: {},
        is_active: true,
        web_message: null,
        workflow_event: selectedNode.id,
        delay_seconds: 0,
      };

      workflowService
        .addAction(newAction, selectedNodeId, workflowId)
        .then((action) => {
          selectedNode.data.properties.actions = [
            ...(selectedNode.data.properties.actions || []),
            action.id,
          ];

          setNodes([
            ...nodes.filter((n) => n.id !== selectedNodeId),
            selectedNode,
          ]);

          setSelectedActions([...selectedActions, action]);
        });
    }
  };

  const handleUpdateAction = async (action: WebAction) => {
    try {
      const axn = await workflowService.updateAction(
        action,
        selectedNodeId,
        workflowId
      );
      setActions(actions.map((a) => (a.id === action.id ? axn : a)));
      setNodes(
        nodes.map((n) =>
          n.id === selectedNodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  properties: {
                    ...n.data.properties,
                    actions: [...n.data.properties.actions, axn.id],
                  },
                },
              }
            : n
        )
      );
    } catch (error) {
      console.error("Failed to update action:", error);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    try {
      await workflowService.deleteAction(actionId, selectedNodeId, workflowId);
      setActions(actions.filter((a) => a.id !== actionId));
      // Update the selected node's properties to remove the action reference
      if (selectedNodeId) {
        const node = nodes.find((n) => n.id === selectedNodeId);
        if (node) {
          node.data.properties.actions = node.data.properties.actions?.filter(
            (id) => id !== actionId
          );
          setNodes([...nodes]);
        }
      }
    } catch (error) {
      console.error("Failed to delete action:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-xl font-bold h-8 w-72 border-transparent focus:border-input"
            />
            <p className="text-sm text-muted-foreground mt-1">{workflow.id}</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Workflow
        </Button>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case "event":
                    return "#d0d8ff";
                  case "action":
                    return "#e0d0ff";
                  default:
                    return "#ffffff";
                }
              }}
              maskColor="rgba(240, 240, 240, 0.6)"
            />
            <Background gap={16} size={1} />
          </ReactFlow>
        </div>

        <div
          className={`border-l w-96 transition-all duration-300 flex flex-col h-[calc(100vh-90px)]`}
        >
          <div className="p-4 flex-1 overflow-y-auto">
            <Tabs defaultValue="workflow">
              <TabsList className="w-full">
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                <TabsTrigger value="node" disabled={!selectedNode}>
                  Properties
                </TabsTrigger>
                <TabsTrigger value="events" disabled={!selectedNode}>
                  Node Json
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workflow" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Textarea
                    id="workflow-name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    rows={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea
                    id="workflow-description"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Add Nodes</Label>
                  <div className="space-y-2">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">
                          Events
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 py-2">
                        {eventTypes.map((eventType) => (
                          <Button
                            key={eventType.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => addNode(eventType)}
                          >
                            <div>
                              <p>{eventType.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {eventType.description}
                              </p>
                            </div>
                          </Button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="node" className="space-y-4 mt-4">
                {selectedNode && (
                  <div>
                    <h3 className="font-medium mb-2">
                      {selectedNode.data.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedNode.data.description}
                    </p>

                    <Label className="text-sm font-medium">Add Action</Label>
                    <CardContent className="space-y-2 py-2  px-0">
                      {actionTypes.map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => addAction(action)}
                        >
                          <div>
                            <p>{action.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                        </Button>
                      ))}
                    </CardContent>

                    <div className="mt-2 space-y-2">
                      <Label>Actions</Label>
                      {selectedActions?.map((action) => (
                        <ActionConfig
                          key={action.id}
                          action={action}
                          workflow={workflow}
                          node={selectedNode}
                          onUpdate={handleUpdateAction}
                          onDelete={handleDeleteAction}
                        />
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setNodes(
                            nodes.filter((n) => n.id !== selectedNodeId)
                          );
                          setEdges(
                            edges.filter(
                              (e) =>
                                e.source !== selectedNodeId &&
                                e.target !== selectedNodeId
                            )
                          );
                          setSelectedNodeId(null);
                        }}
                      >
                        Delete Node
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="events" className="space-y-4 mt-4">
                <pre className="text-xs whitespace-pre-wrap cursor-pointer hover:bg-muted p-2 rounded">
                  {selectedNode &&
                    JSON.stringify(canvasToJsonWorkflow(workflow), null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
