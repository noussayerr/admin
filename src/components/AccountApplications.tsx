import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
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
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Search, Filter, CheckCircle, XCircle, Eye } from "lucide-react";
import axios from "axios";

interface AccountApplication {
  _id: string;
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
  accountType: {
    _id: string;
    name: string;
    description?: string;
  };
  accountInfo: {
    initialDeposit: number;
    wantsDebitCard: boolean;
    wantsOnlineBanking: boolean;
  };
  financialInfo: {
    employmentStatus: string;
    employerName?: string;
    monthlyIncome?: number;
    sourceOfFunds?: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

const AccountApplications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<AccountApplication | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [accountRequests, setAccountRequests] = useState<AccountApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/accountroutes/allapplications");
        setAccountRequests(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching account applications:", err);
        setError("Failed to load account applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccountApplications();
  }, []);
  console.log("Account Requests:", accountRequests);
  const filteredAccountRequests = accountRequests.filter(
    (request) =>
      request.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.accountType?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()),
  );

  const handleViewDetails = (request: AccountApplication) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };

  const handleConfirmAction = (request: AccountApplication, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const executeAction = async () => {
    if (!selectedRequest || !confirmAction) return;
    
    try {
      const newStatus = confirmAction === "approve" ? "approved" : "rejected";
      
      const response = await axios.put(
        `http://localhost:5000/api/accountroutes/applications/${selectedRequest._id}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setAccountRequests(prev =>
          prev.map(req =>
            req._id === selectedRequest._id
              ? { ...req, status: newStatus, updatedAt: new Date().toISOString() }
              : req
          )
        );
        setConfirmDialogOpen(false);
        setDetailsDialogOpen(false);
        alert(`Application ${newStatus} successfully!`);
      } else {
        throw new Error(response.data.message || "Failed to update application status");
      }
    } catch (error) {
      console.error(`Error ${confirmAction} account application:`, error);
      alert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading applications...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search account requests..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Account Requests</CardTitle>
          <CardDescription>Process user requests for new accounts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccountRequests.length > 0 ? (
                filteredAccountRequests.map((request) => (
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
                    <TableCell>{request.accountType?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleConfirmAction(request, "approve")}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
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
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchTerm ? "No matching applications found" : "No account applications available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Account Request Details</DialogTitle>
            <DialogDescription>
              Detailed information about the account application.
              {selectedRequest?.updatedAt && (
                <span className="text-muted-foreground text-sm block mt-1">
                  Last updated: {new Date(selectedRequest.updatedAt).toLocaleString()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedRequest.personalInfo.firstName} ${selectedRequest.personalInfo.lastName}`}
                    alt={`${selectedRequest.personalInfo.firstName} ${selectedRequest.personalInfo.lastName}`}
                  />
                  <AvatarFallback>
                    {selectedRequest.personalInfo.firstName[0]}
                    {selectedRequest.personalInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-medium">
                    {selectedRequest.personalInfo.firstName} {selectedRequest.personalInfo.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">{selectedRequest.personalInfo.email}</div>
                  <div className="text-sm text-muted-foreground">{selectedRequest.personalInfo.phone}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                      <div>{new Date(selectedRequest.personalInfo.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">ID Number</div>
                      <div>{selectedRequest.personalInfo.idNumber}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-muted-foreground">Address</div>
                      <div>
                        {selectedRequest.personalInfo.address}, {selectedRequest.personalInfo.city}{' '}
                        {selectedRequest.personalInfo.postalCode}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Account Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Account Type</div>
                      <div>{selectedRequest.accountType?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Initial Deposit</div>
                      <div>{selectedRequest.accountInfo.initialDeposit} DT</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Debit Card</div>
                      <div>{selectedRequest.accountInfo.wantsDebitCard ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Online Banking</div>
                      <div>{selectedRequest.accountInfo.wantsOnlineBanking ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Employment Status</div>
                      <div>{selectedRequest.financialInfo.employmentStatus}</div>
                    </div>
                    {selectedRequest.financialInfo.employerName && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Employer</div>
                        <div>{selectedRequest.financialInfo.employerName}</div>
                      </div>
                    )}
                    {selectedRequest.financialInfo.monthlyIncome && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Monthly Income</div>
                        <div>{selectedRequest.financialInfo.monthlyIncome} DT</div>
                      </div>
                    )}
                    {selectedRequest.financialInfo.sourceOfFunds && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Source of Funds</div>
                        <div>{selectedRequest.financialInfo.sourceOfFunds}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Application Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Status</div>
                      <div>{getStatusBadge(selectedRequest.status)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Created At</div>
                      <div>{new Date(selectedRequest.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedRequest && selectedRequest.status === "pending" && (
              <>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleConfirmAction(selectedRequest, "approve");
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleConfirmAction(selectedRequest, "reject");
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmAction === "approve" ? "Approve Request" : "Reject Request"}</DialogTitle>
            <DialogDescription>
              {confirmAction === "approve"
                ? "Are you sure you want to approve this account application? This will create a new bank account for the user."
                : "Are you sure you want to reject this account application? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction === "approve" ? "default" : "destructive"}
              className={confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={executeAction}
            >
              {confirmAction === "approve" ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Approval
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountApplications;