// CardManagement.tsx
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Badge } from "../components/ui/badge"
import { 
  Search, 
  MoreHorizontal, 
  Filter, 
  PlusCircle 
} from "lucide-react"
import { useToast } from "../hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog"

interface CardType {
  _id: string
  name: string
  description: string
  imageUrl: string
  tag: string
  features: string[]
  fees: {
    annual: number
    withdrawal: number
    replacement: number
  }
  benefits: Array<{ text: string; icon: string }>
  requirements: {
    minIncome: number
    employmentStatus: string[]
  }
}

export default function CardManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cards, setCards] = useState<CardType[]>([])
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cartroutes/getcardtypes")
        const data = await response.json()
        setCards(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch cards",
          type: "error",
        })
      }
    }
    fetchCards()
  }, [])

  const handleDelete = async (cardId: string) => {
    try {
      await fetch(`http://localhost:5000/api/cartroutes/${cardId}`, {
        method: "DELETE",
      })
      setCards(prev => prev.filter(card => card._id !== cardId))
      toast({
        title: "Success",
        description: "Card deleted successfully",
        type: "success",
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete card",
        type: "error",
      })
    }
  }

  const openCardDetails = (card: CardType) => {
    setSelectedCard(card)
    setIsDialogOpen(true)
  }

  const filteredCards = cards.filter(
    card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tag.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Card Management</h1>
        <p className="text-muted-foreground">Manage all card types available in the STB banking system.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cards..."
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
        <Link to="/apply/card">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </Link>

      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="w-full max-h-[90vh] overflow-y-auto">
    {selectedCard && (
      <>
        <DialogHeader>
          <DialogTitle>{selectedCard.name}</DialogTitle>
          <DialogDescription>
            {selectedCard.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pb-4">
          <img 
            src={selectedCard.imageUrl} 
            alt={selectedCard.name}
            className="w-full h-48 object-contain rounded-lg"
          />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <ul className="space-y-1">
                      {selectedCard.features.map((feature, index) => (
                        <li key={index} className="text-sm">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Fees</h3>
                    <div className="space-y-1 text-sm">
                      <p>Annual: {selectedCard.fees.annual} DT</p>
                      <p>Withdrawal: {selectedCard.fees.withdrawal} DT</p>
                      <p>Replacement: {selectedCard.fees.replacement} DT</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <div className="space-y-1 text-sm">
                      <p>Minimum Income: {selectedCard.requirements.minIncome} DT</p>
                      <p>Employment: {selectedCard.requirements.employmentStatus.join(", ")}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Benefits</h3>
                    <div className="space-y-1 text-sm">
                      {selectedCard.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-muted-foreground">{benefit.icon}</span>
                          {benefit.text}
                        </div>
                      ))}
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
                      setIsDialogOpen(false)
                      navigate(`/cards/edit/${selectedCard._id}`)
                    }}
                  >
                    Edit Card
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Cards</CardTitle>
          <CardDescription>A list of all card types available in the STB banking system.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Annual Fee</TableHead>
                <TableHead className="hidden lg:table-cell">Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card._id}>
                  <TableCell>
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="h-12 w-20 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{card.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:block">
                        {card.description.length > 60 
                          ? `${card.description.substring(0, 60)}...` 
                          : card.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{card.tag}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {card.fees.annual} DT
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {card.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {feature}
                        </Badge>
                      ))}
                      {card.features.length > 2 && (
                        <Badge variant="secondary">+{card.features.length - 2} more</Badge>
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
                        <DropdownMenuItem onClick={() => openCardDetails(card)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => navigate(`/cards/edit/${card._id}`)}
                        >
                          Edit card
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(card._id)}
                        >
                          Delete card
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
  )
}