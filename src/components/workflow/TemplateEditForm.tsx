import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebMessage } from "@/types/workflow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateEditFormProps {
  template: WebMessage;
  onTemplateChange: (template: WebMessage) => void;
}

const TemplateEditForm: React.FC<TemplateEditFormProps> = ({
  template,
  onTemplateChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Label>Title</Label>
        <Input
          value={template.title}
          onChange={(e) =>
            onTemplateChange({
              ...template,
              title: e.target.value,
            })
          }
        />
      </div>
      <div>
        <Label>Message</Label>
        <Input
          value={template.message}
          onChange={(e) =>
            onTemplateChange({
              ...template,
              message: e.target.value,
            })
          }
        />
      </div>
      <div>
        <Label>Message Type</Label>
        <Select
          value={template.message_type}
          onValueChange={(value) =>
            onTemplateChange({
              ...template,
              message_type: value as "info" | "warning" | "success" | "error",
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
          value={template.display_duration}
          onChange={(e) =>
            onTemplateChange({
              ...template,
              display_duration: parseInt(e.target.value),
            })
          }
        />
      </div>
      <div>
        <Label>Position</Label>
        <Select
          value={template.position}
          onValueChange={(value) =>
            onTemplateChange({
              ...template,
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
          value={template.theme}
          onValueChange={(value) =>
            onTemplateChange({
              ...template,
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
      {template.theme === "custom" && (
        <div className="space-y-2">
          <Label>Custom Theme</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Background</Label>
              <Input
                type="color"
                value={template.custom_theme.background}
                onChange={(e) =>
                  onTemplateChange({
                    ...template,
                    custom_theme: {
                      ...template.custom_theme,
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
                value={template.custom_theme.text}
                onChange={(e) =>
                  onTemplateChange({
                    ...template,
                    custom_theme: {
                      ...template.custom_theme,
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
                value={template.custom_theme.primary}
                onChange={(e) =>
                  onTemplateChange({
                    ...template,
                    custom_theme: {
                      ...template.custom_theme,
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
                value={template.custom_theme.secondary}
                onChange={(e) =>
                  onTemplateChange({
                    ...template,
                    custom_theme: {
                      ...template.custom_theme,
                      secondary: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEditForm;
