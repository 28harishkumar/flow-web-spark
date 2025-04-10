import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebMessage } from "@/types/workflow";

interface FeedbackCampaignFormProps {
  template: WebMessage;
  onConfigChange: (key: string, value: unknown) => void;
}

const FeedbackCampaignForm: React.FC<FeedbackCampaignFormProps> = ({
  template,
  onConfigChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Label>Rating Options</Label>
        <div className="space-y-2">
          {template.template_config?.rating_options?.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="number"
                value={option.value}
                onChange={(e) => {
                  const newOptions = [
                    ...(template.template_config?.rating_options || []),
                  ];
                  newOptions[index] = {
                    ...option,
                    value: parseInt(e.target.value),
                  };
                  onConfigChange("rating_options", newOptions);
                }}
              />
              <Input
                value={option.label}
                onChange={(e) => {
                  const newOptions = [
                    ...(template.template_config?.rating_options || []),
                  ];
                  newOptions[index] = {
                    ...option,
                    label: e.target.value,
                  };
                  onConfigChange("rating_options", newOptions);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newOptions = [
                    ...(template.template_config?.rating_options || []),
                  ];
                  newOptions.splice(index, 1);
                  onConfigChange("rating_options", newOptions);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newOptions = [
                ...(template.template_config?.rating_options || []),
                { value: 0, label: "" },
              ];
              onConfigChange("rating_options", newOptions);
            }}
          >
            Add Option
          </Button>
        </div>
      </div>
      <div>
        <Label>Show Comment Box</Label>
        <Select
          value={
            template.template_config?.show_comment_box?.toString() || "false"
          }
          onValueChange={(value) =>
            onConfigChange("show_comment_box", value === "true")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Comment Placeholder</Label>
        <Input
          value={template.template_config?.comment_placeholder || ""}
          onChange={(e) =>
            onConfigChange("comment_placeholder", e.target.value)
          }
        />
      </div>
    </div>
  );
};

export default FeedbackCampaignForm;
