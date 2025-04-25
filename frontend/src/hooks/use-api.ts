import axios from "axios";
import { UpdateTriggerDto } from "./use-triggers";

interface PostHeaders {
  Authorization: string;
  "content-type": "application/json";
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const get = async (authToken: string, uri: string) => {
  try {
    const response = await axios.get(API_URL + uri, {
      headers: {
        Authorization: `Bearer: ${authToken}`,
      },
    });

    return response;
  } catch (error: any) {
    throw error;
  }
};

const post = async (authToken: string, uri: string, data?: any | FormData) => {
  try {
    let headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(API_URL + uri, data || "", {
      headers,
    });

    return response;
  } catch (error: any) {
    throw error;
  }
};

const del = async (authToken: string, uri: string) => {
  try {
    const response = await axios.delete(API_URL + uri, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

const patch = async (
  authToken: string,
  uri: string,
  data?: string | UpdateTriggerDto
) => {
  let headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  } as Partial<PostHeaders>;
  const res = await axios.patch(API_URL + uri, {
    method: "PATCH",
    body: data || "",
    headers,
  });
  return res;
};

export const useApi = () => {
  const token = ""; // TODO: Apply when needed
  return {
    get: async (url: string) => get(token, url),
    post: async (url: string, data?: any | FormData) => post(token, url, data),
    del: async (url: string) => del(token, url),
    patch: async (url: string, data?: any | FormData) =>
      patch(token, url, data),
  };
};
