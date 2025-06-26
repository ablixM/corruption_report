import { z } from "zod";

export function createReportSchemaWithMessages(
  messages: Record<string, string>
) {
  return z.object({
    name: z.string().optional(),
    phone: z
      .string()
      .min(10, messages.phone || messages.required)
      .nonempty(messages.required),
    email: z.string().email(messages.invalid).optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    date: z.string().optional(),
    place: z
      .string()
      .min(1, messages.place || messages.required)
      .nonempty(messages.place || messages.required),
    office: z
      .string()
      .min(1, messages.office || messages.required)
      .nonempty(messages.required),
    corruptionTypeId: z
      .string()
      .min(1, messages.complaintType || messages.required)
      .nonempty(messages.complaintType || messages.required),
    description: z.string().optional(),
    evidences: z.any().optional(),
  });
}
