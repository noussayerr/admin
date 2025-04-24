import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
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
import { 
  Search, 
  MoreHorizontal, 
  Filter, 
  PlusCircle,
  CreditCard,
  Banknote,
  School,
  Briefcase,
  Gem,
  Wallet,
  Users,
  Shield,
  Home,
  Plane,
  ShoppingCart,
  TrendingUp,
  Clock,
  Phone,
  RefreshCw
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

interface AccountType {
  _id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  benefits: Array<{ text: string; icon: string }>;
  requirements: {
    minDeposit: number;
    minBalance?: number;
  };
  fees: {
    monthly: number;
    transaction?: number;
    internationalTransfer?: number;
  };
  interestRate?: number;
}

// Icon mapping component
const IconComponent = ({ iconName, className = "" }: { iconName: string, className?: string }) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "credit-card": CreditCard,
    "banknote": Banknote,
    "school": School,
    "business": Briefcase,
    "diamond": Gem,
    "account-balance": Wallet,
    "people": Users,
    "security": Shield,
    "home": Home,
    "travel": Plane,
    "shopping-cart": ShoppingCart,
    "trending-up": TrendingUp,
    "access-time": Clock,
    "phone-android": Phone,
    "autorenew": RefreshCw,
    "account-balance-wallet": Wallet,
    "payments": CreditCard,
    "event-available": Clock,
    "atm": CreditCard,
    "savings": Banknote,
    "work": Briefcase
  };

  const Icon = iconMap[iconName] || Wallet; // Default to Wallet if icon not found
  return <Icon className={className} />;
};

export default function AccountManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/accountroutes/getaccounttypes");
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch accounts",
        });
      }
    };
    fetchAccounts();
  }, []);

  const handleDelete = async (accountId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/accountroutes/${accountId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      
      setAccounts(prev => prev.filter(account => account._id !== accountId));
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const openAccountDetails = (account: AccountType) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const filteredAccounts = accounts.filter(
    account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Account Management</h1>
        <p className="text-muted-foreground">Manage all account types available in the STB banking system.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search accounts..."
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
        <Link to="/accounts/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Account Type
          </Button>
        </Link>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-h-[90vh] overflow-y-auto">
          {selectedAccount && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IconComponent iconName={selectedAccount.icon} className="h-6 w-6" />
                  {selectedAccount.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedAccount.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pb-4">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <IconComponent 
                      iconName={selectedAccount.icon} 
                      className="h-16 w-16 text-primary" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <ul className="space-y-1">
                      {selectedAccount.features.map((feature, index) => (
                        <li key={index} className="text-sm">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <div className="space-y-1 text-sm">
                      <p>Minimum Deposit: {selectedAccount.requirements.minDeposit} DT</p>
                      {selectedAccount.requirements.minBalance && (
                        <p>Minimum Balance: {selectedAccount.requirements.minBalance} DT</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Fees</h3>
                    <div className="space-y-1 text-sm">
                      <p>Monthly: {selectedAccount.fees.monthly} DT</p>
                      {selectedAccount.fees.transaction && (
                        <p>Transaction: {selectedAccount.fees.transaction} DT</p>
                      )}
                      {selectedAccount.fees.internationalTransfer && (
                        <p>International Transfer: {selectedAccount.fees.internationalTransfer} DT</p>
                      )}
                    </div>
                  </div>
                  {selectedAccount.interestRate && (
                    <div>
                      <h3 className="font-semibold mb-2">Interest Rate</h3>
                      <p className="text-sm">{selectedAccount.interestRate}%</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDialogOpen(false);
                      navigate(`/accounts/edit/${selectedAccount._id}`);
                    }}
                  >
                    Edit Account
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Account Types</CardTitle>
          <CardDescription>A list of all account types available in the STB banking system.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Min. Deposit</TableHead>
                <TableHead className="hidden md:table-cell">Monthly Fee</TableHead>
                <TableHead className="hidden lg:table-cell">Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account._id}>
                  <TableCell>
                    <div className="p-2 rounded-full bg-primary/10 w-fit">
                      <IconComponent 
                        iconName={account.icon} 
                        className="h-6 w-6 text-primary" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{account.name}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {account.description.length > 60 
                      ? `${account.description.substring(0, 60)}...` 
                      : account.description}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {account.requirements.minDeposit} DT
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {account.fees.monthly} DT
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {account.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {feature}
                        </Badge>
                      ))}
                      {account.features.length > 2 && (
                        <Badge variant="secondary">+{account.features.length - 2} more</Badge>
                      )}
                    </div>
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
                        <DropdownMenuItem onClick={() => openAccountDetails(account)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => navigate(`/accounts/edit/${account._id}`)}
                        >
                          Edit account
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(account._id)}
                        >
                          Delete account
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
    </div>
  );
}