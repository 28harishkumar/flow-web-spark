
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { WebAction, Node } from "@/types/workflow";
import GoalDialog from "../action-dialogs/GoalDialog";

interface GoalSectionProps {
  action: WebAction;
  node: Node;
  onUpdate: (action: WebAction) => void;
}

const GoalSection: React.FC<GoalSectionProps> = ({ action, node, onUpdate }) => {
  const [showGoalDialog, setShowGoalDialog] = React.useState(false);

  const getConversionEventName = () => {
    return node.data.label || node.data.type || "unknown event";
  };

  return (
    <div className="p-0">
      <div className="p-2 flex justify-between items-center flex-row">
        <p className="text-md font-medium">Goal</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGoalDialog(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      {action.conversion_tracking && (
        <div className="px-2 py-1 space-y-2 text-sm">
          <div>
            <p className="font-medium">Conversion Event</p>
            <p className="text-muted-foreground">{getConversionEventName()}</p>
          </div>
          {action.conversion_time && (
            <div>
              <p className="font-medium">Conversion Time</p>
              <p className="text-muted-foreground">{action.conversion_time}</p>
            </div>
          )}
          {action.revenue_property && (
            <div>
              <p className="font-medium">Revenue property</p>
              <p className="text-muted-foreground">{action.revenue_property}</p>
            </div>
          )}
        </div>
      )}
      
      <GoalDialog 
        open={showGoalDialog} 
        onOpenChange={setShowGoalDialog}
        action={action}
        node={node}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default GoalSection;
