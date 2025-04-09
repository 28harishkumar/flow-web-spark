import React from "react";
import { WebMessage } from "@/types/workflow";

interface BaseTemplateProps {
  template: WebMessage;
  onClose?: () => void;
  children?: React.ReactNode;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({
  template,
  onClose,
  children,
}) => {
  const getThemeStyles = () => {
    if (template.theme === "custom" && template.custom_theme) {
      return {
        backgroundColor: template.custom_theme.background,
        color: template.custom_theme.text,
        "--primary-color": template.custom_theme.primary,
        "--secondary-color": template.custom_theme.secondary,
      };
    }
    return {};
  };

  return (
    <div
      className={`fixed p-4 rounded-lg shadow-lg max-w-md ${
        template.theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-white text-gray-800"
      }`}
      style={{
        ...getThemeStyles(),
        // ...getPositionStyles(template.position),
      }}
    >
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="px-4 py-2 rounded hover:opacity-80"
          style={{
            backgroundColor:
              template.theme === "custom" ? "var(--primary-color)" : undefined,
          }}
        >
          Close
        </button>
      )}
    </div>
  );
};

const getPositionStyles = (position: string) => {
  switch (position) {
    case "top-right":
      return { top: "1rem", right: "1rem" };
    case "top-left":
      return { top: "1rem", left: "1rem" };
    case "bottom-right":
      return { bottom: "1rem", right: "1rem" };
    case "bottom-left":
      return { bottom: "1rem", left: "1rem" };
    case "center":
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    default:
      return { bottom: "1rem", right: "1rem" };
  }
};

export default BaseTemplate;
