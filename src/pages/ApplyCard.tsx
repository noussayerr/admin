import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
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
import { PlusCircle, Trash2, Upload } from "lucide-react";

interface Reason {
  text: string;
  icon: string;
}

const initialFormData = {
  name: "",
  description: "",
  tag: "",
  why: "",
  fees: {
    annual: "",
    withdrawal: "",
    replacement: "",
  },
  requirements: {
    minIncome: "",
    employmentStatus: [] as string[],
  },
};

export default function ApplyCard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams(); // if id exists, we are in edit mode
  const isEditMode = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([""]);
  const [reasons, setReasons] = useState<Reason[]>([{ text: "", icon: "credit-card" }]);
  const [formData, setFormData] = useState(initialFormData);

  const steps = [
    { title: "Basic Information", fields: ["name", "tag", "description", "why"] },
    { title: "Features & Benefits", fields: ["features", "reasons"] },
    { title: "Fees & Requirements", fields: ["fees", "requirements"] },
  ];

  // Fetch card data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:5000/api/cartroutes/onecart/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch card data");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            tag: data.tag || "",
            why: data.why || "",
            fees: {
              annual: data.fees?.annual?.toString() || "",
              withdrawal: data.fees?.withdrawal?.toString() || "",
              replacement: data.fees?.replacement?.toString() || "",
            },
            requirements: {
              minIncome: data.requirements?.minIncome?.toString() || "",
              employmentStatus: data.requirements?.employmentStatus || [],
            },
          });
          setFeatures(data.features && data.features.length > 0 ? data.features : [""]);
          setReasons(
            data.benefits && data.benefits.length > 0
              ? data.benefits.map((b: any) => ({
                  text: b.text || "",
                  icon: b.icon || "credit-card",
                }))
              : [{ text: "", icon: "credit-card" }]
          );
          if (data.image) {
            setCardImagePreview(data.image);
          }
        })
        .catch((error) => {
          console.error("Error fetching card data:", error);
          toast({
            title: "Error",
            description: "Failed to load card information for editing.",
            type: "error",
          });
        });
    }
  }, [id, isEditMode, toast]);

  // Validate fields based on the current step
  const validateStep = () => {
    if (activeStep === 0) {
      if (!formData.name.trim()) {
        toast({ title: "Validation Error", description: "Card name is required.", type: "error" });
        return false;
      }
      if (!formData.tag.trim()) {
        toast({ title: "Validation Error", description: "Card type is required.", type: "error" });
        return false;
      }
      if (!formData.description.trim()) {
        toast({
          title: "Validation Error",
          description: "Short description is required.",
          type: "error",
        });
        return false;
      }
      if (!formData.why.trim()) {
        toast({
          title: "Validation Error",
          description: "Detailed description is required.",
          type: "error",
        });
        return false;
      }
    } else if (activeStep === 1) {
      if (features.filter((f) => f.trim()).length === 0) {
        toast({
          title: "Validation Error",
          description: "At least one feature is required.",
          type: "error",
        });
        return false;
      }
      if (reasons.filter((r) => r.text.trim()).length === 0) {
        toast({
          title: "Validation Error",
          description: "At least one reason must be provided.",
          type: "error",
        });
        return false;
      }
    } else if (activeStep === 2) {
      if (!formData.fees.annual.trim() || isNaN(parseFloat(formData.fees.annual))) {
        toast({ title: "Validation Error", description: "Valid annual fee is required.", type: "error" });
        return false;
      }
      if (!formData.fees.withdrawal.trim() || isNaN(parseFloat(formData.fees.withdrawal))) {
        toast({
          title: "Validation Error",
          description: "Valid withdrawal fee is required.",
          type: "error",
        });
        return false;
      }
      if (!formData.fees.replacement.trim() || isNaN(parseFloat(formData.fees.replacement))) {
        toast({
          title: "Validation Error",
          description: "Valid replacement fee is required.",
          type: "error",
        });
        return false;
      }
      if (formData.requirements.minIncome && isNaN(parseFloat(formData.requirements.minIncome))) {
        toast({
          title: "Validation Error",
          description: "Minimum income must be a valid number.",
          type: "error",
        });
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
    if (name.startsWith("fees.")) {
      const [, field] = name.split(".");
      setFormData((prev) => ({ ...prev, fees: { ...prev.fees, [field]: value } }));
    } else if (name.startsWith("requirements.")) {
      const [, field] = name.split(".");
      setFormData((prev) => ({ ...prev, requirements: { ...prev.requirements, [field]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setCardImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setCardImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Feature and Reason handlers
  const addFeature = () => setFeatures((prev) => [...prev, ""]);
  const updateFeature = (index: number, value: string) =>
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));
  const removeFeature = (index: number) => setFeatures((prev) => prev.filter((_, i) => i !== index));
  
  const addReason = () => setReasons((prev) => [...prev, { text: "", icon: "credit-card" }]);
  const updateReason = (index: number, field: keyof Reason, value: string) =>
    setReasons((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  const removeReason = (index: number) => setReasons((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      let imageBase64 = cardImagePreview || "";
      if (cardImage) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result?.toString() || "");
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(cardImage);
        });
      }
      const payload = {
        ...formData,
        image: imageBase64,
        features: features.filter((f) => f.trim()),
        benefits: reasons
          .filter((r) => r.text.trim())
          .map((r) => ({
            text: r.text.trim(),
            icon: r.icon,
          })),
        fees: {
          annual: parseFloat(formData.fees.annual) || 0,
          withdrawal: parseFloat(formData.fees.withdrawal) || 0,
          replacement: parseFloat(formData.fees.replacement) || 0,
        },
        requirements: {
          ...formData.requirements,
          minIncome: parseFloat(formData.requirements.minIncome) || 0,
          employmentStatus: formData.requirements.employmentStatus,
        },
      };

      const endpoint = isEditMode
        ? `http://localhost:5000/api/cartroutes/updatecardtype/${id}`
        : "http://localhost:5000/api/cartroutes/addcardtype";
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
        title: isEditMode ? "Card Updated" : "Application Submitted",
        description: isEditMode
          ? "Your card has been updated successfully."
          : "Your card application has been submitted successfully.",
        type: "success",
      });
      navigate("/cards");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Update Your STB Card" : "Apply for a New STB Card"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditMode
            ? "Modify the form below to update your card information"
            : "Complete the form below to apply for a new STB banking card"}
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
              <CardTitle>Card Information</CardTitle>
              <CardDescription>Provide basic information about the card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="card-image">Card Image</Label>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div
                    className="flex h-40 w-64 items-center justify-center rounded-md border border-dashed bg-cover bg-center"
                    style={{ backgroundImage: cardImagePreview ? `url(${cardImagePreview})` : undefined }}
                  >
                    {!cardImagePreview && (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Upload card image</div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input id="card-image" type="file" accept="image/*" onChange={handleImageChange} className="max-w-sm" />
                    <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, GIF</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Card Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. STB Travel Card" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tag">Card Type</Label>
                  <Select value={formData.tag} onValueChange={(v) => handleSelectChange("tag", v)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["International", "National", "Savings", "Premium", "Prepaid", "Business"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description of the card" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="why">Detailed Description</Label>
                <Textarea id="why" name="why" value={formData.why} onChange={handleInputChange} placeholder="Detailed explanation of the card's benefits" className="min-h-[100px]" required />
              </div>
            </CardContent>
          </Card>
        )}
        {activeStep === 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Features & Benefits</CardTitle>
              <CardDescription>Add the card's features and benefits</CardDescription>
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
                  <Label>Key Reasons to Choose</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addReason}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Reason
                  </Button>
                </div>
                <div className="space-y-4">
                  {reasons.map((reason, index) => (
                    <div key={index} className="grid gap-4 rounded-lg border p-4">
                      <div className="grid gap-2">
                        <Label>Reason Text</Label>
                        <Textarea value={reason.text} onChange={(e) => updateReason(index, "text", e.target.value)} placeholder="Explain why this feature is beneficial" required />
                      </div>
                      <div className="grid gap-2">
                        <Label>Icon</Label>
                        <Select value={reason.icon} onValueChange={(v) => updateReason(index, "icon", v)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "credit-card",
                              "atm",
                              "hotel",
                              "payments",
                              "access-time",
                              "phone-android",
                              "trending-up",
                              "event-available",
                              "autorenew",
                              "account-balance-wallet",
                              "people",
                              "security",
                              "add-shopping-cart",
                              "swap-horiz",
                            ].map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {icon.replace("-", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {reasons.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeReason(index)}>
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          Remove Reason
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
              <CardTitle>Fees & Requirements</CardTitle>
              <CardDescription>Specify fees and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="annual-fee">Annual Fee</Label>
                  <Input id="annual-fee" name="fees.annual" value={formData.fees.annual} onChange={handleInputChange} placeholder="e.g. 60 DT" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="withdrawal-fee">Withdrawal Fee</Label>
                  <Input id="withdrawal-fee" name="fees.withdrawal" value={formData.fees.withdrawal} onChange={handleInputChange} placeholder="e.g. 3 DT + 2.5%" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="replacement-fee">Replacement Fee</Label>
                  <Input id="replacement-fee" name="fees.replacement" value={formData.fees.replacement} onChange={handleInputChange} placeholder="e.g. 20 DT" required />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="minIncome">Minimum Income (DT)</Label>
                  <Input id="minIncome" type="number" name="requirements.minIncome" value={formData.requirements.minIncome} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label>Employment Status</Label>
                  <div className="flex flex-col gap-2">
                    {["Employed", "Self-Employed", "Student", "Retired"].map((status) => (
                      <div key={status} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.requirements.employmentStatus.includes(status)}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                employmentStatus: e.target.checked
                                  ? [...prev.requirements.employmentStatus, status]
                                  : prev.requirements.employmentStatus.filter((s) => s !== status),
                              },
                            }))
                          }
                        />
                        <Label>{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>
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
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Card" : "Submit Application"}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
