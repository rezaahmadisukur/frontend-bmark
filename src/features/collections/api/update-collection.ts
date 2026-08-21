import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollectionsQueryKey } from "./get-collections";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Collection } from "~/types/api";
import { z } from "zod";

export const updateCollectionInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().optional()
});

export type UpdateCollectionInput = z.infer<typeof updateCollectionInputSchema>;

export const updateCollection = async ({
  id,
  data
}: {
  id: string;
  data: UpdateCollectionInput;
}): Promise<Collection> => {
  // Normalize name to lowercase so it stays consistent across rename too
  const payload = { ...data, name: data.name.toLowerCase() };
  const res = await axiosInstance.patch<Collection>(`/collections/${id}`, payload);
  return res.data;
};

type UseUpdateCollection = {
  mutationConfig?: MutationConfig<typeof updateCollection>;
};

export const useUpdateCollection = ({
  mutationConfig
}: UseUpdateCollection = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateCollection,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: getCollectionsQueryKey()
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
