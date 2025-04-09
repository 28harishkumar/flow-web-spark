import React, { useEffect, useState } from "react";
import BaseTemplate from "./BaseTemplate";
import { WebMessage } from "@/types/workflow";

interface CountdownCampaignProps {
  template: WebMessage;
  onClose?: () => void;
}

const CountdownCampaign: React.FC<CountdownCampaignProps> = ({
  template,
  onClose,
}) => {
  const config = template.template_config || {};
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(config.end_date || "");
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [config.end_date]);

  return (
    <BaseTemplate template={template} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {config.title || "Limited Time Offer"}
        </h2>
        <p className="mb-6">{config.message || "Hurry up! Offer ends soon!"}</p>
        <div className="flex justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-sm">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm">Seconds</div>
          </div>
        </div>
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

export default CountdownCampaign;
