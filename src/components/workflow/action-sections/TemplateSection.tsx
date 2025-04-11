
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { WebAction, WebMessage, TemplateListType } from "@/types/workflow";
import { WorkflowService } from "@/services/workflow";
import { createSlug } from "@/lib/utils";
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
import TemplateConfig from "../TemplateConfig";

interface TemplateSectionProps {
  action: WebAction;
  onUpdate: (action: WebAction) => void;
}

const TemplateSection: React.FC<TemplateSectionProps> = ({ action, onUpdate }) => {
  const [templates, setTemplates] = useState<TemplateListType[]>([]);
  const [showTemplateConfig, setShowTemplateConfig] = useState(false);
  const workflowService = new WorkflowService();

  useEffect(() => {
    workflowService.getTemplates().then((templates) => {
      setTemplates(templates);
    });
  }, []);

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
        const updatedAction = { ...action, web_message_id: message.id, web_message: message };
        onUpdate(updatedAction);
        setShowTemplateConfig(true);
      } catch (error) {
        console.error("Failed to add template:", error);
      }
    } else {
      // Update existing web message
      const updatedWebMessage = {
        ...action.web_message,
        template_name: selectedTemplate.id
      };
      
      try {
        await workflowService.updateWebMessage(updatedWebMessage);
        onUpdate({ ...action, web_message: updatedWebMessage });
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
      onUpdate({ ...action, web_message: template });
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await workflowService.deleteWebMessage(templateId);
      onUpdate({ ...action, web_message: null });
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  return (
    <div>
      <div className="space-y-2 mt-2">
        <div>
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
                <Button variant="outline" size="sm" className="mt-2">
                  <Settings className="h-4 w-4 mr-1" /> Configure Template
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
  );
};

export default TemplateSection;
