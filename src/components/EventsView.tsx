import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/tracking";
import { WorkflowService } from "@/services/workflow";
import { EventType } from "@/types/workflow";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface EventsViewProps {
  externalId: string;
}

const EventsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const workflowService = new WorkflowService();

  useEffect(() => {
    trackEvent("EventsViewed", {
      page: "events",
    });
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        fetchUserEvents();
        const uniqueUserEvents = await workflowService.getUserEvents();

        setEventTypes(uniqueUserEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentUser?.id]);

  const fetchUserEvents = async (page = 0) => {
    try {
      const userEvents = await workflowService.getUserEvents(false, {
        page,
        limit: 10,
      });
      setEvents(userEvents);
      setTotalPages(Math.ceil(userEvents.length / 10));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchUserEvents(currentPage);
  }, [currentPage]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(event.description)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Event Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filtered Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEvents.length}</div>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedEventId}
                onValueChange={setSelectedEventId}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
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
              {filteredEvents
                .slice(currentPage * 10, (currentPage + 1) * 10)
                .map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant="outline">{event.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(event.description, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell>{currentUser?.id}</TableCell>
                    <TableCell>
                      {new Date(event.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(0, prev - 1))
                    }
                    className={
                      currentPage === 0 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {(() => {
                  const pages = [];
                  const maxPages = 5;
                  let startPage = Math.max(
                    0,
                    currentPage - Math.floor(maxPages / 2)
                  );
                  const endPage = Math.min(
                    totalPages - 1,
                    startPage + maxPages - 1
                  );

                  if (endPage - startPage + 1 < maxPages) {
                    startPage = Math.max(0, endPage - maxPages + 1);
                  }

                  if (startPage > 0) {
                    pages.push(
                      <PaginationItem key="first">
                        <PaginationLink onClick={() => setCurrentPage(0)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );
                    if (startPage > 1) {
                      pages.push(
                        <PaginationItem key="start-ellipsis">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i)}
                          isActive={currentPage === i}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  if (endPage < totalPages - 1) {
                    if (endPage < totalPages - 2) {
                      pages.push(
                        <PaginationItem key="end-ellipsis">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    pages.push(
                      <PaginationItem key="last">
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages - 1)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  return pages;
                })()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages - 1, prev + 1)
                      )
                    }
                    className={
                      currentPage === totalPages - 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsView;
