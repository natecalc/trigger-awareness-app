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

type StorageType = "session" | "local";

export const useStorage = () => {
  const isBrowser = typeof window !== "undefined";

  const getItem = (key: string, type: StorageType = "local"): string | null => {
    if (!isBrowser) return null;

    return type === "local"
      ? localStorage.getItem(key)
      : sessionStorage.getItem(key);
  };

  const setItem = (
    key: string,
    value: string,
    type: StorageType = "local"
  ): void => {
    if (!isBrowser) return;

    if (type === "local") localStorage.setItem(key, value);
    if (type === "session") sessionStorage.setItem(key, value);
  };

  const removeItem = (key: string, type: StorageType = "local"): void => {
    if (!isBrowser) return;
    if (type === "local") localStorage.removeItem(key);
    if (type === "session") sessionStorage.removeItem(key);
  };

  const clearStorage = (type: StorageType = "local"): void => {
    if (!isBrowser) return;
    if (type === "local") localStorage.clear();
    if (type === "session") sessionStorage.clear();
  };

  return {
    getItem,
    setItem,
    clearStorage,
    removeItem,
  };
};
