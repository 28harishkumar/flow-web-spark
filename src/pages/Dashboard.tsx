
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventsView from "@/components/EventsView";
import TemplatesView from "@/components/TemplatesView";
import { LogOut, BellIcon } from "lucide-react";
import { WorkflowService } from "@/services/workflow";
import { useAuth } from "@/context/AuthContext";
import { JsonWorkflow } from "@/types/workflow";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { trackEvent } from "@/lib/tracking";
import PromptInput from "@/components/PromptInput";
import WorkflowTable from "@/components/WorkflowTable";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const { currentUser: user, logout: onLogout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const workflowService = new WorkflowService();
  
  const { data: workflows = [], isLoading, refetch } = useQuery({
    queryKey: ["workflows"],
    queryFn: () => workflowService.listWorkflows(),
  });

  useEffect(() => {
    trackEvent("DashboardViewed", {
      page: "dashboard",
    });
  }, []);

  const handleCreateWorkflow = () => {
    const newWorkflow: JsonWorkflow = {
      id: uuidv4(),
      name: "New Workflow",
      description: "Workflow description",
      events: [],
      is_active: true,
      live_status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    workflowService.createWorkflow(newWorkflow).then((workflow) => {
      navigate(`/dashboard/workflows/${workflow.id}`);
    });
  };

  const handlePromptSubmit = (prompt: string) => {
    toast({
      title: "Prompt submitted",
      description: `Your prompt: "${prompt}" has been received.`,
    });
    // Here you would typically send the prompt to an LLM service
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b py-3 px-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-primary">WorkflowHub</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <BellIcon className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage src="" alt={user.username} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.username}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl py-8 px-4">
          <PromptInput onSubmit={handlePromptSubmit} />

          <Tabs defaultValue="workflows" className="mt-8">
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="templates">Message Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows">
              <WorkflowTable 
                workflows={workflows} 
                isLoading={isLoading} 
                onCreateWorkflow={handleCreateWorkflow}
              />
            </TabsContent>

            <TabsContent value="events">
              <EventsView />
            </TabsContent>

            <TabsContent value="templates">
              <TemplatesView />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
