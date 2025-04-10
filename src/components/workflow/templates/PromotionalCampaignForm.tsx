import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WebMessage } from "@/types/workflow";

interface PromotionalCampaignFormProps {
  template: WebMessage;
  onConfigChange: (key: string, value: any) => void;
}

const PromotionalCampaignForm: React.FC<PromotionalCampaignFormProps> = ({
  template,
  onConfigChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Label>Image URL</Label>
        <Input
          value={template.template_config?.image_url || ""}
          onChange={(e) => onConfigChange("image_url", e.target.value)}
        />
      </div>
      <div>
        <Label>Button Text</Label>
        <Input
          value={template.template_config?.button_text || ""}
          onChange={(e) => onConfigChange("button_text", e.target.value)}
        />
      </div>
      <div>
        <Label>Button URL</Label>
        <Input
          value={template.template_config?.button_url || ""}
          onChange={(e) => onConfigChange("button_url", e.target.value)}
        />
      </div>
      <div>
        <Label>Pricing Amount</Label>
        <Input
          type="number"
          value={template.template_config?.pricing?.amount || ""}
          onChange={(e) =>
            onConfigChange("pricing", {
              ...template.template_config?.pricing,
              amount: parseFloat(e.target.value),
            })
          }
        />
      </div>
      <div>
        <Label>Currency</Label>
        <Input
          value={template.template_config?.pricing?.currency || ""}
          onChange={(e) =>
            onConfigChange("pricing", {
              ...template.template_config?.pricing,
              currency: e.target.value,
            })
          }
        />
      </div>
      <div>
        <Label>Period</Label>
        <Input
          value={template.template_config?.pricing?.period || ""}
          onChange={(e) =>
            onConfigChange("pricing", {
              ...template.template_config?.pricing,
              period: e.target.value,
            })
          }
        />
      </div>
      <div>
        <Label>Countdown End Date</Label>
        <Input
          type="datetime-local"
          value={template.template_config?.countdown_end || ""}
          onChange={(e) => onConfigChange("countdown_end", e.target.value)}
        />
      </div>
    </div>
  );
};

export default PromotionalCampaignForm;
