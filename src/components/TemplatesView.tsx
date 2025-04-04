
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Trash } from 'lucide-react';

// Sample templates data
const sampleTemplates = [
  {
    id: 't1',
    name: 'Welcome Message',
    type: 'popup',
    createdAt: '2025-03-30T14:30:00Z',
    content: {
      title: 'Welcome to our platform!',
      body: 'We\'re excited to have you here. Explore our features to get started.',
      cta: 'Take a Tour',
      theme: 'light',
    }
  },
  {
    id: 't2',
    name: 'Special Offer',
    type: 'banner',
    createdAt: '2025-03-28T10:15:00Z',
    content: {
      title: '20% Off Your First Purchase',
      body: 'Use code WELCOME20 at checkout. Limited time offer!',
      cta: 'Shop Now',
      theme: 'dark',
    }
  },
  {
    id: 't3',
    name: 'Feature Announcement',
    type: 'popup',
    createdAt: '2025-03-25T16:45:00Z',
    content: {
      title: 'New Feature Alert!',
      body: 'We\'ve just launched our new dashboard. Check it out now!',
      cta: 'See What\'s New',
      theme: 'colorful',
    }
  },
];

const TemplatesView: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleEditTemplate = (template: any) => {
    setActiveTemplate({...template});
    setIsDialogOpen(true);
  };

  const handleCreateTemplate = () => {
    setActiveTemplate({
      id: `t-${Date.now()}`,
      name: 'New Template',
      type: 'popup',
      createdAt: new Date().toISOString(),
      content: {
        title: 'Template Title',
        body: 'Template content goes here.',
        cta: 'Call to Action',
        theme: 'light',
      }
    });
    setIsDialogOpen(true);
  };

  const renderTemplatePreview = (template: any) => {
    const themes = {
      light: 'bg-white text-gray-800 border border-gray-200',
      dark: 'bg-gray-800 text-white',
      colorful: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    };
    
    const themeClass = themes[template.content.theme as keyof typeof themes] || themes.light;

    return (
      <div className={`template-preview ${themeClass} rounded-lg p-6 max-w-md mx-auto shadow-lg`}>
        <h3 className="text-xl font-bold mb-3">{template.content.title}</h3>
        <p className="mb-4">{template.content.body}</p>
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90 transition-all">
            {template.content.cta}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">Message Templates</h3>
        <Button onClick={handleCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.type}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-36 overflow-hidden border rounded-md flex items-center justify-center bg-muted/50">
                <div className="scale-[0.6] w-full">
                  {renderTemplatePreview(template)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-muted/50 pt-2">
              <p className="text-xs text-muted-foreground">
                Created {new Date(template.createdAt).toLocaleDateString()}
              </p>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{activeTemplate?.id.startsWith('t-') ? 'Create Template' : 'Edit Template'}</DialogTitle>
            <DialogDescription>
              Design your message template. This will be shown to users when triggered by a workflow.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input 
                  id="template-name" 
                  value={activeTemplate?.name} 
                  onChange={(e) => setActiveTemplate({...activeTemplate, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="template-type">Template Type</Label>
                <Select 
                  value={activeTemplate?.type}
                  onValueChange={(value) => setActiveTemplate({...activeTemplate, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="template-title">Message Title</Label>
                <Input 
                  id="template-title" 
                  value={activeTemplate?.content?.title}
                  onChange={(e) => setActiveTemplate({
                    ...activeTemplate, 
                    content: {...activeTemplate.content, title: e.target.value}
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="template-body">Message Body</Label>
                <Textarea 
                  id="template-body" 
                  rows={4}
                  value={activeTemplate?.content?.body}
                  onChange={(e) => setActiveTemplate({
                    ...activeTemplate, 
                    content: {...activeTemplate.content, body: e.target.value}
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="template-cta">Call to Action Text</Label>
                <Input 
                  id="template-cta" 
                  value={activeTemplate?.content?.cta}
                  onChange={(e) => setActiveTemplate({
                    ...activeTemplate, 
                    content: {...activeTemplate.content, cta: e.target.value}
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="template-theme">Theme</Label>
                <Select 
                  value={activeTemplate?.content?.theme}
                  onValueChange={(value) => setActiveTemplate({
                    ...activeTemplate, 
                    content: {...activeTemplate.content, theme: value}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="colorful">Colorful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Preview</h3>
                <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as 'desktop' | 'mobile')}>
                  <TabsList>
                    <TabsTrigger value="desktop">Desktop</TabsTrigger>
                    <TabsTrigger value="mobile">Mobile</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className={`border rounded-md p-4 flex items-center justify-center ${
                previewMode === 'desktop' ? 'h-80' : 'h-80 max-w-[320px] mx-auto'
              }`}>
                {activeTemplate && renderTemplatePreview(activeTemplate)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsDialogOpen(false)}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesView;
