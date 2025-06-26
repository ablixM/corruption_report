import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/services/api-client";
import ms from "ms";
import { CorruptionType } from "@/definitions/definitions";

const apiClient = new APIClient<CorruptionType>("/lookup/corruption-types");

export const useGetAllTags = (lang: string) => {
  return useQuery<CorruptionType[], Error>({
    queryKey: ["corruption-types", lang],
    queryFn: async () => {
      return (
        (await apiClient.getAllNonPaginated({
          headers: { "Accept-Language": lang },
        })) ?? []
      );
    },
    staleTime: ms("5m"),
  });
};
