import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useAddTrigger,
  useDeleteTrigger,
  useTriggers,
} from "@/hooks/use-triggers";
import { createFileRoute } from "@tanstack/react-router";
import { LucideNotebookPen, PlusSquareIcon, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { TagsInput } from "@/components/ui/tags-input";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [showForm, setShowForm] = useState(false);

  const { mutate: addTrigger } = useAddTrigger();

  const formSchema = z.object({
    triggerEvent: z.string().min(1, "Please describe the triggering event"),
    factualDescription: z
      .string()
      .min(1, "A factual description helps provide clarity"),
    emotions: z
      .string()
      .min(1, "Naming your emotions is an important step")
      .array(),
    meaning: z
      .string()
      .min(1, "Understanding the meaning helps process the trigger"),
    pastRelationship: z
      .string()
      .min(1, "Connecting to past experiences provides insight"),
    triggerName: z
      .string()
      .min(1, "Naming your trigger helps you recognize patterns"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      triggerEvent: "",
      factualDescription: "",
      emotions: [],
      meaning: "",
      pastRelationship: "",
      triggerName: "",
    },
  });

  const handleAddTrigger = () => {
    const values = form.getValues();
    addTrigger({
      triggerEvent: values.triggerEvent,
      factualDescription: values.factualDescription,
      emotions: values.emotions,
      meaning: values.meaning,
      pastRelationship: values.pastRelationship,
      triggerName: values.triggerName,
    });
  };

  return (
    <div className="p-2 space-y-8 flex justify-center">
      <article className="p-2 space-y-8 max-w-3xl w-full">
        <section className="welcome-section border rounded-md p-4 space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">
              Welcome to Trigger Tracker 🌱
            </h1>
            <p className="text-secondary-foreground">
              Your personal space for mindful self-awareness. Document your
              emotional triggers, gain insights into your patterns, and develop
              healthier responses over time. Each entry is a step toward greater
              emotional understanding.
            </p>
          </div>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 w-full py-8"
            size="lg"
            onClick={() => setShowForm(!showForm)}
            hidden={showForm}
          >
            <div className="flex items-center gap-2">
              <PlusSquareIcon />
              <p>Document a new trigger</p>
            </div>
          </Button>

          <fieldset className="form-fieldset" hidden={!showForm}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddTrigger)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="triggerEvent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        What triggered you?
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Describe the specific event, words, or situation that triggered your reaction"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="factualDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        Just the Facts
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe what happened objectively, without interpretation or judgment"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emotions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        Emotional Response
                      </FormLabel>
                      <FormControl>
                        <TagsInput
                          {...field}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          placeholder="What emotions came up? Try to name them specifically (e.g., anger, shame, fear)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meaning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        Meaning & Interpretation
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What meaning did you attach to this situation? What story did you tell yourself?"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        Historical Connection
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Does this remind you of past experiences or relationships? How so?"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="triggerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        Name This Pattern
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Give this trigger a memorable name to help identify it in the future"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="mt-4"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                >
                  Save This Trigger
                </Button>
              </form>
            </Form>
          </fieldset>
        </section>

        <RecentTriggerPanels />
      </article>
    </div>
  );
}

const RecentTriggerPanels = () => {
  const {
    data: triggers,
    isLoading: triggersIsLoading,
    isError: triggersIsError,
  } = useTriggers();

  const { mutate: deleteTrigger } = useDeleteTrigger();

  return (
    <section className="recent-trigger-list">
      <h2 className="text-2xl font-bold">Your Trigger Journal</h2>
      <p className="text-lg">
        Below is your collection of documented triggers. Each entry represents a
        learning opportunity and a chance to respond differently next time.
      </p>
      <ul className="flex flex-col py-8 gap-2">
        {triggersIsLoading && <p>Loading your trigger journal...</p>}
        {triggersIsError && (
          <p>
            We encountered an issue loading your triggers. Please try refreshing
            the page.
          </p>
        )}
        {triggers &&
          triggers.map((trigger) => (
            <li key={trigger.id}>
              <Card className="flex flex-row items-center justify-between p-4">
                <div>
                  <h3 className="text-xl font-bold capitalize">
                    {trigger.triggerName}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {trigger.triggerEvent}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <LucideNotebookPen className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={() => deleteTrigger(trigger.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
      </ul>
    </section>
  );
};

const TriggerCards = () => {
  const {
    data: triggers,
    isLoading: triggersIsLoading,
    isError: triggersIsError,
  } = useTriggers();
  const { mutate: deleteTrigger } = useDeleteTrigger();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 py-8">
      {triggersIsLoading && <p>Loading your trigger journal...</p>}
      {triggersIsError && (
        <p>
          We encountered an issue loading your triggers. Please try refreshing
          the page.
        </p>
      )}
      {triggers &&
        triggers.map((trigger) => (
          <Card key={trigger.id} className="trigger-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold capitalize">
                {trigger.triggerName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Trigger:</span>{" "}
                {trigger.triggerEvent}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Facts:</span>{" "}
                {trigger.factualDescription}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Emotions:</span>{" "}
                {trigger.emotions}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Meaning:</span> {trigger.meaning}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Connection:</span>{" "}
                {trigger.pastRelationship}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                disabled
                onClick={() => console.log("View Trigger Details")}
              >
                Reflect
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteTrigger(trigger.id)}
              >
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};
