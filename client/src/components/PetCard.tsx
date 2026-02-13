import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pet } from "@shared/schema";
import { Heart } from "lucide-react";

interface PetCardProps {
  pet: Pet;
  index: number;
}

export function PetCard({ pet, index }: PetCardProps) {
  // Use first letter as fallback
  const initials = pet.name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="p-6 border-0 shadow-soft hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

        <div className="flex items-start justify-between relative z-10">
          <Avatar className="w-16 h-16 border-4 border-white shadow-sm">
            <AvatarImage src={pet.imageUrl || undefined} alt={pet.name} className="object-cover" />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="p-2 rounded-full bg-pink-50 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold font-display text-slate-800">{pet.name}</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {pet.breed || "Best Friend"} • {pet.age ? `${pet.age} months` : "Age unknown"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {pet.weight && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {pet.weight} lbs
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            Healthy
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}
