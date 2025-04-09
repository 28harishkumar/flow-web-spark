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
          <div className="grid grid-cols-3 gap-4">
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
            </div>
            <div className="space-y-2">
              {TemplateComponent && (
                <div className="mt-4">
                  <Label>Template Configuration</Label>
                  {template.template_name === "promotional_campaign" && (
                    <div className="space-y-2">
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={
                            editedTemplate.template_config?.image_url || ""
                          }
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
                          value={
                            editedTemplate.template_config?.button_url || ""
                          }
                          onChange={(e) =>
                            handleConfigChange("button_url", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Pricing Amount</Label>
                        <Input
                          type="number"
                          value={
                            editedTemplate.template_config?.pricing?.amount ||
                            ""
                          }
                          onChange={(e) =>
                            handleConfigChange("pricing", {
                              ...editedTemplate.template_config?.pricing,
                              amount: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Input
                          value={
                            editedTemplate.template_config?.pricing?.currency ||
                            ""
                          }
                          onChange={(e) =>
                            handleConfigChange("pricing", {
                              ...editedTemplate.template_config?.pricing,
                              currency: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Period</Label>
                        <Input
                          value={
                            editedTemplate.template_config?.pricing?.period ||
                            ""
                          }
                          onChange={(e) =>
                            handleConfigChange("pricing", {
                              ...editedTemplate.template_config?.pricing,
                              period: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Countdown End Date</Label>
                        <Input
                          type="datetime-local"
                          value={
                            editedTemplate.template_config?.countdown_end || ""
                          }
                          onChange={(e) =>
                            handleConfigChange("countdown_end", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                  {template.template_name === "feedback_campaign" && (
                    <div className="space-y-2">
                      <div>
                        <Label>Rating Options</Label>
                        <div className="space-y-2">
                          {editedTemplate.template_config?.rating_options?.map(
                            (option, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  type="number"
                                  value={option.value}
                                  onChange={(e) => {
                                    const newOptions = [
                                      ...(editedTemplate.template_config
                                        ?.rating_options || []),
                                    ];
                                    newOptions[index] = {
                                      ...option,
                                      value: parseInt(e.target.value),
                                    };
                                    handleConfigChange(
                                      "rating_options",
                                      newOptions
                                    );
                                  }}
                                />
                                <Input
                                  value={option.label}
                                  onChange={(e) => {
                                    const newOptions = [
                                      ...(editedTemplate.template_config
                                        ?.rating_options || []),
                                    ];
                                    newOptions[index] = {
                                      ...option,
                                      label: e.target.value,
                                    };
                                    handleConfigChange(
                                      "rating_options",
                                      newOptions
                                    );
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newOptions = [
                                      ...(editedTemplate.template_config
                                        ?.rating_options || []),
                                    ];
                                    newOptions.splice(index, 1);
                                    handleConfigChange(
                                      "rating_options",
                                      newOptions
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = [
                                ...(editedTemplate.template_config
                                  ?.rating_options || []),
                                { value: 0, label: "" },
                              ];
                              handleConfigChange("rating_options", newOptions);
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
                            editedTemplate.template_config?.show_comment_box?.toString() ||
                            "false"
                          }
                          onValueChange={(value) =>
                            handleConfigChange(
                              "show_comment_box",
                              value === "true"
                            )
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
                          value={
                            editedTemplate.template_config
                              ?.comment_placeholder || ""
                          }
                          onChange={(e) =>
                            handleConfigChange(
                              "comment_placeholder",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                  {template.template_name === "survey_campaign" && (
                    <div className="space-y-2">
                      <div>
                        <Label>Questions</Label>
                        <div className="space-y-2">
                          {editedTemplate.template_config?.questions?.map(
                            (question, index) => (
                              <div
                                key={index}
                                className="space-y-2 border p-2 rounded"
                              >
                                <div className="flex justify-between">
                                  <Label>Question {index + 1}</Label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newQuestions = [
                                        ...(editedTemplate.template_config
                                          ?.questions || []),
                                      ];
                                      newQuestions.splice(index, 1);
                                      handleConfigChange(
                                        "questions",
                                        newQuestions
                                      );
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div>
                                  <Label>Text</Label>
                                  <Input
                                    value={question.text}
                                    onChange={(e) => {
                                      const newQuestions = [
                                        ...(editedTemplate.template_config
                                          ?.questions || []),
                                      ];
                                      newQuestions[index] = {
                                        ...question,
                                        text: e.target.value,
                                      };
                                      handleConfigChange(
                                        "questions",
                                        newQuestions
                                      );
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  <Select
                                    value={question.type}
                                    onValueChange={(value) => {
                                      const newQuestions = [
                                        ...(editedTemplate.template_config
                                          ?.questions || []),
                                      ];
                                      newQuestions[index] = {
                                        ...question,
                                        type: value as
                                          | "multiple_choice"
                                          | "text"
                                          | "scale",
                                      };
                                      handleConfigChange(
                                        "questions",
                                        newQuestions
                                      );
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple_choice">
                                        Multiple Choice
                                      </SelectItem>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="scale">
                                        Scale
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {question.type === "multiple_choice" && (
                                  <div>
                                    <Label>Options</Label>
                                    <div className="space-y-2">
                                      {question.options?.map(
                                        (option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="flex gap-2"
                                          >
                                            <Input
                                              value={option}
                                              onChange={(e) => {
                                                const newQuestions = [
                                                  ...(editedTemplate
                                                    .template_config
                                                    ?.questions || []),
                                                ];
                                                const newOptions = [
                                                  ...(question.options || []),
                                                ];
                                                newOptions[optionIndex] =
                                                  e.target.value;
                                                newQuestions[index] = {
                                                  ...question,
                                                  options: newOptions,
                                                };
                                                handleConfigChange(
                                                  "questions",
                                                  newQuestions
                                                );
                                              }}
                                            />
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                const newQuestions = [
                                                  ...(editedTemplate
                                                    .template_config
                                                    ?.questions || []),
                                                ];
                                                const newOptions = [
                                                  ...(question.options || []),
                                                ];
                                                newOptions.splice(
                                                  optionIndex,
                                                  1
                                                );
                                                newQuestions[index] = {
                                                  ...question,
                                                  options: newOptions,
                                                };
                                                handleConfigChange(
                                                  "questions",
                                                  newQuestions
                                                );
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )
                                      )}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newQuestions = [
                                            ...(editedTemplate.template_config
                                              ?.questions || []),
                                          ];
                                          const newOptions = [
                                            ...(question.options || []),
                                            "",
                                          ];
                                          newQuestions[index] = {
                                            ...question,
                                            options: newOptions,
                                          };
                                          handleConfigChange(
                                            "questions",
                                            newQuestions
                                          );
                                        }}
                                      >
                                        Add Option
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                {question.type === "scale" && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label>Min Value</Label>
                                      <Input
                                        type="number"
                                        value={question.min || 0}
                                        onChange={(e) => {
                                          const newQuestions = [
                                            ...(editedTemplate.template_config
                                              ?.questions || []),
                                          ];
                                          newQuestions[index] = {
                                            ...question,
                                            min: parseInt(e.target.value),
                                          };
                                          handleConfigChange(
                                            "questions",
                                            newQuestions
                                          );
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label>Max Value</Label>
                                      <Input
                                        type="number"
                                        value={question.max || 10}
                                        onChange={(e) => {
                                          const newQuestions = [
                                            ...(editedTemplate.template_config
                                              ?.questions || []),
                                          ];
                                          newQuestions[index] = {
                                            ...question,
                                            max: parseInt(e.target.value),
                                          };
                                          handleConfigChange(
                                            "questions",
                                            newQuestions
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newQuestions = [
                                ...(editedTemplate.template_config?.questions ||
                                  []),
                                {
                                  id: Math.random().toString(36).substr(2, 9),
                                  text: "",
                                  type: "text",
                                },
                              ];
                              handleConfigChange("questions", newQuestions);
                            }}
                          >
                            Add Question
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {template.template_name === "newsletter_campaign" && (
                    <div className="space-y-2">
                      <div>
                        <Label>Email Placeholder</Label>
                        <Input
                          value={
                            editedTemplate.template_config?.email_placeholder ||
                            ""
                          }
                          onChange={(e) =>
                            handleConfigChange(
                              "email_placeholder",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Show Name Field</Label>
                        <Select
                          value={
                            editedTemplate.template_config?.show_name_field?.toString() ||
                            "false"
                          }
                          onValueChange={(value) =>
                            handleConfigChange(
                              "show_name_field",
                              value === "true"
                            )
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
                      {editedTemplate.template_config?.show_name_field && (
                        <div>
                          <Label>Name Placeholder</Label>
                          <Input
                            value={
                              editedTemplate.template_config
                                ?.name_placeholder || ""
                            }
                            onChange={(e) =>
                              handleConfigChange(
                                "name_placeholder",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                      <div>
                        <Label>Show Consent Checkbox</Label>
                        <Select
                          value={
                            editedTemplate.template_config?.show_consent_checkbox?.toString() ||
                            "false"
                          }
                          onValueChange={(value) =>
                            handleConfigChange(
                              "show_consent_checkbox",
                              value === "true"
                            )
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
                      {editedTemplate.template_config
                        ?.show_consent_checkbox && (
                        <div>
                          <Label>Consent Text</Label>
                          <Input
                            value={
                              editedTemplate.template_config?.consent_text || ""
                            }
                            onChange={(e) =>
                              handleConfigChange("consent_text", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {template.template_name === "social_sharing_campaign" && (
                    <div className="space-y-2">
                      <div>
                        <Label>Social Platforms</Label>
                        <div className="space-y-2">
                          {editedTemplate.template_config?.social_platforms?.map(
                            (platform, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Platform Name"
                                  value={platform.name}
                                  onChange={(e) => {
                                    const newPlatforms = [
                                      ...(editedTemplate.template_config
                                        ?.social_platforms || []),
                                    ];
                                    newPlatforms[index] = {
                                      ...platform,
                                      name: e.target.value,
                                    };
                                    handleConfigChange(
                                      "social_platforms",
                                      newPlatforms
                                    );
                                  }}
                                />
                                <Input
                                  placeholder="Icon URL"
                                  value={platform.icon}
                                  onChange={(e) => {
                                    const newPlatforms = [
                                      ...(editedTemplate.template_config
                                        ?.social_platforms || []),
                                    ];
                                    newPlatforms[index] = {
                                      ...platform,
                                      icon: e.target.value,
                                    };
                                    handleConfigChange(
                                      "social_platforms",
                                      newPlatforms
                                    );
                                  }}
                                />
                                <Input
                                  placeholder="Share URL"
                                  value={platform.url}
                                  onChange={(e) => {
                                    const newPlatforms = [
                                      ...(editedTemplate.template_config
                                        ?.social_platforms || []),
                                    ];
                                    newPlatforms[index] = {
                                      ...platform,
                                      url: e.target.value,
                                    };
                                    handleConfigChange(
                                      "social_platforms",
                                      newPlatforms
                                    );
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newPlatforms = [
                                      ...(editedTemplate.template_config
                                        ?.social_platforms || []),
                                    ];
                                    newPlatforms.splice(index, 1);
                                    handleConfigChange(
                                      "social_platforms",
                                      newPlatforms
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newPlatforms = [
                                ...(editedTemplate.template_config
                                  ?.social_platforms || []),
                                { name: "", icon: "", url: "" },
                              ];
                              handleConfigChange(
                                "social_platforms",
                                newPlatforms
                              );
                            }}
                          >
                            Add Platform
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Show Copy Link</Label>
                        <Select
                          value={
                            editedTemplate.template_config?.show_copy_link?.toString() ||
                            "false"
                          }
                          onValueChange={(value) =>
                            handleConfigChange(
                              "show_copy_link",
                              value === "true"
                            )
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
                        <Label>Share URL</Label>
                        <Input
                          value={
                            editedTemplate.template_config?.share_url || ""
                          }
                          onChange={(e) =>
                            handleConfigChange("share_url", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                  {template.template_name === "countdown_campaign" && (
                    <div className="space-y-2">
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="datetime-local"
                          value={editedTemplate.template_config?.end_date || ""}
                          onChange={(e) =>
                            handleConfigChange("end_date", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                  {template.template_name === "product_announcement" && (
                    <div className="space-y-2">
                      <div>
                        <Label>Features</Label>
                        <div className="space-y-2">
                          {editedTemplate.template_config?.features?.map(
                            (feature, index) => (
                              <div
                                key={index}
                                className="space-y-2 border p-2 rounded"
                              >
                                <div className="flex justify-between">
                                  <Label>Feature {index + 1}</Label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newFeatures = [
                                        ...(editedTemplate.template_config
                                          ?.features || []),
                                      ];
                                      newFeatures.splice(index, 1);
                                      handleConfigChange(
                                        "features",
                                        newFeatures
                                      );
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div>
                                  <Label>Title</Label>
                                  <Input
                                    value={feature.title}
                                    onChange={(e) => {
                                      const newFeatures = [
                                        ...(editedTemplate.template_config
                                          ?.features || []),
                                      ];
                                      newFeatures[index] = {
                                        ...feature,
                                        title: e.target.value,
                                      };
                                      handleConfigChange(
                                        "features",
                                        newFeatures
                                      );
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Input
                                    value={feature.description}
                                    onChange={(e) => {
                                      const newFeatures = [
                                        ...(editedTemplate.template_config
                                          ?.features || []),
                                      ];
                                      newFeatures[index] = {
                                        ...feature,
                                        description: e.target.value,
                                      };
                                      handleConfigChange(
                                        "features",
                                        newFeatures
                                      );
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label>Icon URL</Label>
                                  <Input
                                    value={feature.icon}
                                    onChange={(e) => {
                                      const newFeatures = [
                                        ...(editedTemplate.template_config
                                          ?.features || []),
                                      ];
                                      newFeatures[index] = {
                                        ...feature,
                                        icon: e.target.value,
                                      };
                                      handleConfigChange(
                                        "features",
                                        newFeatures
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFeatures = [
                                ...(editedTemplate.template_config?.features ||
                                  []),
                                { title: "", description: "", icon: "" },
                              ];
                              handleConfigChange("features", newFeatures);
                            }}
                          >
                            Add Feature
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Common fields for all templates */}
                  <div className="space-y-2 mt-4">
                    <Label>Common Configuration</Label>
                    <div>
                      <Label>Preferences</Label>
                      <div className="space-y-2">
                        {editedTemplate.template_config?.preferences?.map(
                          (preference, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={preference}
                                onChange={(e) => {
                                  const newPreferences = [
                                    ...(editedTemplate.template_config
                                      ?.preferences || []),
                                  ];
                                  newPreferences[index] = e.target.value;
                                  handleConfigChange(
                                    "preferences",
                                    newPreferences
                                  );
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newPreferences = [
                                    ...(editedTemplate.template_config
                                      ?.preferences || []),
                                  ];
                                  newPreferences.splice(index, 1);
                                  handleConfigChange(
                                    "preferences",
                                    newPreferences
                                  );
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPreferences = [
                              ...(editedTemplate.template_config?.preferences ||
                                []),
                              "",
                            ];
                            handleConfigChange("preferences", newPreferences);
                          }}
                        >
                          Add Preference
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Benefits</Label>
                      <div className="space-y-2">
                        {editedTemplate.template_config?.benefits?.map(
                          (benefit, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={benefit}
                                onChange={(e) => {
                                  const newBenefits = [
                                    ...(editedTemplate.template_config
                                      ?.benefits || []),
                                  ];
                                  newBenefits[index] = e.target.value;
                                  handleConfigChange("benefits", newBenefits);
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newBenefits = [
                                    ...(editedTemplate.template_config
                                      ?.benefits || []),
                                  ];
                                  newBenefits.splice(index, 1);
                                  handleConfigChange("benefits", newBenefits);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newBenefits = [
                              ...(editedTemplate.template_config?.benefits ||
                                []),
                              "",
                            ];
                            handleConfigChange("benefits", newBenefits);
                          }}
                        >
                          Add Benefit
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Platforms</Label>
                      <div className="space-y-2">
                        {editedTemplate.template_config?.platforms?.map(
                          (platform, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={platform}
                                onChange={(e) => {
                                  const newPlatforms = [
                                    ...(editedTemplate.template_config
                                      ?.platforms || []),
                                  ];
                                  newPlatforms[index] = e.target.value;
                                  handleConfigChange("platforms", newPlatforms);
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newPlatforms = [
                                    ...(editedTemplate.template_config
                                      ?.platforms || []),
                                  ];
                                  newPlatforms.splice(index, 1);
                                  handleConfigChange("platforms", newPlatforms);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPlatforms = [
                              ...(editedTemplate.template_config?.platforms ||
                                []),
                              "",
                            ];
                            handleConfigChange("platforms", newPlatforms);
                          }}
                        >
                          Add Platform
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Referral Code</Label>
                      <Input
                        value={
                          editedTemplate.template_config?.referral_code || ""
                        }
                        onChange={(e) =>
                          handleConfigChange("referral_code", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Template Preview</Label>
              {TemplateComponent && (
                <TemplateComponent template={editedTemplate} />
              )}
            </div>
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
