import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Heart, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen pt-16 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left z-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100">
            For the ones who love us unconditionally
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
            Secure their future, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              one treat at a time.
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            PetWealth helps you save and invest for your pet's health, happiness, and unexpected vet bills. Start a fund that grows with them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all">
                Start Saving Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="rounded-full px-8 h-14 text-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              How it works
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
          
          {/* Main Image */}
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50 rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* dog looking up emotional */}
            <img 
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop" 
              alt="Happy golden retriever" 
              className="w-full h-auto object-cover"
            />
            
            {/* Floating widget card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Monthly Contribution</p>
                <p className="text-xl font-bold text-slate-900">+$150.00</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Why PetWealth?</h2>
            <p className="text-lg text-slate-600">We're more than just a savings account. We're a comprehensive financial safety net for your furry family members.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Emergency Fund", 
                desc: "Be ready for unexpected vet visits without breaking the bank.",
                color: "text-blue-600 bg-blue-50" 
              },
              { 
                icon: TrendingUp, 
                title: "Smart Investing", 
                desc: "Grow your contributions with low-risk portfolios tailored for pet care.",
                color: "text-green-600 bg-green-50" 
              },
              { 
                icon: Heart, 
                title: "Pet Perks", 
                desc: "Unlock discounts on food, toys, and insurance as your savings grow.",
                color: "text-pink-600 bg-pink-50" 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
