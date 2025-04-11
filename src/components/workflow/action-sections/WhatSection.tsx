
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { WebAction, WebMessage } from "@/types/workflow";
import WhatDialog from "../action-dialogs/WhatDialog";

interface WhatSectionProps {
  action: WebAction;
  onUpdate: (action: WebAction) => void;
}

const WhatSection: React.FC<WhatSectionProps> = ({ action, onUpdate }) => {
  const [showWhatDialog, setShowWhatDialog] = React.useState(false);

  const handleUpdateTemplate = async (template: WebMessage) => {
    // This is called from the child component
    if (onUpdate) {
      const updatedAction = { ...action, web_message: template };
      onUpdate(updatedAction);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    // This is called from the child component
    if (onUpdate) {
      const updatedAction = { ...action, web_message: null };
      onUpdate(updatedAction);
    }
  };

  return (
    <div className="p-0">
      <div className="p-2 flex justify-between items-center flex-row">
        <p className="text-md font-medium">What</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowWhatDialog(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      
      <WhatDialog 
        open={showWhatDialog} 
        onOpenChange={setShowWhatDialog}
        action={action}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
};

export default WhatSection;
