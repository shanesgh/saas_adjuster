import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: "owner" | "adjuster" | "clerical";
  company: string;
  pin: string;
  pinExpiry: number;
  pinAttempts: number;
  pinLockout: number | null;
  isRegistered: boolean;
}

interface UserStore {
  users: User[];
  addUser: (
    user: Omit<User, "id" | "pinAttempts" | "pinLockout" | "isRegistered">
  ) => void;
  removeUser: (id: string) => void;
  findUser: (
    firstName: string,
    lastName: string,
    company: string
  ) => User | undefined;
  validatePin: (userId: string, pin: string) => boolean;
  markUserRegistered: (userId: string) => void;
  incrementPinAttempts: (userId: string) => void;
}

const generateMixedCasePIN = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let pin = "";
  for (let i = 0; i < 8; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)];
  }
  return pin;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          pin: generateMixedCasePIN(),
          pinExpiry: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
          pinAttempts: 0,
          pinLockout: null,
          isRegistered: false,
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      removeUser: (id) => {
        set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
      },

      findUser: (firstName, lastName, company) => {
        return get().users.find(
          (u) =>
            u.firstName.toLowerCase() === firstName.toLowerCase() &&
            u.lastName.toLowerCase() === lastName.toLowerCase() &&
            u.company === company
        );
      },

      validatePin: (userId, pin) => {
        const users = get().users;
        const user = users.find((u) => u.id === userId);
        if (!user) return false;

        // Check lockout
        if (user.pinLockout && user.pinLockout > Date.now()) return false;

        // Check expiry
        if (user.pinExpiry < Date.now()) return false;

        // Check attempts
        if (user.pinAttempts >= 3) return false;

        if (user.pin !== pin) {
          get().incrementPinAttempts(userId);
          return false;
        }

        return true;
      },

      markUserRegistered: (userId) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, isRegistered: true, pin: "" } : u
          ),
        }));
      },

      incrementPinAttempts: (userId) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  pinAttempts: u.pinAttempts + 1,
                  pinLockout:
                    u.pinAttempts + 1 >= 3
                      ? Date.now() + 30 * 60 * 1000
                      : u.pinLockout,
                }
              : u
          ),
        }));
      },
    }),
    {
      name: "user-storage",
    }
  )
);
