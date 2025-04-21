import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="p-8">{children}</div>
    </div>
  );
};

function RootComponent() {
  return (
    <main>
      <header>
        <div className="flex flex-row items-center p-4 space-x-4">
          <h1 className="text-xl font-bold">🧘‍♂️ Trigger Tracker </h1>
          <nav className="p-2 flex gap-2 text-lg">
            {/* Insert Page Links */}
          </nav>
        </div>
      </header>

      <hr />

      <RootLayout>
        <Outlet />
      </RootLayout>
      <TanStackRouterDevtools position="bottom-right" />
    </main>
  );
}
