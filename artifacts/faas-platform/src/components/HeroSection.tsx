import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetPlatformStats } from "@workspace/api-client-react";
import heroImage from "@/assets/images/hero-tractor.png";
import { Phone, CalendarClock } from "lucide-react";

interface HeroSectionProps {
  onBookNow: () => void;
}

export function HeroSection({ onBookNow }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30 z-10" />
        <img
          src={heroImage}
          alt="Tractor in a field"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      <div className="container relative z-20 px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="max-w-[800px] flex flex-col items-start gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Farming as a Service
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
              Book Farm Equipment <br className="hidden md:block" />
              <span className="text-primary">in Minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Access high-quality tractors, harvesters, and implements on-demand. 
              Verified local operators, fair hourly pricing, and instant availability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" className="h-14 px-8 text-base shadow-lg" onClick={onBookNow}>
              <CalendarClock className="mr-2 h-5 w-5" />
              Book Equipment
            </Button>
            <Button size="lg" variant="secondary" className="h-14 px-8 text-base" asChild>
              <a href="tel:+918000000000">
                <Phone className="mr-2 h-5 w-5" />
                Call Operator
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
