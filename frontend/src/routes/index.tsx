import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddTrigger } from "@/hooks/use-triggers";
import { createFileRoute } from "@tanstack/react-router";
import { PlusSquareIcon } from "lucide-react";
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
      </article>
    </div>
  );
}
