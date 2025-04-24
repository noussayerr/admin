"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { PlusCircle, Trash2, Landmark } from "lucide-react"

export default function AddAccount() {
  const navigate = useNavigate()
  const [features, setFeatures] = useState<string[]>([""])

  const addFeature = () => {
    setFeatures([...features, ""])
  }

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...features]
    updatedFeatures[index] = value
    setFeatures(updatedFeatures)
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...features]
    updatedFeatures.splice(index, 1)
    setFeatures(updatedFeatures)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Form submitted")
    navigate("/accounts")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Add New Account Type</h1>
        <p className="text-muted-foreground">Create a new account type for the STB banking system.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Enter the details of the new account type.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" placeholder="e.g. Premium Savings Account" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select required>
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account-balance">Account Balance</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="school">Student</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="diamond">Premium</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the account type"
                className="min-h-[100px]"
                required
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="min-deposit">Minimum Deposit</Label>
                <Input id="min-deposit" placeholder="e.g. 50 DT" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="monthly-fee">Monthly Fee</Label>
                <Input id="monthly-fee" placeholder="e.g. 5 DT or Free" required />
              </div>
            </div>

            <Separator />

            <div>
              <div className="mb-4 flex items-center justify-between">
                <Label>Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>

              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      required
                    />
                    {features.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove feature</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="eligibility">Eligibility Requirements</Label>
              <Textarea
                id="eligibility"
                placeholder="Describe who is eligible for this account type"
                className="min-h-[100px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate("/accounts")}>
              Cancel
            </Button>
            <Button type="submit">
              <Landmark className="mr-2 h-4 w-4" />
              Create Account Type
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
