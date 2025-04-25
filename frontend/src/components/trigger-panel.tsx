import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TriggerEvent } from "@/hooks/use-triggers";
import { formattedDate } from "@/helpers/date";
import { truncateString } from "@/helpers/parse";

export const TriggerPanel = ({ trigger }: { trigger: TriggerEvent }) => {
  return (
    <section className="px-8 py-4 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-indigo-500 w-full md:w-3xl">
      <div className=" space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-indigo-700 capitalize">
            {trigger.triggerName}
          </CardTitle>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate(trigger.createdAt)}
          </div>
        </div>
        <div className="space-x-2 w-full flex items-center justify-between">
          <p className="text-sm  text-secondary-foreground">
            {truncateString(
              trigger.triggerEvent.slice(0, 1).toUpperCase() +
                trigger.triggerEvent.slice(1),
              50
            )}
          </p>
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
              View details <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TriggerPanel;
