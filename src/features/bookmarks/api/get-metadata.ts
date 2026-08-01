import { axiosInstance } from "~/lib/axios";

export async function fetchMetadata(url: string) {
  const res = await axiosInstance.get(
    `/metadata?url=${encodeURIComponent(url)}`
  );

  return res.data;
}
