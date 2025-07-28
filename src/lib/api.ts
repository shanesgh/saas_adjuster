const API_BASE = import.meta.env.DEV
  ? "http://localhost:8888/api" // Add /api prefix here
  : "http://localhost:8888/api";

import { useAuth } from "@clerk/clerk-react";
// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

// Generic request function
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const { getToken } = useAuth();
  const token = await getToken(); // However you get your token

  headers.Authorization = `Bearer ${token}`;

  console.log("🚀 Making request to:", url);
  console.log("📝 Headers:", headers);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("📡 Response status:", response.status);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Response data:", data);
    return data;
  } catch (error) {
    console.error("❌ Request failed:", error);
    throw error;
  }
};


// Claims functions
export const getClaims = () => {
  return request<any[]>("/claims");
};

export const getClaim = (id: string) => {
  return request<any>(`/claims/${id}`);
};

export const createClaim = (data: any) => {
  return request<any>("/claims", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateClaim = (id: string, data: any) => {
  return request<any>(`/claims/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateClaimStatus = (
  id: string,
  status: string,
  reason?: string
) => {
  return request<any>(`/claims/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      reason: reason || undefined,
    }),
  });
};


export const getReports = () => {
  return request<any[]>("/reports");
};

export const generateReport = (claimId: string, pdfData: string) => {
  return request<any>(`/reports/generate/${claimId}`, {
    method: "POST",
    body: JSON.stringify({ pdfData }),
  });
};

export const downloadReport = (reportId: string) => {
  return fetch(`${API_BASE}/reports/${reportId}/download`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const generatePin = (data: {
  firstName: string;
  lastName: string;
  role: string;
  userId: string;
}) => {
  return request<{ success: boolean; pin: string }>("/users/generate-pin", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const createCompany = (data: any, userId: string) => {
  const payload = {
    ...data,
    userId,
  };
  return request<any>("/company", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Health check function for testing
export const healthCheck = () => {
  return request<{ status: string; timestamp: string }>("/health").catch(() => {
    return fetch(`${API_BASE.replace("/api", "")}/health`).then((res) =>
      res.json()
    );
  });
};

// Convenience object for backward compatibility
export const apiClient = {
  setToken: setAuthToken,
  clearToken: clearAuthToken,
  createCompany,
  getClaims,
  getClaim,
  createClaim,
  updateClaim,
  updateClaimStatus,
  getReports,
  generateReport,
  downloadReport,
  healthCheck,
};
