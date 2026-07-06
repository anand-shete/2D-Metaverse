import React, { createContext, useContext } from "react";

export interface User {
  id: string;
  username: string;
  avatar: string;
}

interface IUserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export const UserContext = createContext<IUserContext | null>(null);

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used inside UserProvider");

  return ctx;
}
