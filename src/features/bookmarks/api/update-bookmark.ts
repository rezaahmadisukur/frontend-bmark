import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookmarksQueryKey } from "./get-bookmarks";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Bookmark } from "~/types/api";
import { z } from "zod";

export const updateBookmarkInputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  isFavorite: z.boolean().optional(),
  collectionId: z.string().optional()
});

export type UpdateBookmarkInput = z.infer<typeof updateBookmarkInputSchema>;

export const updateBookmark = async ({
  id,
  data
}: {
  id: string;
  data: UpdateBookmarkInput;
}): Promise<Bookmark> => {
  const res = await axiosInstance.patch<Bookmark>(`/bookmarks/${id}`, data);

  return res.data;
};

type UseUpdateBookmark = {
  mutationConfig?: MutationConfig<typeof updateBookmark>;
};

export const useUpdateBookmark = ({
  mutationConfig
}: UseUpdateBookmark = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateBookmark,
    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: getBookmarksQueryKey()
      });
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
