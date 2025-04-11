
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { WebAction } from "@/types/workflow";
import WhoDialog from "../action-dialogs/WhoDialog";

interface WhoSectionProps {
  action: WebAction;
  onUpdate: (action: WebAction) => void;
}

const WhoSection: React.FC<WhoSectionProps> = ({ action, onUpdate }) => {
  const [showWhoDialog, setShowWhoDialog] = React.useState(false);

  return (
    <div className="p-0">
      <div className="p-2 flex justify-between items-center flex-row">
        <p className="text-md font-medium">Who</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowWhoDialog(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      
      <WhoDialog 
        open={showWhoDialog} 
        onOpenChange={setShowWhoDialog}
        action={action}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default WhoSection;
