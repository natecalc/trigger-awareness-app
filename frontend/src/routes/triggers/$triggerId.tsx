import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/triggers/$triggerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const triggerId = useParams({
    from: "/triggers/$triggerId",
    select: (params) => params.triggerId,
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Trigger ID: {triggerId}</h1>
      <p>This is the trigger detail page.</p>
      <p>Trigger ID: {triggerId}</p>
      {/* Add more details about the trigger here */}
    </div>
  );
}
