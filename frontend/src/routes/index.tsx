import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddTrigger } from "@/hooks/use-triggers";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronsRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import EmotionSelector from "@/components/emotion-picker";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [triggerFormStep, setTriggerFormStep] = useState(0);

  const { mutate: addTrigger, data, isPending, error } = useAddTrigger();

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
    mode: "onChange",
  });

  const nextStep = () => {
    setTriggerFormStep(triggerFormStep + 1);
    window.scrollTo(0, 0);
  };

  const backStep = () => {
    setTriggerFormStep(triggerFormStep - 1);
    window.scrollTo(0, 0);
  };

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
      {/* <NavigationTop className={"md:flex"}>
        {onBoardStep === 1 && (
          <NavButton
            className={"text-primary"}
            callback={() => router.replace("/logout")}
          >
            Log Out
          </NavButton>
        )}
        {onBoardStep !== 1 && <NavBackButton callback={backStep} />}
      </NavigationTop> */}
      <main className="container px-4 py-10 pb-16 p-2 space-y-8 max-w-3xl w-full">
        <div className="pb-4">
          {/* <TaskProgressBar
            completedTasks={onBoardStep}
            totalTasks={totalSteps}
            barText="Progress"
          /> */}
        </div>

        {triggerFormStep == 0 && (
          <section className="welcome-section p-4 space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Welcome to TriggerMap 🌱</h1>
              <p className="text-secondary-foreground">
                Your personal space for mindful self-awareness. Document your
                emotional triggers, gain insights into your patterns, and
                develop healthier responses over time. Each entry is a step
                toward greater emotional understanding.
              </p>
            </div>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 w-full py-8 shadow-2xl"
              size="lg"
              onClick={() => setTriggerFormStep(1)}
            >
              <div className="flex items-center gap-2">
                <p>Document a new trigger</p>
                <ChevronsRight />
              </div>
            </Button>
          </section>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddTrigger)}
            className="space-y-4"
          >
            {triggerFormStep == 1 && (
              <TriggerEvent
                nextStep={nextStep}
                backStep={backStep}
                form={form}
              />
            )}
            {triggerFormStep == 2 && (
              <FactualDescription
                nextStep={nextStep}
                backStep={backStep}
                form={form}
              />
            )}
            {triggerFormStep == 3 && (
              <EmotionalResponse
                nextStep={nextStep}
                backStep={backStep}
                form={form}
              />
            )}
            {triggerFormStep == 4 && (
              <MeaningAndInterpretation
                nextStep={nextStep}
                backStep={backStep}
                form={form}
              />
            )}
            {triggerFormStep == 5 && (
              <HistoricalConnection
                nextStep={nextStep}
                backStep={backStep}
                form={form}
              />
            )}
            {triggerFormStep == 6 && (
              <NameThisPattern
                nextStep={nextStep}
                backStep={backStep}
                form={form}
                handleAddTrigger={handleAddTrigger}
              />
            )}
            {triggerFormStep == 7 &&
              (isPending ? (
                <section>
                  <Spinner size="medium" />
                  <h1 className="text-3xl font-bold">Submitting...</h1>
                  <p className="text-secondary-foreground">
                    Your trigger is being submitted. Please wait a moment.
                  </p>
                </section>
              ) : error ? (
                <section>
                  <h1 className="text-3xl font-bold">Error</h1>
                  <p className="text-secondary-foreground">
                    There was an error submitting your trigger. Please try
                    again.
                  </p>
                </section>
              ) : (
                <section>
                  <h1 className="text-3xl font-bold">All Done! 🎉</h1>
                  <p className="text-secondary-foreground">
                    You've successfully documented your trigger. This process is
                    a step towards greater self-awareness and emotional
                    understanding.
                  </p>
                  <Button className="mt-4 w-full" variant="default" asChild>
                    <Link
                      to="/triggers/$triggerId"
                      params={{ triggerId: data?.data?.id.toString() }}
                      disabled={!data?.data?.id}
                    >
                      View Trigger
                    </Link>
                  </Button>
                </section>
              ))}
          </form>
        </Form>
      </main>
    </div>
  );
}

const TriggerEvent = ({
  nextStep,
  backStep,
  form,
}: {
  nextStep: () => void;
  backStep: () => void;
  form: UseFormReturn<any>;
}) => {
  const triggerEventValue = form.watch("triggerEvent");

  const isDisabled =
    !triggerEventValue ||
    triggerEventValue.trim() === "" ||
    form.getFieldState("triggerEvent").invalid;

  return (
    <article className="space-y-4 ">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">What triggered you?</h1>
        <p className="text-secondary-foreground">
          Describe the specific event, words, or situation that triggered your
          reaction.
        </p>
      </div>
      <FormField
        control={form.control}
        name="triggerEvent"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe the specific event, words, or situation that triggered your reaction"
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("triggerEvent");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
                    e.preventDefault();
                    form.setValue("triggerEvent", field.value);
                    nextStep();
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <footer className="flex justify-between">
        <Button onClick={backStep} variant="secondary">
          Back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            form.setValue("triggerEvent", form.getValues().triggerEvent);
            nextStep();
          }}
        >
          Next
        </Button>
      </footer>
    </article>
  );
};

const FactualDescription = ({
  nextStep,
  backStep,
  form,
}: {
  nextStep: () => void;
  backStep: () => void;
  form: UseFormReturn<any>;
}) => {
  const factualDescriptionValue = form.watch("factualDescription");
  const isDisabled =
    !factualDescriptionValue ||
    factualDescriptionValue.trim() === "" ||
    form.getFieldState("factualDescription").invalid;
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Just the Facts</h1>
      <p className="text-secondary-foreground">
        Describe what happened objectively, without interpretation or judgment.
      </p>
      <FormField
        control={form.control}
        name="factualDescription"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Describe what happened objectively, without interpretation or judgment"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("factualDescription");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
                    e.preventDefault();
                    form.setValue("factualDescription", field.value);
                    nextStep();
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <footer className="flex justify-between">
        <Button variant="secondary" onClick={backStep}>
          Back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            form.setValue(
              "factualDescription",
              form.getValues().factualDescription
            );
            nextStep();
          }}
        >
          Next
        </Button>
      </footer>
    </article>
  );
};

const EmotionalResponse = ({
  nextStep,
  backStep,
  form,
}: {
  nextStep: () => void;
  backStep: () => void;
  form: UseFormReturn<any>;
}) => {
  const emotionsValue = form.watch("emotions");
  const isDisabled =
    !emotionsValue ||
    emotionsValue.length === 0 ||
    form.getFieldState("emotions").invalid;

  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Emotional Response</h1>
      <p className="text-secondary-foreground">
        What emotions came up? Try to name them specifically (e.g. anger, shame,
        fear).
      </p>
      <FormField
        control={form.control}
        name="emotions"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <EmotionSelector
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  form.trigger("emotions");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <footer className="flex justify-between">
        <Button variant="secondary" onClick={backStep}>
          Back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            form.setValue("emotions", form.getValues().emotions);
            nextStep();
          }}
        >
          Next
        </Button>
      </footer>
    </article>
  );
};

const MeaningAndInterpretation = ({
  nextStep,
  backStep,
  form,
}: {
  nextStep: () => void;
  backStep: () => void;
  form: UseFormReturn<any>;
}) => {
  const meaningValue = form.watch("meaning");
  const isDisabled =
    !meaningValue ||
    meaningValue.trim() === "" ||
    form.getFieldState("meaning").invalid;
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Meaning & Interpretation</h1>
      <p className="text-secondary-foreground">
        What meaning did you attach to this situation? What story did you tell
        yourself?
      </p>
      <FormField
        control={form.control}
        name="meaning"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="What meaning did you attach to this situation? What story did you tell yourself?"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("meaning");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
                    e.preventDefault();
                    form.setValue("meaning", field.value);
                    nextStep();
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <footer className="flex justify-between">
        <Button variant="secondary" onClick={backStep}>
          Back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            form.setValue("meaning", form.getValues().meaning);
            nextStep();
          }}
        >
          Next
        </Button>
      </footer>
    </article>
  );
};

const HistoricalConnection = ({
  nextStep,
  backStep,
  form,
}: {
  nextStep: () => void;
  backStep: () => void;
  form: UseFormReturn<any>;
}) => {
  const pastRelationshipValue = form.watch("pastRelationship");
  const isDisabled =
    !pastRelationshipValue ||
    pastRelationshipValue.trim() === "" ||
    form.getFieldState("pastRelationship").invalid;
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Historical Connection</h1>
      <p className="text-secondary-foreground">
        Does this remind you of past experiences or relationships? How so?
      </p>
      <FormField
        control={form.control}
        name="pastRelationship"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Does this remind you of past experiences or relationships? How so?"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("pastRelationship");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
                    e.preventDefault();
                    form.setValue("pastRelationship", field.value);
                    nextStep();
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <footer className="flex justify-between">
        <Button variant="secondary" onClick={backStep}>
          Back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            form.setValue(
              "pastRelationship",
              form.getValues().pastRelationship
            );
            nextStep();
          }}
        >
          Next
        </Button>
      </footer>
    </article>
  );
};

const NameThisPattern = ({
  nextStep,
  backStep,
  form,
  handleAddTrigger,
}: {
  nextStep: () => void;
  backStep: () => void;
  form: UseFormReturn<any>;
  handleAddTrigger: () => void;
}) => {
  const triggerNameValue = form.watch("triggerName");
  const isDisabled =
    !triggerNameValue ||
    triggerNameValue.trim() === "" ||
    form.getFieldState("triggerName").invalid;
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Name This Pattern</h1>
      <p className="text-secondary-foreground">
        Give this trigger a memorable name to help identify it in the future.
      </p>
      <FormField
        control={form.control}
        name="triggerName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Give this trigger a memorable name to help identify it in the future"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("triggerName");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
                    e.preventDefault();
                    form.setValue("triggerName", field.value);
                    nextStep();
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <footer className="flex justify-between">
        <Button variant="secondary" onClick={backStep}>
          Back
        </Button>
        <Button
          disabled={isDisabled}
          onClick={() => {
            form.setValue("triggerName", form.getValues().triggerName);
            handleAddTrigger();
            nextStep();
          }}
        >
          Submit Trigger
        </Button>
      </footer>
    </article>
  );
};
