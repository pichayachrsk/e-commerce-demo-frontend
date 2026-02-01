const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, success: boolean = false) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(success);
    }
  });
  failedQueue = [];
};

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async refreshToken(): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    // Handle 401 Unauthorized - try to refresh token
    if (
      response.status === 401 &&
      !(options as any)._retry &&
      endpoint !== "/auth/refresh" &&
      endpoint !== "/auth/login"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return this.request<T>(endpoint, { ...options, _retry: true } as any);
        });
      }

      isRefreshing = true;

      try {
        await this.refreshToken();
        processQueue(null, true);
        isRefreshing = false;

        return this.request<T>(endpoint, { ...options, _retry: true } as any);
      } catch (error) {
        processQueue(error, false);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
            window.location.href = "/login";
          }
        }
        throw error;
      }
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    // Handle empty response body (e.g., DELETE requests)
    const text = await response.text();
    if (!text) {
      return { data: null } as ApiResponse<T>;
    }

    return JSON.parse(text);
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_BASE_URL);
