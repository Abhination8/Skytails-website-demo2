import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useCreatePet, useUpdatePet } from "@/hooks/use-pets";
import { useUpdateFinancials } from "@/hooks/use-financials";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPetSchema, insertFinancialProfileSchema } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, CheckCircle2 } from "lucide-react";
import { z } from "zod";

export default function Profile() {
  const { data, isLoading } = useQuery({
    queryKey: [api.dashboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.get.path);
      if (!res.ok) throw new Error("Failed");
      return await res.json();
    }
  });

  if (isLoading || !data) return null; // Or skeleton

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Settings & Profile</h1>
        <p className="text-slate-500">Manage your account, pets, and financial goals.</p>
      </div>

      <Tabs defaultValue="pets" className="w-full">
        <TabsList className="mb-8 p-1 bg-slate-100 rounded-full w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="pets" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">My Pets</TabsTrigger>
          <TabsTrigger value="financials" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Financials</TabsTrigger>
          <TabsTrigger value="identity" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Identity</TabsTrigger>
        </TabsList>

        <TabsContent value="pets" className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {data.pets.map((pet: any) => (
              <Card key={pet.id} className="overflow-hidden border-slate-100 shadow-soft">
                <div className="p-6 flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="w-16 h-16 rounded-xl">
                      <AvatarImage src={pet.imageUrl} />
                      <AvatarFallback className="rounded-xl">{pet.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{pet.name}</h3>
                      <p className="text-sm text-muted-foreground">{pet.breed}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary" className="text-xs">{pet.age} months</Badge>
                      </div>
                    </div>
                  </div>
                  <EditPetDialog pet={pet} />
                </div>
              </Card>
            ))}
            
            <Dialog>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-slate-200 shadow-none hover:border-primary/50 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center min-h-[140px]">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-slate-600">Add another pet</p>
                  </div>
                </Card>
              </DialogTrigger>
              <AddPetDialogContent userId={data.user.id} />
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="financials">
          <FinancialSettings profile={data.financialProfile} />
        </TabsContent>

        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>We need to verify your identity to process withdrawals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-green-50 text-green-700 rounded-xl mb-6">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-bold">Email Verified</p>
                  <p className="text-sm opacity-90">Your account is secure.</p>
                </div>
              </div>
              
              <div className="space-y-4 opacity-50 pointer-events-none">
                <div className="space-y-2">
                  <Label>Government ID Upload</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                    <p>Drag and drop your ID here (Mock disabled)</p>
                  </div>
                </div>
                <Button disabled>Submit for Verification</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddPetDialogContent({ userId }: { userId: number }) {
  const createPet = useCreatePet();
  const form = useForm<z.infer<typeof insertPetSchema>>({
    resolver: zodResolver(insertPetSchema),
    defaultValues: { userId, name: "", breed: "", age: 0, weight: 0 }
  });

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add a new furry friend</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(data => createPet.mutate(data))} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...form.register("name")} placeholder="Buddy" />
          </div>
          <div className="space-y-2">
            <Label>Breed</Label>
            <Input {...form.register("breed")} placeholder="Golden Retriever" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Age (months)</Label>
            <Input type="number" {...form.register("age", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Weight (lbs)</Label>
            <Input type="number" {...form.register("weight", { valueAsNumber: true })} />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={createPet.isPending}>
          {createPet.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
          Save Pet
        </Button>
      </form>
    </DialogContent>
  );
}

function EditPetDialog({ pet }: { pet: any }) {
  const updatePet = useUpdatePet();
  const form = useForm({
    resolver: zodResolver(insertPetSchema.partial()),
    defaultValues: { ...pet }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Edit2 className="w-4 h-4 text-slate-400" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {pet.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(data => updatePet.mutate({ id: pet.id, ...data }))} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Health Notes</Label>
            <Input {...form.register("healthNotes")} placeholder="Allergies, vaccines..." />
          </div>
          <div className="space-y-2">
            <Label>Weight (lbs)</Label>
            <Input type="number" {...form.register("weight", { valueAsNumber: true })} />
          </div>
          <Button type="submit" className="w-full" disabled={updatePet.isPending}>
            Update Pet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FinancialSettings({ profile }: { profile: any }) {
  const updateFinancials = useUpdateFinancials();
  const [contribution, setContribution] = useState(profile.monthlyContribution || 50);

  return (
    <Card className="shadow-soft border-slate-100">
      <CardHeader>
        <CardTitle>Investment Goals</CardTitle>
        <CardDescription>Adjust how much you want to save monthly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Monthly Contribution</Label>
            <span className="text-2xl font-bold text-primary">${contribution}</span>
          </div>
          <Slider 
            value={[contribution]} 
            onValueChange={([v]) => setContribution(v)} 
            max={1000} 
            step={10} 
            className="py-4"
          />
          <p className="text-sm text-muted-foreground">
            Projected 5-year growth: <span className="font-bold text-green-600">${(contribution * 12 * 5 * 1.07).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> (at 7% return)
          </p>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={() => updateFinancials.mutate({ monthlyContribution: contribution })}
            disabled={updateFinancials.isPending}
            className="w-full"
          >
            {updateFinancials.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
