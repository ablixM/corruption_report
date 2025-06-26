"use client";

import React from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";

interface ReportDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  uploadProgress: number;
  ticketNumber: string | null;
  onClose?: () => void;
}

export function ReportDialog({
  showDialog,
  setShowDialog,
  uploadProgress,
  ticketNumber,
  onClose,
}: ReportDialogProps) {
  const t = useTranslations();

  return (
    <Dialog
      open={showDialog}
      onOpenChange={(open) => {
        // Only allow closing through explicit button clicks
        if (!open) return;
        setShowDialog(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ticketNumber
              ? t("reportForm.dialog.successTitle")
              : t("reportForm.dialog.uploadingTitle")}
          </DialogTitle>
          <DialogDescription>
            {ticketNumber ? t("reportForm.dialog.successDescription") : null}

            {ticketNumber ? (
              <Link
                href={`/report/${ticketNumber}`}
                className="underline font-bold p-2"
              >
                {t("reportForm.dialog.checkStatus")}
              </Link>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {ticketNumber ? null : <Progress value={uploadProgress} />}
          <div className="mt-2 text-center">
            {ticketNumber ? (
              <>
                <div className="mb-2">
                  {t("reportForm.dialog.ticketNumberLabel")}
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
                  {t("reportForm.dialog.copy")}
                </Button>
              </>
            ) : (
              <div>
                {t("reportForm.dialog.uploading")}
                {uploadProgress > 0 ? ` (${uploadProgress}%)` : null}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          {ticketNumber && (
            <Button
              onClick={() => {
                setShowDialog(false);
                onClose?.();
              }}
            >
              {t("reportForm.dialog.close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
