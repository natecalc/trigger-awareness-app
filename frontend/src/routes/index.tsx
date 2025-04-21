import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <article className="p-2">
      <section className="welcome-section">
        <h1 className="text-3xl font-bold">Welcome to Trigger Tracker!</h1>
        <p className="text-lg">
          This is a simple web application that allows you to track and manage
          your triggers. You can add, edit, and delete triggers, as well as view
          their details and history.
        </p>
      </section>

      <section className="add-trigger-section">
        {/* Add trigger button */}
        {/* Add trigger form */}
      </section>
      <section className="trigger-list-section">
        {/* Trigger list */}
        {/* Trigger details */}
      </section>
    </article>
  );
}
