import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TriggerEvent } from "@/hooks/use-triggers";

export const TriggerPanel = ({ trigger }: { trigger: TriggerEvent }) => {
  return (
    <section
      className={`px-8 py-4 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 items-center w-full md:w-3xl flex flex-row justify-between`}
    >
      <h3 className="text-lg font-semibold text-indigo-700 capitalize">
        {trigger.triggerName}
      </h3>

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        <Link
          to="/triggers/$triggerId"
          params={{ triggerId: trigger.id.toString() }}
        >
          Details <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </section>
  );
};

export default TriggerPanel;
