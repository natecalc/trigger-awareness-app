import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmotionColor } from "@/helpers/colors";
import { formattedDate } from "@/helpers/date";
import { useTriggerById } from "@/hooks/use-triggers";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Edit, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/triggers/$triggerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const triggerId = useParams({
    from: "/triggers/$triggerId",
    select: (params) => params.triggerId,
  });
  const { data: trigger } = useTriggerById(triggerId);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (trigger) {
      // setEditedTrigger(trigger);
    }
  }, [trigger]);

  if (!trigger) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Trigger Not Found</h1>
        <p className="text-gray-500">
          The trigger you are looking for does not exist.
        </p>
      </div>
    );
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // setEditedTrigger({ ...trigger });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <article className="flex flex-col p-4 space-y-4 w-full md:w-3xl ">
      <section className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="p-0 h-auto text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <Link to="/triggers">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to all triggers
          </Link>
        </Button>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-1" /> Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                <Edit className="h-4 w-4 mr-1" /> Edit Trigger
              </Button>
              <Button
                variant="destructiveOutline"
                size="sm"
                // onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      </section>

      <Card className=" shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-indigo-500">
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3>
              <strong>Trigger event</strong>
            </h3>
            <p className="text-muted-foreground">{trigger.triggerEvent}</p>
          </div>
          <div className="space-y-2">
            <h3>
              <strong>Factual description</strong>
            </h3>
            <p className="text-muted-foreground">
              {trigger.factualDescription}
            </p>
          </div>
          <div className="space-y-2">
            <h3>
              <strong>Emotions</strong>
            </h3>
            <ul className="list-disc list-inside space-x-1">
              {trigger.emotions.map((emotion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${getEmotionColor(emotion)} font-normal py-0.5 capitalize`}
                >
                  {emotion}
                </Badge>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3>
              <strong>Meaning</strong>
            </h3>
            <p className="text-muted-foreground">{trigger.meaning}</p>
          </div>
          <div className="space-y-2">
            <h3>
              <strong>Past relationship</strong>
            </h3>
            <p className="text-muted-foreground">{trigger.pastRelationship}</p>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
