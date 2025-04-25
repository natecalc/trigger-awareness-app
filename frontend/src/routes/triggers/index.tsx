import { TriggerPanel } from "@/components/trigger-panel";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTriggers } from "@/hooks/use-triggers";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/triggers/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    isLoading: triggersIsLoading,
    isError: triggersIsError,
    data: triggers,
  } = useTriggers();

  if (triggersIsLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <Spinner className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-gray-500">
            Please wait while we fetch your triggers.
          </p>
        </div>
      </div>
    );
  }
  if (triggersIsError) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-gray-500">
            There was an error fetching your triggers.
          </p>
        </div>
      </div>
    );
  }
  if (!triggers || triggers.length === 0) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">No Triggers Found</h1>
          <p className="text-gray-500">
            You have no triggers yet. Start by adding one!
          </p>
          <Link to="/">
            <Button className="mt-4">Add Trigger</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col w-full p-4 space-y-4 md:w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Trigger Repository</h2>
        <Button variant="outline" size="sm" className="text-sm" asChild>
          <Link to="/">Add Trigger</Link>
        </Button>
      </div>
      <p className="text-gray-500 mb-4">
        View summary information and details about your triggers. View details
        for full breakdown of each.
      </p>
      {triggers.map((trigger) => (
        <TriggerPanel key={trigger.id} trigger={trigger} />
      ))}
    </section>
  );
}
