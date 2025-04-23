import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TriggerEvent } from "@/hooks/use-triggers";
import { formattedDate } from "@/helpers/date";
import { getEmotionColor } from "@/helpers/colors";

export const TriggerPanel = ({
  trigger,
  onDelete,
}: {
  trigger: TriggerEvent;
  onDelete?: (id: number) => void;
}) => (
  <Card className=" shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-indigo-500 w-full md:w-3xl">
    <CardHeader>
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg font-semibold text-indigo-700 capitalize">
          {trigger.triggerName}
        </CardTitle>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {formattedDate(trigger.createdAt)}
        </div>
      </div>
    </CardHeader>

    <CardContent className=" space-y-2">
      <p className="text-sm text-gray-600 line-clamp-2 ">
        {trigger.triggerEvent.slice(0, 1).toUpperCase() +
          trigger.triggerEvent.slice(1)}
      </p>
      <div className="flex flex-wrap gap-1">
        {trigger.emotions.map((emotion, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`${getEmotionColor(emotion)} font-normal py-0.5 capitalize`}
          >
            {emotion}
          </Badge>
        ))}
      </div>
    </CardContent>

    <CardFooter className="pt-0 flex justify-between">
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

      {onDelete && (
        <Button
          size="sm"
          variant="destructiveOutline"
          onClick={() => onDelete(trigger.id)}
        >
          Delete
        </Button>
      )}
    </CardFooter>
  </Card>
);

export default TriggerPanel;
