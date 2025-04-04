import React, { useCallback, useEffect, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Panel, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  MarkerType, 
  NodeTypes 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import EventNode from './flow/EventNode';
import ActionNode from './flow/ActionNode';
import { Workflow } from '@/types/workflow';

interface WorkflowEditorProps {
  workflow: Workflow;
  onSave: (workflow: Workflow) => void;
  onCancel: () => void;
}

const eventTypes = [
  { id: 'page_view', name: 'Page View', description: 'Triggered when a user views a page' },
  { id: 'button_click', name: 'Button Click', description: 'Triggered when a user clicks a button' },
  { id: 'form_submit', name: 'Form Submit', description: 'Triggered when a user submits a form' },
  { id: 'time_spent', name: 'Time Spent', description: 'Triggered after a user spends X time on a page' },
  { id: 'scroll_depth', name: 'Scroll Depth', description: 'Triggered when a user scrolls to a specific depth' },
];

const actionTypes = [
  { id: 'show_message', name: 'Show Message', description: 'Display a message to the user' },
  { id: 'redirect', name: 'Redirect', description: 'Redirect the user to another URL' },
  { id: 'tag_user', name: 'Tag User', description: 'Add a tag to the user profile' },
  { id: 'webhook', name: 'Webhook', description: 'Trigger an external webhook' },
  { id: 'wait', name: 'Wait', description: 'Wait for a specific amount of time' },
];

const getInitialNodes = () => [
  {
    id: 'start',
    type: 'event',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Start', 
      description: 'Beginning of the workflow',
      type: 'start',
      properties: {}
    }
  }
];

const nodeTypes: NodeTypes = {
  event: EventNode,
  action: ActionNode
};

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflow, onSave, onCancel }) => {
  const [workflowName, setWorkflowName] = useState(workflow.name);
  const [workflowDescription, setWorkflowDescription] = useState(workflow.description || '');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [panelExpanded, setPanelExpanded] = useState(true);
  
  const initialNodes = workflow.nodes && workflow.nodes.length > 0 
    ? workflow.nodes 
    : getInitialNodes();
    
  const initialEdges = workflow.edges || [];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);
  
  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
  
  const addNode = (nodeType: 'event' | 'action', typeId: string) => {
    const typeName = nodeType === 'event' 
      ? eventTypes.find(et => et.id === typeId)?.name 
      : actionTypes.find(at => at.id === typeId)?.name;
      
    const description = nodeType === 'event' 
      ? eventTypes.find(et => et.id === typeId)?.description 
      : actionTypes.find(at => at.id === typeId)?.description;
      
    let posX = 250;
    let posY = 150;
    
    if (selectedNodeId) {
      const selectedNode = nodes.find(node => node.id === selectedNodeId);
      if (selectedNode) {
        posX = selectedNode.position.x;
        posY = selectedNode.position.y + 150;
      }
    } else {
      if (nodes.length > 0) {
        const maxY = Math.max(...nodes.map(node => node.position.y));
        posY = maxY + 150;
      }
    }
    
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: posX, y: posY },
      data: { 
        label: typeName,
        description: description,
        type: typeId,
        properties: {}
      }
    };
    
    setNodes(nodes => [...nodes, newNode]);
    setSelectedNodeId(newNode.id);
    
    if (selectedNodeId) {
      const newEdge = {
        id: `e${selectedNodeId}-${newNode.id}`,
        source: selectedNodeId,
        target: newNode.id,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
      setEdges(edges => [...edges, newEdge]);
    }
  };
  
  const handleSave = () => {
    const updatedWorkflow = {
      ...workflow,
      name: workflowName,
      description: workflowDescription,
      nodes,
      edges,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedWorkflow);
  };
  
  const updateNodeProperties = (nodeId: string, properties: any) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            properties: {
              ...node.data.properties,
              ...properties
            }
          }
        };
      }
      return node;
    }));
  };
  
  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;
  
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onCancel} className="mr-2">
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
                  case 'event':
                    return '#d0d8ff';
                  case 'action':
                    return '#e0d0ff';
                  default:
                    return '#ffffff';
                }
              }}
              maskColor="rgba(240, 240, 240, 0.6)"
            />
            <Background gap={16} size={1} />
          </ReactFlow>
        </div>
        
        <div className={`border-l w-96 transition-all duration-300 flex flex-col ${panelExpanded ? '' : 'w-12'}`}>
          <div className="border-b p-3 flex justify-between items-center bg-muted/50">
            <h3 className={`font-medium ${panelExpanded ? '' : 'hidden'}`}>Workflow Configuration</h3>
            <Button variant="ghost" size="icon" onClick={() => setPanelExpanded(!panelExpanded)}>
              {panelExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
          
          {panelExpanded && (
            <div className="p-4 flex-1 overflow-y-auto">
              <Tabs defaultValue="workflow">
                <TabsList className="w-full">
                  <TabsTrigger value="workflow">Workflow</TabsTrigger>
                  <TabsTrigger value="node" disabled={!selectedNode}>Properties</TabsTrigger>
                </TabsList>
                
                <TabsContent value="workflow" className="space-y-4 mt-4">
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
                          <CardTitle className="text-sm font-medium">Events</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 py-2">
                          {eventTypes.map(eventType => (
                            <Button 
                              key={eventType.id} 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => addNode('event', eventType.id)}
                            >
                              <div>
                                <p>{eventType.name}</p>
                                <p className="text-xs text-muted-foreground">{eventType.description}</p>
                              </div>
                            </Button>
                          ))}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 py-2">
                          {actionTypes.map(actionType => (
                            <Button 
                              key={actionType.id} 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => addNode('action', actionType.id)}
                            >
                              <div>
                                <p>{actionType.name}</p>
                                <p className="text-xs text-muted-foreground">{actionType.description}</p>
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
                      <h3 className="font-medium mb-2">{selectedNode.data.label}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{selectedNode.data.description}</p>
                      
                      {selectedNode.type === 'event' && (
                        <div className="space-y-4">
                          {selectedNode.data.type === 'page_view' && (
                            <div className="space-y-2">
                              <Label>URL Pattern</Label>
                              <Input 
                                placeholder="/path/*" 
                                value={selectedNode.data.properties.urlPattern || ''} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { urlPattern: e.target.value })}
                              />
                              <p className="text-xs text-muted-foreground">
                                Enter URL pattern to match. Use * as wildcard.
                              </p>
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'button_click' && (
                            <div className="space-y-2">
                              <Label>Button Selector</Label>
                              <Input 
                                placeholder="#signup-button, .cta-button" 
                                value={selectedNode.data.properties.buttonSelector || ''} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { buttonSelector: e.target.value })}
                              />
                              <p className="text-xs text-muted-foreground">
                                CSS selector to identify the button.
                              </p>
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'form_submit' && (
                            <div className="space-y-2">
                              <Label>Form Selector</Label>
                              <Input 
                                placeholder="#contact-form" 
                                value={selectedNode.data.properties.formSelector || ''} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { formSelector: e.target.value })}
                              />
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'time_spent' && (
                            <div className="space-y-2">
                              <Label>Time (seconds)</Label>
                              <Input 
                                type="number" 
                                min="1"
                                value={selectedNode.data.properties.seconds || 30} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { seconds: parseInt(e.target.value) })}
                              />
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'scroll_depth' && (
                            <div className="space-y-2">
                              <Label>Scroll Percentage</Label>
                              <Input 
                                type="number" 
                                min="1"
                                max="100"
                                value={selectedNode.data.properties.percentage || 50} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { percentage: parseInt(e.target.value) })}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {selectedNode.type === 'action' && (
                        <div className="space-y-4">
                          {selectedNode.data.type === 'show_message' && (
                            <div className="space-y-2">
                              <Label>Select Template</Label>
                              <Select 
                                value={selectedNode.data.properties.templateId || ''} 
                                onValueChange={(value) => updateNodeProperties(selectedNode.id, { templateId: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a template" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="t1">Welcome Message</SelectItem>
                                  <SelectItem value="t2">Special Offer</SelectItem>
                                  <SelectItem value="t3">Feature Announcement</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <div className="mt-2">
                                <Label>Delay (seconds)</Label>
                                <Input 
                                  type="number" 
                                  min="0"
                                  value={selectedNode.data.properties.delay || 0} 
                                  onChange={(e) => updateNodeProperties(selectedNode.id, { delay: parseInt(e.target.value) })}
                                />
                              </div>
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'redirect' && (
                            <div className="space-y-2">
                              <Label>Redirect URL</Label>
                              <Input 
                                placeholder="https://example.com/page" 
                                value={selectedNode.data.properties.url || ''} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { url: e.target.value })}
                              />
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'tag_user' && (
                            <div className="space-y-2">
                              <Label>Tag Name</Label>
                              <Input 
                                placeholder="interested-in-product" 
                                value={selectedNode.data.properties.tag || ''} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { tag: e.target.value })}
                              />
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'webhook' && (
                            <div className="space-y-2">
                              <Label>Webhook URL</Label>
                              <Input 
                                placeholder="https://api.example.com/hook" 
                                value={selectedNode.data.properties.webhookUrl || ''} 
                                onChange={(e) => updateNodeProperties(selectedNode.id, { webhookUrl: e.target.value })}
                              />
                            </div>
                          )}
                          
                          {selectedNode.data.type === 'wait' && (
                            <div className="space-y-2">
                              <Label>Wait Duration</Label>
                              <div className="flex space-x-2">
                                <Input 
                                  type="number" 
                                  min="1"
                                  value={selectedNode.data.properties.duration || 1} 
                                  onChange={(e) => updateNodeProperties(selectedNode.id, { duration: parseInt(e.target.value) })}
                                />
                                <Select 
                                  value={selectedNode.data.properties.unit || 'minutes'} 
                                  onValueChange={(value) => updateNodeProperties(selectedNode.id, { unit: value })}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="minutes">Minutes</SelectItem>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="days">Days</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <Button variant="destructive" size="sm" onClick={() => {
                          setNodes(nodes.filter(n => n.id !== selectedNodeId));
                          setEdges(edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
                          setSelectedNodeId(null);
                        }}>
                          Delete Node
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
