export type State = {
  message?: string;
  errors?:
    | {
        name?: string[] | undefined;
        phone?: string[] | undefined;
        email?: string[] | undefined;
        address?: string[] | undefined;
        date?: string[] | undefined;
        place?: string[] | undefined;
        office_name?: string[] | undefined;
        corruption_type?: string[] | undefined;
        description?: string[] | undefined;
        evidence?: string[] | undefined;
      }
    | undefined;
};
