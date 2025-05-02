import { useStorage } from '@/helpers/storage';
import {
  LoginCredentials,
  SignupCredentials,
  useLogin,
  useSignup,
} from '@/hooks/use-auth';
import { UserDto, useUser } from '@/hooks/use-user';
import { useNavigate } from '@tanstack/react-router';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  isLoginLoading: boolean;
  isSignupLoading: boolean;
  loginError: Error | null;
  signupError: Error | null;
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
  isLoginLoading: false,
  isSignupLoading: false,
  loginError: null,
  signupError: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const [userError, setUserError] = useState<Error | null>(null);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [signupError, setSignupError] = useState<Error | null>(null);

  const { getItem, removeItem, clearStorage } = useStorage();
  const {
    data: currentUser,
    isPending: isCurrentUserPending,
    error: currentUserError,
    refetch: refetchCurrentUser,
  } = useUser();

  const {
    mutate: signupMutate,
    isPending: isSignupPending,
    error: signupFetchError,
  } = useSignup();

  const {
    mutate: loginMutate,
    isPending: isLoginPending,
    error: loginFetchError,
  } = useLogin();

  const navigate = useNavigate();

  const logout = () => {
    removeItem('token');
    removeItem('user');
    clearStorage('session');
    setUser(undefined);
    setIsAuthenticated(false);
    setUserError(null);
    setLoginError(null);
    setSignupError(null);
    toast('Logged out successfully', {
      icon: '✅',
      description: 'Adios, see you next time!',
      duration: 3000,
      action: {
        label: 'Close',
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    navigate({ to: '/auth' });
  };

  const login = (credentials: LoginCredentials) => {
    setIsLoginLoading(true);
    setLoginError(null);
    loginMutate(credentials, {
      onSettled: () => {
        setIsLoginLoading(false);
      },
    });
  };

  const signup = (credentials: SignupCredentials) => {
    setIsSignupLoading(true);
    setSignupError(null);
    signupMutate(credentials, {
      onSettled: () => {
        setIsSignupLoading(false);
      },
    });
  };

  useEffect(() => {
    const token = getItem('token');
    if (!token) {
      setUser(undefined);
      setIsAuthenticated(false);
      setUserError(null);
      setIsUserLoading(false);
      return;
    }

    setIsUserLoading(isCurrentUserPending);

    if (currentUserError) {
      const error =
        currentUserError instanceof Error
          ? currentUserError
          : new Error(String(currentUserError));

      console.error('Error fetching user data:', error);
      setUserError(error);
      logout();
      return;
    }

    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
      setUserError(null);
    } else if (!isCurrentUserPending) {
      logout();
    }
  }, [currentUser, isCurrentUserPending, currentUserError, login, signup]);

  useEffect(() => {
    if (loginFetchError) {
      setLoginError(loginFetchError);
    }

    if (!isLoginPending) {
      setIsLoginLoading(false);
    }
  }, [isLoginPending, loginFetchError]);

  useEffect(() => {
    if (signupFetchError) {
      setSignupError(signupFetchError);
    }

    if (!isSignupPending) {
      setIsSignupLoading(false);
    }
  }, [isSignupPending, signupFetchError]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(
      () => {
        refetchCurrentUser();
      },
      15 * 60 * 1000
    ); // 15 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, refetchCurrentUser]);

  const value = {
    user,
    setUser,
    isUserLoading,
    setIsUserLoading,
    userError,
    setUserError,
    signup,
    login,
    logout,
    isLoginLoading,
    isSignupLoading,
    loginError,
    signupError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
