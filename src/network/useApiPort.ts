import { API_ROUTES } from "./apiRoutes";
import { apiClient } from "./index";

interface BetterwayApiCall {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: keyof typeof API_ROUTES | string;
  body?: any;
  query?: Record<string, any>;
  auth?: string | null;
}

interface UseApiPortArgs {
  intent: string;
  port: Promise<any>;
  success?: (res: any) => void;
  failure?: (err: any) => void;
  print?: "all" | "none" | "error";
}

export const betterwayApiCall = ({
  method,
  url,
  body,
  query,
  auth,
}: BetterwayApiCall) => {
  const endpoint = API_ROUTES[url as keyof typeof API_ROUTES] || url;

  // Check if body is FormData
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {};
  
  if (auth) {
    headers.Authorization = `Bearer ${auth}`;
  }
  
  if (isFormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  return apiClient.request({
    method,
    url: endpoint,
    params: query,
    data: body,
    headers,
  });
};

export const useApiPort =
  ({ intent, port, success, failure, print = "all" }: UseApiPortArgs) =>
    async () => {
      try {
        const response = await port;
        if (print === "all") {
          console.log(`[${intent}] ✅ Success:`, response.data);
        }
        success?.(response.data);
      } catch (err: any) {
        if (print !== "none") {
          console.error(`[${intent}] ❌ Failure:`, err?.response || err);
        }
        failure?.(err);
      }
    };
