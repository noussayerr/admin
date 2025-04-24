"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Search, MoreHorizontal, Filter, UserPlus } from "lucide-react"

// Mock data for users
const initialUsers = [
  {
    id: "1",
    name: "Ahmed Ben Ali",
    email: "ahmed.benali@example.com",
    status: "active",
    accountType: "Premium",
    joinDate: "2023-01-15",
    lastLogin: "2023-05-10",
  },
  {
    id: "2",
    name: "Sarra Mansour",
    email: "sarra.mansour@example.com",
    status: "active",
    accountType: "Standard",
    joinDate: "2023-02-20",
    lastLogin: "2023-05-09",
  },
  {
    id: "3",
    name: "Mohamed Karim",
    email: "mohamed.karim@example.com",
    status: "inactive",
    accountType: "Premium",
    joinDate: "2023-03-05",
    lastLogin: "2023-04-28",
  },
  {
    id: "4",
    name: "Leila Trabelsi",
    email: "leila.trabelsi@example.com",
    status: "active",
    accountType: "Standard",
    joinDate: "2023-03-15",
    lastLogin: "2023-05-10",
  },
  {
    id: "5",
    name: "Kamel Gharbi",
    email: "kamel.gharbi@example.com",
    status: "suspended",
    accountType: "Premium",
    joinDate: "2023-04-01",
    lastLogin: "2023-04-20",
  },
  {
    id: "6",
    name: "Amina Belhaj",
    email: "amina.belhaj@example.com",
    status: "active",
    accountType: "Standard",
    joinDate: "2023-04-10",
    lastLogin: "2023-05-08",
  },
  {
    id: "7",
    name: "Youssef Msakni",
    email: "youssef.msakni@example.com",
    status: "active",
    accountType: "Premium",
    joinDate: "2023-04-15",
    lastLogin: "2023-05-09",
  },
  {
    id: "8",
    name: "Fatma Riahi",
    email: "fatma.riahi@example.com",
    status: "inactive",
    accountType: "Standard",
    joinDate: "2023-04-20",
    lastLogin: "2023-05-01",
  },
]

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage all STB users and their account information.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
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
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users in the STB banking system.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Account Type</TableHead>
                <TableHead className="hidden md:table-cell">Join Date</TableHead>
                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "destructive"
                      }
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.accountType}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
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
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
