import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type UpdateFinancialProfileRequest } from "@shared/routes";

export function useUpdateFinancials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFinancialProfileRequest) => {
      const res = await fetch(api.financials.update.path, {
        method: api.financials.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to update financials");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
    },
  });
}
