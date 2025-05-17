"use client";
import React, { useActionState } from "react";
import { createReport } from "@/lib/actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { State } from "@/lib/types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Loader } from "lucide-react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function DatePicker() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function ReportForm() {
  const t = useTranslations();
  const initialState: State = {
    message: "",
    errors: {
      phone: [],
      place: [],
      officeName: [],
      corruptionType: [],
      evidence: [],
      description: [],
    },
  };
  const [state, formAction, isPending] = useActionState(
    createReport,
    initialState
  );

  // Add state for file upload
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [filePreview, setFilePreview] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [isDragActive, setIsDragActive] = React.useState(false);

  // File preview effect
  React.useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null);
      return;
    }
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreview(null);
    }
  }, [selectedFile]);

  // Simulate upload progress (replace with real upload logic as needed)
  React.useEffect(() => {
    if (!isUploading) return;
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isUploading]);

  // Use translated corruption type options
  const CORRUPTION_TYPE_OPTIONS = [
    { key: "bribery" },
    { key: "embezzlement" },
    { key: "fraud" },
    { key: "abuseOfPower" },
    { key: "nepotism" },
    { key: "extortion" },
    { key: "other" },
  ];

  // Toast on message or error
  React.useEffect(() => {
    if (state.message) {
      toast(state.message, { position: "top-center" });
    }
    // Optionally, handle field errors with a toast as well
  }, [state.message, state.errors, t]);

  return (
    <div className="w-full">
      <form
        action={formAction}
        className="space-y-4 w-full"
        encType="multipart/form-data"
      >
        <h2 className="text-lg font-bold">
          {t("reportForm.section.yourInfo")}
        </h2>
        <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="phone">
              {t("reportForm.label.name")}{" "}
              <span className="text-muted-foreground">
                {t("reportForm.label.optional")}
              </span>
            </Label>
            <Input id="name" name="name" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="phone">
              {t("reportForm.label.phone")}{" "}
              <span className="text-red-600">*</span>
            </Label>
            <Input type="tel" id="phone" name="phone" />
            {state.errors?.phone && (
              <p className="text-sm text-red-600">{state.errors.phone}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="email">
              {t("reportForm.label.email")}{" "}
              <span className="text-muted-foreground">
                {t("reportForm.label.optional")}
              </span>
            </Label>
            <Input id="email" name="email" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="address">{t("reportForm.label.address")}</Label>
            <Input id="address" name="address" />
          </div>
        </div>

        <Separator className="my-4" />
        <h2 className="text-lg font-bold">
          {t("reportForm.section.corruptionReport")}
        </h2>

        <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="date">{t("reportForm.label.dateOptional")}</Label>
            <DatePicker />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="place">
              {t("reportForm.label.place")}{" "}
              <span className="text-red-600">*</span>
            </Label>
            <Input id="place" name="place" />
            {state.errors?.place && (
              <p className="text-sm text-red-600">{state.errors.place}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="officeName">
              {t("reportForm.label.officeName")}
              <span className="text-red-600">*</span>
            </Label>
            <Input id="officeName" name="officeName" />
            {state.errors?.officeName && (
              <p className="text-sm text-red-600">{state.errors.officeName}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="corruptionType">
              {t("reportForm.label.corruptionType")}
            </Label>
            <Select name="corruptionType">
              <SelectTrigger className="w-full text-sm">
                <SelectValue
                  placeholder={t("reportForm.placeholder.corruptionType")}
                />
              </SelectTrigger>
              <SelectContent>
                {CORRUPTION_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type.key} value={type.key}>
                    {t(`reportForm.corruptionTypes.${type.key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">
            {t("reportForm.label.description")}{" "}
            <span className="text-red-600">*</span>
          </Label>
          <Textarea id="description" name="description" />
          {state.errors?.description && (
            <p className="text-sm text-red-600">{state.errors.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="evidence">{t("reportForm.label.evidence")}</Label>
          <input
            id="evidence"
            name="evidence"
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedFile(file);
              setIsUploading(!!file);
            }}
          />
          <div
            className={
              `relative flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer ` +
              (isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted bg-muted/50 hover:bg-muted/80")
            }
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragActive(false);
              const file = e.dataTransfer.files?.[0] || null;
              setSelectedFile(file);
              setIsUploading(!!file);
            }}
            onClick={() => document.getElementById("evidence")?.click()}
          >
            <span className="text-sm text-muted-foreground mb-2">
              {selectedFile
                ? t("reportForm.file.change")
                : t("reportForm.file.drag")}
            </span>
            {selectedFile && (
              <span className="text-xs text-muted-foreground mb-2">
                {selectedFile.name}
              </span>
            )}
            {selectedFile && (
              <div className="mt-2 flex items-center gap-4 w-full">
                {filePreview ? (
                  <Image
                    src={filePreview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded border"
                    width={64}
                    height={64}
                  />
                ) : (
                  <span className="inline-block h-16 w-16 flex items-center justify-center bg-muted rounded border">
                    {selectedFile.type.includes("pdf") ? (
                      <span className="text-xs">
                        {t("reportForm.file.pdf")}
                      </span>
                    ) : selectedFile.type.includes("doc") ? (
                      <span className="text-xs">
                        {t("reportForm.file.doc")}
                      </span>
                    ) : (
                      <span className="text-xs">
                        {t("reportForm.file.file")}
                      </span>
                    )}
                  </span>
                )}
                <div className="flex-1">
                  <Progress value={uploadProgress} />
                  {isUploading && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {t("reportForm.file.uploading", {
                        progress: uploadProgress,
                      })}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        <h2 className="text-lg font-bold">
          {t("reportForm.section.suspectInfo")}
        </h2>

        <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="suspectName">
              {t("reportForm.label.suspectName")}
            </Label>
            <Input id="suspectName" name="suspectName" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="suspectPosition">
              {t("reportForm.label.suspectPosition")}
            </Label>
            <Input id="suspectPosition" name="suspectPosition" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="suspectPhone">
            {t("reportForm.label.suspectPhone")}
          </Label>
          <Input type="tel" id="suspectPhone" name="suspectPhone" />
        </div>

        <Button type="submit" disabled={isPending} className="w-[200px]">
          {isPending && (
            <Loader className="mr-2 h-4 w-4 transition-all  animate-spin" />
          )}
          {t("reportForm.button.submit")}
        </Button>
      </form>
    </div>
  );
}

export default ReportForm;
