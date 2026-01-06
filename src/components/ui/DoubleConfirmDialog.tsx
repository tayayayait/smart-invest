import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DoubleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  nextLabel: string;
  confirmLabel: string;
  cancelLabel: string;
}

export function DoubleConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  step1Title,
  step1Description,
  step2Title,
  step2Description,
  nextLabel,
  confirmLabel,
  cancelLabel,
}: DoubleConfirmDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    onConfirm();
    onOpenChange(false);
    setStep(1);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setStep(1);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{step === 1 ? step1Title : step2Title}</AlertDialogTitle>
          <AlertDialogDescription>
            {step === 1 ? step1Description : step2Description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleNext}>
            {step === 1 ? nextLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
