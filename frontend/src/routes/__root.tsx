import {
  Link,
  Outlet,
  createRootRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthContext, AuthProvider } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const HEADER_HEIGHT = 64;
export const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="mt-24 flex flex-1 items-center justify-center p-0 md:mt-16 md:p-8">
        {children}
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
      className={`fixed top-0 left-0 z-10 w-full bg-white shadow-md h-[${HEADER_HEIGHT}px] flex items-center justify-between p-4`}
    >
      <div className="flex flex-row items-center space-x-4">
        <Sheet>
          <SheetTrigger className="flex sm:hidden">
            <Button asChild variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 p-4">
            <SheetHeader>
              <SheetTitle className="text-lg">Menu</SheetTitle>
              <SheetDescription>Navigate through the app</SheetDescription>
            </SheetHeader>
            <nav className="text-md flex flex-col gap-2 p-4">
              <SheetClose asChild>
                <Link to="/">Home</Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  to="/triggers"
                  search={pathname === '/triggers' ? '' : pathname}
                  className={`${user ? 'visible' : 'invisible'}`}
                >
                  Triggers
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
        <img
          src="/logo.png"
          alt="TriggerMap Logo"
          width={64}
          height={64}
          className="hidden rounded-full sm:block"
        />
        <h1 className="text-xl font-bold">TriggerMap </h1>
        <nav className="hidden gap-2 p-2 text-lg sm:flex">
          <Link to="/">Home</Link>

          <Link
            to="/triggers"
            search={pathname === '/triggers' ? '' : pathname}
            className={`${user ? 'visible' : 'invisible'}`}
          >
            Triggers
          </Link>
        </nav>
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-12 w-12">
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
            navigate({ to: '/auth' });
          }}
        >
          Login
        </Button>
      )}
    </header>
  );
}
