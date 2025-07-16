const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:8788/api' 
  : 'https://your-pages-domain.pages.dev/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Users
  async generatePin(userId: string) {
    return this.request<{ pin: string; expiresAt: string }>('/users/generate-pin', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async validatePin(userId: string, pin: string) {
    return this.request<{ valid: boolean; error?: string }>('/users/validate-pin', {
      method: 'POST',
      body: JSON.stringify({ userId, pin }),
    });
  }

  async getUserProfile() {
    return this.request<any>('/users/profile');
  }

  // Claims
  async getClaims() {
    return this.request<any[]>('/claims');
  }

  async getClaim(id: string) {
    return this.request<any>(`/claims/${id}`);
  }

  async createClaim(data: any) {
    return this.request<any>('/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClaim(id: string, data: any) {
    return this.request<any>(`/claims/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Notes
  async createNote(data: { claimId: string; section: string; content: string }) {
    return this.request<any>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNoteHistory(claimId: string, section: string) {
    return this.request<any[]>(`/notes/${claimId}/${section}/history`);
  }

  // Reports
  async getReports() {
    return this.request<any[]>('/reports');
  }

  async generateReport(claimId: string) {
    return this.request<any>(`/reports/generate/${claimId}`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient(API_BASE);