import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react"

interface ConfirmDeleteDialogProps {
  onConfirm: () => void | Promise<void>
  title?: string
  description?: string
  children: ReactNode
}

export function ConfirmDeleteDialog({
  onConfirm,
  title = "Deseja excluir este item?",
  description = "Essa ação não poderá ser desfeita.",
  children,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    await onConfirm()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Apagar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
