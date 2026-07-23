import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const qc = useQueryClient();
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    qc.clear();
    window.location.href = "/login";
  };
}
