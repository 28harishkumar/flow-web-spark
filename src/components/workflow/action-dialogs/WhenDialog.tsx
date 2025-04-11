
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { CalendarIcon, Clock, HelpCircle, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface WhenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: WebAction;
  onUpdate: (action: WebAction) => void;
}

const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WhenDialog: React.FC<WhenDialogProps> = ({
  open,
  onOpenChange,
  action,
  onUpdate,
}) => {
  const [editedAction, setEditedAction] = useState<WebAction>(() => {
    // Initialize delivery preferences if they don't exist
    return { 
      ...action,
      delivery_preferences: action.delivery_preferences || {
        priority: "low",
        days: [],
        startTime: "09:00",
        endTime: "17:00",
        frequency: false,
        exclude_from_limits: false,
        campaign_frequency_limits: false,
        max_delivery: {
          count: 1,
          timeUnit: "day",
          timeValue: 1
        },
        display_trigger: {
          type: "exactly",
          value: 1
        }
      }
    };
  });

  // State for selected days
  const [selectedDays, setSelectedDays] = useState<number[]>(editedAction.delivery_preferences?.days || []);

  const handleSave = () => {
    // Update with the selected days
    const updatedAction = {
      ...editedAction,
      delivery_preferences: {
        ...editedAction.delivery_preferences,
        days: selectedDays
      }
    };
    onUpdate(updatedAction);
    onOpenChange(false);
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">When</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[75vh] overflow-y-auto py-4">
          {/* Date and Time Section */}
          <Accordion type="single" collapsible defaultValue="date-time" className="w-full">
            <AccordionItem value="date-time" className="border rounded-md">
              <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  </div>
                  <span className="text-md font-medium">Date and time</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Start date and time</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="start-now"
                          name="start-option"
                          className="h-4 w-4 accent-primary"
                          checked={!editedAction.start_date}
                          onChange={() => 
                            setEditedAction({
                              ...editedAction,
                              start_date: ""
                            })
                          }
                        />
                        <Label htmlFor="start-now">Now</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="start-date"
                          name="start-option"
                          className="h-4 w-4 accent-primary"
                          checked={!!editedAction.start_date}
                          onChange={() => 
                            setEditedAction({
                              ...editedAction,
                              start_date: new Date().toISOString().slice(0, 16)
                            })
                          }
                        />
                        <Label htmlFor="start-date">On a date/time</Label>
                        
                        <div className="flex gap-2">
                          <Popover>
                            <PopoverTrigger asChild disabled={!editedAction.start_date}>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal w-[180px]",
                                  !editedAction.start_date && "opacity-50"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editedAction.start_date 
                                  ? format(new Date(editedAction.start_date), "MMM dd, yyyy")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={editedAction.start_date ? new Date(editedAction.start_date) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    const current = editedAction.start_date 
                                      ? new Date(editedAction.start_date)
                                      : new Date();
                                    const hours = current.getHours();
                                    const minutes = current.getMinutes();
                                    date.setHours(hours);
                                    date.setMinutes(minutes);
                                    setEditedAction({
                                      ...editedAction,
                                      start_date: date.toISOString()
                                    });
                                  }
                                }}
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <span className="mx-1">at</span>
                          
                          <Popover>
                            <PopoverTrigger asChild disabled={!editedAction.start_date}>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal w-[140px]",
                                  !editedAction.start_date && "opacity-50"
                                )}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {editedAction.start_date 
                                  ? format(new Date(editedAction.start_date), "HH:mm:ss")
                                  : "Select time"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3" align="start">
                              <div className="grid gap-2">
                                <Input
                                  type="time"
                                  step="1"
                                  value={editedAction.start_date ? format(new Date(editedAction.start_date), "HH:mm:ss") : ""}
                                  onChange={(e) => {
                                    if (!editedAction.start_date) return;
                                    const date = new Date(editedAction.start_date);
                                    const [hours, minutes, seconds] = e.target.value.split(':');
                                    date.setHours(parseInt(hours || "0"));
                                    date.setMinutes(parseInt(minutes || "0"));
                                    date.setSeconds(parseInt(seconds || "0"));
                                    setEditedAction({
                                      ...editedAction,
                                      start_date: date.toISOString()
                                    });
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-medium">End date and time</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="end-never"
                          name="end-option"
                          className="h-4 w-4 accent-primary"
                          checked={!editedAction.end_date}
                          onChange={() =>
                            setEditedAction({
                              ...editedAction,
                              end_date: ""
                            })
                          }
                        />
                        <Label htmlFor="end-never">Never</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="end-date"
                          name="end-option"
                          className="h-4 w-4 accent-primary"
                          checked={!!editedAction.end_date}
                          onChange={() =>
                            setEditedAction({
                              ...editedAction,
                              end_date: new Date().toISOString()
                            })
                          }
                        />
                        <Label htmlFor="end-date">On a date/time</Label>
                        
                        <div className="flex gap-2">
                          <Popover>
                            <PopoverTrigger asChild disabled={!editedAction.end_date}>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal w-[180px]",
                                  !editedAction.end_date && "opacity-50"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editedAction.end_date 
                                  ? format(new Date(editedAction.end_date), "MMM dd, yyyy")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={editedAction.end_date ? new Date(editedAction.end_date) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    const current = editedAction.end_date 
                                      ? new Date(editedAction.end_date)
                                      : new Date();
                                    const hours = current.getHours();
                                    const minutes = current.getMinutes();
                                    date.setHours(hours);
                                    date.setMinutes(minutes);
                                    setEditedAction({
                                      ...editedAction,
                                      end_date: date.toISOString()
                                    });
                                  }
                                }}
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <span className="mx-1">at</span>
                          
                          <Popover>
                            <PopoverTrigger asChild disabled={!editedAction.end_date}>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal w-[140px]",
                                  !editedAction.end_date && "opacity-50"
                                )}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {editedAction.end_date 
                                  ? format(new Date(editedAction.end_date), "HH:mm:ss")
                                  : "Select time"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3" align="start">
                              <div className="grid gap-2">
                                <Input
                                  type="time"
                                  step="1"
                                  value={editedAction.end_date ? format(new Date(editedAction.end_date), "HH:mm:ss") : ""}
                                  onChange={(e) => {
                                    if (!editedAction.end_date) return;
                                    const date = new Date(editedAction.end_date);
                                    const [hours, minutes, seconds] = e.target.value.split(':');
                                    date.setHours(parseInt(hours || "0"));
                                    date.setMinutes(parseInt(minutes || "0"));
                                    date.setSeconds(parseInt(seconds || "0"));
                                    setEditedAction({
                                      ...editedAction,
                                      end_date: date.toISOString()
                                    });
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* New Delivery Preferences Section */}
            <AccordionItem value="delivery-preferences" className="border rounded-md mt-4">
              <AccordionTrigger className="px-4 py-3 flex items-center gap-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 p-1 rounded-full">
                    <div className="h-5 w-5 rounded-full bg-amber-400 flex items-center justify-center text-white">●</div>
                  </div>
                  <span className="text-md font-medium">Delivery preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-6">
                  {/* In-App Priority */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-medium">In-App Priority</h3>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select 
                      value={editedAction.delivery_preferences?.priority || "low"}
                      onValueChange={(value) => 
                        setEditedAction({
                          ...editedAction,
                          delivery_preferences: {
                            ...editedAction.delivery_preferences,
                            priority: value
                          }
                        })
                      }
                    >
                      <SelectTrigger className="w-full bg-slate-100">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">1 - Low</SelectItem>
                        <SelectItem value="medium">2 - Medium</SelectItem>
                        <SelectItem value="high">3 - High</SelectItem>
                        <SelectItem value="critical">4 - Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Set Frequency */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Checkbox 
                        id="set-frequency" 
                        checked={editedAction.delivery_preferences?.frequency}
                        onCheckedChange={(checked) => 
                          setEditedAction({
                            ...editedAction,
                            delivery_preferences: {
                              ...editedAction.delivery_preferences,
                              frequency: checked as boolean
                            }
                          })
                        }
                      />
                      <Label htmlFor="set-frequency" className="font-medium">Set frequency</Label>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Deliver this campaign on */}
                    <div className="space-y-4 pl-6">
                      <div>
                        <Label className="font-medium mb-2 block">Deliver this campaign on</Label>
                        <div className="flex gap-2 mt-2">
                          {dayNames.map((day, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              className={cn(
                                "rounded-full w-10 h-10 p-0",
                                selectedDays.includes(index) && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => toggleDay(index)}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Time range */}
                      <div className="flex items-center gap-2">
                        <div className="font-medium mr-2">{selectedDays.length > 0 
                          ? dayLabels[selectedDays[0]] 
                          : "Day"}
                        </div>
                        <Input
                          type="time"
                          value={editedAction.delivery_preferences?.startTime || "09:00"}
                          className="w-36 bg-slate-100"
                          onChange={(e) => 
                            setEditedAction({
                              ...editedAction,
                              delivery_preferences: {
                                ...editedAction.delivery_preferences,
                                startTime: e.target.value
                              }
                            })
                          }
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={editedAction.delivery_preferences?.endTime || "17:00"}
                          className="w-36 bg-slate-100"
                          onChange={(e) => 
                            setEditedAction({
                              ...editedAction,
                              delivery_preferences: {
                                ...editedAction.delivery_preferences,
                                endTime: e.target.value
                              }
                            })
                          }
                        />
                        <div className="font-medium ml-2">{selectedDays.length > 1 
                          ? dayLabels[selectedDays[1]] 
                          : (selectedDays.length > 0 ? dayLabels[selectedDays[0]] : "Day")}
                        </div>
                      </div>
                    </div>

                    {/* Exclude from Global campaign limits */}
                    <div className="mt-6 flex items-center gap-2">
                      <Checkbox 
                        id="exclude-limits"
                        checked={editedAction.delivery_preferences?.exclude_from_limits}
                        onCheckedChange={(checked) =>
                          setEditedAction({
                            ...editedAction,
                            delivery_preferences: {
                              ...editedAction.delivery_preferences,
                              exclude_from_limits: checked as boolean
                            }
                          })
                        }
                      />
                      <Label htmlFor="exclude-limits" className="font-medium">Exclude from Global campaign limits</Label>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Campaign frequency limits */}
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Checkbox 
                          id="campaign-frequency-limits"
                          checked={editedAction.delivery_preferences?.campaign_frequency_limits}
                          onCheckedChange={(checked) =>
                            setEditedAction({
                              ...editedAction,
                              delivery_preferences: {
                                ...editedAction.delivery_preferences,
                                campaign_frequency_limits: checked as boolean
                              }
                            })
                          }
                        />
                        <Label htmlFor="campaign-frequency-limits" className="font-medium">Campaign frequency limits and display rules</Label>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </div>

                      {editedAction.delivery_preferences?.campaign_frequency_limits && (
                        <div className="pl-6 space-y-4">
                          {/* Deliver up to */}
                          <Collapsible className="border rounded-md">
                            <CollapsibleTrigger className="flex justify-between items-center w-full p-3">
                              <span className="font-medium">Deliver up to</span>
                              <Button variant="ghost" size="sm">
                                <div className="rotate-0 transform transition-transform">▼</div>
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-3 border-t">
                              <div className="flex items-center gap-2">
                                <div className="bg-slate-100 px-2 py-1 rounded">
                                  A
                                </div>
                                <Input
                                  type="number"
                                  className="w-20 bg-slate-100"
                                  value={editedAction.delivery_preferences?.max_delivery?.count || 1}
                                  onChange={(e) =>
                                    setEditedAction({
                                      ...editedAction,
                                      delivery_preferences: {
                                        ...editedAction.delivery_preferences,
                                        max_delivery: {
                                          ...editedAction.delivery_preferences?.max_delivery,
                                          count: parseInt(e.target.value)
                                        }
                                      }
                                    })
                                  }
                                />
                                <Select 
                                  value={editedAction.delivery_preferences?.max_delivery?.timeUnit || "day"}
                                  onValueChange={(value) =>
                                    setEditedAction({
                                      ...editedAction,
                                      delivery_preferences: {
                                        ...editedAction.delivery_preferences,
                                        max_delivery: {
                                          ...editedAction.delivery_preferences?.max_delivery,
                                          timeUnit: value
                                        }
                                      }
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Time(s) in" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hour">Time(s) in</SelectItem>
                                    <SelectItem value="day">Day(s)</SelectItem>
                                    <SelectItem value="week">Week(s)</SelectItem>
                                    <SelectItem value="month">Month(s)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="number"
                                  className="w-20 bg-slate-100"
                                  value={editedAction.delivery_preferences?.max_delivery?.timeValue || 1}
                                  onChange={(e) =>
                                    setEditedAction({
                                      ...editedAction,
                                      delivery_preferences: {
                                        ...editedAction.delivery_preferences,
                                        max_delivery: {
                                          ...editedAction.delivery_preferences?.max_delivery,
                                          timeValue: parseInt(e.target.value)
                                        }
                                      }
                                    })
                                  }
                                />
                                <Select
                                  value="hour"
                                  onValueChange={() => {}}
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Hour(s)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hour">Hour(s)</SelectItem>
                                    <SelectItem value="day">Day(s)</SelectItem>
                                    <SelectItem value="week">Week(s)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button variant="outline" size="sm" className="mt-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Add limit...
                              </Button>
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Display when trigger occurs */}
                          <Collapsible className="border rounded-md">
                            <CollapsibleTrigger className="flex justify-between items-center w-full p-3">
                              <span className="font-medium">Display when trigger occurs</span>
                              <Button variant="ghost" size="sm">
                                <div className="rotate-0 transform transition-transform">▼</div>
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-3 border-t">
                              <div className="flex items-center gap-2">
                                <div className="bg-slate-100 px-2 py-1 rounded">
                                  A
                                </div>
                                <Select
                                  value={editedAction.delivery_preferences?.display_trigger?.type || "exactly"}
                                  onValueChange={(value) =>
                                    setEditedAction({
                                      ...editedAction,
                                      delivery_preferences: {
                                        ...editedAction.delivery_preferences,
                                        display_trigger: {
                                          ...editedAction.delivery_preferences?.display_trigger,
                                          type: value
                                        }
                                      }
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue placeholder="exactly" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="exactly">exactly</SelectItem>
                                    <SelectItem value="after">after</SelectItem>
                                    <SelectItem value="every">every</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="number"
                                  className="w-20 bg-slate-100"
                                  value={editedAction.delivery_preferences?.display_trigger?.value || 1}
                                  onChange={(e) =>
                                    setEditedAction({
                                      ...editedAction,
                                      delivery_preferences: {
                                        ...editedAction.delivery_preferences,
                                        display_trigger: {
                                          ...editedAction.delivery_preferences?.display_trigger,
                                          value: parseInt(e.target.value)
                                        }
                                      }
                                    })
                                  }
                                />
                                <div className="w-20 text-center">time</div>
                                <Button variant="ghost" size="icon">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="pt-4">
            <Button onClick={handleSave} className="bg-primary">Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhenDialog;
