
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { WebAction } from "@/types/workflow";
import WhenDialog from "../action-dialogs/WhenDialog";

interface WhenSectionProps {
  action: WebAction;
  onUpdate: (action: WebAction) => void;
}

const WhenSection: React.FC<WhenSectionProps> = ({ action, onUpdate }) => {
  const [showWhenDialog, setShowWhenDialog] = React.useState(false);

  return (
    <div className="p-0">
      <div className="p-2 flex justify-between items-center flex-row">
        <p className="text-md font-medium">When</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowWhenDialog(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      
      {action.start_date && (
        <div className="px-2 py-1 text-sm">
          <p className="font-medium">Start: {new Date(action.start_date).toLocaleString()}</p>
        </div>
      )}
      
      {action.end_date && (
        <div className="px-2 py-1 text-sm">
          <p className="font-medium">End: {new Date(action.end_date).toLocaleString()}</p>
        </div>
      )}
      
      <WhenDialog 
        open={showWhenDialog} 
        onOpenChange={setShowWhenDialog}
        action={action}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default WhenSection;
