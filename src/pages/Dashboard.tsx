import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventsView from "@/components/EventsView";
import WorkflowsView from "@/components/WorkflowsView";
import TemplatesView from "@/components/TemplatesView";
import WorkflowEditor from "@/pages/WorkflowEditor";
import { LogOut, Plus } from "lucide-react";
import { WorkflowService } from "@/services/workflow";
import { UserEventsService } from "@/services/userEvents";
import { WebMessagingService } from "@/services/webMessaging";
import { useAuth } from "@/context/AuthContext";
import { JsonWorkflow } from "@/types/workflow";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { trackEvent } from "@/lib/tracking";

const Dashboard: React.FC = () => {
  const { currentUser: user, logout: onLogout } = useAuth();
  const navigate = useNavigate();

  const workflowService = new WorkflowService();
  const navigateToEditor = (workflowId: string) => {
    navigate(`/dashboard/workflows/${workflowId}`);
  };

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

    //navigateToEditor(newWorkflow.id.toString());
    workflowService.createWorkflow(newWorkflow).then((workflow) => {
      navigateToEditor(workflow.id);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-semibold">WorkflowHub</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user.username} />
                <AvatarFallback>
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
        <div className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <Button onClick={handleCreateWorkflow}>
              <Plus className="mr-2 h-4 w-4" /> New Workflow
            </Button>
          </div>

          <Tabs defaultValue="workflows">
            <TabsList className="mb-6">
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="templates">Message Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows">
              <WorkflowsView />
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
