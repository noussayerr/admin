"use client"

import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"
import { CreditCard, Users, LayoutDashboard, BellRing, ClipboardCheck, Wallet, Landmark, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { ScrollArea } from "../components/ui/scroll-area"
import { Sheet, SheetContent } from "../components/ui/sheet"
import stblogo from "../assets/STBlogo.png"
import { text } from "stream/consumers"
interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function Sidebar({ open, onOpenChange }: SidebarProps) {
  const location = useLocation()

  const routes = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      href: "/users",
      icon: Users,
    },
    {
      title: "Card Management",
      href: "/cards",
      icon: CreditCard,
    },
    {
      title: "Account Management",
      href: "/accounts",
      icon: Landmark,
    },
    {
      title: "Credit Management",
      href: "/credits",
      icon: Wallet,
    },
    {
      title: "Request Management",
      href: "/requests",
      icon: ClipboardCheck,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: BellRing,
    },
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const SidebarContent = (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold" onClick={() => onOpenChange(false)}>
          <img src={stblogo} alt="STB Logo" className="h-10 w-10" />
          <span className="text-xl">STB Admin</span>
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => onOpenChange(false)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="grid gap-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                isActive(route.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <route.icon className={cn("h-5 w-5  ",isActive(route.href) ? 'text-blue-600':"text-black" ) }/>
              <p className={cn("text-lg",isActive(route.href) ? 'text-blue-600':"text-black" ) }>{route.title}</p>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3 text-muted-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Admin Portal</div>
            <div className="text-xs">v1.0.0</div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden w-64 border-r bg-background lg:block">{SidebarContent}</aside>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          {SidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}
