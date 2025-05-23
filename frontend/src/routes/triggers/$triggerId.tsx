import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { getEmotionColorClassName } from '@/helpers/colors';
import { formattedDate } from '@/helpers/date';
import {
  TriggerEventDto,
  useDeleteTrigger,
  useTriggerById,
  useUpdateTrigger,
} from '@/hooks/use-triggers';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Edit, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/triggers/$triggerId')({
  component: RouteComponent,
});

function RouteComponent() {
  const triggerId = useParams({
    from: '/triggers/$triggerId',
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
    <article className="flex w-full flex-col space-y-4 p-4 md:w-3xl">
      <section className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-auto p-0 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <Link to="/triggers">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <p className="hidden sm:inline">Back to triggers</p>
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
                <X className="mr-1 h-4 w-4" />
                <p className="hidden sm:inline">Cancel</p>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="mr-1 h-4 w-4" />
                <p className="hidden sm:inline">Save changes</p>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-1 h-4 w-4" />
                <p className="hidden sm:inline">Edit</p>
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
                    <Trash2 className="mr-1 h-4 w-4" />
                    <p className="hidden sm:inline">Delete</p>
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
                    <div className="mt-4 flex gap-2">
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

      <Card className="border-l-4 border-l-indigo-500 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <h3>
              <strong>Name</strong>
            </h3>
            <div className="flex items-center text-sm text-nowrap text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              {formattedDate(trigger.createdAt)}
            </div>
          </div>
          {isEditing ? (
            <Input
              type="text"
              defaultValue={trigger.triggerName}
              className="text-lg font-semibold"
              onChange={(e) => onChangeValues(e, 'triggerName')}
            />
          ) : (
            <CardTitle className="text-lg font-semibold text-indigo-700">
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
                className="text-lg font-semibold"
                onChange={(e) => onChangeValues(e, 'triggerEvent')}
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
                className="text-lg font-semibold"
                onChange={(e) => onChangeValues(e, 'factualDescription')}
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
            <ul className="list-inside list-disc space-x-1">
              {trigger.emotions.map((emotion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${getEmotionColorClassName(emotion)} py-0.5 font-normal`}
                >
                  {emotion}
                </Badge>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="flex w-full items-center justify-between gap-2">
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
                className="text-lg font-semibold"
                onChange={(e) => onChangeValues(e, 'meaning')}
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
                className="text-lg font-semibold"
                onChange={(e) => onChangeValues(e, 'pastRelationship')}
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
