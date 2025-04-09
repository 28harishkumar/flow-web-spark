import React from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface SurveyCampaignProps {
  template: WebMessage;
  onClose?: () => void;
}

const SurveyCampaign: React.FC<SurveyCampaignProps> = ({
  template,
  onClose,
}) => {
  const config = template.template_config || {};

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {config.title || "Quick Survey"}
        </h2>
        <p className="mb-6">
          {config.message || "Help us improve by answering a few questions!"}
        </p>
        <div className="space-y-4 mb-6">
          {config.questions?.map(
            (question: {
              id: string;
              text: string;
              type: string;
              options?: string[];
            }) => (
              <div key={question.id} className="text-left">
                <p className="font-semibold mb-2">{question.text}</p>
                {question.type === "multiple_choice" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <input type="radio" name={question.id} value={option} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {question.type === "text" && (
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Your answer..."
                    rows={2}
                  />
                )}
              </div>
            )
          )}
        </div>
        {config.button_text && (
          <button
            className="inline-block px-6 py-2 rounded-full font-semibold hover:opacity-80"
            style={{
              backgroundColor:
                template.theme === "custom"
                  ? "var(--primary-color)"
                  : undefined,
            }}
          >
            {config.button_text}
          </button>
        )}
      </div>
    </BaseTemplate>
  );
};

export default SurveyCampaign;
