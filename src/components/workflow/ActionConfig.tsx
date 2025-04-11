import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CanvasWorkflow,
  TemplateListType,
  WebAction,
  WebMessage,
  Node,
} from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Save, Settings, ChevronDown, Plus } from "lucide-react";
import TemplateConfig from "./TemplateConfig";
import { WorkflowService } from "@/services/workflow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSlug } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { Badge } from "../ui/badge";
import { Calendar } from "lucide-react";

interface ActionConfigProps {
  action: WebAction;
  workflow: CanvasWorkflow;
  node: Node;
  onUpdate: (action: WebAction) => void;
  onDelete: (actionId: string) => void;
}

const ActionConfig: React.FC<ActionConfigProps> = ({
  action,
  workflow,
  node,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAction, setEditedAction] = useState<WebAction>(action);
  const [templates, setTemplates] = useState<TemplateListType[]>([]);
  const [showTemplateConfig, setShowTemplateConfig] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showWhoDialog, setShowWhoDialog] = useState(false);
  const [showWhatDialog, setShowWhatDialog] = useState(false);
  const [showWhenDialog, setShowWhenDialog] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [isWhoHaveDoneOpen, setIsWhoHaveDoneOpen] = useState(true);
  const [isWhoHaveNotDoneOpen, setIsWhoHaveNotDoneOpen] = useState(true);

  const segmentData = {
    triggerEvent: "WalletAddBalanceClick",
    haveDoneEvents: [
      { name: "Charged", qualifier: "First Time", timeframe: "In the last 30 days" },
    ],
    haveNotDoneEvents: [
      { id: "A", name: "user_deposit_success" },
      { id: "B", name: "Charged" },
    ],
  };

  const form = useForm({
    defaultValues: {
      segment: "",
      triggerEvent: "WalletAddBalanceClick",
      filterEnabled: true,
    },
  });

  const workflowService = new WorkflowService();

  useEffect(() => {
    workflowService.getTemplates().then((templates) => {
      setTemplates(templates);
    });
    workflowService.getUserEvents(true).then((fetchedEvents) => {
      setEvents(fetchedEvents.map((event) => event.name));
    });
  }, []);

  const handleSave = () => {
    onUpdate(editedAction);
    setIsEditing(false);
  };

  const handleTemplateSelect = async (templateId: string) => {
    const selectedTemplate = templates.find((t) => t.id === templateId);
    if (!selectedTemplate) return;

    if (!action.web_message) {
      const newWebMessage: Partial<WebMessage> = {
        title: selectedTemplate.name,
        message: selectedTemplate.description,
        message_type: "info",
        display_duration: 5000,
        template_name: selectedTemplate.id,
        template_config: {},
        position: "bottom-right",
        theme: "custom",
        custom_theme: {
          background: "#ffffff",
          text: "#333333",
          primary: "#007bff",
          secondary: "#6c757d",
        },
        is_active: true,
      };

      try {
        const message = await workflowService.addWebMessage(newWebMessage);
        action.web_message_id = message.id;
        onUpdate(action);
        setShowTemplateConfig(true);
      } catch (error) {
        console.error("Failed to add template:", error);
      }
    } else {
      action.web_message.template_name = selectedTemplate.name;
      try {
        await workflowService.updateWebMessage({
          ...action.web_message,
          template_name: selectedTemplate.id,
        });
        onUpdate(action);
        setShowTemplateConfig(true);
      } catch (error) {
        console.error("Failed to update template:", error);
      }
    }
  };

  const handleUpdateTemplate = async (template: WebMessage) => {
    try {
      await workflowService.updateWebMessage({
        ...template,
        template_name: template.template_name.toLowerCase().replace(" ", "_"),
      });
      action.web_message = template;
      onUpdate(action);
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await workflowService.deleteWebMessage(templateId);
      action.web_message = null;
      onUpdate(action);
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const getRevenuePropertyOptions = () => {
    const eventProps = node.data.eventProperties || {};
    const propertyOptions = Object.keys(eventProps);
    
    if (propertyOptions.length === 0) {
      return [
        { value: "currency_amount", label: "currency_amount" },
        { value: "total_value", label: "total_value" }
      ];
    }
    
    return propertyOptions.map(prop => ({
      value: prop,
      label: prop
    }));
  };

  const getConversionEventName = () => {
    return node.data.label || node.data.type || "unknown event";
  };

  return (
    <Card className="mb-4">
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {action.action_type}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(action.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 border-t">
        <div className="space-y-4">
          <div className="p-0">
            <div className="p-2 flex justify-between items-center flex-row">
              <p className="text-md font-medium">Goal</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGoalDialog(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            {action.conversion_tracking && (
              <div className="px-2 py-1 space-y-2 text-sm">
                <div>
                  <p className="font-medium">Conversion Event</p>
                  <p className="text-muted-foreground">{getConversionEventName()}</p>
                </div>
                {action.conversion_time && (
                  <div>
                    <p className="font-medium">Conversion Time</p>
                    <p className="text-muted-foreground">{action.conversion_time}</p>
                  </div>
                )}
                {action.revenue_property && (
                  <div>
                    <p className="font-medium">Revenue property</p>
                    <p className="text-muted-foreground">{action.revenue_property}</p>
                  </div>
                )}
              </div>
            )}
            <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Set a Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      checked={editedAction.conversion_tracking || false}
                      className="h-4 w-4"
                      onChange={(e) =>
                        setEditedAction({
                          ...editedAction,
                          conversion_tracking: e.target.checked,
                        })
                      }
                    />
                    Conversion Tracking
                  </Label>

                  {editedAction.conversion_tracking && (
                    <>
                      <div>
                        <Label>Conversion Time</Label>
                        <Select
                          value={editedAction.conversion_time || ""}
                          onValueChange={(value) =>
                            setEditedAction({
                              ...editedAction,
                              conversion_time: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select conversion time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4 Hours">4 Hours</SelectItem>
                            <SelectItem value="8 Hours">8 Hours</SelectItem>
                            <SelectItem value="12 Hours">12 Hours</SelectItem>
                            <SelectItem value="1 Day">1 Day</SelectItem>
                            <SelectItem value="2 Days">2 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Revenue Property</Label>
                        <Select
                          value={editedAction.revenue_property || ""}
                          onValueChange={(value) =>
                            setEditedAction({
                              ...editedAction,
                              revenue_property: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select revenue property" />
                          </SelectTrigger>
                          <SelectContent>
                            {getRevenuePropertyOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  <Button onClick={() => setShowGoalDialog(false)}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="space-y-4 border-t">
          <div className="p-0">
            <div className="p-2 flex justify-between items-center flex-row">
              <p className="text-md font-medium">Who</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWhoDialog(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="px-2 py-1 space-y-2 text-sm">
              <p>When a user does</p>
              <div className="ml-5 flex flex-wrap gap-1 mb-2">
                <Badge variant="secondary" className="bg-rose-100 text-rose-900 hover:bg-rose-200">
                  {segmentData.triggerEvent}
                </Badge>
              </div>
              
              <p>Filtered by</p>
              
              <div className="ml-5 mb-2">
                <p className="italic text-slate-600">Users who have done</p>
                <ul className="list-disc ml-8">
                  {segmentData.haveDoneEvents.map((event, idx) => (
                    <li key={idx} className="flex items-center gap-1 flex-wrap">
                      <Badge variant="secondary" className="bg-rose-100 text-rose-900 hover:bg-rose-200">
                        {event.name}
                      </Badge>
                      <span>{event.qualifier}</span>
                      <span>{event.timeframe}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="ml-5">
                <p className="italic text-slate-600">AND does not do</p>
                <ul className="list-disc ml-8">
                  {segmentData.haveNotDoneEvents.map((event, idx) => (
                    <li key={idx}>
                      <Badge variant="secondary" className="bg-rose-100 text-rose-900 hover:bg-rose-200">
                        {event.name}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="ml-5">
                <p className="italic text-slate-600">OR</p>
                <ul className="list-disc ml-8">
                  <li>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-900 hover:bg-rose-200">
                      Charged
                    </Badge>
                  </li>
                </ul>
              </div>
            </div>
            
            <Dialog open={showWhoDialog} onOpenChange={setShowWhoDialog}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Target Segment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-purple-800">Target Segment</p>
                    <div className="h-6 w-6 rounded-full bg-purple-300 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4 space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-lg">Find users from segment</p>
                      <Button variant="outline" className="bg-blue-50 text-blue-700">
                        Action: New segment
                      </Button>
                    </div>
                    
                    <Collapsible
                      open={true}
                      className="w-full border rounded-md"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                        <p className="font-medium">As soon as user does</p>
                        <ChevronDown className="h-5 w-5" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0 border-t">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="bg-blue-50 px-3 py-2 text-sm">
                            WalletAddBalanceClick
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Filter
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={filterEnabled}
                        onChange={(e) => setFilterEnabled(e.target.checked)}
                      />
                      <Label className="font-medium text-base">Filter on past behavior and user properties</Label>
                    </div>
                    
                    {filterEnabled && (
                      <>
                        <Collapsible
                          open={isWhoHaveDoneOpen}
                          onOpenChange={setIsWhoHaveDoneOpen}
                          className="w-full border rounded-md"
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                            <p className="font-medium">Who have done</p>
                            <ChevronDown className="h-5 w-5" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-4 pt-0 border-t">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="bg-slate-100 rounded-md py-2 px-3">
                                AND
                              </Badge>
                              <Badge variant="outline" className="bg-white border rounded-md py-2 px-3">
                                A
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-50 px-3 py-2">
                                Charged
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-50 px-3 py-2">
                                First Time
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-50 px-3 py-2 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                In the last 30 days
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline" className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" className="text-blue-500">
                                Add an event...
                              </Button>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <Collapsible
                          open={isWhoHaveNotDoneOpen}
                          onOpenChange={setIsWhoHaveNotDoneOpen}
                          className="w-full border rounded-md"
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-slate-100 rounded-md py-2 px-3">
                                AND
                              </Badge>
                              <p className="font-medium">Who have not done</p>
                            </div>
                            <ChevronDown className="h-5 w-5" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-4 pt-0 border-t">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="bg-white border rounded-md py-2 px-3">
                                A
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-50 px-3 py-2">
                                user_deposit_success
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="bg-slate-100 rounded-md py-2 px-3">
                                OR
                              </Badge>
                              <Badge variant="outline" className="bg-white border rounded-md py-2 px-3">
                                B
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-50 px-3 py-2">
                                Charged
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline" className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" className="text-blue-500">
                                Add an event...
                              </Button>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </>
                    )}
                  </div>
                  
                  <Button className="w-full" onClick={() => setShowWhoDialog(false)}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="space-y-4 border-t">
          <div className="p-0">
            <div className="p-2 flex justify-between items-center flex-row">
              <p className="text-md font-medium">What</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWhatDialog(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={showWhatDialog} onOpenChange={setShowWhatDialog}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Template Configuration</DialogTitle>
                </DialogHeader>
                <TemplateConfig
                  template={action.web_message}
                  onUpdate={handleUpdateTemplate}
                  onDelete={handleDeleteTemplate}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="space-y-4 border-t">
          <div className="p-0">
            <div className="p-2 flex justify-between items-center flex-row">
              <p className="text-md font-medium">When</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWhenDialog(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={showWhenDialog} onOpenChange={setShowWhenDialog}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Date and Time</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Label>Start Date and Time</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      name="start"
                      className="h-4 w-4"
                      checked={!editedAction.start_date}
                      onChange={() =>
                        setEditedAction({
                          ...editedAction,
                          start_date: "",
                        })
                      }
                    />
                    <span>Now</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="radio"
                      name="start"
                      className="h-4 w-4"
                      checked={!!editedAction.start_date}
                      onChange={() =>
                        setEditedAction({
                          ...editedAction,
                          start_date: new Date().toISOString().slice(0, 16),
                        })
                      }
                    />
                    <span>On a date/time</span>
                    <Input
                      type="datetime-local"
                      className="w-60"
                      value={editedAction.start_date || ""}
                      onChange={(e) =>
                        setEditedAction({
                          ...editedAction,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mt-4">End Date and Time</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="radio"
                        name="end"
                        className="h-4 w-4"
                        checked={!editedAction.end_date}
                        onChange={() =>
                          setEditedAction({
                            ...editedAction,
                            end_date: "",
                          })
                        }
                      />
                      <span>Never</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="radio"
                      name="end"
                      className="h-4 w-4"
                      checked={!!editedAction.end_date}
                      onChange={() =>
                        setEditedAction({
                          ...editedAction,
                          end_date: new Date().toISOString().slice(0, 16),
                        })
                      }
                    />
                    <span>On a date/time</span>
                    <Input
                      type="datetime-local"
                      className="w-60"
                      value={editedAction.end_date || ""}
                      onChange={(e) =>
                        setEditedAction({
                          ...editedAction,
                          end_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button onClick={() => setShowWhenDialog(false)}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <div>
              <Label>Delay (seconds)</Label>
              <Input
                type="number"
                value={editedAction.delay_seconds || 0}
                onChange={(e) =>
                  setEditedAction({
                    ...editedAction,
                    delay_seconds: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Action Config</Label>
              <Editor
                height="150px"
                defaultLanguage="json"
                value={JSON.stringify(editedAction.action_config, null, 2)}
                options={{
                  readOnly: false,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: "on",
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                }}
                onChange={(e) => {
                  try {
                    const config = JSON.parse(e);
                    setEditedAction({
                      ...editedAction,
                      action_config: config,
                    });
                  } catch (error) {
                    // Handle invalid JSON
                  }
                }}
              />
            </div>
            <div>
              <Label>Template</Label>
              <div className="flex gap-2">
                <Select
                  value={createSlug(action.web_message?.template_name || "")}
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {action.web_message && (
                  <Dialog
                    open={showTemplateConfig}
                    onOpenChange={setShowTemplateConfig}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Configure Template</DialogTitle>
                      </DialogHeader>
                      <TemplateConfig
                        template={action.web_message}
                        onUpdate={handleUpdateTemplate}
                        onDelete={handleDeleteTemplate}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm">
              Delay: {action.delay_seconds || 0} seconds
            </p>
            <p className="text-sm">Config</p>
            <pre className="text-xs whitespace-pre-wrap cursor-pointer hover:bg-muted p-2 rounded">
              {JSON.stringify(action.action_config)}
            </pre>
            {action.web_message && (
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  Template: {action.web_message.template_name}
                </p>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateConfig(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionConfig;
