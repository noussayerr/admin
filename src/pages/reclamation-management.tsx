import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { Search, MoreHorizontal, Filter, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import axios from "axios";

interface Reclamation {
  _id: string;
  subject: string;
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  priority: "low" | "medium" | "high";
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  category: string;
  responseMessage?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertCircle,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-800" },
  medium: { label: "Medium", color: "bg-orange-100 text-orange-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" },
};

const API_URL = 'http://localhost:5000/api';

export default function ReclamationManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    fetchReclamations();
  }, []);

  const fetchReclamations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/reclamations`);
      setReclamations(response.data.reclamations);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reclamations",
        
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (reclamationId: string, newStatus: string) => {
    try {
      await axios.put(
        `${API_URL}/reclamations/${reclamationId}/status`,
        { status: newStatus },
      );

      setReclamations((prev) =>
        prev.map((rec) =>
          rec._id === reclamationId
            ? { ...rec, status: newStatus as Reclamation["status"], updatedAt: new Date().toISOString() }
            : rec,
        ),
      );

      toast({
        title: "Status Updated",
        description: `Reclamation status changed to ${statusConfig[newStatus as keyof typeof statusConfig].label}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reclamation status",
       
      });
    }
  };

  const handleResponse = async () => {
    if (!selectedReclamation || !responseMessage.trim()) return;

    try {
      await axios.put(
        `${API_URL}/reclamations/${selectedReclamation._id}/response`,
        { 
          responseMessage,
          status: "resolved" 
        }
      );

      setReclamations((prev) =>
        prev.map((rec) =>
          rec._id === selectedReclamation._id
            ? { ...rec, responseMessage, status: "resolved", updatedAt: new Date().toISOString() }
            : rec,
        ),
      );

      toast({
        title: "Response Sent",
        description: "Your response has been sent to the customer",
      });

      setIsDialogOpen(false);
      setResponseMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response",
        
      });
    }
  };

  const openReclamationDetails = (reclamation: Reclamation) => {
    setSelectedReclamation(reclamation);
    setResponseMessage(reclamation.responseMessage || "");
    setIsDialogOpen(true);
  };

  const filteredReclamations = reclamations.filter((reclamation) => {
    const matchesSearch =
      reclamation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reclamation.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      reclamation.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || reclamation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="h-full space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Reclamation Management</h1>
        <p className="text-muted-foreground">Manage customer complaints and requests efficiently.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reclamations..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            {filteredReclamations.length} Total
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-yellow-50 text-yellow-700 border-yellow-200">
            {filteredReclamations.filter((r) => r.status === "pending").length} Pending
          </Badge>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReclamation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {getInitials(selectedReclamation.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{selectedReclamation.subject}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      by {selectedReclamation.user?.name || "Unknown User"}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className={statusConfig[selectedReclamation.status].color}>
                    {statusConfig[selectedReclamation.status].label}
                  </Badge>
                  <Badge className={priorityConfig[selectedReclamation.priority].color}>
                    {priorityConfig[selectedReclamation.priority].label} Priority
                  </Badge>
                  <div className="text-sm text-muted-foreground">{selectedReclamation.category}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p>{formatDate(selectedReclamation.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Updated</Label>
                    <p>{formatDate(selectedReclamation.updatedAt)}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Customer Email</Label>
                  <p className="text-sm">{selectedReclamation.user?.email || "N/A"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">{selectedReclamation.description}</div>
                </div>

                <div>
                  <Label htmlFor="status-select">Update Status</Label>
                  <Select
                    value={selectedReclamation.status}
                    onValueChange={(value) => handleStatusChange(selectedReclamation._id, value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="response">Response Message</Label>
                  <Textarea
                    id="response"
                    placeholder="Write your response to the customer..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                {selectedReclamation.responseMessage && (
                  <div>
                    <Label className="text-muted-foreground">Previous Response</Label>
                    <div className="mt-2 p-3 bg-green-50 rounded-md text-sm border border-green-200">
                      {selectedReclamation.responseMessage}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={handleResponse} disabled={!responseMessage.trim()}>
                    Send Response
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Customer Reclamations</CardTitle>
          <CardDescription>Manage customer complaints, requests, and feedback efficiently.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReclamations.map((reclamation) => {
                const StatusIcon = statusConfig[reclamation.status].icon;
                return (
                  <TableRow key={reclamation._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                            {getInitials(reclamation.user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{reclamation.user?.name || "Unknown User"}</div>
                          <div className="text-xs text-muted-foreground">{reclamation.user?.email || "N/A"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="font-medium text-sm truncate">{reclamation.subject}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {reclamation.description.substring(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {reclamation.category || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusConfig[reclamation.status].color} text-xs flex items-center gap-1 w-fit`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[reclamation.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${priorityConfig[reclamation.priority].color} text-xs`}>
                        {priorityConfig[reclamation.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(reclamation.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openReclamationDetails(reclamation)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(reclamation._id, "in-progress")}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Mark in progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(reclamation._id, "resolved")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleStatusChange(reclamation._id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}