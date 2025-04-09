import React from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface SocialSharingCampaignProps {
  template: WebMessage;
  onClose?: () => void;
}

const SocialSharingCampaign: React.FC<SocialSharingCampaignProps> = ({
  template,
  onClose,
}) => {
  const config = template.template_config || {};

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {config.title || "Share with Friends"}
        </h2>
        <p className="mb-6">{config.message || "Help us spread the word!"}</p>
        <div className="flex justify-center gap-4 mb-6">
          {config.social_platforms?.map(
            (platform: { name: string; icon: string; url: string }) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:opacity-80"
                style={{
                  backgroundColor:
                    template.theme === "custom"
                      ? "var(--primary-color)"
                      : undefined,
                }}
              >
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="w-6 h-6"
                />
              </a>
            )
          )}
        </div>
        {config.show_copy_link && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={config.share_url || ""}
                readOnly
                className="flex-1 p-2 border rounded"
              />
              <button
                className="px-4 py-2 rounded font-semibold hover:opacity-80"
                style={{
                  backgroundColor:
                    template.theme === "custom"
                      ? "var(--primary-color)"
                      : undefined,
                }}
                onClick={() => {
                  navigator.clipboard.writeText(config.share_url || "");
                }}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
};

export default SocialSharingCampaign;
