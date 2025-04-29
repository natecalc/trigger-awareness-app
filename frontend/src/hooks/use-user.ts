import { useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";

export interface UserDto {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const useUser = () => {
  const { get } = useApi();

  return useQuery<UserDto>({
    queryKey: ["user"],
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await get("/users/me");
      return response.data;
    },
  });
};
