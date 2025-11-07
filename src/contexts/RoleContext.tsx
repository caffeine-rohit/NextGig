// src/contexts/RoleContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "candidate" | "employer";

const RoleContext = createContext<{ role: Role; setRole: (r: Role) => void } | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const initial = (localStorage.getItem("nextgig_role") as Role) || "candidate";
  const [role, setRoleState] = useState<Role>(initial);
  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem("nextgig_role", r);
  };
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
};
