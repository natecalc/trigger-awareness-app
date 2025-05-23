import { TriggersAreaChart } from '@/components/area-chart';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
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
        <TriggersAreaChart />
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
