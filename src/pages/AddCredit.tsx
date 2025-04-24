"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Wallet } from "lucide-react"

export default function AddCredit() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Form submitted")
    navigate("/credits")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Add New Credit Type</h1>
        <p className="text-muted-foreground">Create a new credit or loan type for the STB banking system.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Credit Information</CardTitle>
            <CardDescription>Enter the details of the new credit type.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Credit Title</Label>
                <Input id="title" placeholder="e.g. Home Loan" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select required>
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="directions-car">Car</SelectItem>
                    <SelectItem value="person">Person</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="school">Education</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="medical-services">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the credit type"
                className="min-h-[100px]"
                required
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="interest-rate">Interest Rate</Label>
                <Input id="interest-rate" placeholder="e.g. 7.5%" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g. Up to 25 years" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="color">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    defaultValue="#0ea5e9"
                    className="h-10 w-10 cursor-pointer p-1"
                    required
                  />
                  <Input id="color-hex" placeholder="#0ea5e9" className="flex-1" defaultValue="#0ea5e9" required />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="min-amount">Minimum Amount</Label>
                <Input id="min-amount" placeholder="e.g. 10,000 DT" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="max-amount">Maximum Amount</Label>
                <Input id="max-amount" placeholder="e.g. 500,000 DT" required />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="eligibility">Eligibility Requirements</Label>
              <Textarea
                id="eligibility"
                placeholder="Describe who is eligible for this credit type"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="documents">Required Documents</Label>
              <Textarea
                id="documents"
                placeholder="List all documents required for application"
                className="min-h-[100px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate("/credits")}>
              Cancel
            </Button>
            <Button type="submit">
              <Wallet className="mr-2 h-4 w-4" />
              Create Credit Type
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
