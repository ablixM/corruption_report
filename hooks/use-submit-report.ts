import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { APIClient } from "@/services/api-client";
import { createReportSchemaWithMessages } from "@/lib/schema";
import { State } from "@/lib/types";
import { z } from "zod";
import { useTranslations } from "next-intl";

const apiClient = new APIClient("/reports");

const errorMessages = {
  required: "This field is required.",
  invalid: "Invalid value.",
  phone: "Phone number is required.",
  place: "Place is required.",
  office_name: "Office name is required.",
  description: "Description must be at least 10 characters.",
};
const schema = createReportSchemaWithMessages(errorMessages);

export type ReportFormValues = z.infer<
  ReturnType<typeof createReportSchemaWithMessages>
> & {
  evidences?: File[];
};

export function useSubmitReport() {
  const t = useTranslations();

  function getErrorMessage(error: unknown): string {
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
      if (
        "response" in error &&
        error.response &&
        typeof error.response === "object"
      ) {
        const response = error.response as { data?: any };
        if (response.data) {
          if (typeof response.data === "string") return response.data;
          if (typeof response.data.message === "string")
            return response.data.message;
          if (typeof response.data.error === "string")
            return response.data.error;
        }
      }
      if ("message" in error && typeof error.message === "string") {
        return error.message;
      }
    }
    return "An unknown error occurred.";
  }

  return useMutation<
    { ticketNumber: string },
    unknown,
    {
      payload: ReportFormValues;
      onUploadProgress?: (progress: number) => void;
    },
    unknown
  >({
    mutationFn: async ({ payload, onUploadProgress }) => {
      // Validate with Zod
      const parseResult = schema.safeParse(payload);
      if (!parseResult.success) {
        const errors: Record<string, string[]> = {};
        parseResult.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          if (!errors[field]) errors[field] = [];
          errors[field].push(err.message);
        });
        const errorState: State = {
          message: "Validation failed.",
          errors,
        };
        throw errorState;
      }
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "evidences" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append("evidences", file);
            }
          });
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });
      const response = await apiClient.post(formData, (event) => {
        if (onUploadProgress && event.total) {
          onUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
      return response as { ticketNumber: string };
    },
    onError: (error: any) => {
      if (error && error.errors) {
        toast.error(t("reportForm.toast.error"), {
          description: Object.values(error.errors).flat().join("\n"),
        });
      } else {
        toast.error(t("reportForm.toast.error"), {
          description: getErrorMessage(error),
        });
      }
    },
  });
}
