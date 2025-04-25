export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return fallback;
  }
};

export const truncateString = (str: string, length: number) => {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + "...";
};
