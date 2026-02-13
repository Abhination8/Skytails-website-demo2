import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/use-dashboard";

export function GrowthChart() {
  const { data } = useDashboard();
  
  if (!data) return null;

  const monthly = data.financialProfile.monthlyContribution || 50;
  const initial = data.financialProfile.totalSavings || 0;
  const annualReturn = 0.07; // 7% expected return
  
  const chartData = Array.from({ length: 11 }, (_, i) => {
    const year = i;
    const months = year * 12;
    const ratePerMonth = annualReturn / 12;
    // Future value of a series
    const total = initial * Math.pow(1 + ratePerMonth, months) + 
                  monthly * ((Math.pow(1 + ratePerMonth, months) - 1) / ratePerMonth);
    
    return {
      year: `Year ${year}`,
      value: Math.round(total)
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-soft overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-display font-bold text-slate-900">Projected Growth</CardTitle>
              <p className="text-xs text-slate-500">Based on ${monthly}/mo at 7% expected annual return</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">10 Year Target</p>
              <p className="text-xl font-display font-bold text-green-600">
                ${chartData[10].value.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] p-0 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                tickFormatter={(val) => `$${val.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '1rem'
                }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'Projected Savings']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
