import { useSignup } from "@/hooks/use-user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignupForm />;
}

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate: signup, error, isError, isSuccess, isPending } = useSignup();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    if (isSuccess) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <Card className="w-full min-w-md">
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
          {isError && (
            <div className="bg-red-100 text-red-800 rounded-md p-4">
              <h3>{error.message}</h3>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-100 text-green-800 rounded-md p-4">
              <h3>Account created! Please log in.</h3>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
