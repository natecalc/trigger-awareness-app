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
  const authToken = localStorage.getItem("token") || "";

  const { get } = useApi(authToken);
  return useQuery<UserDto>({
    queryKey: ["user", authToken],
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!authToken,
    queryFn: async () => {
      const response = await get("/users/me");
      return response.data;
    },
  });
};
