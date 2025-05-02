import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/providers/auth-provider';
import { LoginCredentials } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BadgeCheck, BadgeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthPage />;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <article className="flex w-full flex-col items-center justify-center py-8">
      <section className="flex w-full max-w-md flex-col items-center justify-center">
        {isLogin ? <LoginForm /> : <SignupForm />}
        <Button
          variant="link"
          onClick={() => setIsLogin((prev) => !prev)}
          className="mt-4"
        >
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </Button>
      </section>
    </article>
  );
};

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const { user, login, userError, isLoginLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
    setFormData({
      email: '',
      password: '',
    });
    if (user) {
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {userError && (
            <div className="rounded-md bg-red-100 p-4 text-red-800">
              <h3>{userError.message}</h3>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoginLoading}>
            {isLoginLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const SignupForm = () => {
  const signupSchema = z
    .object({
      username: z.string().min(1, 'Username is required'),
      email: z.string().email('Invalid email address'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(
          /[@$!%*?&#]/,
          'Password must contain at least one special character'
        ),
      confirmPassword: z.string().min(8, 'Confirm Password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { user, signup, isUserLoading, signupError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const { username, email, password } = form.getValues();
    signup({
      username,
      email,
      password,
    });
    if (user) {
      navigate({ to: '/dashboard' });
    }
    form.reset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="username"
                        name="username"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        id="email"
                        name="email"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="password"
              render={({ field }) => {
                const password = form.watch('password');

                const requirements = [
                  {
                    label: 'At least 8 characters',
                    test: (pw: string) => pw.length >= 8,
                  },
                  {
                    label: 'At least one uppercase letter',
                    test: (pw: string) => /[A-Z]/.test(pw),
                  },
                  {
                    label: 'At least one lowercase letter',
                    test: (pw: string) => /[a-z]/.test(pw),
                  },
                  {
                    label: 'At least one number',
                    test: (pw: string) => /\d/.test(pw),
                  },
                  {
                    label: 'At least one special character',
                    test: (pw: string) => /[@$!%*?&#]/.test(pw),
                  },
                ];

                return (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        id="password"
                        name="password"
                        required
                      />
                    </FormControl>
                    {field.value && (
                      <ul className="mt-2 space-y-1">
                        {requirements.map((req, index) => {
                          const isValid = req.test(password || '');
                          return (
                            <li
                              key={index}
                              className={cn(
                                `flex items-center space-x-2 text-xs`,
                                isValid ? 'text-green-500' : 'text-red-500'
                              )}
                            >
                              {isValid ? (
                                <BadgeCheck className="h-4 w-4" />
                              ) : (
                                <BadgeX className="h-4 w-4" />
                              )}
                              <span>{req.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="confirmPassword"
              render={({ field }) => {
                const password = form.watch('password');
                const confirmPassword = form.watch('confirmPassword');

                return (
                  <FormItem>
                    <FormLabel htmlFor="confirm-password">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        required
                      />
                    </FormControl>
                    {password &&
                      confirmPassword &&
                      password !== confirmPassword && (
                        <FormMessage>
                          <span className="text-red-500">
                            Passwords do not match
                          </span>
                        </FormMessage>
                      )}
                    {password &&
                      confirmPassword &&
                      password === confirmPassword && (
                        <FormMessage>
                          <span className="text-green-500">
                            Passwords match
                          </span>
                        </FormMessage>
                      )}
                  </FormItem>
                );
              }}
            />

            {signupError && (
              <div className="rounded-md bg-red-100 p-4 text-red-800">
                <h3>{signupError.message}</h3>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isUserLoading || !form.formState.isValid}
            >
              {isUserLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
