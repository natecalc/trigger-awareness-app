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
import { PlusSquareIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [showForm, setShowForm] = useState(false);

  const {
    data: triggers,
    isLoading: triggersIsLoading,
    isError: triggersIsError,
  } = useTriggers();

  const { mutate: addTrigger } = useAddTrigger();
  const { mutate: deleteTrigger } = useDeleteTrigger();

  const formSchema = z.object({
    triggerEvent: z.string().min(1, "Trigger Event is required"),
    factualDescription: z.string().min(1, "Factual Description is required"),
    emotions: z.string().min(1, "Emotions are required"),
    meaning: z.string().min(1, "Meaning is required"),
    pastRelationship: z.string().min(1, "Past Relationship is required"),
    triggerName: z.string().min(1, "Trigger Name is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      triggerEvent: "",
      factualDescription: "",
      emotions: "",
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
    <div className="p-2 space-y-8">
      <article className="p-2 space-y-8">
        <section className="welcome-section border rounded-md p-4 space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">
              Welcome to Trigger Tracker 👋
            </h1>
            <p className="text-secondary-foreground">
              This is a simple web application that allows you to track and
              manage your triggers. You can add, edit, and delete triggers, as
              well as view their details and history.
            </p>
          </div>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 w-full py-8"
            size="lg"
            onClick={() => setShowForm(!showForm)}
          >
            <div className="flex items-center gap-2">
              <PlusSquareIcon />
              <p>Add a trigger</p>
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
                        Trigger Event
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="What happened that triggered you?"
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
                        Factual Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What happened factually?"
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
                        Emotions
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How did it make you feel?"
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
                  name="meaning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        Meaning
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What meaning did you make out of this situation?"
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
                        Past Relationship
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Does this remind you of a past relationship?"
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
                        Trigger Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What would you like to name this trigger?"
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
                  Add Trigger
                </Button>
              </form>
            </Form>
          </fieldset>
        </section>

        <section className="trigger-list-section">
          <h2 className="text-2xl font-bold">Your Triggers</h2>
          <p className="text-lg">
            Here are the triggers you have added. You can click on each trigger
            to view its details and history.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 py-8">
            {triggersIsLoading && <p>Loading...</p>}
            {triggersIsError && <p>Error loading triggers</p>}
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
                      Trigger Event: {trigger.triggerEvent}
                    </p>
                    <p className="text-sm text-gray-500">
                      Factual Description: {trigger.factualDescription}
                    </p>
                    <p className="text-sm text-gray-500">
                      Emotions: {trigger.emotions}
                    </p>
                    <p className="text-sm text-gray-500">
                      Meaning: {trigger.meaning}
                    </p>
                    <p className="text-sm text-gray-500">
                      Past Relationship: {trigger.pastRelationship}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      disabled
                      onClick={() => console.log("View Trigger Details")}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteTrigger(trigger.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </section>
      </article>
    </div>
  );
}
