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
import { createSlug } from "@/lib/utils";
import CommonFormFields from "./templates/CommonFormFields";
import { ProductAnnouncementForm } from "./templates/ProductAnnouncementForm";
import { CountdownCampaignForm } from "./templates/CountdownCampaignForm";
import { SocialSharingCampaignForm } from "./templates/SocialSharingCampaignForm";
import { NewsletterCampaignForm } from "./templates/NewsletterCampaignForm";
import SurveyCampaignForm from "./templates/SurveyCampaignForm";
import FeedbackCampaignForm from "./templates/FeedbackCampaignForm";
import PromotionalCampaignForm from "./templates/PromotionalCampaignForm";
import TemplateEditForm from "./TemplateEditForm";
import { WelcomeMessageForm } from "./templates/WelcomeMessageForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    templates[createSlug(template.template_name) as keyof typeof templates];

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

  const renderTemplateForm = () => {
    switch (createSlug(template.template_name) as keyof typeof templates) {
      case "promotional_campaign":
        return (
          <PromotionalCampaignForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      case "feedback_campaign":
        return (
          <FeedbackCampaignForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      case "survey_campaign":
        return (
          <SurveyCampaignForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      case "newsletter_campaign":
        return (
          <NewsletterCampaignForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      case "social_sharing_campaign":
        return (
          <SocialSharingCampaignForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      case "countdown_campaign":
        return (
          <CountdownCampaignForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      case "product_announcement":
        return (
          <ProductAnnouncementForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      case "welcome_campaign":
        return (
          <WelcomeMessageForm
            template={editedTemplate}
            onConfigChange={handleConfigChange}
          />
        );
      default:
        return null;
    }
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
          <div className="space-y-2 grid grid-cols-2 gap-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="template">Template Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="mt-4">
                <TemplateEditForm
                  template={editedTemplate}
                  onTemplateChange={setEditedTemplate}
                />
              </TabsContent>
              <TabsContent value="template" className="mt-4">
                {TemplateComponent && (
                  <div>
                    <Label>Template Configuration</Label>
                    {renderTemplateForm()}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            {TemplateComponent && (
              <div className="flex justify-end">
                <Label>Template Preview</Label>
                <TemplateComponent template={editedTemplate} />
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
