import { z } from "zod";

export const CorruptionReportSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional(),
  address: z.string().optional(),
  date: z.string().optional(),
  place: z.string().min(1, "Place is required"),
  officeName: z.string().min(1, "Office name is required"),
  corruptionType: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  evidence: z.string().optional(),

  suspectName: z.string().optional(),
  suspectPhone: z.string().optional(),
  suspectPosition: z.string().optional(),
});
