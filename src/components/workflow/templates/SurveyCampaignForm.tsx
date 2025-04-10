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

interface SurveyCampaignFormProps {
  template: WebMessage;
  onConfigChange: (key: string, value: unknown) => void;
}

const SurveyCampaignForm: React.FC<SurveyCampaignFormProps> = ({
  template,
  onConfigChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Label>Questions</Label>
        <div className="space-y-2">
          {template.template_config?.questions?.map((question, index) => (
            <div key={index} className="space-y-2 border p-2 rounded">
              <div className="flex justify-between">
                <Label>Question {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newQuestions = [
                      ...(template.template_config?.questions || []),
                    ];
                    newQuestions.splice(index, 1);
                    onConfigChange("questions", newQuestions);
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
                      ...(template.template_config?.questions || []),
                    ];
                    newQuestions[index] = {
                      ...question,
                      text: e.target.value,
                    };
                    onConfigChange("questions", newQuestions);
                  }}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) => {
                    const newQuestions = [
                      ...(template.template_config?.questions || []),
                    ];
                    newQuestions[index] = {
                      ...question,
                      type: value as "multiple_choice" | "text" | "scale",
                    };
                    onConfigChange("questions", newQuestions);
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
                    <SelectItem value="scale">Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {question.type === "multiple_choice" && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newQuestions = [
                              ...(template.template_config?.questions || []),
                            ];
                            const newOptions = [...(question.options || [])];
                            newOptions[optionIndex] = e.target.value;
                            newQuestions[index] = {
                              ...question,
                              options: newOptions,
                            };
                            onConfigChange("questions", newQuestions);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newQuestions = [
                              ...(template.template_config?.questions || []),
                            ];
                            const newOptions = [...(question.options || [])];
                            newOptions.splice(optionIndex, 1);
                            newQuestions[index] = {
                              ...question,
                              options: newOptions,
                            };
                            onConfigChange("questions", newQuestions);
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
                        const newQuestions = [
                          ...(template.template_config?.questions || []),
                        ];
                        const newOptions = [...(question.options || []), ""];
                        newQuestions[index] = {
                          ...question,
                          options: newOptions,
                        };
                        onConfigChange("questions", newQuestions);
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
                          ...(template.template_config?.questions || []),
                        ];
                        newQuestions[index] = {
                          ...question,
                          min: parseInt(e.target.value),
                        };
                        onConfigChange("questions", newQuestions);
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
                          ...(template.template_config?.questions || []),
                        ];
                        newQuestions[index] = {
                          ...question,
                          max: parseInt(e.target.value),
                        };
                        onConfigChange("questions", newQuestions);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newQuestions = [
                ...(template.template_config?.questions || []),
                {
                  id: Math.random().toString(36).substr(2, 9),
                  text: "",
                  type: "text",
                },
              ];
              onConfigChange("questions", newQuestions);
            }}
          >
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyCampaignForm;
