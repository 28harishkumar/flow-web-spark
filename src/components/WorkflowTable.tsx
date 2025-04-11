
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { JsonWorkflow } from "@/types/workflow";
import { Input } from "@/components/ui/input";

interface WorkflowTableProps {
  workflows: JsonWorkflow[];
  isLoading: boolean;
  onCreateWorkflow: () => void;
}

const ITEMS_PER_PAGE = 5;

const WorkflowTable: React.FC<WorkflowTableProps> = ({ workflows, isLoading, onCreateWorkflow }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter workflows based on search query
  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredWorkflows.length);
  const displayedWorkflows = filteredWorkflows.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (workflowId: string) => {
    setSelectedItems(prev => 
      prev.includes(workflowId) 
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === displayedWorkflows.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayedWorkflows.map(w => w.id));
    }
  };

  const handleRowClick = (workflow: JsonWorkflow) => {
    navigate(`/dashboard/workflows/${workflow.id}`);
  };

  if (isLoading) {
    return <div>Loading workflows...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Workflows</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search workflows"
              className="pl-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={onCreateWorkflow} className="gap-1">
            <Plus className="h-4 w-4" /> Create
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectedItems.length === displayedWorkflows.length && displayedWorkflows.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Campaign Details</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedWorkflows.map((workflow) => (
              <TableRow 
                key={workflow.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(workflow)}
              >
                <TableCell onClick={(e) => e.stopPropagation()} className="p-2">
                  <Checkbox 
                    checked={selectedItems.includes(workflow.id)}
                    onCheckedChange={() => handleCheckboxChange(workflow.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {workflow.events.length > 0 ? 'Event' : 'SM'}
                        </Badge>
                        <span className="font-medium text-blue-600">{workflow.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {workflow.id.substring(0, 10)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(workflow.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {workflow.updated_at ? new Date(workflow.updated_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={workflow.is_active ? "default" : "secondary"}>
                    {workflow.is_active ? 'Completed' : 'Draft'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {filteredWorkflows.length > 0 ? `${startIndex + 1}-${endIndex} of ${filteredWorkflows.length} items` : 'No workflows found'}
        </div>
        
        {totalPages > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default WorkflowTable;
