import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./use-api";
import { queryClient } from "@/routes/__root";
import { toast } from "sonner";
import { safeJsonParse } from "@/helpers/parse";

interface TriggerApiResponse {
  id: number;
  trigger_event: string;
  factual_description: string;
  emotions: string;
  meaning: string;
  past_relationship: string;
  trigger_name: string;
  created_at: string;
  updated_at: string;
}

export interface TriggerEvent {
  id: number;
  triggerEvent: string;
  factualDescription: string;
  emotions: string[];
  meaning: string;
  pastRelationship: string;
  triggerName: string;
  createdAt: string;
  updatedAt: string;
}

interface AddTriggerDto {
  triggerEvent: string;
  factualDescription: string;
  emotions: string[];
  meaning: string;
  pastRelationship: string;
  triggerName: string;
}

export const useTriggers = () => {
  const { get } = useApi();
  return useQuery<TriggerEvent[]>({
    queryKey: ["triggers"],
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await get("/triggers");

      return response.data.map((item: TriggerApiResponse) => ({
        id: item.id,
        triggerEvent: item.trigger_event,
        factualDescription: item.factual_description,
        emotions: safeJsonParse(item.emotions, []),
        meaning: item.meaning,
        pastRelationship: item.past_relationship,
        triggerName: item.trigger_name,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    },
  });
};

export const useAddTrigger = () => {
  const { post } = useApi();
  return useMutation({
    mutationFn: async (trigger: AddTriggerDto) => {
      return await post("/triggers", trigger);
    },
    onSuccess: async () => {
      toast("New Trigger Added", {
        icon: "🧘‍♂️",
        description: "One step closer to emotional clarity.",
        duration: 3000,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["triggers"] });
    },
  });
};

export const useDeleteTrigger = () => {
  const { del } = useApi();
  return useMutation({
    mutationFn: async (triggerId: number) => {
      return await del(`/triggers/${triggerId}`);
    },
    onSuccess: async () => {
      toast("Trigger Deleted", {
        icon: "🗑️",
        description: "Healing is a process, not a destination.",
        duration: 3000,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["triggers"] });
    },
  });
};

export const useTriggerById = (triggerId: string) => {
  const { get } = useApi();
  return useQuery<TriggerEvent>({
    queryKey: ["triggers", triggerId],
    queryFn: async () => {
      const response = await get(`/triggers/${triggerId}`);
      const item = response.data;
      return {
        id: item.id,
        triggerEvent: item.trigger_event,
        factualDescription: item.factual_description,
        emotions: safeJsonParse(item.emotions, []),
        meaning: item.meaning,
        pastRelationship: item.past_relationship,
        triggerName: item.trigger_name,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    },
  });
};
