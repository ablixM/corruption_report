"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ComplaintDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  uploadProgress: number;
  ticketNumber: string | null;
  onClose?: () => void;
}

export function ComplaintDialog({
  showDialog,
  setShowDialog,
  uploadProgress,
  ticketNumber,
  onClose,
}: ComplaintDialogProps) {
  const t = useTranslations();

  return (
    <Dialog
      open={showDialog}
      onOpenChange={(open) => {
        if (!open) return;
        setShowDialog(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ticketNumber
              ? t("complaintForm.dialog.success")
              : t("complaintForm.dialog.uploading")}
          </DialogTitle>
        </DialogHeader>
        {!ticketNumber ? (
          <div className="py-6">
            <Progress value={uploadProgress} className="w-full" />
          </div>
        ) : (
          <div className="py-4">
            <div className="mt-2 text-center">
              <div className="mb-2">
                {t("complaintForm.dialog.ticketNumber")}
              </div>
              <div className="font-mono text-sm bg-muted rounded p-2 select-all inline-block">
                {ticketNumber}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="m-2"
                onClick={() => {
                  navigator.clipboard.writeText(ticketNumber);
                  toast.success(t("reportForm.dialog.copied"));
                }}
              >
                {t("complaintForm.dialog.copy")}
              </Button>
            </div>
          </div>
        )}
        <DialogFooter>
          {ticketNumber && (
            <Button
              onClick={() => {
                setShowDialog(false);
                onClose?.();
              }}
            >
              {t("complaintForm.dialog.close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
