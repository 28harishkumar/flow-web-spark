
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

interface ApiError {
  status: number;
  message: string;
  data: unknown;
}

export class ApiService {
  protected client: AxiosInstance;
  protected mockEnabled: boolean;
  protected useMockFallback: boolean;

  constructor() {
    const token = localStorage.getItem("user_token");
    const isLocalhost = window.location.origin.startsWith("http://localhost");
    this.mockEnabled =
      !isLocalhost || import.meta.env.VITE_APP_MOCK_ENABLED === "true";
    this.useMockFallback = import.meta.env.VITE_USE_MOCK_FALLBACK === "true";
    
    this.client = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Token ${token}` : undefined,
      },
    });

    this.client.interceptors.request.use((config) => {
      if (import.meta.env.DEV) {
        config.headers["X-Requested-With"] = "XMLHttpRequest";
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              console.error("Authentication failed");
              break;
            case 403:
              console.error("Access forbidden");
              break;
            case 404:
              console.error("Resource not found");
              break;
            case 500:
              console.error("Server error");
              break;
            default:
              console.error("API error:", error.message);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  protected async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    // Use mock data if explicitly enabled
    if (this.mockEnabled) {
      return this.handleMockRequest<T>(method, endpoint, data);
    }

    try {
      // Try real API request first
      const response = await this.client({
        method,
        url: endpoint,
        data,
      });
      return response.data;
    } catch (error) {
      // If real API fails and mock fallback is enabled, try mock data
      if (this.useMockFallback) {
        console.warn("API request failed, using mock fallback data", error);
        return this.handleMockRequest<T>(method, endpoint, data);
      }
      throw this.handleError(error as AxiosError);
    }
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        status: error.response.status,
        message:
          (error.response.data as { message?: string })?.message ||
          "An error occurred",
        data: error.response.data,
      };
    }
    return {
      status: 500,
      message: "Network error",
      data: null,
    };
  }

  protected handleMockRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    // Mock data handling will be implemented in respective services
    console.log("Using mock data for:", method, endpoint, data);
    return Promise.resolve({} as T);
  }
}
