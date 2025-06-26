import { z } from "zod";

export function createComplaintSchemaWithMessages(
  errorMessages: Record<string, string>
) {
  return z.object({
    name: z.string().optional(),
    phone: z
      .string()
      .min(10, { message: errorMessages.phone })
      .regex(/^\+?[0-9]+$/, { message: errorMessages.phone }),
    email: z
      .string()
      .email({ message: errorMessages.invalid })
      .optional()
      .or(z.literal(""))
      .optional(),
    address: z.string().optional(),
    date: z.string().optional(),
    place: z.string().min(1, { message: errorMessages.place }),
    office: z.string().min(1, { message: errorMessages.office }),
    description: z.string().min(1, { message: errorMessages.required }),
  });
}
