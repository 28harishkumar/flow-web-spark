
import React, { useState, useEffect } from "react";
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
import { WebAction } from "@/types/workflow";
import { WorkflowService } from "@/services/workflow";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface WhoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: WebAction;
  onUpdate: (action: WebAction) => void;
}

const WhoDialog: React.FC<WhoDialogProps> = ({
  open,
  onOpenChange,
  action,
  onUpdate,
}) => {
  const [events, setEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [editedAction, setEditedAction] = useState<WebAction>({ ...action });
  
  const workflowService = new WorkflowService();
  
  useEffect(() => {
    if (open) {
      // Fetch events from API when dialog opens
      workflowService.getUserEvents(true).then((fetchedEvents) => {
        setEvents(fetchedEvents.map((event) => event.name));
      });
      
      // Initialize the state with values from the action
      if (action.targetSegment) {
        setSelectedEvent(action.targetSegment.triggerEvent || null);
        setFilterEnabled(!!action.targetSegment.filterConditions);
      }
    }
  }, [open, action]);
  
  const handleSave = () => {
    const updatedAction = {
      ...editedAction,
      targetSegment: {
        triggerEvent: selectedEvent,
        filterConditions: filterEnabled ? {
          hasDone: [],
          hasNotDone: [],
          userProperties: []
        } : undefined
      }
    };
    onUpdate(updatedAction);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Target Segment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Select Event</Label>
          <Select
            value={selectedEvent || ""}
            onValueChange={setSelectedEvent}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pick an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event, index) => (
                <SelectItem key={index} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedEvent}</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-enabled"
                  checked={filterEnabled}
                  onCheckedChange={(checked) => setFilterEnabled(!!checked)}
                />
                <label
                  htmlFor="filter-enabled"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Filter on past behavior and user properties
                </label>
              </div>
              
              {filterEnabled && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Who have done</AccordionTrigger>
                    <AccordionContent>
                      <Button variant="outline" size="sm" className="mt-2">
                        + Add an event...
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Who have not done</AccordionTrigger>
                    <AccordionContent>
                      <Button variant="outline" size="sm" className="mt-2">
                        + Add an event...
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>With user properties</AccordionTrigger>
                    <AccordionContent>
                      <Button variant="outline" size="sm" className="mt-2">
                        + Add property...
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          )}
          
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhoDialog;
