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
      <section id="why-skytails" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Why SkyTails?</h2>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-600">Getting started with SkyTails is simple and fast.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Create Account", desc: "Sign up in seconds with just your email and pet's name." },
              { step: "02", title: "Set Your Goal", desc: "Choose a monthly contribution that fits your budget." },
              { step: "03", title: "Watch It Grow", desc: "Your funds are invested in pet-focused growth portfolios." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <span className="text-6xl font-display font-bold text-blue-100 absolute -top-8 -left-4 z-0">{item.step}</span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section id="our-journey" className="py-24 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Our journey</h2>
            <p className="text-lg text-slate-600 mb-4">
              SkyTails started with a simple realization: our pets aren't just animals, they're family. And family deserves financial security.
            </p>
            <p className="text-lg text-slate-600">
              Founded in 2024, we've helped thousands of pet owners build a safety net that ensures their companions get the best care, no matter what life throws their way.
            </p>
          </div>
          <div className="flex-1 rounded-3xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000&auto=format&fit=crop" alt="Pet and owner" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section id="testimonials" className="py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-16">What does our customer say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { quote: "SkyTails gave me peace of mind when Luna needed unexpected surgery. The fund was there when I needed it most.", author: "Sarah M., Dog Mom" },
              { quote: "I love seeing the projected growth for Oliver's future. It's so much more than a savings account.", author: "James R., Cat Dad" }
            ].map((t, i) => (
              <div key={i} className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <p className="text-xl italic mb-6">"{t.quote}"</p>
                <p className="font-bold">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-8">Contact Info</h2>
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-lg text-slate-600">Questions? We're here to help.</p>
            <div className="p-6 bg-white rounded-2xl shadow-sm space-y-2">
              <p className="font-bold text-slate-900">Email: support@skytails.com</p>
              <p className="font-bold text-slate-900">Phone: +1 (555) PET-BOND</p>
              <p className="text-slate-500">123 Furry Friends Lane, Petaluma, CA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
