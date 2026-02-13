import { useQuery } from "@tanstack/react-query";
import { api, type DashboardDataResponse } from "@shared/routes";

export function useDashboard() {
  return useQuery<DashboardDataResponse>({
    queryKey: [api.dashboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.get.path);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return await res.json();
    },
  });
}
