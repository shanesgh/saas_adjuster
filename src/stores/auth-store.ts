import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

export type UserRole = "user" | "admin" | "ceo";

export interface User {
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  failedAttempts: number;
  lastAttemptTime: number | null;

  login: (email: string) => Promise<void>;
  logout: () => void;
  verifyToken: (token: string) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

const PREDEFINED_USERS: Record<string, User> = {
  "shane.marchan@gmail.com": { email: "shane.marchan@gmail.com", role: "ceo" },
};

const tokenSchema = z.string().min(32);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      failedAttempts: 0,
      lastAttemptTime: null,

      login: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          const { failedAttempts, lastAttemptTime } = get();
          const now = Date.now();

          if (
            failedAttempts >= 5 &&
            lastAttemptTime &&
            now - lastAttemptTime < 15 * 60 * 1000
          ) {
            throw new Error(
              "Too many failed attempts. Please try again later."
            );
          }

          const validatedEmail = z.string().email().parse(email);
          const user = PREDEFINED_USERS[validatedEmail];

          if (!user) {
            set({
              failedAttempts: failedAttempts + 1,
              lastAttemptTime: now,
              error: "Invalid email. Please try again.",
              isLoading: false,
            });
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 1500));

          const token = Array.from({ length: 32 }, () =>
            Math.floor(Math.random() * 36).toString(36)
          ).join("");

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            failedAttempts: 0,
            lastAttemptTime: null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      verifyToken: async (token: string) => {
        try {
          tokenSchema.parse(token);
          return token === get().token;
        } catch (error) {
          return false;
        }
      },

      initializeAuth: async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const { token } = get();
        if (token) {
          set({ isAuthenticated: true });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
