import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteTrigger, useTriggers } from "@/hooks/use-triggers";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LucideNotebookPen, Trash } from "lucide-react";

export const Route = createFileRoute("/triggers/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: triggers,
    isLoading: triggersIsLoading,
    isError: triggersIsError,
  } = useTriggers();
  const { mutate: deleteTrigger } = useDeleteTrigger();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 py-8">
      {triggersIsLoading && <p>Loading your trigger journal...</p>}
      {triggersIsError && (
        <p>
          We encountered an issue loading your triggers. Please try refreshing
          the page.
        </p>
      )}
      {triggers &&
        triggers.map((trigger) => (
          <Card key={trigger.id} className="trigger-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold capitalize">
                {trigger.triggerName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Trigger:</span>{" "}
                {trigger.triggerEvent}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Facts:</span>{" "}
                {trigger.factualDescription}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Emotions:</span>{" "}
                {trigger.emotions}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Meaning:</span> {trigger.meaning}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Connection:</span>{" "}
                {trigger.pastRelationship}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link
                  to="/triggers/$triggerId"
                  params={{ triggerId: trigger.id.toString() }}
                >
                  Reflect
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteTrigger(trigger.id)}
              >
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}

const RecentTriggerPanels = () => {
  const {
    data: triggers,
    isLoading: triggersIsLoading,
    isError: triggersIsError,
  } = useTriggers();

  const { mutate: deleteTrigger } = useDeleteTrigger();

  return (
    <section className="recent-trigger-list">
      <h2 className="text-2xl font-bold">Your Trigger Journal</h2>
      <p className="text-lg">
        Below is your collection of documented triggers. Each entry represents a
        learning opportunity and a chance to respond differently next time.
      </p>
      <ul className="flex flex-col py-8 gap-2">
        {triggersIsLoading && <p>Loading your trigger journal...</p>}
        {triggersIsError && (
          <p>
            We encountered an issue loading your triggers. Please try refreshing
            the page.
          </p>
        )}
        {triggers &&
          triggers.map((trigger) => (
            <li key={trigger.id}>
              <Card className="flex flex-row items-center justify-between p-4">
                <div>
                  <h3 className="text-xl font-bold capitalize">
                    {trigger.triggerName}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {trigger.triggerEvent}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <LucideNotebookPen className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={() => deleteTrigger(trigger.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
      </ul>
    </section>
  );
};
