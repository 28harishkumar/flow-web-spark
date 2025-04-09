import React from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface WelcomeMessageProps {
  template: WebMessage;
  onClose?: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  template,
  onClose,
}) => {
  const config = template.template_config || {};

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {config.title || "Welcome!"}
        </h2>
        <p className="mb-6">
          {config.message || "We're glad to have you here!"}
        </p>
        {config.button_text && config.button_url && (
          <a
            href={config.button_url}
            className="inline-block px-6 py-2 rounded-full font-semibold hover:opacity-80"
            style={{
              backgroundColor:
                template.theme === "custom"
                  ? "var(--primary-color)"
                  : undefined,
            }}
          >
            {config.button_text}
          </a>
        )}
      </div>
    </BaseTemplate>
  );
};

export default WelcomeMessage;
