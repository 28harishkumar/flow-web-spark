
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
import { MoreHorizontal, Tag } from "lucide-react";
import { JsonWorkflow } from "@/types/workflow";

interface WorkflowTableProps {
  workflows: JsonWorkflow[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 5;

const WorkflowTable: React.FC<WorkflowTableProps> = ({ workflows, isLoading }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const totalPages = Math.ceil(workflows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, workflows.length);
  const displayedWorkflows = workflows.slice(startIndex, endIndex);
  
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
              <TableHead>Sent</TableHead>
              <TableHead>Engaged</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[40px]"></TableHead>
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
                  {Math.floor(Math.random() * 1500) || '--'}
                </TableCell>
                <TableCell>
                  {Math.floor(Math.random() * 10) || '--'}
                </TableCell>
                <TableCell>
                  {(Math.random() * 0.5).toFixed(2) || '--'}
                </TableCell>
                <TableCell>
                  <Badge variant={workflow.is_active ? "default" : "secondary"}>
                    {workflow.is_active ? 'Completed' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add action menu logic here
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {startIndex + 1}-{endIndex} of {workflows.length} items
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Items per page</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={ITEMS_PER_PAGE}
              onChange={() => {}}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};

export default WorkflowTable;
