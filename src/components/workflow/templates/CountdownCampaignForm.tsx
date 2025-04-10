import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WebMessage } from "@/types/workflow";

interface CountdownCampaignFormProps {
  template: WebMessage;
  onConfigChange: (key: string, value: unknown) => void;
}

export const CountdownCampaignForm: React.FC<CountdownCampaignFormProps> = ({
  template,
  onConfigChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <Label>Title</Label>
          <Input
            value={template.template_config?.title || ""}
            onChange={(e) => onConfigChange("title", e.target.value)}
            placeholder="Enter countdown title"
          />
        </div>
        <div>
          <Label>Message</Label>
          <Input
            value={template.template_config?.message || ""}
            onChange={(e) => onConfigChange("message", e.target.value)}
            placeholder="Enter countdown message"
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="datetime-local"
            value={template.template_config?.end_date || ""}
            onChange={(e) => onConfigChange("end_date", e.target.value)}
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={template.template_config?.button_text || ""}
            onChange={(e) => onConfigChange("button_text", e.target.value)}
            placeholder="Enter button text"
          />
        </div>
        <div>
          <Label>Button URL</Label>
          <Input
            value={template.template_config?.button_url || ""}
            onChange={(e) => onConfigChange("button_url", e.target.value)}
            placeholder="Enter button URL"
          />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input
            value={template.template_config?.image_url || ""}
            onChange={(e) => onConfigChange("image_url", e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </div>
    </div>
  );
};
