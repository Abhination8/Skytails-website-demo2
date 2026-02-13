import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type DashboardDataResponse } from "@shared/routes";
import { type UpdateFinancialProfileRequest, type FinancialProfile } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

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

export function useUpdateFinancials() {
  return useMutation({
    mutationFn: async (updates: UpdateFinancialProfileRequest) => {
      const res = await apiRequest("PUT", api.financials.update.path, updates);
      return res.json() as Promise<FinancialProfile>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
    },
  });
}
