import { TriggerPanel } from "@/components/trigger-panel";
import { Button } from "@/components/ui/button";
import { useDeleteTrigger, useTriggers } from "@/hooks/use-triggers";
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
  const { mutate: deleteTrigger } = useDeleteTrigger();

  if (triggersIsLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-gray-500">
            Please wait while we fetch your triggers.
          </p>
        </div>
      </div>
    );
  }
  if (triggersIsError) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
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
      <div className="flex items-center justify-center w-full h-screen">
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
      <h2 className="text-2xl font-bold mb-4">Your Trigger Repository</h2>
      <p className="text-gray-500 mb-4">
        View summary information and details about your triggers. View details
        for full breakdown of each.
      </p>
      {triggers.map((trigger) => (
        <TriggerPanel
          key={trigger.id}
          trigger={trigger}
          onDelete={deleteTrigger}
        />
      ))}
    </section>
  );
}
