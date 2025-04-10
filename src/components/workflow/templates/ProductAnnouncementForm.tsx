import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { WebMessage } from "@/types/workflow";

interface ProductAnnouncementFormProps {
  template: WebMessage;
  onConfigChange: (key: string, value: unknown) => void;
}

export const ProductAnnouncementForm: React.FC<
  ProductAnnouncementFormProps
> = ({ template, onConfigChange }) => {
  const features = template.template_config?.features || [];

  const handleAddFeature = () => {
    const newFeature = {
      title: "",
      description: "",
      icon: "",
    };
    onConfigChange("features", [...features, newFeature]);
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    onConfigChange("features", updatedFeatures);
  };

  const handleFeatureChange = (
    index: number,
    field: keyof (typeof features)[0],
    value: string
  ) => {
    const updatedFeatures = features.map((feature, i) => {
      if (i === index) {
        return { ...feature, [field]: value };
      }
      return feature;
    });
    onConfigChange("features", updatedFeatures);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <Label>Title</Label>
          <Input
            value={template.template_config?.title || ""}
            onChange={(e) => onConfigChange("title", e.target.value)}
            placeholder="Enter product title"
          />
        </div>
        <div>
          <Label>Message</Label>
          <Input
            value={template.template_config?.message || ""}
            onChange={(e) => onConfigChange("message", e.target.value)}
            placeholder="Enter product message"
          />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input
            value={template.template_config?.image_url || ""}
            onChange={(e) => onConfigChange("image_url", e.target.value)}
            placeholder="Enter product image URL"
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
          <Label>Features</Label>
          {features.map((feature, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Feature {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFeature(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={feature.title}
                onChange={(e) =>
                  handleFeatureChange(index, "title", e.target.value)
                }
                placeholder="Enter feature title"
              />
              <Input
                value={feature.description}
                onChange={(e) =>
                  handleFeatureChange(index, "description", e.target.value)
                }
                placeholder="Enter feature description"
              />
              <Input
                value={feature.icon}
                onChange={(e) =>
                  handleFeatureChange(index, "icon", e.target.value)
                }
                placeholder="Enter icon URL"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddFeature}
            className="w-full"
          >
            Add Feature
          </Button>
        </div>
      </div>
    </div>
  );
};
