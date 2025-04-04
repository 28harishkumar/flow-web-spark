
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, PlayCircle, PauseCircle, MoreHorizontal } from 'lucide-react';
import { Workflow } from '@/types/workflow';

// Sample data for workflows
const sampleWorkflows: Workflow[] = [
  {
    id: 'w1',
    name: 'New User Onboarding',
    description: 'Guide new users through the platform features',
    createdAt: '2025-03-30T14:30:00Z',
    status: 'active',
    triggers: ['user_signup'],
    stats: { triggered: 145, completed: 98, active: 12 },
    nodes: [],
    edges: []
  },
  {
    id: 'w2',
    name: 'Cart Abandonment',
    description: 'Re-engage users who abandoned their shopping cart',
    createdAt: '2025-03-28T10:15:00Z',
    status: 'paused',
    triggers: ['cart_add', 'session_end'],
    stats: { triggered: 78, completed: 34, active: 0 },
    nodes: [],
    edges: []
  },
  {
    id: 'w3',
    name: 'Feature Announcement',
    description: 'Announce new features to existing users',
    createdAt: '2025-03-25T16:45:00Z',
    status: 'draft',
    triggers: ['user_login'],
    stats: { triggered: 0, completed: 0, active: 0 },
    nodes: [],
    edges: []
  },
];

interface WorkflowsViewProps {
  onEditWorkflow: (workflow: Workflow) => void;
}

const WorkflowsView: React.FC<WorkflowsViewProps> = ({ onEditWorkflow }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleWorkflows.map((workflow) => (
        <Card key={workflow.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="mb-1">{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </div>
              <Badge 
                variant={
                  workflow.status === 'active' ? 'default' : 
                  workflow.status === 'paused' ? 'outline' : 'secondary'
                }
              >
                {workflow.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="text-sm space-y-3">
              <div>
                <p className="text-muted-foreground">Triggers:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {workflow.triggers?.map(trigger => (
                    <Badge key={trigger} variant="outline" className="text-xs">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Triggered</p>
                  <p className="font-medium">{workflow.stats?.triggered || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Completed</p>
                  <p className="font-medium">{workflow.stats?.completed || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Active</p>
                  <p className="font-medium">{workflow.stats?.active || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between bg-muted/50 pt-2">
            <p className="text-xs text-muted-foreground">
              Created {new Date(workflow.createdAt).toLocaleDateString()}
            </p>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEditWorkflow(workflow)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={workflow.status === 'draft'}
              >
                {workflow.status === 'active' ? 
                  <PauseCircle className="h-4 w-4" /> : 
                  <PlayCircle className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default WorkflowsView;
