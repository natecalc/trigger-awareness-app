import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getEmotionColorClassName } from "@/helpers/colors";
import { formattedDate } from "@/helpers/date";
import {
  TriggerEventDto,
  useDeleteTrigger,
  useTriggerById,
  useUpdateTrigger,
} from "@/hooks/use-triggers";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Edit, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/triggers/$triggerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const triggerId = useParams({
    from: "/triggers/$triggerId",
    select: (params) => params.triggerId,
  });
  const { data: trigger } = useTriggerById(triggerId);
  const { mutate: deleteTrigger } = useDeleteTrigger();
  const { mutate: updateTrigger } = useUpdateTrigger();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrigger, setEditedTrigger] = useState<Partial<TriggerEventDto>>(
    {}
  );

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

  const handleSave = () => {
    updateTrigger({
      ...trigger,
      ...editedTrigger,
    });
    setIsEditing(false);
  };

  const handleDeleteTrigger = (triggerId: string) => {
    deleteTrigger(Number(triggerId));
  };

  const onChangeValues = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TriggerEventDto
  ) => {
    setEditedTrigger({
      ...editedTrigger,
      [field]: e.target.value,
    });
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit Trigger
              </Button>
              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructiveOutline"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold text-red-600">
                      Are you sure you want to delete this trigger?
                    </h2>
                    <p className="text-gray-500">
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" size="sm" asChild>
                        <Link
                          to="/triggers"
                          onClick={() => {
                            handleDeleteTrigger(triggerId);
                            setShowDeleteDialog(false);
                          }}
                        >
                          Delete
                        </Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </section>

      <Card className=" shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-indigo-500">
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <h3>
              <strong>Name</strong>
            </h3>
            <div className="flex items-center text-sm text-gray-500  text-nowrap">
              <Calendar className="h-4 w-4 mr-1" />
              {formattedDate(trigger.createdAt)}
            </div>
          </div>
          {isEditing ? (
            <Input
              type="text"
              defaultValue={trigger.triggerName}
              className="text-lg font-semibold "
              onChange={(e) => onChangeValues(e, "triggerName")}
            />
          ) : (
            <CardTitle className="text-lg font-semibold text-indigo-700 ">
              {trigger.triggerName}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3>
              <strong>Event</strong>
            </h3>
            {isEditing ? (
              <Input
                type="text"
                defaultValue={trigger.triggerEvent}
                className="text-lg font-semibold "
                onChange={(e) => onChangeValues(e, "triggerEvent")}
              />
            ) : (
              <p className="text-muted-foreground">{trigger.triggerEvent}</p>
            )}
          </div>
          <div className="space-y-2">
            <h3>
              <strong>Factual description</strong>
            </h3>
            {isEditing ? (
              <Input
                type="text"
                defaultValue={trigger.factualDescription}
                className="text-lg font-semibold "
                onChange={(e) => onChangeValues(e, "factualDescription")}
              />
            ) : (
              <p className="text-muted-foreground">
                {trigger.factualDescription}
              </p>
            )}
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
                  className={`${getEmotionColorClassName(emotion)} font-normal py-0.5 `}
                >
                  {emotion}
                </Badge>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 w-full justify-between">
              <strong>Emotional intensity</strong>
              {isEditing && (
                <h3>
                  <strong>{editedTrigger.intensity}</strong>
                </h3>
              )}
            </h3>
            {isEditing ? (
              <Slider
                defaultValue={[1]}
                min={1}
                max={10}
                step={1}
                value={[editedTrigger.intensity || 1]}
                onValueChange={(value) => {
                  setEditedTrigger({
                    ...editedTrigger,
                    intensity: value[0],
                  });
                }}
              />
            ) : (
              <p className="text-muted-foreground">{trigger.intensity}</p>
            )}
          </div>
          <div className="space-y-2">
            <h3>
              <strong>Meaning</strong>
            </h3>
            {isEditing ? (
              <Input
                type="text"
                defaultValue={trigger.meaning}
                className="text-lg font-semibold "
                onChange={(e) => onChangeValues(e, "meaning")}
              />
            ) : (
              <p className="text-muted-foreground">{trigger.meaning}</p>
            )}
          </div>
          <div className="space-y-2">
            <h3>
              <strong>Past relationship</strong>
            </h3>
            {isEditing ? (
              <Input
                type="text"
                defaultValue={trigger.pastRelationship}
                className="text-lg font-semibold "
                onChange={(e) => onChangeValues(e, "pastRelationship")}
              />
            ) : (
              <p className="text-muted-foreground">
                {trigger.pastRelationship}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
