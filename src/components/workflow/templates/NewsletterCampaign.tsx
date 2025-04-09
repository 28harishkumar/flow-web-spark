import React from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface NewsletterCampaignProps {
  template: WebMessage;
  onClose?: () => void;
}

const NewsletterCampaign: React.FC<NewsletterCampaignProps> = ({
  template,
  onClose,
}) => {
  const config = template.template_config || {};

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {config.title || "Subscribe to Our Newsletter"}
        </h2>
        <p className="mb-6">
          {config.message || "Stay updated with our latest news and offers!"}
        </p>
        <div className="mb-6">
          <input
            type="email"
            placeholder={config.email_placeholder || "Enter your email"}
            className="w-full p-2 border rounded mb-2"
          />
          {config.show_name_field && (
            <input
              type="text"
              placeholder={config.name_placeholder || "Your name"}
              className="w-full p-2 border rounded mb-2"
            />
          )}
          {config.show_consent_checkbox && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              <span>{config.consent_text || "I agree to receive emails"}</span>
            </label>
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

export default NewsletterCampaign;
