"use server";
import { CorruptionReportSchema } from "./schema";
import { State } from "./types";

const CreateReport = CorruptionReportSchema.omit({
  name: true,
  email: true,
  address: true,
  date: true,
  suspectName: true,
  suspectPhone: true,
  suspectPosition: true,
}).strict();

export async function createReport(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = CreateReport.safeParse({
    phone: formData.get("phone"),
    place: formData.get("place"),
    officeName: formData.get("officeName"),
    corruptionType: formData.get("corruptionType"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      message: "Missing Fields. Failed to Create Invoice.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // const evidenceFile = formData.get('evidence') as File;

  // You can upload this file to cloud storage here (e.g., S3, Cloudinary)
  // For now, just simulate success

  return {
    message: "Report submitted successfully.",
  };
}
