import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollectionsQueryKey } from "./get-collections";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Collection } from "~/types/api";
import { z } from "zod";

export const createCollectionInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().optional()
});

export type CreateCollectionInput = z.infer<typeof createCollectionInputSchema>;

export const createCollection = async ({
  data
}: {
  data: CreateCollectionInput;
}): Promise<Collection> => {
  const res = await axiosInstance.post<Collection>("/collections", data);
  return res.data;
};

type UseCreateCollection = {
  mutationConfig?: MutationConfig<typeof createCollection>;
};

export const useCreateCollection = ({
  mutationConfig
}: UseCreateCollection = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createCollection,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: getCollectionsQueryKey()
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
