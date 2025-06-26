"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { CloudUpload, Loader } from "lucide-react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslations, useLocale } from "next-intl";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitReport, ReportFormValues } from "@/hooks/use-submit-report";
import { createReportSchemaWithMessages } from "@/lib/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useGetAllTags } from "@/hooks/use-get-corruption-type";
import { ReportDialog } from "./report-dialog";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) {
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
          <CalendarIcon className="mr-2 h-4 w-4" />
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
  const locale = useLocale();
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [filePreviews, setFilePreviews] = React.useState<(string | null)[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [reportDate, setReportDate] = React.useState<Date | undefined>();
  const [showDialog, setShowDialog] = React.useState(false);
  const [ticketNumber, setTicketNumber] = React.useState<string | null>(null);
  const mutation = useSubmitReport();
  const {
    data: corruptionTypes,
    isLoading: isCorruptionTypesLoading,
    error: corruptionTypesError,
  } = useGetAllTags(locale);

  const errorMessages = React.useMemo(
    () => ({
      required: t("reportForm.error.required"),
      invalid: t("reportForm.error.invalid"),
      phone: t("reportForm.error.phone", {
        default: t("reportForm.error.required"),
      }),
      place: t("reportForm.error.place", {
        default: t("reportForm.error.required"),
      }),
      complaintType: t("reportForm.error.complaintType", {
        default: t("reportForm.error.required"),
      }),
      office: t("reportForm.error.officeName", {
        default: t("reportForm.error.required"),
      }),
    }),
    [t]
  );
  const schema = React.useMemo(
    () => createReportSchemaWithMessages(errorMessages),
    [errorMessages]
  );

  const [complaintPlace, setComplaintPlace] = React.useState<
    "subcity" | "woreda"
  >("woreda");

  const subcityOptions = React.useMemo(
    () => [
      { value: "01", label: locale === "am" ? "አዲስ ከተማ" : "Addis Ketema" },
      { value: "02", label: locale === "am" ? "አቃቂ ቃሊቲ" : "Akaki Kality" },
      { value: "03", label: locale === "am" ? "አራዳ" : "Arada" },
      { value: "04", label: locale === "am" ? "ቦሌ" : "Bole" },
      { value: "05", label: locale === "am" ? "ጉለሌ" : "Gullele" },
      { value: "06", label: locale === "am" ? "ኮልፌ ቀራኒዮ" : "Kolfe Keranio" },
      { value: "07", label: locale === "am" ? "ልደታ" : "Lideta" },
      {
        value: "08",
        label: locale === "am" ? "ንፋስ ስልክ ላፍቶ" : "Nifas Silk Lafto",
      },
      { value: "09", label: locale === "am" ? "ይካ" : "Yeka" },
      { value: "10", label: locale === "am" ? "ለሚ ኩራ" : "Lemi Kura" },
    ],
    [locale]
  );

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      date: "",
      place: "",
      office: "",
      corruptionTypeId: "",
      description: "",
    },
    mode: "onTouched",
  });

  const woredaOptions = React.useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => {
      const num = String(i + 1).padStart(2, "0");
      return {
        value: num,
        label: locale === "am" ? `ወረዳ ${num}` : `Woreda ${num}`,
      };
    });
  }, [locale]);

  // File previews effect
  React.useEffect(() => {
    const urls = selectedFiles.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null
    );
    setFilePreviews(urls);
    return () => {
      urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [selectedFiles]);

  const onSubmit: SubmitHandler<ReportFormValues> = (values) => {
    setShowDialog(true);
    setUploadProgress(0);
    setTicketNumber(null);
    mutation.mutate(
      {
        payload: {
          ...values,
          evidences: selectedFiles,
        },
        onUploadProgress: (progress) => setUploadProgress(progress),
      },
      {
        onSuccess: (data) => {
          setTicketNumber(data.ticketNumber);
          setUploadProgress(100);
        },
        onError: () => {
          setShowDialog(false);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <h2 className="text-lg font-bold">
            {t("reportForm.section.yourInfo")}
          </h2>
          <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
            <FormField<ReportFormValues>
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="name">
                    {t("reportForm.label.name")}{" "}
                    <span className="text-muted-foreground">
                      {t("reportForm.label.optional")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<ReportFormValues>
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="phone">
                    {t("reportForm.label.phone")}{" "}
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      id="phone"
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
            <FormField<ReportFormValues>
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="email">
                    {t("reportForm.label.email")}{" "}
                    <span className="text-muted-foreground">
                      {t("reportForm.label.optional")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<ReportFormValues>
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="address">
                    {t("reportForm.label.address")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="address"
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4" />
          <h2 className="text-lg font-bold">
            {t("reportForm.section.corruptionReport")}
          </h2>

          <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
            <Controller<ReportFormValues>
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="date">
                    {t("reportForm.label.dateOptional")}
                  </FormLabel>
                  <DatePicker
                    date={reportDate}
                    setDate={(date) => {
                      setReportDate(date);
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 w-full">
              <FormLabel htmlFor="complaintPlace">
                {t("reportForm.label.complaintPlace")}{" "}
                <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                value={complaintPlace}
                onValueChange={(value: "subcity" | "woreda") =>
                  setComplaintPlace(value)
                }
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue
                    placeholder={t("reportForm.label.selectPlaceType")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subcity">
                    {t("reportForm.label.subcity")}
                  </SelectItem>
                  <SelectItem value="woreda">
                    {t("reportForm.label.woreda")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormField<ReportFormValues>
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormLabel htmlFor="place">
                      {complaintPlace === "subcity"
                        ? t("reportForm.label.subcity")
                        : t("reportForm.label.woreda")}{" "}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : undefined
                        }
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue
                            placeholder={
                              complaintPlace === "subcity"
                                ? t("reportForm.label.subcity")
                                : t("reportForm.label.woreda")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="min-w-[200px] w-auto">
                          {(complaintPlace === "subcity"
                            ? subcityOptions
                            : woredaOptions
                          ).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
            <FormField<ReportFormValues>
              control={form.control}
              name="office"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="office">
                    {t("reportForm.label.officeName")}
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="office"
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<ReportFormValues>
              control={form.control}
              name="corruptionTypeId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="corruptionTypeId">
                    {t("reportForm.label.corruptionType")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : undefined
                      }
                      onValueChange={field.onChange}
                      disabled={
                        isCorruptionTypesLoading || !!corruptionTypesError
                      }
                    >
                      <SelectTrigger className="w-full text-sm ">
                        <SelectValue
                          placeholder={t(
                            "reportForm.placeholder.corruptionType"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent className="min-w-xs w-auto">
                        {isCorruptionTypesLoading && (
                          <SelectItem value="__loading__" disabled>
                            {t("reportForm.loading")}
                          </SelectItem>
                        )}
                        {corruptionTypesError && (
                          <SelectItem value="__error__" disabled>
                            {t("reportForm.error-corruption-types")}
                          </SelectItem>
                        )}
                        {corruptionTypes &&
                          corruptionTypes.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={String(type.id)}
                              className="max-w-sm border-b py-4"
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField<ReportFormValues>
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel htmlFor="description">
                  {t("reportForm.label.description")}{" "}
                  <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <FormLabel htmlFor="evidence">
              {t("reportForm.label.evidence")}
            </FormLabel>
            <input
              id="evidence"
              name="evidence"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setSelectedFiles((prev) => [...prev, ...files]);
              }}
            />
            <div
              className={
                `relative flex flex-col items-center justify-center border-2 border-dashed  rounded-md p-6 transition-colors cursor-pointer ` +
                (isDragActive
                  ? "border-primary bg-primary/50"
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
                const files = Array.from(e.dataTransfer.files || []);
                setSelectedFiles((prev) => [...prev, ...files]);
              }}
              onClick={() => document.getElementById("evidence")?.click()}
            >
              <span className="text-sm flex flex-col items-ceneter gap-2 justify-center text-muted-foreground mb-2">
                {selectedFiles.length > 0
                  ? t("reportForm.file.change")
                  : t("reportForm.file.drag")}
                <div className="flex items-center justify-center">
                  <CloudUpload width={64} height={64} />
                </div>
              </span>
              {selectedFiles.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 w-full">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={file.name + idx}
                      className="flex items-center gap-4 w-full"
                    >
                      {filePreviews[idx] ? (
                        <Image
                          src={filePreviews[idx] as string}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded border"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <span className="inline-block h-16 w-16 flex items-center justify-center bg-muted rounded border">
                          {file.type.includes("pdf") ? (
                            <span className="text-xs">
                              {t("reportForm.file.pdf")}
                            </span>
                          ) : file.type.includes("doc") ? (
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
                      <span className="text-xs text-muted-foreground mb-2 flex-1">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                        aria-label={t("reportForm.file.remove")}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending && (
              <Loader className="mr-2 h-4 w-4 transition-all  animate-spin" />
            )}
            {t("reportForm.button.submit")}
          </Button>
        </form>
      </Form>
      <ReportDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        uploadProgress={uploadProgress}
        ticketNumber={ticketNumber}
        onClose={() => {
          setTicketNumber(null);
          setUploadProgress(0);
          form.reset();
        }}
      />
    </div>
  );
}

export default ReportForm;
