"use client";

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
} from "@/components/ui/alert-dialog";
import { ReactNode, useState } from "react";

interface ConfirmDialogProps {
  /** Button or custom trigger UI */
  trigger?: ReactNode;
  /** Title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Called when user confirms */
  onConfirm: () => void;
  /** Optional confirm button label */
  confirmLabel?: string;
  /** Optional cancel button label */
  cancelLabel?: string;
  /** Optional destructive color style */
  destructive?: boolean;
}

export default function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    //FIXME - dialog is not opening may be due to setopen is never true
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent className="rounded-2xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-base text-muted-foreground">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="text-base px-6">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`text-base px-6 ${
              destructive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
