import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CanvasWorkflow,
  TemplateListType,
  WebAction,
  WebEvent,
  WebMessage,
  Node,
} from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Save, Settings } from "lucide-react";
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

  const workflowService = new WorkflowService();

  useEffect(() => {
    workflowService.getTemplates().then((templates) => {
      setTemplates(templates);
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
      // Create new web message
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
      // Update existing web message
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

  return (
    <Card className="mb-4">
      <CardHeader className="py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {action.action_type}
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
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
      <CardContent className="py-2">
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
              <Input
                value={JSON.stringify(editedAction.action_config)}
                onChange={(e) => {
                  try {
                    const config = JSON.parse(e.target.value);
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
                    <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
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
            <p className="text-sm">
              Config: {JSON.stringify(action.action_config)}
            </p>
            {action.web_message && (
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  Template: {action.web_message.template_name}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplateConfig(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionConfig;
