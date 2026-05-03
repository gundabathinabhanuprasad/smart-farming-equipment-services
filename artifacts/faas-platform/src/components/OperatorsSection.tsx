import React from "react";
import { motion } from "framer-motion";
import { useListOperators } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, MapPin, Star, ShieldCheck, Tractor } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import operator1Img from "@/assets/images/operator-1.png";

export function OperatorsSection() {
  const { data: operators, isLoading } = useListOperators();

  return (
    <section id="operators" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Verified Local Operators
            </h2>
            <p className="text-muted-foreground text-lg">
              Our operators are skilled professionals from your own region, ensuring reliable service and zero language barriers.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-2xl p-6 bg-card flex flex-col items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {operators?.map((operator, index) => (
              <motion.div
                key={operator.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card border rounded-2xl p-6 text-center flex flex-col items-center hover:shadow-lg transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3">
                  <Badge variant={operator.available ? "default" : "secondary"} className={operator.available ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                    {operator.available ? "Available" : "Busy"}
                  </Badge>
                </div>
                
                <div className="relative mb-4 mt-2">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                    <AvatarImage src={operator.avatarUrl || operator1Img} alt={operator.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {operator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1">{operator.name}</h3>
                
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {operator.village}, {operator.district}
                </div>

                <div className="flex gap-4 mb-6 w-full justify-center text-sm">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-amber-500 font-bold mb-1">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      {operator.rating.toFixed(1)}
                    </div>
                    <span className="text-xs text-muted-foreground">Rating</span>
                  </div>
                  <div className="w-px bg-border"></div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-foreground font-bold mb-1">
                      <Tractor className="h-4 w-4 mr-1 text-primary" />
                      {operator.equipmentCount}
                    </div>
                    <span className="text-xs text-muted-foreground">Machines</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <a href={`tel:${operator.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Operator
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
