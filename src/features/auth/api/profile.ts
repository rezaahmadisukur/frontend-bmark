import { useQuery, queryOptions } from "@tanstack/react-query";
import { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";

export const getProfile = async () => {
  const res = await axiosInstance.get("/auth/profile");

  return res.data;
};

export const getProfileQueryKey = () => ["auth", "profile"];

export const getProfileQueryOptions = () => {
  return queryOptions({
    queryKey: getProfileQueryKey(),
    queryFn: () => getProfile()
  });
};

type UseGetProfile = {
  queryConfig?: QueryConfig<typeof getProfile>;
};

export const useGetProfile = ({ queryConfig }: UseGetProfile = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return useQuery({
    ...getProfileQueryOptions(),
    ...queryConfig,
    enabled: !!token
  });
};
