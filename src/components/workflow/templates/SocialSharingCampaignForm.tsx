import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { WebMessage } from "@/types/workflow";

interface SocialSharingCampaignFormProps {
  template: WebMessage;
  onConfigChange: (key: string, value: unknown) => void;
}

export const SocialSharingCampaignForm: React.FC<
  SocialSharingCampaignFormProps
> = ({ template, onConfigChange }) => {
  const socialPlatforms = template.template_config?.social_platforms || [];

  const handleAddPlatform = () => {
    const newPlatform = {
      name: "",
      icon: "",
      url: "",
    };
    onConfigChange("social_platforms", [...socialPlatforms, newPlatform]);
  };

  const handleRemovePlatform = (index: number) => {
    const updatedPlatforms = socialPlatforms.filter((_, i) => i !== index);
    onConfigChange("social_platforms", updatedPlatforms);
  };

  const handlePlatformChange = (
    index: number,
    field: keyof (typeof socialPlatforms)[0],
    value: string
  ) => {
    const updatedPlatforms = socialPlatforms.map((platform, i) => {
      if (i === index) {
        return { ...platform, [field]: value };
      }
      return platform;
    });
    onConfigChange("social_platforms", updatedPlatforms);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <Label>Share URL</Label>
          <Input
            value={template.template_config?.share_url || ""}
            onChange={(e) => onConfigChange("share_url", e.target.value)}
            placeholder="Enter share URL"
          />
        </div>
        <div>
          <Label>Show Copy Link</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={template.template_config?.show_copy_link || false}
              onChange={(e) =>
                onConfigChange("show_copy_link", e.target.checked)
              }
            />
            <span>Enable copy link button</span>
          </div>
        </div>
        <div>
          <Label>Social Platforms</Label>
          {socialPlatforms.map((platform, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Platform {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePlatform(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={platform.name}
                onChange={(e) =>
                  handlePlatformChange(index, "name", e.target.value)
                }
                placeholder="Enter platform name"
              />
              <Input
                value={platform.icon}
                onChange={(e) =>
                  handlePlatformChange(index, "icon", e.target.value)
                }
                placeholder="Enter icon URL"
              />
              <Input
                value={platform.url}
                onChange={(e) =>
                  handlePlatformChange(index, "url", e.target.value)
                }
                placeholder="Enter share URL"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddPlatform}
            className="w-full"
          >
            Add Platform
          </Button>
        </div>
      </div>
    </div>
  );
};
