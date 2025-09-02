import { Filter, MoreHorizontal, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'suspended'
  accountType: 'Premium' | 'Standard'
  joinDate: string
  lastLogin: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/authroutes/users')
        const data = await response.json()
        console.log("Fetched users:", data)
        if (data.success) {
          setUsers(data.users)
          setFilteredUsers(data.users)
        } else {
          console.error("Failed to fetch users:", data.message)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/authroutes/users/${userToDelete}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        
        if (data.success) {
          setUsers(users.filter((user) => user.id !== userToDelete))
          setDeleteDialogOpen(false)
          setUserToDelete(null)
          
        } else {
          console.error("Failed to delete user:", data.message)
        }
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: 'active' | 'inactive' | 'suspended') => {
    const action = currentStatus === 'active' ? 'block' : 'unblock'
    
    try {
      const response = await fetch(`http://localhost:5000/api/authroutes/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      const data = await response.json()
      
      if (data.success) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                status: action === 'block' ? 'inactive' : 'active',
                lastLogin: action === 'block' ? user.lastLogin : new Date().toISOString().split('T')[0]
              } 
            : user
        ))
        console.log(`User ${action}ed successfully`)
      } else {
        console.error(`Failed to ${action} user:`, data.message)
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
                          user.status === "active" 
                            ? "default" 
                            : user.status === "inactive" 
                              ? "secondary" 
                              : "destructive"
                        }
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.accountType}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.lastLogin || "Never"}</TableCell>
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
                          <DropdownMenuItem 
                            className={user.status === "active" ? "text-destructive" : "text-green-600"}
                            onClick={() => toggleUserStatus(user.id, user.status)}
                          >
                            {user.status === "active" ? "Block user" : "Unblock user"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm ? "No users match your search" : "No users found"}
                  </TableCell>
                </TableRow>
              )}
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