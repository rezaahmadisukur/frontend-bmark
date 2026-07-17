import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookmarksQueryKey } from "./get-bookmarks";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";

export const deleteBookmark = async ({ id }: { id: string }) => {
  const res = await axiosInstance.delete(`/bookmarks/${id}`);

  return res.data;
};

export type UseDeleteBookmark = {
  mutationConfig?: MutationConfig<typeof deleteBookmark>;
};

export const useDeleteBookmark = ({
  mutationConfig
}: UseDeleteBookmark = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteBookmark,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: getBookmarksQueryKey()
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
