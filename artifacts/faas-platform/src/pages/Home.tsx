import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { EquipmentSection } from "@/components/EquipmentSection";
import { AIInsightsSection } from "@/components/AIInsightsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { OperatorsSection } from "@/components/OperatorsSection";
import { RevenueModelSection } from "@/components/RevenueModelSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { BookingDialog } from "@/components/BookingDialog";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<number | undefined>(undefined);

  const handleOpenBooking = (equipmentId?: number) => {
    setSelectedEquipment(equipmentId);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar onBookNow={() => handleOpenBooking()} />
      
      <main className="flex-1">
        <HeroSection onBookNow={() => handleOpenBooking()} />
        <StatsBar />
        <EquipmentSection onBookNow={handleOpenBooking} />
        <WhyChooseUs />
        <AIInsightsSection />
        <TestimonialsSection />
        <OperatorsSection />
        <RevenueModelSection />
        <ContactSection />
      </main>

      <Footer />
      <StickyMobileCTA onBookNow={() => handleOpenBooking()} />

      <BookingDialog 
        open={isBookingOpen} 
        onOpenChange={setIsBookingOpen} 
        defaultEquipmentId={selectedEquipment}
      />
    </div>
  );
}
