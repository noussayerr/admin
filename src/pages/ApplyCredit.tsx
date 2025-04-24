import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2, PlusCircle, Trash2, Wallet } from "lucide-react";

const creditIcons = [
  { value: "home", label: "Home" },
  { value: "car", label: "Car" },
  { value: "business", label: "Business" },
  { value: "school", label: "Education" },
  { value: "wallet", label: "Wallet" },
  { value: "trending-up", label: "Investment" },
  { value: "credit-card", label: "Credit Card" }
];

export default function AddCredit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    interestRate: "",
    duration: "",
    eligibility: "",
    icon: "wallet",
    color: "#0ea5e9",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchCreditType = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/creditroutes/credittypes/${id}`);
          const data = await response.json();
          
          setFormData({
            title: data.title || "",
            description: data.description || "",
            interestRate: data.interestRate?.toString() || "",
            duration: data.duration || "",
            eligibility: data.eligibility || "",
            icon: data.icon || "wallet",
            color: data.color || "#0ea5e9",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load credit type information for editing.",
          });
        }
      };
      
      fetchCreditType();
    }
  }, [id, isEditMode, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({ title: "Validation Error", description: "Credit title is required." });
      return false;
    }
    if (!formData.description.trim()) {
      toast({ title: "Validation Error", description: "Description is required." });
      return false;
    }
    if (!formData.interestRate || isNaN(parseFloat(formData.interestRate))) {
      toast({ title: "Validation Error", description: "Valid interest rate is required." });
      return false;
    }
    if (!formData.duration.trim()) {
      toast({ title: "Validation Error", description: "Duration is required." });
      return false;
    }
    if (!formData.eligibility.trim()) {
      toast({ title: "Validation Error", description: "Eligibility requirements are required." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        interestRate: parseFloat(formData.interestRate),
      };

      const endpoint = isEditMode
        ? `http://localhost:5000/api/creditroutes/credittypes/${id}`
        : "http://localhost:5000/api/creditroutes/credittypes";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      toast({
        title: isEditMode ? "Credit Type Updated" : "Credit Type Created",
        description: isEditMode
          ? "Your credit type has been updated successfully."
          : "Your new credit type has been created successfully.",
      });
      navigate("/credits");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your form",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Update Credit Type" : "Create New Credit Type"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditMode
            ? "Modify the form below to update this credit type"
            : "Complete the form below to create a new credit type"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Credit Information</CardTitle>
            <CardDescription>Provide basic information about the credit type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Credit Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Personal Loan"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => handleSelectChange("icon", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditIcons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the credit type"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  placeholder="e.g. 8.5"
                  step="0.01"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. Up to 60 months"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="color">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="h-10 w-10 cursor-pointer p-1"
                    required
                  />
                  <Input
                    id="color-hex"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="eligibility">Eligibility Requirements</Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                placeholder="Describe who is eligible for this credit type"
                className="min-h-[100px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/credits")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  {isEditMode ? "Update Credit Type" : "Create Credit Type"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}