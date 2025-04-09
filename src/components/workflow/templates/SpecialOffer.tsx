import React from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface SpecialOfferProps {
  template: WebMessage;
  onClose?: () => void;
}

const SpecialOffer: React.FC<SpecialOfferProps> = ({ template, onClose }) => {
  const config = template.template_config || {};

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        {config.image_url && (
          <img
            src={config.image_url}
            alt="Special Offer"
            className="w-full h-48 object-cover rounded-t-lg mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-2">
          {config.title || "Special Offer!"}
        </h2>
        <p className="mb-4">{config.message || "Limited time offer!"}</p>
        {config.pricing && (
          <div className="mb-4">
            <span className="text-3xl font-bold">
              {config.pricing.currency} {config.pricing.amount}
            </span>
            <span className="text-gray-500">/{config.pricing.period}</span>
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
        {config.countdown_end && (
          <div className="mt-4 text-sm">
            <p>Offer ends in:</p>
            <div className="flex justify-center gap-2 mt-2">
              {/* Countdown timer would go here */}
            </div>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
};

export default SpecialOffer;
