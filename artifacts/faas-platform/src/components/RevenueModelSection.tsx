import React from "react";
import { motion } from "framer-motion";
import { Wallet, Landmark, TrendingUp, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RevenueModelSection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm font-medium mb-6">
              For Equipment Owners
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              Turn Your Idle Tractor Into a Profit Center
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 leading-relaxed">
              Don't let your expensive machinery gather dust during off-seasons. Join the KhetBook network and start earning passive income by renting to verified local farmers.
            </p>

            <ul className="space-y-5 mb-10">
              {[
                { title: "Guaranteed Payments", desc: "No more chasing dues. Get paid directly into your bank account within 24 hours.", icon: Wallet },
                { title: "Insurance Cover", desc: "Every booking is covered by our comprehensive machinery insurance policy.", icon: Landmark },
                { title: "Full Control", desc: "You decide when your equipment is available and who operates it.", icon: HandCoins }
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className="bg-accent/20 p-2 rounded-lg mr-4 mt-1">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{feature.title}</h4>
                    <p className="text-primary-foreground/70">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-primary font-bold">
              List Your Equipment
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background rounded-3xl p-8 md:p-10 shadow-2xl border border-border/50 text-foreground relative"
          >
            <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground w-24 h-24 rounded-full flex items-center justify-center font-bold text-xl rotate-12 shadow-lg border-4 border-background">
              Fair Split
            </div>
            
            <h3 className="text-2xl font-bold mb-8 text-center border-b pb-6">Transparent Revenue Model</h3>
            
            <div className="flex flex-col gap-6">
              {/* Owner Share */}
              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="font-bold text-xl text-primary">70%</div>
                    <div className="text-sm font-medium text-muted-foreground">Goes to Equipment Owner</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Includes Operator fee</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
              </div>

              {/* Platform Share */}
              <div className="relative mt-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="font-bold text-xl text-secondary">30%</div>
                    <div className="text-sm font-medium text-muted-foreground">Platform Fee</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "30%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="bg-secondary h-full rounded-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-muted/50 rounded-xl p-4 text-sm text-center text-muted-foreground">
              <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
              Our 30% covers insurance, platform maintenance, AI insights generation, and customer support.
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
