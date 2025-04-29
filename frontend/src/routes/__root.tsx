import {
  Link,
  Outlet,
  createRootRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthContext, AuthProvider } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const HEADER_HEIGHT = 64;
export const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center justify-center ">
      <div className="p-0 md:p-8 w-full items-center justify-center flex mt-24 md:mt-16">
        <div className="pt-8">{children}</div>
      </div>
    </div>
  );
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

function RootComponent() {
  const { pathname } = useLocation();

  return (
    <Providers>
      <main>
        <Header pathname={pathname} />

        <hr />

        <RootLayout>
          <Outlet />
        </RootLayout>
        <TanStackRouterDevtools position="bottom-right" />
      </main>
    </Providers>
  );
}

function Header({ pathname }: { pathname: string }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-10 h-[${HEADER_HEIGHT}px] justify-between flex items-center p-4`}
    >
      <div className="flex flex-row items-center space-x-4">
        <img
          src="/logo.png"
          alt="TriggerMap Logo"
          width={64}
          height={64}
          className="rounded-full"
        />
        <h1 className="text-xl font-bold">TriggerMap </h1>
        <nav className="p-2 flex gap-2 text-lg">
          <Link to="/">Home</Link>

          <Link
            to="/triggers"
            search={pathname === "/triggers" ? "" : pathname}
          >
            Triggers
          </Link>
        </nav>
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-lg font-bold">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          onClick={() => {
            navigate({ to: "/" });
          }}
        >
          Login
        </Button>
      )}
    </header>
  );
}
