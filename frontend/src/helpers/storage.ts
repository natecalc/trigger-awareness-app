import { TriggerEventDto } from "@/hooks/use-triggers";

export const saveFormData = ({
  step,
  formData,
}: {
  step: string;
  formData: Partial<TriggerEventDto>;
}) => {
  const savedData = JSON.parse(localStorage.getItem("multistepForm") || "{}");
  savedData[step] = formData;
  localStorage.setItem("multistepForm", JSON.stringify(savedData));
};

export const loadFormData = (step: string): Partial<TriggerEventDto> => {
  const savedData = JSON.parse(localStorage.getItem("multistepForm") || "{}");
  return savedData[step] || {};
};

export const clearFormData = () => {
  localStorage.removeItem("multistepForm");
};
