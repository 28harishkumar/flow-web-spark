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
import { Trash2, Edit2, Save } from "lucide-react";
import TemplateConfig from "./TemplateConfig";
import { WorkflowService } from "@/services/workflow";

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

  const addTemplate = (template: TemplateListType) => {
    const newTemplate: Partial<WebMessage> = {
      title: "",
      message: "",
      message_type: "info",
      display_duration: 5000,
      template_name: template.name,
      template_config: {},
      position: "bottom-right",
      theme: "custom",
      custom_theme: {
        background: "#ffffff",
        text: "#333333",
        primary: "#007bff",
        secondary: "#6c757d",
      },
    };
  };

  const handleUpdateTemplate = async (template: WebMessage) => {
    try {
      await workflowService.updateTemplate(template, workflow.id);
      action.web_message = template;
      onUpdate(action);
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await workflowService.deleteTemplate(templateId, workflow.id);
      action.web_message = null;
      onUpdate(action);
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  return (
    <>
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
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm">
                Delay: {action.delay_seconds || 0} seconds
              </p>
              <p className="text-sm">
                Config: {JSON.stringify(action.action_config)}
              </p>
            </div>
          )}

          {action.web_message && (
            <TemplateConfig
              key={action.web_message.id}
              template={action.web_message}
              onUpdate={handleUpdateTemplate}
              onDelete={handleDeleteTemplate}
            />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-2">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left h-auto py-2"
              onClick={() => addTemplate(template)}
            >
              <div>
                <p>{template.name}</p>
                <p className="text-xs text-muted-foreground">
                  {template.description}
                </p>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default ActionConfig;
