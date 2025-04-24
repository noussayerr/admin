// src/hooks/use-toast.ts
import { useState, useEffect, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
  duration?: number
}

type Toast = ToastProps & {
  id: string
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, type = "default", duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, type, duration }
    
    setToasts((prevToasts) => [...prevToasts, newToast])
    
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1))
      }, toasts[0].duration)
      
      return () => clearTimeout(timer)
    }
  }, [toasts])

  return { toast, dismiss, toasts }
}