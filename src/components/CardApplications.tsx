import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "../components/ui/avatar";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye,
  CreditCard,
  Home,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  FileText
} from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";

interface CardApplication {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  bankingAccount: {
    _id: string;
    accountNumber: string;
  };
  cardType: {
    _id: string;
    name: string;
    description: string;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  cardInfo: {
    cardHolderName: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryPostalCode?: string;
  };
  employmentInfo: {
    status: string;
    employerName?: string;
    monthlyIncome: number;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  adminNotes?: string;
  processedAt?: string;
}

const CardApplications: React.FC = () => {
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<CardApplication | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [cardRequests, setCardRequests] = useState<CardApplication[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    const fetchCardApplications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cartroutes/allapplications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCardRequests(response.data);
      } catch (error) {
        console.error("Error fetching card applications:", error);
        
      }
    };
    fetchCardApplications();
  }, []);

  const filteredCardRequests = cardRequests.filter(
    (request) =>
      request.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.cardType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleViewDetails = (request: CardApplication) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || "");
    setDetailsDialogOpen(true);
  };

  const handleConfirmAction = (request: CardApplication, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const executeAction = async () => {
  if (!selectedRequest || !confirmAction) return;
  
  setIsProcessing(true);
  try {
    // Convert "approve" to "approved" and "reject" to "rejected"
    const backendStatus = confirmAction === 'approve' ? 'approved' : 'rejected';
    
    const response = await axios.put(
      `http://localhost:5000/api/cartroutes/processapplication/${selectedRequest._id}`,
      {
        status: backendStatus,  // Use the correct status values
        adminNotes: adminNotes
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Only update state if request was successful
    if (response.data) {
      setCardRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id ? { 
            ...req, 
            status: backendStatus,  // Use the same status here
            adminNotes,
            processedAt: new Date().toISOString()
          } : req
        )
      );
      
      // Show success feedback
    }
  } catch (error) {
    console.error(`Error ${confirmAction} card application:`, error);
    // Show error to user
  } finally {
    setIsProcessing(false);
    setConfirmDialogOpen(false);
    setDetailsDialogOpen(false);
  }
};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Card Applications</h1>
          <p className="text-muted-foreground">
            Manage and process card applications from users
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search applications..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                {filteredCardRequests.length} {filteredCardRequests.length === 1 ? "application" : "applications"} found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1 text-sm">
                Pending: {cardRequests.filter(r => r.status === 'pending').length}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                Approved: {cardRequests.filter(r => r.status === 'approved').length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[300px]">Applicant</TableHead>
                  <TableHead>Card Type</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCardRequests.length > 0 ? (
                  filteredCardRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.personalInfo.firstName} ${request.personalInfo.lastName}`}
                              alt={`${request.personalInfo.firstName} ${request.personalInfo.lastName}`}
                            />
                            <AvatarFallback>
                              {request.personalInfo.firstName[0]}
                              {request.personalInfo.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {request.personalInfo.firstName} {request.personalInfo.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">{request.personalInfo.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{request.cardType?.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          ****{request.bankingAccount?.accountNumber?.slice(-4) || "----"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewDetails(request)}
                            className="hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => handleConfirmAction(request, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleConfirmAction(request, "reject")}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Details
            </DialogTitle>
            <DialogDescription>
              Review all information before processing this application
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedRequest.personalInfo.firstName} ${selectedRequest.personalInfo.lastName}`}
                    alt={`${selectedRequest.personalInfo.firstName} ${selectedRequest.personalInfo.lastName}`}
                  />
                  <AvatarFallback>
                    {selectedRequest.personalInfo.firstName[0]}
                    {selectedRequest.personalInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <h3 className="text-lg font-semibold">
                    {selectedRequest.personalInfo.firstName} {selectedRequest.personalInfo.lastName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{selectedRequest.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{selectedRequest.personalInfo.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="h-5 w-5" />
                      Card Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Card Type</p>
                        <p className="font-medium">{selectedRequest.cardType?.name || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cardholder Name</p>
                        <p className="font-medium">{selectedRequest.cardInfo.cardHolderName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Home className="h-5 w-5" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedRequest.cardInfo.deliveryAddress}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">City</p>
                          <p className="font-medium">{selectedRequest.cardInfo.deliveryCity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Postal Code</p>
                          <p className="font-medium">
                            {selectedRequest.cardInfo.deliveryPostalCode || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5" />
                      Employment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Employment Status</p>
                        <p className="font-medium capitalize">{selectedRequest.employmentInfo.status}</p>
                      </div>
                      {selectedRequest.employmentInfo.employerName && (
                        <div>
                          <p className="text-sm text-muted-foreground">Employer</p>
                          <p className="font-medium">{selectedRequest.employmentInfo.employerName}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Income</p>
                        <p className="font-medium">
                          {formatCurrency(selectedRequest.employmentInfo.monthlyIncome)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5" />
                      Application Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted On</p>
                        <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                      </div>
                      {selectedRequest.processedAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Processed On</p>
                          <p className="font-medium">{formatDate(selectedRequest.processedAt)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Linked Account</p>
                        <p className="font-medium">
                          ****{selectedRequest.bankingAccount?.accountNumber?.slice(-4) || "----"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                />
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDetailsDialogOpen(false)}
            >
              Close
            </Button>
            {selectedRequest?.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setConfirmAction("reject");
                    setConfirmDialogOpen(true);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Application
                </Button>
                <Button
                  onClick={() => {
                    setConfirmAction("approve");
                    setConfirmDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Application
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction === "approve" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {confirmAction === "approve" ? "Approve Application" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve"
                ? "This will create a new card for the user and charge the annual fee. Are you sure?"
                : "This will reject the application and notify the user. Are you sure?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction === "approve" ? "default" : "destructive"}
              onClick={executeAction}
              disabled={isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : confirmAction === "approve" ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardApplications;