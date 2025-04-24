"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Search, Filter, CheckCircle, XCircle, Eye } from "lucide-react"

// Mock data for requests
const cardRequests = [
  {
    id: "1",
    user: {
      name: "Ahmed Ben Ali",
      email: "ahmed.benali@example.com",
      avatar: "AB",
    },
    cardType: "STB Travel",
    requestDate: "2023-05-01",
    status: "pending",
  },
  {
    id: "2",
    user: {
      name: "Sarra Mansour",
      email: "sarra.mansour@example.com",
      avatar: "SM",
    },
    cardType: "Carte STB Epargne",
    requestDate: "2023-05-02",
    status: "pending",
  },
  {
    id: "3",
    user: {
      name: "Mohamed Karim",
      email: "mohamed.karim@example.com",
      avatar: "MK",
    },
    cardType: "Carte Visa Electron Nationale",
    requestDate: "2023-05-03",
    status: "approved",
  },
  {
    id: "4",
    user: {
      name: "Leila Trabelsi",
      email: "leila.trabelsi@example.com",
      avatar: "LT",
    },
    cardType: "Carte CIB3",
    requestDate: "2023-05-04",
    status: "rejected",
  },
]

const accountRequests = [
  {
    id: "1",
    user: {
      name: "Kamel Gharbi",
      email: "kamel.gharbi@example.com",
      avatar: "KG",
    },
    accountType: "Current Account",
    requestDate: "2023-05-01",
    status: "pending",
  },
  {
    id: "2",
    user: {
      name: "Amina Belhaj",
      email: "amina.belhaj@example.com",
      avatar: "AB",
    },
    accountType: "Savings Account",
    requestDate: "2023-05-02",
    status: "pending",
  },
  {
    id: "3",
    user: {
      name: "Youssef Msakni",
      email: "youssef.msakni@example.com",
      avatar: "YM",
    },
    accountType: "Student Account",
    requestDate: "2023-05-03",
    status: "approved",
  },
]

const creditRequests = [
  {
    id: "1",
    user: {
      name: "Fatma Riahi",
      email: "fatma.riahi@example.com",
      avatar: "FR",
    },
    creditType: "Home Loan",
    amount: "250,000 DT",
    requestDate: "2023-05-01",
    status: "pending",
  },
  {
    id: "2",
    user: {
      name: "Nizar Chaabane",
      email: "nizar.chaabane@example.com",
      avatar: "NC",
    },
    creditType: "Auto Loan",
    amount: "45,000 DT",
    requestDate: "2023-05-02",
    status: "pending",
  },
  {
    id: "3",
    user: {
      name: "Salma Jebali",
      email: "salma.jebali@example.com",
      avatar: "SJ",
    },
    creditType: "Personal Loan",
    amount: "15,000 DT",
    requestDate: "2023-05-03",
    status: "approved",
  },
  {
    id: "4",
    user: {
      name: "Hedi Mejri",
      email: "hedi.mejri@example.com",
      avatar: "HM",
    },
    creditType: "Business Loan",
    amount: "100,000 DT",
    requestDate: "2023-05-04",
    status: "rejected",
  },
]

export default function RequestManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null)

  const filteredCardRequests = cardRequests.filter(
    (request) =>
      request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.cardType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAccountRequests = accountRequests.filter(
    (request) =>
      request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.accountType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCreditRequests = creditRequests.filter(
    (request) =>
      request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.creditType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request)
    setDetailsDialogOpen(true)
  }

  const handleConfirmAction = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setConfirmAction(action)
    setConfirmDialogOpen(true)
  }

  const executeAction = () => {
    // Here you would normally send the action to your backend
    console.log(`${confirmAction} request ${selectedRequest.id}`)
    setConfirmDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "approved":
        return <Badge variant="default">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Request Management</h1>
        <p className="text-muted-foreground">Manage and process user requests for cards, accounts, and credits.</p>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="cards">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cards">Card Requests</TabsTrigger>
          <TabsTrigger value="accounts">Account Requests</TabsTrigger>
          <TabsTrigger value="credits">Credit Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Card Requests</CardTitle>
              <CardDescription>Process user requests for new cards.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Card Type</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCardRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.user.name}`}
                              alt={request.user.name}
                            />
                            <AvatarFallback>{request.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.user.name}</div>
                            <div className="text-sm text-muted-foreground">{request.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.cardType}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
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
                                className="text-green-600"
                                onClick={() => handleConfirmAction(request, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="mt-4">
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
                  {filteredAccountRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.user.name}`}
                              alt={request.user.name}
                            />
                            <AvatarFallback>{request.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.user.name}</div>
                            <div className="text-sm text-muted-foreground">{request.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.accountType}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
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
                                className="text-green-600"
                                onClick={() => handleConfirmAction(request, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="mt-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Credit Requests</CardTitle>
              <CardDescription>Process user requests for new credits and loans.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Credit Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCreditRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.user.name}`}
                              alt={request.user.name}
                            />
                            <AvatarFallback>{request.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.user.name}</div>
                            <div className="text-sm text-muted-foreground">{request.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.creditType}</TableCell>
                      <TableCell>{request.amount}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
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
                                className="text-green-600"
                                onClick={() => handleConfirmAction(request, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>Detailed information about the request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedRequest.user.name}`}
                    alt={selectedRequest.user.name}
                  />
                  <AvatarFallback>{selectedRequest.user.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-medium">{selectedRequest.user.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedRequest.user.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Request Type</div>
                  <div className="text-base">
                    {selectedRequest.cardType
                      ? `Card: ${selectedRequest.cardType}`
                      : selectedRequest.accountType
                        ? `Account: ${selectedRequest.accountType}`
                        : `Credit: ${selectedRequest.creditType}`}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Request Date</div>
                  <div className="text-base">{selectedRequest.requestDate}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="text-base">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                {selectedRequest.amount && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Amount</div>
                    <div className="text-base">{selectedRequest.amount}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Additional Information</div>
                <div className="rounded-md bg-muted p-3 text-sm">
                  {selectedRequest.cardType
                    ? "The user has requested a new card and has completed all required verification steps."
                    : selectedRequest.accountType
                      ? "The user has requested a new account and has provided all necessary documentation."
                      : "The user has applied for a credit and has submitted all required financial information."}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedRequest && selectedRequest.status === "pending" && (
              <>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setDetailsDialogOpen(false)
                    handleConfirmAction(selectedRequest, "approve")
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false)
                    handleConfirmAction(selectedRequest, "reject")
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

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmAction === "approve" ? "Approve Request" : "Reject Request"}</DialogTitle>
            <DialogDescription>
              {confirmAction === "approve"
                ? "Are you sure you want to approve this request? This action cannot be undone."
                : "Are you sure you want to reject this request? This action cannot be undone."}
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
  )
}
