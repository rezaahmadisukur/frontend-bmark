import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollectionsQueryKey } from "./get-collections";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";

export const deleteCollection = async ({
  id
}: {
  id: string;
}): Promise<void> => {
  await axiosInstance.delete(`/collections/${id}`);
};

type UseDeleteCollection = {
  mutationConfig?: MutationConfig<typeof deleteCollection>;
};

export const useDeleteCollection = ({
  mutationConfig
}: UseDeleteCollection = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: getCollectionsQueryKey()
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
