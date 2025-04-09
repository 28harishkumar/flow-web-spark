import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebMessage } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templates } from "./templates";

interface TemplateConfigProps {
  template: WebMessage;
  onUpdate: (template: WebMessage) => void;
  onDelete: (templateId: string) => void;
}

const TemplateConfig: React.FC<TemplateConfigProps> = ({
  template,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<WebMessage>(template);
  const TemplateComponent =
    templates[template.template_name as keyof typeof templates];

  const handleSave = () => {
    onUpdate(editedTemplate);
    setIsEditing(false);
  };

  const handleConfigChange = (
    key: string,
    value: string | number | boolean | object
  ) => {
    setEditedTemplate({
      ...editedTemplate,
      template_config: {
        ...editedTemplate.template_config,
        [key]: value,
      },
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {template.template_name}
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
              onClick={() => onDelete(template.id)}
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
              <Label>Title</Label>
              <Input
                value={editedTemplate.title}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Message</Label>
              <Input
                value={editedTemplate.message}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    message: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Message Type</Label>
              <Select
                value={editedTemplate.message_type}
                onValueChange={(value) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    message_type: value as
                      | "info"
                      | "warning"
                      | "success"
                      | "error",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Display Duration (ms)</Label>
              <Input
                type="number"
                value={editedTemplate.display_duration}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    display_duration: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Position</Label>
              <Select
                value={editedTemplate.position}
                onValueChange={(value) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    position: value as
                      | "top-right"
                      | "top-left"
                      | "bottom-right"
                      | "bottom-left"
                      | "center",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Theme</Label>
              <Select
                value={editedTemplate.theme}
                onValueChange={(value) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    theme: value as "light" | "dark" | "custom",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editedTemplate.theme === "custom" && (
              <div className="space-y-2">
                <Label>Custom Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Background</Label>
                    <Input
                      type="color"
                      value={editedTemplate.custom_theme.background}
                      onChange={(e) =>
                        setEditedTemplate({
                          ...editedTemplate,
                          custom_theme: {
                            ...editedTemplate.custom_theme,
                            background: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Text</Label>
                    <Input
                      type="color"
                      value={editedTemplate.custom_theme.text}
                      onChange={(e) =>
                        setEditedTemplate({
                          ...editedTemplate,
                          custom_theme: {
                            ...editedTemplate.custom_theme,
                            text: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Primary</Label>
                    <Input
                      type="color"
                      value={editedTemplate.custom_theme.primary}
                      onChange={(e) =>
                        setEditedTemplate({
                          ...editedTemplate,
                          custom_theme: {
                            ...editedTemplate.custom_theme,
                            primary: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Secondary</Label>
                    <Input
                      type="color"
                      value={editedTemplate.custom_theme.secondary}
                      onChange={(e) =>
                        setEditedTemplate({
                          ...editedTemplate,
                          custom_theme: {
                            ...editedTemplate.custom_theme,
                            secondary: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Template-specific configuration */}
            {TemplateComponent && (
              <div className="mt-4">
                <Label>Template Configuration</Label>
                {/* Add template-specific configuration fields here */}
                {/* For example, for SpecialOffer: */}
                {template.template_name === "special-offer" && (
                  <div className="space-y-2">
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={editedTemplate.template_config?.image_url || ""}
                        onChange={(e) =>
                          handleConfigChange("image_url", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Button Text</Label>
                      <Input
                        value={
                          editedTemplate.template_config?.button_text || ""
                        }
                        onChange={(e) =>
                          handleConfigChange("button_text", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Button URL</Label>
                      <Input
                        value={editedTemplate.template_config?.button_url || ""}
                        onChange={(e) =>
                          handleConfigChange("button_url", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
                {/* Add configuration fields for other template types */}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm">Title: {template.title}</p>
            <p className="text-sm">Message: {template.message}</p>
            <p className="text-sm">Type: {template.message_type}</p>
            <p className="text-sm">Duration: {template.display_duration}ms</p>
            <p className="text-sm">Position: {template.position}</p>
            <p className="text-sm">Theme: {template.theme}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateConfig;
