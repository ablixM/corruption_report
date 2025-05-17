export type State = {
    message?: string;
    errors?: {
  name?: string[] | undefined;
  phone?: string[] | undefined;
  email?: string[] | undefined;
  address?: string[] | undefined;
  date?: string[] | undefined;
  place?: string[] | undefined;
  officeName?: string[] | undefined;
  corruptionType?: string[] | undefined;
  description?: string[] | undefined;
  evidence?: string[] | undefined;
  suspectName?: string[] | undefined;
  suspectPhone?: string[] | undefined;
  suspectPosition?: string[] | undefined;
} | undefined;
}