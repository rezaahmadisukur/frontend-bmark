import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookmarksQueryKey } from "./get-bookmarks";
import { MutationConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Bookmark } from "~/types/api";
import { z } from "zod";

export const createBookmarkInputSchema = z.object({
  url: z.string().min(1, "URL is required").url("Must be a valid URL"),
  title: z.string().optional(),
  description: z.string().optional(),
  collectionId: z.string().optional()
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkInputSchema>;

export const createBookmark = async ({
  data
}: {
  data: CreateBookmarkInput;
}): Promise<Bookmark> => {
  const res = await axiosInstance.post<Bookmark>("/bookmarks", data);

  return res.data;
};

type UseCreateBookmark = {
  mutationConfig?: MutationConfig<typeof createBookmark>;
};

export const useCreateBookmark = ({
  mutationConfig
}: UseCreateBookmark = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createBookmark,
    onSuccess: (...args) => {
      // 1. Jalankan invalidasi wajib
      qc.invalidateQueries({
        queryKey: getBookmarksQueryKey()
      });
      // 2. Jalankan onSuccess dari komponen (misal: tutup modal, show toast)
      onSuccess?.(...args);
    },
    ...restConfig
  });
};
