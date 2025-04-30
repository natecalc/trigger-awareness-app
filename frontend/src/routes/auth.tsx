import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/providers/auth-provider';
import { LoginCredentials } from '@/hooks/use-auth';

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

  const { user, login, userError, isUserLoading } = useContext(AuthContext);
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

          <Button type="submit" className="w-full" disabled={isUserLoading}>
            {isUserLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { user, signup, userError, isUserLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup(formData);
    setFormData({
      username: '',
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
        <CardTitle>Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

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

          <Button type="submit" className="w-full" disabled={isUserLoading}>
            {isUserLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
