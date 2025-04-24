"use client"

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
import { Mail, MessageSquare, Send } from "lucide-react"
import { useToast } from "../hooks/use-toast"

export default function Notifications() {
  const { toast } = useToast()
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [smsContent, setSmsContent] = useState("")
  const [appNotificationTitle, setAppNotificationTitle] = useState("")
  const [appNotificationContent, setAppNotificationContent] = useState("")
  const [recipientType, setRecipientType] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const emailTemplates = [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to STB Banking",
      content:
        "Dear [Customer Name],\n\nWelcome to STB Banking! We're thrilled to have you as our customer. Your account has been successfully created and is now ready to use.\n\nYour account number: [Account Number]\n\nIf you have any questions or need assistance, please don't hesitate to contact our customer support team.\n\nBest regards,\nSTB Banking Team",
    },
    {
      id: "card-approved",
      name: "Card Approval",
      subject: "Your STB Card Application is Approved",
      content:
        "Dear [Customer Name],\n\nWe're pleased to inform you that your application for [Card Type] has been approved. Your new card will be delivered to your registered address within 5-7 business days.\n\nFor security reasons, you'll need to activate your card before using it. You can do this through our mobile app or by visiting your nearest STB branch.\n\nBest regards,\nSTB Banking Team",
    },
    {
      id: "account-statement",
      name: "Monthly Statement",
      subject: "Your Monthly Account Statement",
      content:
        "Dear [Customer Name],\n\nYour monthly account statement for [Month] is now available. You can view and download it from our mobile app or online banking portal.\n\nAccount Number: [Account Number]\nStatement Period: [Start Date] - [End Date]\n\nIf you notice any discrepancies, please contact our customer support team immediately.\n\nBest regards,\nSTB Banking Team",
    },
  ]

  const smsTemplates = [
    {
      id: "otp",
      name: "OTP Verification",
      content: "Your STB verification code is: [OTP]. Valid for 5 minutes. Do not share this code with anyone.",
    },
    {
      id: "transaction-alert",
      name: "Transaction Alert",
      content:
        "STB Alert: A transaction of [Amount] has been made on your account ending with [Last 4 Digits] on [Date].",
    },
    {
      id: "card-delivery",
      name: "Card Delivery",
      content:
        "Your STB [Card Type] has been dispatched and will be delivered to your registered address within 5-7 business days.",
    },
  ]

  const appNotificationTemplates = [
    {
      id: "new-feature",
      name: "New Feature Announcement",
      title: "New Feature Available",
      content: "We've added a new feature to our mobile app. Check it out now!",
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
    },
  ]

  const handleEmailTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = emailTemplates.find((t) => t.id === templateId)
    if (template) {
      setEmailSubject(template.subject)
      setEmailContent(template.content)
    }
  }

  const handleSmsTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = smsTemplates.find((t) => t.id === templateId)
    if (template) {
      setSmsContent(template.content)
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

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the email via your backend
    toast({
      title: "Email Sent",
      description: `Email sent to ${recipientType === "all" ? "all users" : "selected users"}.`,
    })
  }

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the SMS via your backend
    toast({
      title: "SMS Sent",
      description: `SMS sent to ${recipientType === "all" ? "all users" : "selected users"}.`,
    })
  }

  const handleSendAppNotification = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the app notification via your backend
    toast({
      title: "Notification Sent",
      description: `App notification sent to ${recipientType === "all" ? "all users" : "selected users"}.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Send notifications to users via email, SMS, or in-app messages.</p>
      </div>

      <Tabs defaultValue="email">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="app">App Notification</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Email</CardTitle>
              <CardDescription>Compose and send emails to your users.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSendEmail}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-template">Email Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleEmailTemplateChange}>
                    <SelectTrigger id="email-template">
                      <SelectValue placeholder="Select a template or create a new one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Create New</SelectItem>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email-content">Content</Label>
                  <Textarea
                    id="email-content"
                    placeholder="Email content"
                    className="min-h-[200px]"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={setRecipientType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-users-email" />
                      <Label htmlFor="all-users-email">All Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="selected" id="selected-users-email" />
                      <Label htmlFor="selected-users-email">Selected Users</Label>
                    </div>
                  </RadioGroup>
                </div>

                {recipientType === "selected" && (
                  <div className="grid gap-2">
                    <Label htmlFor="user-selection">Select Users</Label>
                    <Select>
                      <SelectTrigger id="user-selection">
                        <SelectValue placeholder="Select users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium Users</SelectItem>
                        <SelectItem value="standard">Standard Users</SelectItem>
                        <SelectItem value="new">New Users (Last 30 days)</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button type="submit">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Send SMS</CardTitle>
              <CardDescription>Compose and send SMS messages to your users.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSendSms}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="sms-template">SMS Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleSmsTemplateChange}>
                    <SelectTrigger id="sms-template">
                      <SelectValue placeholder="Select a template or create a new one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Create New</SelectItem>
                      {smsTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sms-content">Content</Label>
                  <Textarea
                    id="sms-content"
                    placeholder="SMS content (160 characters max for standard SMS)"
                    className="min-h-[100px]"
                    value={smsContent}
                    onChange={(e) => setSmsContent(e.target.value)}
                    required
                  />
                  <div className="text-xs text-muted-foreground text-right">{smsContent.length}/160 characters</div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={setRecipientType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-users-sms" />
                      <Label htmlFor="all-users-sms">All Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="selected" id="selected-users-sms" />
                      <Label htmlFor="selected-users-sms">Selected Users</Label>
                    </div>
                  </RadioGroup>
                </div>

                {recipientType === "selected" && (
                  <div className="grid gap-2">
                    <Label htmlFor="user-selection-sms">Select Users</Label>
                    <Select>
                      <SelectTrigger id="user-selection-sms">
                        <SelectValue placeholder="Select users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium Users</SelectItem>
                        <SelectItem value="standard">Standard Users</SelectItem>
                        <SelectItem value="new">New Users (Last 30 days)</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button type="submit">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send SMS
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="app" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Send App Notification</CardTitle>
              <CardDescription>Compose and send in-app notifications to your users.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSendAppNotification}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="app-notification-template">Notification Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleAppNotificationTemplateChange}>
                    <SelectTrigger id="app-notification-template">
                      <SelectValue placeholder="Select a template or create a new one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Create New</SelectItem>
                      {appNotificationTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="app-notification-title">Title</Label>
                  <Input
                    id="app-notification-title"
                    placeholder="Notification title"
                    value={appNotificationTitle}
                    onChange={(e) => setAppNotificationTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="app-notification-content">Content</Label>
                  <Textarea
                    id="app-notification-content"
                    placeholder="Notification content"
                    className="min-h-[100px]"
                    value={appNotificationContent}
                    onChange={(e) => setAppNotificationContent(e.target.value)}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={setRecipientType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-users-app" />
                      <Label htmlFor="all-users-app">All Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="selected" id="selected-users-app" />
                      <Label htmlFor="selected-users-app">Selected Users</Label>
                    </div>
                  </RadioGroup>
                </div>

                {recipientType === "selected" && (
                  <div className="grid gap-2">
                    <Label htmlFor="user-selection-app">Select Users</Label>
                    <Select>
                      <SelectTrigger id="user-selection-app">
                        <SelectValue placeholder="Select users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium Users</SelectItem>
                        <SelectItem value="standard">Standard Users</SelectItem>
                        <SelectItem value="new">New Users (Last 30 days)</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
