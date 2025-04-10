import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { WebMessage } from "@/types/workflow";

interface NewsletterCampaignFormProps {
  template: WebMessage;
  onConfigChange: (key: string, value: unknown) => void;
}

export const NewsletterCampaignForm: React.FC<NewsletterCampaignFormProps> = ({
  template,
  onConfigChange,
}) => {
  const questions = template.template_config?.questions || [];

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      text: "",
      type: "text" as const,
    };
    onConfigChange("questions", [...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    const updatedQuestions = questions.filter((question) => question.id !== id);
    onConfigChange("questions", updatedQuestions);
  };

  const handleQuestionChange = (
    id: string,
    field: "text" | "type",
    value: string
  ) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === id) {
        return { ...question, [field]: value };
      }
      return question;
    });
    onConfigChange("questions", updatedQuestions);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <Label>Title</Label>
          <Input
            value={template.template_config?.title || ""}
            onChange={(e) => onConfigChange("title", e.target.value)}
            placeholder="Enter newsletter title"
          />
        </div>
        <div>
          <Label>Message</Label>
          <Input
            value={template.template_config?.message || ""}
            onChange={(e) => onConfigChange("message", e.target.value)}
            placeholder="Enter newsletter message"
          />
        </div>
        <div>
          <Label>Email Placeholder</Label>
          <Input
            value={template.template_config?.email_placeholder || ""}
            onChange={(e) =>
              onConfigChange("email_placeholder", e.target.value)
            }
            placeholder="Enter email placeholder"
          />
        </div>
        <div>
          <Label>Show Name Field</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={template.template_config?.show_name_field || false}
              onChange={(e) =>
                onConfigChange("show_name_field", e.target.checked)
              }
            />
            <span>Enable name field</span>
          </div>
        </div>
        {template.template_config?.show_name_field && (
          <div>
            <Label>Name Placeholder</Label>
            <Input
              value={template.template_config?.name_placeholder || ""}
              onChange={(e) =>
                onConfigChange("name_placeholder", e.target.value)
              }
              placeholder="Enter name placeholder"
            />
          </div>
        )}
        <div>
          <Label>Show Consent Checkbox</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={template.template_config?.show_consent_checkbox || false}
              onChange={(e) =>
                onConfigChange("show_consent_checkbox", e.target.checked)
              }
            />
            <span>Enable consent checkbox</span>
          </div>
        </div>
        {template.template_config?.show_consent_checkbox && (
          <div>
            <Label>Consent Text</Label>
            <Input
              value={template.template_config?.consent_text || ""}
              onChange={(e) => onConfigChange("consent_text", e.target.value)}
              placeholder="Enter consent text"
            />
          </div>
        )}
        <div>
          <Label>Questions</Label>
          {questions.map((question) => (
            <div key={question.id} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Question</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(question.id, "text", e.target.value)
                }
                placeholder="Enter question text"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddQuestion}
            className="w-full"
          >
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
};
