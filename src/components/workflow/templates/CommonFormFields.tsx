import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { WebMessage } from "@/types/workflow";

interface CommonFormFieldsProps {
  template: WebMessage;
  onConfigChange: (key: string, value: unknown) => void;
}

const CommonFormFields: React.FC<CommonFormFieldsProps> = ({
  template,
  onConfigChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Label>Preferences</Label>
        <div className="space-y-2">
          {template.template_config?.preferences?.map((preference, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={preference}
                onChange={(e) => {
                  const newPreferences = [
                    ...(template.template_config?.preferences || []),
                  ];
                  newPreferences[index] = e.target.value;
                  onConfigChange("preferences", newPreferences);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newPreferences = [
                    ...(template.template_config?.preferences || []),
                  ];
                  newPreferences.splice(index, 1);
                  onConfigChange("preferences", newPreferences);
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
              const newPreferences = [
                ...(template.template_config?.preferences || []),
                "",
              ];
              onConfigChange("preferences", newPreferences);
            }}
          >
            Add Preference
          </Button>
        </div>
      </div>
      <div>
        <Label>Benefits</Label>
        <div className="space-y-2">
          {template.template_config?.benefits?.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={benefit}
                onChange={(e) => {
                  const newBenefits = [
                    ...(template.template_config?.benefits || []),
                  ];
                  newBenefits[index] = e.target.value;
                  onConfigChange("benefits", newBenefits);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newBenefits = [
                    ...(template.template_config?.benefits || []),
                  ];
                  newBenefits.splice(index, 1);
                  onConfigChange("benefits", newBenefits);
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
              const newBenefits = [
                ...(template.template_config?.benefits || []),
                "",
              ];
              onConfigChange("benefits", newBenefits);
            }}
          >
            Add Benefit
          </Button>
        </div>
      </div>
      <div>
        <Label>Platforms</Label>
        <div className="space-y-2">
          {template.template_config?.platforms?.map((platform, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={platform}
                onChange={(e) => {
                  const newPlatforms = [
                    ...(template.template_config?.platforms || []),
                  ];
                  newPlatforms[index] = e.target.value;
                  onConfigChange("platforms", newPlatforms);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newPlatforms = [
                    ...(template.template_config?.platforms || []),
                  ];
                  newPlatforms.splice(index, 1);
                  onConfigChange("platforms", newPlatforms);
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
              const newPlatforms = [
                ...(template.template_config?.platforms || []),
                "",
              ];
              onConfigChange("platforms", newPlatforms);
            }}
          >
            Add Platform
          </Button>
        </div>
      </div>
      <div>
        <Label>Referral Code</Label>
        <Input
          value={template.template_config?.referral_code || ""}
          onChange={(e) => onConfigChange("referral_code", e.target.value)}
        />
      </div>
    </div>
  );
};

export default CommonFormFields;
