
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebAction, Node } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Save } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import GoalSection from "./action-sections/GoalSection";
import WhoSection from "./action-sections/WhoSection";
import WhatSection from "./action-sections/WhatSection";
import WhenSection from "./action-sections/WhenSection";
import TemplateSection from "./action-sections/TemplateSection";

interface ActionConfigProps {
  action: WebAction;
  workflow: any;
  node: Node;
  onUpdate: (action: WebAction) => void;
  onDelete: (actionId: string) => void;
}

const ActionConfig: React.FC<ActionConfigProps> = ({
  action,
  workflow,
  node,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAction, setEditedAction] = useState<WebAction>(action);

  const handleSave = () => {
    onUpdate(editedAction);
    setIsEditing(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {action.action_type}
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => onDelete(action.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 border-t">
        <div className="space-y-4">
          <GoalSection 
            action={action} 
            node={node} 
            onUpdate={onUpdate} 
          />
        </div>
        
        <div className="space-y-4 border-t">
          <WhoSection 
            action={action}
            onUpdate={onUpdate}
          />
        </div>
        
        <div className="space-y-4 border-t">
          <WhatSection 
            action={action}
            onUpdate={onUpdate}
          />
        </div>
        
        <div className="space-y-4 border-t">
          <WhenSection 
            action={action}
            onUpdate={onUpdate}
          />
        </div>
        
        {isEditing ? (
          <div className="space-y-2 border-t pt-2">
            <div>
              <Label>Delay (seconds)</Label>
              <Input
                type="number"
                value={editedAction.delay_seconds || 0}
                onChange={(e) =>
                  setEditedAction({
                    ...editedAction,
                    delay_seconds: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Action Config</Label>
              <Editor
                height="150px"
                defaultLanguage="json"
                value={JSON.stringify(editedAction.action_config, null, 2)}
                options={{
                  readOnly: false,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: "on",
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                }}
                onChange={(e) => {
                  try {
                    const config = JSON.parse(e);
                    setEditedAction({
                      ...editedAction,
                      action_config: config,
                    });
                  } catch (error) {
                    // Handle invalid JSON
                  }
                }}
              />
            </div>
            <div>
              <Label>Template</Label>
              <TemplateSection 
                action={editedAction}
                onUpdate={(updatedAction) => {
                  setEditedAction(updatedAction);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1 border-t pt-2">
            <p className="text-sm">
              Delay: {action.delay_seconds || 0} seconds
            </p>
            <p className="text-sm">Config</p>
            <pre className="text-xs whitespace-pre-wrap cursor-pointer hover:bg-muted p-2 rounded">
              {JSON.stringify(action.action_config)}
            </pre>
            {action.web_message && (
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  Template: {action.web_message.template_name}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionConfig;
