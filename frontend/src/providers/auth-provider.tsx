import { useStorage } from "@/helpers/storage";
import {
  LoginCredentials,
  SignupCredentials,
  useLogin,
  useSignup,
} from "@/hooks/use-auth";
import { UserDto, useUser } from "@/hooks/use-user";
import { useNavigate } from "@tanstack/react-router";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const AuthContext = createContext<{
  user: UserDto | undefined;
  setUser: (user: UserDto | undefined) => void;
  isUserLoading: boolean;
  setIsUserLoading: (isLoading: boolean) => void;
  userError: Error | null;
  setUserError: (error: Error | null) => void;
  signup: (credentials: SignupCredentials) => void;
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
}>({
  user: undefined,
  setUser: () => {},
  isUserLoading: true,
  setIsUserLoading: () => {},
  userError: null,
  setUserError: () => {},
  signup: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | undefined>();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { getItem, removeItem } = useStorage();
  const { data: currUser, isPending, error, refetch } = useUser();
  const { mutate: signup } = useSignup();
  const { mutate: login } = useLogin();

  const navigate = useNavigate();

  const logout = () => {
    removeItem("token");
    removeItem("user");
    setUser(undefined);
    setIsAuthenticated(false);
    setUserError(null);
    toast("Logged out successfully", {
      icon: "✅",
      description: "Adios, see you next time!",
      duration: 3000,
      action: {
        label: "Close",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    navigate({ to: "/auth" });
  };

  useEffect(() => {
    const token = getItem("token");
    if (!token) {
      setUser(undefined);
      setIsAuthenticated(false);
      setUserError(null);
      setIsUserLoading(false);
      return;
    }

    if (isPending) {
      return;
    }

    if (error) {
      console.error("Error fetching user data:", error);
      setUserError(error instanceof Error ? error : new Error(String(error)));
      logout();
      setIsUserLoading(false);
      return;
    }

    if (currUser) {
      setUser(currUser);
      setIsAuthenticated(true);
      setUserError(null);
    } else {
      logout();
    }

    setIsUserLoading(false);
  }, [currUser, isPending, error, getItem]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(
      () => {
        refetch();
      },
      15 * 60 * 1000
    ); // 15 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, refetch]);

  const value = {
    user,
    setUser,
    isUserLoading,
    setIsUserLoading,
    isAuthenticated,
    userError,
    setUserError,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
