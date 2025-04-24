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
  Home,
  Car,
  Briefcase,
  School,
  Wallet,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

interface CreditType {
  _id: string;
  title: string;
  description: string;
  interestRate: number;
  duration: string;
  eligibility: string;
  icon: string;
  color: string;
  features: string[];
  benefits: Array<{ text: string; icon: string }>;
  requirements: {
    minIncome?: number;
    minCreditScore?: number;
    employmentDuration?: string;
  };
  fees: {
    processing?: number;
    latePayment?: number;
    prepayment?: number;
  };
}

// Icon mapping component
const IconComponent = ({ iconName, className = "" }: { iconName: string, className?: string }) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "home": Home,
    "car": Car,
    "business": Briefcase,
    "school": School,
    "wallet": Wallet,
    "trending-up": TrendingUp,
    "credit-card": CreditCard
  };

  const Icon = iconMap[iconName] || Wallet;
  return <Icon className={className} />;
};

export default function CreditManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [credits, setCredits] = useState<CreditType[]>([]);
  const [selectedCredit, setSelectedCredit] = useState<CreditType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/creditroutes/credittypes");
        const data = await response.json();
        console.log(data)
        setCredits(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch credit types",
        });
      }
    };
    fetchCredits();
  }, []);

  const handleDelete = async (creditId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/creditroutes/credittypes/${creditId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete credit type");
      }
      
      setCredits(prev => prev.filter(credit => credit._id !== creditId));
      toast({
        title: "Success",
        description: "Credit type deleted successfully",
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const openCreditDetails = (credit: CreditType) => {
    setSelectedCredit(credit);
    setIsDialogOpen(true);
  };

  const filteredCredits = credits.filter(
    credit =>
      credit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Credit Management</h1>
        <p className="text-muted-foreground">Manage all credit types available in the STB banking system.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search credit types..."
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
        <Link to="/credits/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Credit Type
          </Button>
        </Link>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-h-[90vh] overflow-y-auto">
          {selectedCredit && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div 
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${selectedCredit.color}20`, color: selectedCredit.color }}
                  >
                    <IconComponent iconName={selectedCredit.icon} className="h-4 w-4" />
                  </div>
                  {selectedCredit.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedCredit.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>Interest Rate: {selectedCredit.interestRate}%</p>
                      <p>Duration: {selectedCredit.duration}</p>
                      <p>Eligibility: {selectedCredit.eligibility}</p>
                    </div>
                  </div>
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
                      navigate(`/credits/edit/${selectedCredit._id}`);
                    }}
                  >
                    Edit Credit Type
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Credit Types</CardTitle>
          <CardDescription>A list of all credit types available in the STB banking system.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead className="hidden lg:table-cell">Eligibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCredits.map((credit) => (
                <TableRow key={credit._id}>
                  <TableCell>
                    <div 
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${credit.color}20`, color: credit.color }}
                    >
                      <IconComponent iconName={credit.icon} className="h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{credit.title}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {credit.description.length > 60 
                      ? `${credit.description.substring(0, 60)}...` 
                      : credit.description}
                  </TableCell>
                  <TableCell>
                    {credit.interestRate}%
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {credit.duration}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {credit.eligibility.length > 30 
                      ? `${credit.eligibility.substring(0, 30)}...` 
                      : credit.eligibility}
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
                        <DropdownMenuItem onClick={() => openCreditDetails(credit)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => navigate(`/credits/edit/${credit._id}`)}
                        >
                          Edit credit type
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(credit._id)}
                        >
                          Delete credit type
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