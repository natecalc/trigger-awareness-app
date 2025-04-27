import { createContext, useState } from "react";

export const UserContext = createContext<{
  user: any;
  setUser: (user: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: any;
  setError: (error: any) => void;
} | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
