
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, SearchIcon } from 'lucide-react';

// Mock data for events
const mockEvents = [
  { id: '1', type: 'page_view', url: '/home', userId: 'user123', timestamp: '2025-04-04T12:15:00Z' },
  { id: '2', type: 'button_click', element: 'signup-button', userId: 'user456', timestamp: '2025-04-04T11:30:00Z' },
  { id: '3', type: 'form_submit', formId: 'contact-form', userId: 'user789', timestamp: '2025-04-04T10:45:00Z' },
  { id: '4', type: 'page_view', url: '/pricing', userId: 'user123', timestamp: '2025-04-04T09:20:00Z' },
  { id: '5', type: 'custom', name: 'product_view', productId: 'prod123', userId: 'user456', timestamp: '2025-04-04T08:10:00Z' },
];

const EventsView: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">356</div>
            <p className="text-xs text-muted-foreground mt-1">+4.3% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workflow Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground mt-1">+15.8% from yesterday</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2">
            <div>
              <CardTitle>Event Log</CardTitle>
              <CardDescription>Recent events from your website</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-full md:w-64">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search events..." 
                  className="pl-8" 
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="page_view">Page View</SelectItem>
                  <SelectItem value="button_click">Button Click</SelectItem>
                  <SelectItem value="form_submit">Form Submit</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Badge variant={
                      event.type === 'page_view' ? 'outline' :
                      event.type === 'button_click' ? 'secondary' :
                      event.type === 'form_submit' ? 'default' : 'destructive'
                    }>
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.type === 'page_view' && `URL: ${event.url}`}
                    {event.type === 'button_click' && `Element: ${event.element}`}
                    {event.type === 'form_submit' && `Form: ${event.formId}`}
                    {event.type === 'custom' && `${event.name}: ${event.productId}`}
                  </TableCell>
                  <TableCell>{event.userId}</TableCell>
                  <TableCell>
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsView;
