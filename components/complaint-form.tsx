"use client";

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTranslations, useLocale } from "next-intl";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitComplaint, ComplaintFormValues } from "@/hooks/use-submit-complaint";
import { createComplaintSchemaWithMessages } from "@/lib/complaint-schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ComplaintDialog } from "./complaint-dialog";

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
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

export function ComplaintForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [reportDate, setReportDate] = React.useState<Date | undefined>();
  const [showDialog, setShowDialog] = React.useState(false);
  const [ticketNumber, setTicketNumber] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const mutation = useSubmitComplaint();

  const errorMessages = React.useMemo(
    () => ({
      required: t("complaintForm.error.required"),
      invalid: t("complaintForm.error.invalid"),
      phone: t("complaintForm.error.phone", {
        default: t("complaintForm.error.required"),
      }),
      place: t("complaintForm.error.place", {
        default: t("complaintForm.error.required"),
      }),
      office: t("complaintForm.error.officeName", {
        default: t("complaintForm.error.required"),
      }),
    }),
    [t]
  );

  const schema = React.useMemo(
    () => createComplaintSchemaWithMessages(errorMessages),
    [errorMessages]
  );

  const [complaintPlace, setComplaintPlace] = React.useState<"subcity" | "woreda">("woreda");

  const subcityOptions = React.useMemo(
    () => [
      { value: "01", label: locale === "am" ? "አዲስ ከተማ" : "Addis Ketema" },
      { value: "02", label: locale === "am" ? "አቃቂ ቃሊቲ" : "Akaki Kality" },
      { value: "03", label: locale === "am" ? "አራዳ" : "Arada" },
      { value: "04", label: locale === "am" ? "ቦሌ" : "Bole" },
      { value: "05", label: locale === "am" ? "ጉለሌ" : "Gullele" },
      { value: "06", label: locale === "am" ? "ኮልፌ ቀራኒዮ" : "Kolfe Keranio" },
      { value: "07", label: locale === "am" ? "ልደታ" : "Lideta" },
      { value: "08", label: locale === "am" ? "ንፋስ ስልክ ላፍቶ" : "Nifas Silk Lafto" },
      { value: "09", label: locale === "am" ? "ይካ" : "Yeka" },
      { value: "10", label: locale === "am" ? "ለሚ ኩራ" : "Lemi Kura" },
    ],
    [locale]
  );

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      date: "",
      place: "",
      office: "",
      description: "",
    },
    mode: "onTouched",
  });

  const woredaOptions = React.useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => {
        const num = String(i + 1).padStart(2, "0");
        return {
          value: num,
          label: locale === "am" ? `ወረዳ ${num}` : `Woreda ${num}`,
        };
      }),
    [locale]
  );

  const onSubmit: SubmitHandler<ComplaintFormValues> = (values) => {
    setShowDialog(true);
    setUploadProgress(0);
    setTicketNumber(null);
    mutation.mutate(
      {
        payload: values,
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
    <div className="w-full max-w-screen-sm mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <h2 className="text-lg font-bold">{t("complaintForm.section.yourInfo")}</h2>
          <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
            <FormField<ComplaintFormValues>
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="name">
                    {t("complaintForm.label.name")}{" "}
                    <span className="text-muted-foreground">
                      {t("complaintForm.label.optional")}
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
            <FormField<ComplaintFormValues>
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="phone">
                    {t("complaintForm.label.phone")}{" "}
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
            <FormField<ComplaintFormValues>
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="email">
                    {t("complaintForm.label.email")}{" "}
                    <span className="text-muted-foreground">
                      {t("complaintForm.label.optional")}
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
            <FormField<ComplaintFormValues>
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="address">
                    {t("complaintForm.label.address")}
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
          <h2 className="text-lg font-bold">{t("complaintForm.section.complaintDetails")}</h2>

          <div className="flex flex-col gap-2 md:flex-row w-full md:gap-4">
            <Controller<ComplaintFormValues>
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="date">
                    {t("complaintForm.label.dateOptional")}
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
                {t("complaintForm.label.complaintPlace")}{" "}
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
                    placeholder={t("complaintForm.label.selectPlaceType")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subcity">
                    {t("complaintForm.label.subcity")}
                  </SelectItem>
                  <SelectItem value="woreda">
                    {t("complaintForm.label.woreda")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormField<ComplaintFormValues>
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormLabel htmlFor="place">
                      {complaintPlace === "subcity"
                        ? t("complaintForm.label.subcity")
                        : t("complaintForm.label.woreda")}{" "}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={
                          typeof field.value === "string" ? field.value : undefined
                        }
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue
                            placeholder={
                              complaintPlace === "subcity"
                                ? t("complaintForm.label.subcity")
                                : t("complaintForm.label.woreda")
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

          <div className="flex flex-col gap-2 w-full">
            <FormField<ComplaintFormValues>
              control={form.control}
              name="office"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel htmlFor="office">
                    {t("complaintForm.label.officeName")}
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
          </div>

          <FormField<ComplaintFormValues>
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel htmlFor="description">
                  {t("complaintForm.label.description")}{" "}
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

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("complaintForm.submit")}
            </Button>
          </div>
        </form>
      </Form>

      <ComplaintDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        uploadProgress={uploadProgress}
        ticketNumber={ticketNumber}
        onClose={() => {
          setShowDialog(false);
          form.reset();
          setReportDate(undefined);
        }}
      />
    </div>
  );
}