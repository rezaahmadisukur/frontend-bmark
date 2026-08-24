import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookmarksQueryKey } from "./get-bookmarks";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Bookmark } from "~/types/api";

export const toggleFavorite = async ({
  id
}: {
  id: string;
}): Promise<Bookmark> => {
  const res = await axiosInstance.patch<Bookmark>(`/bookmarks/${id}/favorite`);

  return res.data;
};

type UseToggleFavorite = {
  mutationConfig?: MutationConfig<typeof toggleFavorite>;
};

export const useToggleFavorite = ({
  mutationConfig
}: UseToggleFavorite = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: getBookmarksQueryKey()
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
