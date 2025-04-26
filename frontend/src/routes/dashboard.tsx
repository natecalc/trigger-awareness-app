import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard"!</div>;
}

const Dashboard = () => {
  return (
    <article>
      <section className="dashboard heading">
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard!</p>
      </section>

      <section className="dashboard stats">
        <h2>Statistics</h2>
        <p>Here are some statistics about your usage:</p>
      </section>

      <section className="dashboard chart">
        <h2>Chart</h2>
        <p>Showing frequency and intensity over time</p>
      </section>

      <section className="dashboard calendar">
        <h2>Calendar</h2>
        <p>Here is your calendar for the month</p>
      </section>
    </article>
  );
};
