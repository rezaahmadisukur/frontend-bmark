import { type ReactNode } from "react";

interface ActivityProps {
  mode: "visible" | "hidden";
  children: ReactNode;
}

export const Activity = ({ mode, children }: ActivityProps) => {
  if (mode === "hidden") return null;

  return <>{children}</>;
};
