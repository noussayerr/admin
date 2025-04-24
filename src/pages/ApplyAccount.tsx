import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

interface Benefit {
  text: string;
  icon: string;
}

const initialFormData = {
  name: "",
  description: "",
  icon: "account-balance",
  features: [""],
  benefits: [{ text: "", icon: "account-balance" }],
  requirements: {
    minDeposit: "",
    minBalance: "",
  },
  fees: {
    monthly: "",
    transaction: "",
    internationalTransfer: "",
  },
  interestRate: "",
};

export default function AddAccount() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<Benefit[]>([{ text: "", icon: "account-balance" }]);
  const [formData, setFormData] = useState(initialFormData);

  const steps = [
    { title: "Basic Information", fields: ["name", "description", "icon"] },
    { title: "Features & Benefits", fields: ["features", "benefits"] },
    { title: "Requirements & Fees", fields: ["requirements", "fees", "interestRate"] },
  ];

  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:5000/api/accountroutes/getaccounttype/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch account data");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            icon: data.icon || "account-balance",
            features: data.features && data.features.length > 0 ? data.features : [""],
            benefits: data.benefits && data.benefits.length > 0
              ? data.benefits.map((b: any) => ({
                  text: b.text || "",
                  icon: b.icon || "account-balance",
                }))
              : [{ text: "", icon: "account-balance" }],
            requirements: {
              minDeposit: data.requirements?.minDeposit?.toString() || "",
              minBalance: data.requirements?.minBalance?.toString() || "",
            },
            fees: {
              monthly: data.fees?.monthly?.toString() || "",
              transaction: data.fees?.transaction?.toString() || "",
              internationalTransfer: data.fees?.internationalTransfer?.toString() || "",
            },
            interestRate: data.interestRate?.toString() || "",
          });
          setFeatures(data.features && data.features.length > 0 ? data.features : [""]);
          setBenefits(
            data.benefits && data.benefits.length > 0
              ? data.benefits.map((b: any) => ({
                  text: b.text || "",
                  icon: b.icon || "account-balance",
                }))
              : [{ text: "", icon: "account-balance" }]
          );
        })        .catch((error) => {
          console.error("Error fetching account data:", error);
          toast({
            title: "Error",
            description: "Failed to load account information for editing.",
          });
        });
    }
  }, [id, isEditMode, toast]);

  const validateStep = () => {
    if (activeStep === 0) {
      if (!formData.name.trim()) {
        toast({ title: "Validation Error", description: "Account name is required.", });
        return false;
      }
      if (!formData.description.trim()) {
        toast({ title: "Validation Error", description: "Description is required."  });
        return false;
      }
    } else if (activeStep === 1) {
      if (features.filter((f) => f.trim()).length === 0) {
        toast({ title: "Validation Error", description: "At least one feature is required."  });
        return false;
      }
      if (benefits.filter((b) => b.text.trim()).length === 0) {
        toast({ title: "Validation Error", description: "At least one benefit must be provided." });
        return false;
      }
    } else if (activeStep === 2) {
      if (!formData.requirements.minDeposit.trim() || isNaN(parseFloat(formData.requirements.minDeposit))) {
        toast({ title: "Validation Error", description: "Valid minimum deposit is required." });
        return false;
      }
      if (!formData.fees.monthly.trim() || isNaN(parseFloat(formData.fees.monthly))) {
        toast({ title: "Validation Error", description: "Valid monthly fee is required." });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("requirements.")) {
      const [, field] = name.split(".");
      setFormData((prev) => ({ ...prev, requirements: { ...prev.requirements, [field]: value } }));
    } else if (name.startsWith("fees.")) {
      const [, field] = name.split(".");
      setFormData((prev) => ({ ...prev, fees: { ...prev.fees, [field]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFeature = () => setFeatures((prev) => [...prev, ""]);
  const updateFeature = (index: number, value: string) =>
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));
  const removeFeature = (index: number) => setFeatures((prev) => prev.filter((_, i) => i !== index));
  
  const addBenefit = () => setBenefits((prev) => [...prev, { text: "", icon: "account-balance" }]);
  const updateBenefit = (index: number, field: keyof Benefit, value: string) =>
    setBenefits((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  const removeBenefit = (index: number) => setBenefits((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        features: features.filter((f) => f.trim()),
        benefits: benefits
          .filter((b) => b.text.trim())
          .map((b) => ({
            text: b.text.trim(),
            icon: b.icon,
          })),
        requirements: {
          minDeposit: parseFloat(formData.requirements.minDeposit) || 0,
          minBalance: formData.requirements.minBalance ? parseFloat(formData.requirements.minBalance) : null,
        },
        fees: {
          monthly: parseFloat(formData.fees.monthly) || 0,
          transaction: formData.fees.transaction ? parseFloat(formData.fees.transaction) : null,
          internationalTransfer: formData.fees.internationalTransfer ? parseFloat(formData.fees.internationalTransfer) : null,
        },
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : null,
      };

      const endpoint = isEditMode
        ? `http://localhost:5000/api/accountroutes/updateaccounttype/${id}`
        : "http://localhost:5000/api/accountroutes/createaccounttype";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }
      toast({
        title: isEditMode ? "Account Updated" : "Account Created",
        description: isEditMode
          ? "Your account type has been updated successfully."
          : "Your new account type has been created successfully.",
      });
      navigate("/accounts");
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

  const iconOptions = [
    "account-balance",
    "savings",
    "school",
    "business",
    "diamond",
    "atm",
    "payments",
    "trending-up",
    "event-available",
    "account-balance-wallet",
    "people",
    "security",
    "credit-card",
    "home",
    "work",
    "travel",
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Update Account Type" : "Create New Account Type"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditMode
            ? "Modify the form below to update this account type"
            : "Complete the form below to create a new account type"}
        </p>
      </div>
      <div className="mb-8 flex justify-between">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= activeStep ? "bg-primary text-white" : "bg-muted"}`}>
              {index + 1}
            </div>
            <span className={`mt-2 text-sm ${index === activeStep ? "font-medium" : "text-muted-foreground"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <form>
        {activeStep === 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide basic information about the account type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. STB Premium Account" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed description of the account type" className="min-h-[100px]" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{icon}</span>
                            {icon.replace("-", " ")}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {activeStep === 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Features & Benefits</CardTitle>
              <CardDescription>Add the account's features and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <Label>Key Features</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={feature} onChange={(e) => updateFeature(index, e.target.value)} placeholder={`Feature ${index + 1}`} required />
                      {features.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-6 border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <Label>Key Benefits</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Benefit
                  </Button>
                </div>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="grid gap-4 rounded-lg border p-4">
                      <div className="grid gap-2">
                        <Label>Benefit Text</Label>
                        <Textarea value={benefit.text} onChange={(e) => updateBenefit(index, "text", e.target.value)} placeholder="Explain this benefit" required />
                      </div>
                      <div className="grid gap-2">
                        <Label>Icon</Label>
                        <Select value={benefit.icon} onValueChange={(v) => updateBenefit(index, "icon", v)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">{icon}</span>
                                  {icon.replace("-", " ")}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {benefits.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeBenefit(index)}>
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          Remove Benefit
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {activeStep === 2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Requirements & Fees</CardTitle>
              <CardDescription>Specify requirements and fees for this account type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="minDeposit">Minimum Deposit (DT)</Label>
                  <Input id="minDeposit" name="requirements.minDeposit" type="number" value={formData.requirements.minDeposit} onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minBalance">Minimum Balance (DT)</Label>
                  <Input id="minBalance" name="requirements.minBalance" type="number" value={formData.requirements.minBalance} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="monthlyFee">Monthly Fee (DT)</Label>
                  <Input id="monthlyFee" name="fees.monthly" type="number" value={formData.fees.monthly} onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transactionFee">Transaction Fee (DT)</Label>
                  <Input id="transactionFee" name="fees.transaction" type="number" value={formData.fees.transaction} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="internationalFee">International Transfer Fee (DT)</Label>
                  <Input id="internationalFee" name="fees.internationalTransfer" type="number" value={formData.fees.internationalTransfer} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input id="interestRate" name="interestRate" type="number" value={formData.interestRate} onChange={handleInputChange} step="0.01" />
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handlePrev} disabled={activeStep === 0 || isSubmitting}>
            Previous
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Account" : "Create Account"}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}