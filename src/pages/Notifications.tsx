import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Separator } from "../components/ui/separator"
import { 
  Mail, 
  Bell, 
  BellRing, 
  Send, 
  Users, 
  FileText, 
  CreditCard, 
  Plus, 
  FileInput, 
  AlignLeft, 
  Filter,
  Clock,
  Tag,
} from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { Badge } from "../components/ui/badge"

export default function Notifications() {
  const { toast } = useToast()
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [appNotificationTitle, setAppNotificationTitle] = useState("")
  const [appNotificationContent, setAppNotificationContent] = useState("")
  const [recipientType, setRecipientType] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [activeTab, setActiveTab] = useState("email")
  const [selectedUserEmail, setSelectedUserEmail] = useState("")
  const [isSending, setIsSending] = useState(false)

  const emailTemplates = [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to STB Banking",
      content:
        "Dear [Customer Name],\n\nWelcome to STB Banking! We're thrilled to have you as our customer. Your account has been successfully created and is now ready to use.\n\nYour account number: [Account Number]\n\nIf you have any questions or need assistance, please don't hesitate to contact our customer support team.\n\nBest regards,\nSTB Banking Team",
      icon: <Mail className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "card-approved",
      name: "Card Approval",
      subject: "Your STB Card Application is Approved",
      content:
        "Dear [Customer Name],\n\nWe're pleased to inform you that your application for [Card Type] has been approved. Your new card will be delivered to your registered address within 5-7 business days.\n\nFor security reasons, you'll need to activate your card before using it. You can do this through our mobile app or by visiting your nearest STB branch.\n\nBest regards,\nSTB Banking Team",
      icon: <CreditCard className="h-4 w-4 text-green-500" />,
    },
    {
      id: "account-statement",
      name: "Monthly Statement",
      subject: "Your Monthly Account Statement",
      content:
        "Dear [Customer Name],\n\nYour monthly account statement for [Month] is now available. You can view and download it from our mobile app or online banking portal.\n\nAccount Number: [Account Number]\nStatement Period: [Start Date] - [End Date]\n\nIf you notice any discrepancies, please contact our customer support team immediately.\n\nBest regards,\nSTB Banking Team",
      icon: <FileText className="h-4 w-4 text-purple-500" />,
    },
  ]

  const appNotificationTemplates = [
    {
      id: "new-feature",
      name: "New Feature Announcement",
      title: "New Feature Available",
      content: "We've added a new feature to our mobile app. Check it out now!",
      icon: <Bell className="h-4 w-4 text-green-500" />,
    },
    {
      id: "maintenance",
      name: "Scheduled Maintenance",
      title: "Scheduled Maintenance",
      content:
        "Our online banking services will be unavailable on [Date] from [Start Time] to [End Time] due to scheduled maintenance.",
    },
    {
      id: "promotion",
      name: "Special Promotion",
      title: "Special Offer for You",
      content:
        "Enjoy special rates on personal loans until [End Date]. Apply now through our mobile app or visit your nearest branch.",
      icon: <Tag className="h-4 w-4 text-purple-500" />,
    },
  ]

  const userGroups = [
    { id: "premium", name: "Premium Users", count: 1245 },
    { id: "standard", name: "Standard Users", count: 8765 },
    { id: "new", name: "New Users (Last 30 days)", count: 342 },
    { id: "inactive", name: "Inactive Users", count: 2310 },
  ]

  const handleEmailTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = emailTemplates.find((t) => t.id === templateId)
    if (template) {
      setEmailSubject(template.subject)
      setEmailContent(template.content)
    }
  }

  const handleAppNotificationTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = appNotificationTemplates.find((t) => t.id === templateId)
    if (template) {
      setAppNotificationTitle(template.title)
      setAppNotificationContent(template.content)
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    try {
      let response;
      if (recipientType === "specific") {
        // Send to specific user
        response = await fetch('http://localhost:5000/api/authroutes/send-to-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: selectedUserEmail,
            subject: emailSubject,
            content: emailContent
          }),
        });
      } else {
        // Send to group
        response = await fetch('http://localhost:5000/api/authroutes/send-to-group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            groupId: recipientType,
            subject: emailSubject,
            content: emailContent
          }),
        });
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send notification');
      }

      toast({
        title: "Email Sent",
        description: data.message,
        
      });
    } catch (error : any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        
      });
    } finally {
      setIsSending(false);
    }
  }

  const handleSendAppNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    try {
      let response;
      if (recipientType === "specific") {
        // Send to specific user
        response = await fetch('/api/notifications/send-to-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: selectedUserEmail,
            subject: appNotificationTitle,
            content: appNotificationContent
          }),
        });
      } else {
        // Send to group
        response = await fetch('/api/notifications/send-to-group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            groupId: recipientType,
            subject: appNotificationTitle,
            content: appNotificationContent
          }),
        });
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send notification');
      }

      toast({
        title: "Notification Sent",
        description: data.message,
        
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification",
        
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customer Communications</h1>
          <p className="text-muted-foreground">Engage with your customers through multiple channels</p>
        </div>
        
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-auto">
          <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="app" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
            <div className="flex items-center space-x-2">
              <BellRing className="h-4 w-4" />
              <span>App Notification</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Email Campaign</CardTitle>
                  <CardDescription>Send personalized emails to your customers</CardDescription>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  <Mail className="mr-1 h-3 w-3" />
                  Email
                </Badge>
              </div>
            </CardHeader>
            <form onSubmit={handleSendEmail}>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="email-template" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    Email Template
                  </Label>
                  <Select value={selectedTemplate} onValueChange={handleEmailTemplateChange}>
                    <SelectTrigger id="email-template" className="bg-gray-50">
                      <SelectValue placeholder="Select a template or create a new one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Template
                        </div>
                      </SelectItem>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center">
                            {template.icon}
                            <span className="ml-2">{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email-subject" className="flex items-center">
                    <FileInput className="mr-2 h-4 w-4 text-blue-500" />
                    Subject
                  </Label>
                  <Input
                    id="email-subject"
                    placeholder="Email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email-content" className="flex items-center">
                    <AlignLeft className="mr-2 h-4 w-4 text-blue-500" />
                    Content
                  </Label>
                  <Textarea
                    id="email-content"
                    placeholder="Email content"
                    className="min-h-[200px] bg-gray-50"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    required
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <Label className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-blue-500" />
                    Recipients
                  </Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={setRecipientType}
                    className="grid gap-3 grid-cols-3"
                  >
                    <div>
                      <RadioGroupItem value="all" id="all-users-email" className="peer sr-only" />
                      <Label
                        htmlFor="all-users-email"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Users className="mb-2 h-6 w-6" />
                        All Users
                        <span className="mt-1 text-sm text-muted-foreground">all customers</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="specific" id="specific-user-email" className="peer sr-only" />
                      <Label
                        htmlFor="specific-user-email"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Mail className="mb-2 h-6 w-6" />
                        Specific User
                        <span className="mt-1 text-sm text-muted-foreground">Single recipient</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="selected" id="selected-users-email" className="peer sr-only" />
                      <Label
                        htmlFor="selected-users-email"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Filter className="mb-2 h-6 w-6" />
                        User Group
                        <span className="mt-1 text-sm text-muted-foreground">Custom audience</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {recipientType === "specific" && (
                  <div className="grid gap-3">
                    <Label htmlFor="user-email">User Email</Label>
                    <Input
                      id="user-email"
                      placeholder="Enter user email"
                      type="email"
                      value={selectedUserEmail}
                      onChange={(e) => setSelectedUserEmail(e.target.value)}
                      className="bg-gray-50"
                      required
                    />
                  </div>
                )}

                {recipientType === "selected" && (
                  <div className="grid gap-3">
                    <Label htmlFor="user-selection">Select User Group</Label>
                    <Select>
                      <SelectTrigger id="user-selection" className="bg-gray-50">
                        <SelectValue placeholder="Select user group" />
                      </SelectTrigger>
                      <SelectContent>
                        {userGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{group.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {group.count.toLocaleString()}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <Button variant="outline">Save Draft</Button>
                <div className="space-x-2">
                  <Button variant="outline">Preview</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSending}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSending ? "Sending..." : "Send Now"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="app" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">App Notification</CardTitle>
                  <CardDescription>Send in-app messages to your customers</CardDescription>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  <BellRing className="mr-1 h-3 w-3" />
                  Push Notification
                </Badge>
              </div>
            </CardHeader>
            <form onSubmit={handleSendAppNotification}>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="app-notification-template" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    Notification Template
                  </Label>
                  <Select value={selectedTemplate} onValueChange={handleAppNotificationTemplateChange}>
                    <SelectTrigger id="app-notification-template" className="bg-gray-50">
                      <SelectValue placeholder="Select a template or create a new one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Template
                        </div>
                      </SelectItem>
                      {appNotificationTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center">
                            {template.icon}
                            <span className="ml-2">{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="app-notification-title" className="flex items-center">
                    <FileInput className="mr-2 h-4 w-4 text-blue-500" />
                    Title
                  </Label>
                  <Input
                    id="app-notification-title"
                    placeholder="Notification title"
                    value={appNotificationTitle}
                    onChange={(e) => setAppNotificationTitle(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="app-notification-content" className="flex items-center">
                    <AlignLeft className="mr-2 h-4 w-4 text-blue-500" />
                    Content
                  </Label>
                  <Textarea
                    id="app-notification-content"
                    placeholder="Notification content"
                    className="min-h-[100px] bg-gray-50"
                    value={appNotificationContent}
                    onChange={(e) => setAppNotificationContent(e.target.value)}
                    required
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <Label className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-blue-500" />
                    Recipients
                  </Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={setRecipientType}
                    className="grid gap-3 grid-cols-3"
                  >
                    <div>
                      <RadioGroupItem value="all" id="all-users-app" className="peer sr-only" />
                      <Label
                        htmlFor="all-users-app"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Users className="mb-2 h-6 w-6" />
                        All Users
                        
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="specific" id="specific-user-app" className="peer sr-only" />
                      <Label
                        htmlFor="specific-user-app"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Mail className="mb-2 h-6 w-6" />
                        Specific User
                        <span className="mt-1 text-sm text-muted-foreground">Single recipient</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="selected" id="selected-users-app" className="peer sr-only" />
                      <Label
                        htmlFor="selected-users-app"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Filter className="mb-2 h-6 w-6" />
                        User Group
                        <span className="mt-1 text-sm text-muted-foreground">Custom audience</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {recipientType === "specific" && (
                  <div className="grid gap-3">
                    <Label htmlFor="user-email-app">User Email</Label>
                    <Input
                      id="user-email-app"
                      placeholder="Enter user email"
                      type="email"
                      value={selectedUserEmail}
                      onChange={(e) => setSelectedUserEmail(e.target.value)}
                      className="bg-gray-50"
                      required
                    />
                  </div>
                )}

                {recipientType === "selected" && (
                  <div className="grid gap-3">
                    <Label htmlFor="user-selection-app">Select User Group</Label>
                    <Select>
                      <SelectTrigger id="user-selection-app" className="bg-gray-50">
                        <SelectValue placeholder="Select user group" />
                      </SelectTrigger>
                      <SelectContent>
                        {userGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{group.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {group.count.toLocaleString()}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-3">
                  <Label className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    Delivery Options
                  </Label>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" className="flex-1">
                      Send Immediately
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <Button variant="outline">Save Draft</Button>
                <div className="space-x-2">
                  <Button variant="outline">Preview</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSending}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSending ? "Sending..." : "Send Now"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}