import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, PlayCircle, PauseCircle, MoreHorizontal } from "lucide-react";
import { JsonWorkflow } from "@/types/workflow";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { WorkflowService } from "@/services/workflow";

const WorkflowsView: React.FC = () => {
  const workflowService = new WorkflowService();
  const navigate = useNavigate();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: () => workflowService.listWorkflows(),
  });

  const handleEditWorkflow = (workflow: JsonWorkflow) => {
    navigate(`/dashboard/workflows/${workflow.id}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="mb-1">{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </div>
              <Badge variant={workflow.is_active ? "default" : "outline"}>
                {workflow.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-sm space-y-3">
              <div>
                <p className="text-muted-foreground">Events</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {workflow.events.length}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Live</p>
                  <p className="font-medium">
                    {workflow.live_status ? "Yes" : "No"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium">
                    {workflow.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between bg-muted/50 pt-2">
            <p className="text-xs text-muted-foreground">
              Updated {new Date(workflow.updated_at).toLocaleDateString()}
            </p>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditWorkflow(workflow)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!workflow.is_active}
              >
                {workflow.is_active ? (
                  <PauseCircle className="h-4 w-4" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
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
