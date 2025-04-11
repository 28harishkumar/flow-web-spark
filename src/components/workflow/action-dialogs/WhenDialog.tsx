
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
import { WebAction } from "@/types/workflow";

interface WhenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: WebAction;
  onUpdate: (action: WebAction) => void;
}

const WhenDialog: React.FC<WhenDialogProps> = ({
  open,
  onOpenChange,
  action,
  onUpdate,
}) => {
  const [editedAction, setEditedAction] = useState<WebAction>({ ...action });

  const handleSave = () => {
    onUpdate(editedAction);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Date and Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Start Date and Time</Label>
          <div className="flex items-center gap-2">
            <Input
              type="radio"
              name="start"
              className="h-4 w-4"
              checked={!editedAction.start_date}
              onChange={() =>
                setEditedAction({
                  ...editedAction,
                  start_date: "",
                })
              }
            />
            <span>Now</span>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="radio"
              name="start"
              className="h-4 w-4"
              checked={!!editedAction.start_date}
              onChange={() =>
                setEditedAction({
                  ...editedAction,
                  start_date: new Date().toISOString().slice(0, 16),
                })
              }
            />
            <span>On a date/time</span>
            <Input
              type="datetime-local"
              className="w-60"
              value={editedAction.start_date || ""}
              onChange={(e) =>
                setEditedAction({
                  ...editedAction,
                  start_date: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label className="mt-4">End Date and Time</Label>
            <div className="flex items-center gap-2">
              <Input
                type="radio"
                name="end"
                className="h-4 w-4"
                checked={!editedAction.end_date}
                onChange={() =>
                  setEditedAction({
                    ...editedAction,
                    end_date: "",
                  })
                }
              />
              <span>Never</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="radio"
              name="end"
              className="h-4 w-4"
              checked={!!editedAction.end_date}
              onChange={() =>
                setEditedAction({
                  ...editedAction,
                  end_date: new Date().toISOString().slice(0, 16),
                })
              }
            />
            <span>On a date/time</span>
            <Input
              type="datetime-local"
              className="w-60"
              value={editedAction.end_date || ""}
              onChange={(e) =>
                setEditedAction({
                  ...editedAction,
                  end_date: e.target.value,
                })
              }
            />
          </div>
          <Button onClick={handleSave} className="mt-4">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhenDialog;
