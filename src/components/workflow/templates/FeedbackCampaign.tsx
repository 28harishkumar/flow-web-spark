import React from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface FeedbackCampaignProps {
  template: WebMessage;
  onClose?: () => void;
}

const FeedbackCampaign: React.FC<FeedbackCampaignProps> = ({
  template,
  onClose,
}) => {
  const config = template.template_config || {};

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {config.title || "How are we doing?"}
        </h2>
        <p className="mb-6">
          {config.message || "We'd love to hear your feedback!"}
        </p>
        <div className="flex justify-center gap-4 mb-6">
          {config.rating_options?.map(
            (option: { value: number; label: string }) => (
              <button
                key={option.value}
                className="px-4 py-2 rounded-full font-semibold hover:opacity-80"
                style={{
                  backgroundColor:
                    template.theme === "custom"
                      ? "var(--primary-color)"
                      : undefined,
                }}
                onClick={() => {
                  if (config.onRatingSelect) {
                    config.onRatingSelect(option.value);
                  }
                }}
              >
                {option.label}
              </button>
            )
          )}
        </div>
        {config.show_comment_box && (
          <div className="mb-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder={
                config.comment_placeholder || "Additional comments..."
              }
              rows={3}
            />
          </div>
        )}
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

export default FeedbackCampaign;
