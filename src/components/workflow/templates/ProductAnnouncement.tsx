import React from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface FeatureAnnouncementProps {
  template: WebMessage;
  onClose?: () => void;
}

const FeatureAnnouncement: React.FC<FeatureAnnouncementProps> = ({
  template,
  onClose,
}) => {
  const config = template.template_config || {};

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {config.title || "New Feature!"}
        </h2>
        <p className="mb-6">
          {config.message || "Check out our latest feature!"}
        </p>
        {config.features && config.features.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mb-6">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                {feature.icon && (
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-6 h-6 mt-1"
                  />
                )}
                <div className="text-left">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default FeatureAnnouncement;
