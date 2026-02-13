import { useDashboard } from "@/hooks/use-dashboard";
import { PetCard } from "@/components/PetCard";
import { GrowthChart } from "@/components/GrowthChart";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Wallet, Trophy, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="pt-20 text-center">Failed to load dashboard.</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Good morning, {data.user.name || "Friend"}!
          </h1>
          <p className="text-slate-500">Here's how your furry family is doing.</p>
        </div>
        <Link href="/profile">
          <Button className="rounded-full shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Contribution
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Pets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-700">My Pets</h2>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">Manage</Button>
            </Link>
          </div>
          
          {data.pets.length > 0 ? (
            data.pets.map((pet, i) => (
              <PetCard key={pet.id} pet={pet} index={i} />
            ))
          ) : (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 mb-4">No pets added yet.</p>
              <Link href="/profile">
                <Button variant="outline">Add your first pet</Button>
              </Link>
            </div>
          )}

          {/* Engagement Widget */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-orange-900">Daily Streak</h3>
            </div>
            <p className="text-sm text-orange-800 mb-3">
              You've checked in for <span className="font-bold">{data.progress.streakDays || 0} days</span> in a row! Keep it up for special rewards.
            </p>
            <Progress value={(data.progress.streakDays || 0) * 10} className="h-2 bg-orange-200" />
          </motion.div>
        </div>

        {/* Middle & Right Column - Financials */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white rounded-2xl shadow-soft border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-500">Total Savings</span>
              </div>
              <p className="text-3xl font-display font-bold text-slate-900">
                ${(data.financialProfile.totalSavings || 0).toLocaleString()}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white rounded-2xl shadow-soft border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-500">Monthly Goal</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-display font-bold text-slate-900">
                  ${data.financialProfile.monthlyContribution || 0}
                </p>
                <span className="text-sm text-slate-400 mb-1">/ month</span>
              </div>
            </motion.div>
          </div>

          {/* Main Chart */}
          <GrowthChart />

          {/* Profile Completion CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-indigo-900 rounded-3xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Complete your profile</h3>
                <p className="text-indigo-200 mb-4 max-w-md">
                  Add more details about your pets and verify your identity to unlock higher interest rates.
                </p>
                <div className="flex items-center gap-4">
                  <Progress value={data.progress.profileCompletedPercent || 20} className="w-32 h-2 bg-indigo-800" />
                  <span className="text-sm font-medium">{data.progress.profileCompletedPercent}%</span>
                </div>
              </div>
              <Link href="/profile">
                <Button className="bg-white text-indigo-900 hover:bg-indigo-50 border-0">
                  Finish Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen pt-24 px-4 container mx-auto max-w-6xl">
      <div className="flex justify-between mb-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
