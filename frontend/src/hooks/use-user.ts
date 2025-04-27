import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";
import { toast } from "sonner";
import { queryClient } from "@/routes/__root";

interface UserDto {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

interface SignupResponse {
  id: number;
  username: string;
  email: string;
  token: string;
}

export const useSignup = () => {
  const { post } = useApi();

  return useMutation<SignupResponse, Error, SignupCredentials>({
    mutationFn: async (credentials) => {
      try {
        const response = await post("/auth/signup", credentials);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Signup failed";
        const errorStatus = error.response?.status || 500;
        throw { message: errorMessage, status: errorStatus };
      }
    },
    onSuccess: async (data) => {
      console.log("Signup successful", data);
      toast("Signup Successful", {
        icon: "✅",
        description: "Welcome to the community!",
        duration: 3000,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      const errorMessage = error.message || "An error occurred";
      toast.error(errorMessage, {
        description: "Please try again.",
        duration: 3000,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    },
  });
};

export const useUser = () => {
  const authToken = localStorage.getItem("token") || "";

  const { get } = useApi(authToken);
  return useQuery<UserDto[]>({
    queryKey: ["user", authToken],
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!authToken,
    queryFn: async () => {
      const response = await get("/users/me");

      return {
        ...response.data,
      };
    },
  });
};
