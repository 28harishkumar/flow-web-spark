
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventsView from './EventsView';
import WorkflowsView from './WorkflowsView';
import TemplatesView from './TemplatesView';
import WorkflowEditor from './WorkflowEditor';
import { LogOut, Plus } from 'lucide-react';
import { Workflow } from '@/types/workflow';

interface DashboardProps {
  user: { email: string };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  
  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'Workflow description',
      createdAt: new Date().toISOString(),
      nodes: [],
      edges: [],
    };
    setActiveWorkflow(newWorkflow);
    setView('editor');
  };
  
  const handleEditWorkflow = (workflow: Workflow) => {
    setActiveWorkflow(workflow);
    setView('editor');
  };
  
  const handleSaveWorkflow = (updatedWorkflow: Workflow) => {
    // In a real app, we would save to a backend
    console.log('Saving workflow:', updatedWorkflow);
    setView('dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-semibold">WorkflowHub</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user.email} />
                <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {view === 'dashboard' ? (
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
                <WorkflowsView onEditWorkflow={handleEditWorkflow} />
              </TabsContent>
              
              <TabsContent value="events">
                <EventsView />
              </TabsContent>
              
              <TabsContent value="templates">
                <TemplatesView />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <WorkflowEditor 
            workflow={activeWorkflow!} 
            onSave={handleSaveWorkflow} 
            onCancel={() => setView('dashboard')} 
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
