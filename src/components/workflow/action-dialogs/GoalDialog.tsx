
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebAction, Node } from "@/types/workflow";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: WebAction;
  node: Node;
  onUpdate: (action: WebAction) => void;
}

const GoalDialog: React.FC<GoalDialogProps> = ({
  open,
  onOpenChange,
  action,
  node,
  onUpdate,
}) => {
  const [editedAction, setEditedAction] = useState<WebAction>({ ...action });

  const getRevenuePropertyOptions = () => {
    const eventProps = node.data.eventProperties || {};
    const propertyOptions = Object.keys(eventProps);
    
    if (propertyOptions.length === 0) {
      return [
        { value: "currency_amount", label: "currency_amount" },
        { value: "total_value", label: "total_value" }
      ];
    }
    
    return propertyOptions.map(prop => ({
      value: prop,
      label: prop
    }));
  };
  
  const handleSave = () => {
    onUpdate(editedAction);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Set a Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={editedAction.conversion_tracking || false}
              className="h-4 w-4"
              onChange={(e) =>
                setEditedAction({
                  ...editedAction,
                  conversion_tracking: e.target.checked,
                })
              }
            />
            Conversion Tracking
          </Label>

          {editedAction.conversion_tracking && (
            <>
              <div>
                <Label>Conversion Time</Label>
                <Select
                  value={editedAction.conversion_time || ""}
                  onValueChange={(value) =>
                    setEditedAction({
                      ...editedAction,
                      conversion_time: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select conversion time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4 Hours">4 Hours</SelectItem>
                    <SelectItem value="8 Hours">8 Hours</SelectItem>
                    <SelectItem value="12 Hours">12 Hours</SelectItem>
                    <SelectItem value="1 Day">1 Day</SelectItem>
                    <SelectItem value="2 Days">2 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Revenue Property</Label>
                <Select
                  value={editedAction.revenue_property || ""}
                  onValueChange={(value) =>
                    setEditedAction({
                      ...editedAction,
                      revenue_property: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue property" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRevenuePropertyOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;
