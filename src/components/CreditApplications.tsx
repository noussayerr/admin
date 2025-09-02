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
  Home,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  FileText,
  Banknote,
  Clock,
  Percent
} from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";

interface CreditApplication {
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
  creditType: {
    _id: string;
    title: string;
    interestRate: number;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    dateOfBirth: string;
    idNumber: string;
  };
  creditInfo: {
    amountRequested: number;
    duration: number;
    purpose: string;
    rib: string;
    monthlyPayment: number;
    interestRate: number;
  };
  financialInfo: {
    employmentStatus: string;
    employerName?: string;
    monthlyIncome: number;
    otherLoans: boolean;
    loanDetails?: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  adminNote?: string;
}

const CreditApplications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<CreditApplication | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [creditRequests, setCreditRequests] = useState<CreditApplication[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    const fetchCreditApplications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/creditroutes/allapplications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCreditRequests(response.data);
      } catch (error) {
        console.error("Error fetching credit applications:", error);
      }
    };
    fetchCreditApplications();
  }, []);

  const filteredCreditRequests = creditRequests.filter(
    (request) =>
      request.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.creditType?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleViewDetails = (request: CreditApplication) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNote || "");
    setDetailsDialogOpen(true);
  };

  const handleConfirmAction = (request: CreditApplication, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const executeAction = async () => {
    if (!selectedRequest || !confirmAction) return;
    
    setIsProcessing(true);
    try {
      const backendStatus = confirmAction === 'approve' ? 'approved' : 'rejected';
      
      const response = await axios.put(
        `http://localhost:5000/api/creditroutes/applications/${selectedRequest._id}/status`,
        {
          status: backendStatus,
          adminNote: adminNotes
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setCreditRequests((prev) =>
          prev.map((req) =>
            req._id === selectedRequest._id ? { 
              ...req, 
              status: backendStatus,
              adminNote: adminNotes,
              updatedAt: new Date().toISOString()
            } : req
          )
        );
      }
    } catch (error) {
      console.error(`Error ${confirmAction} credit application:`, error);
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

 

  const formatInterestRate = (rate: number) => {
    return `${rate}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Credit Applications</h1>
          <p className="text-muted-foreground">
            Manage and process credit applications from users
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
                {filteredCreditRequests.length} {filteredCreditRequests.length === 1 ? "application" : "applications"} found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1 text-sm">
                Pending: {creditRequests.filter(r => r.status === 'pending').length}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                Approved: {creditRequests.filter(r => r.status === 'approved').length}
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
                  <TableHead>Credit Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreditRequests.length > 0 ? (
                  filteredCreditRequests.map((request) => (
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
                          <Banknote className="h-4 w-4 text-muted-foreground" />
                          <span>{request.creditType?.title || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>DT {request.creditInfo.amountRequested}</TableCell>
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
              Credit Application Details
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
                      <Banknote className="h-5 w-5" />
                      Credit Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Credit Type</p>
                        <p className="font-medium">{selectedRequest.creditType?.title || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Requested</p>
                        <p className="font-medium">{formatCurrency(selectedRequest.creditInfo.amountRequested)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Purpose</p>
                        <p className="font-medium capitalize">{selectedRequest.creditInfo.purpose.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Percent className="h-5 w-5" />
                      Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-medium">{formatInterestRate(selectedRequest.creditInfo.interestRate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{selectedRequest.creditInfo.duration} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="font-medium">{formatCurrency(selectedRequest.creditInfo.monthlyPayment)}</p>
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
                        <p className="font-medium capitalize">{selectedRequest.financialInfo.employmentStatus.replace('-', ' ')}</p>
                      </div>
                      {selectedRequest.financialInfo.employerName && (
                        <div>
                          <p className="text-sm text-muted-foreground">Employer</p>
                          <p className="font-medium">{selectedRequest.financialInfo.employerName}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Income</p>
                        <p className="font-medium">
                          {formatCurrency(selectedRequest.financialInfo.monthlyIncome)}
                        </p>
                      </div>
                      {selectedRequest.financialInfo.otherLoans && (
                        <div>
                          <p className="text-sm text-muted-foreground">Other Loans</p>
                          <p className="font-medium">Yes</p>
                        </div>
                      )}
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
                      {selectedRequest.updatedAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{formatDate(selectedRequest.updatedAt)}</p>
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
                ? "This will create a new credit account for the user. Are you sure?"
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

export default CreditApplications;