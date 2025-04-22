import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

export const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="p-0 md:p-8 ">{children}</div>
    </div>
  );
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {children}
    </QueryClientProvider>
  );
};

function RootComponent() {
  return (
    <Providers>
      <main>
        <header>
          <div className="flex flex-row items-center p-4 space-x-4">
            <img
              src="/logo.png"
              alt="TriggerMap Logo"
              width={64}
              height={64}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold">TriggerMap </h1>
            <nav className="p-2 flex gap-2 text-lg">
              <a href="/">Home</a>
              <a href="/triggers">Triggers</a>
            </nav>
          </div>
        </header>

        <hr />

        <RootLayout>
          <Outlet />
        </RootLayout>
        <TanStackRouterDevtools position="bottom-right" />
      </main>
    </Providers>
  );
}
