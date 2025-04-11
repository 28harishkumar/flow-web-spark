
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WebAction, WebMessage } from "@/types/workflow";
import TemplateConfig from "../TemplateConfig";

interface WhatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: WebAction;
  onUpdateTemplate: (template: WebMessage) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const WhatDialog: React.FC<WhatDialogProps> = ({
  open,
  onOpenChange,
  action,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Template Configuration</DialogTitle>
        </DialogHeader>
        <TemplateConfig
          template={action.web_message}
          onUpdate={onUpdateTemplate}
          onDelete={onDeleteTemplate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WhatDialog;
