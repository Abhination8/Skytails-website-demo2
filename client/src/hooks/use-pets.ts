import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CreatePetRequest, type UpdatePetRequest } from "@shared/schema";

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePetRequest) => {
      const res = await fetch(api.pets.create.path, {
        method: api.pets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) throw new Error("Validation failed");
        throw new Error("Failed to create pet");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & UpdatePetRequest) => {
      const url = buildUrl(api.pets.update.path, { id });
      const res = await fetch(url, {
        method: api.pets.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Pet not found");
        throw new Error("Failed to update pet");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
    },
  });
}
