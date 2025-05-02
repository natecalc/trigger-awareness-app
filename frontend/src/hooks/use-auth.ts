import { useMutation } from '@tanstack/react-query';
import { useApi } from './use-api';
import { toast } from 'sonner';
import { queryClient } from '@/routes/__root';
import { useStorage } from '@/helpers/storage';
import { useNavigate } from '@tanstack/react-router';

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthApiResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    token: string;
  };
}

export const useSignup = () => {
  const { post } = useApi();
  const { setItem } = useStorage();
  const navigate = useNavigate();

  return useMutation<AuthApiResponse, Error, SignupCredentials>({
    mutationFn: async (credentials) => {
      try {
        const response = await post('/auth/signup', credentials);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Signup failed';
        const errorStatus = error.response?.status || 500;
        throw { message: errorMessage, status: errorStatus };
      }
    },
    onSuccess: async (data) => {
      toast('Signup Successful', {
        icon: '✅',
        description: `Welcome to the community, ${data.user.username}!`,
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      setItem('token', data.token);
      setItem('user', JSON.stringify(data));
      navigate({ to: '/' });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      const errorMessage = error.message || 'An error occurred';
      toast.error(errorMessage, {
        description: 'Please try again.',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    },
  });
};

export const useLogin = () => {
  const { post } = useApi();
  const { setItem } = useStorage();
  const navigate = useNavigate();

  return useMutation<AuthApiResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      try {
        const response = await post('/auth/login', credentials);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Login failed';
        const errorStatus = error.response?.status || 500;
        throw { message: errorMessage, status: errorStatus };
      }
    },
    onSuccess: async (data) => {
      toast('Login Successful', {
        icon: '✅',
        description: `Welcome back, ${data.user.username}!`,
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      setItem('token', data.token);
      setItem('user', JSON.stringify(data));
      navigate({ to: '/' });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      const errorMessage = error.message || 'An error occurred';
      toast.error(errorMessage, {
        description: 'Please try again.',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    },
  });
};
