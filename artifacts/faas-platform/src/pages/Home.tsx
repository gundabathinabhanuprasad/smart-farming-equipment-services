import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { DriverSection } from "@/components/DriverSection";
import { DriverBookingDialog } from "@/components/DriverBookingDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X } from "lucide-react";

interface Driver {
  id: number;
  userName: string | null;
  userPhone: string | null;
  experience: number;
  pricePerHour: number;
  available: boolean;
  village: string | null;
  district: string | null;
  rating: number;
  totalBookings: number;
  bio: string | null;
}

export default function Home() {
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<number | undefined>(undefined);
  const [isDriverBookingOpen, setIsDriverBookingOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");

  const handleOpenBooking = (equipmentId?: number) => {
    setSelectedEquipment(equipmentId);
    setIsBookingOpen(true);
  };

  const handleOpenDriverBooking = (driver?: Driver) => {
    setSelectedDriver(driver?.id ? driver : undefined);
    setIsDriverBookingOpen(true);
  };

  const applyLocationFilter = () => setAppliedFilter(locationFilter.trim());
  const clearFilter = () => { setLocationFilter(""); setAppliedFilter(""); };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar onBookNow={() => handleOpenBooking()} />

      <main className="flex-1">
        <HeroSection onBookNow={() => handleOpenBooking()} />
        <StatsBar />

        {/* Location Filter Bar */}
        <div className="bg-card border-b py-4 sticky top-16 z-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by village or district (e.g. Palwal)"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && applyLocationFilter()}
                  className="pl-9"
                />
                {locationFilter && (
                  <button onClick={clearFilter} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button onClick={applyLocationFilter} variant="default" size="sm" className="gap-1.5">
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
            {appliedFilter && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing results near: <span className="font-medium text-foreground">{appliedFilter}</span>
                <button onClick={clearFilter} className="ml-2 text-primary hover:underline text-xs">Clear</button>
              </p>
            )}
          </div>
        </div>

        <EquipmentSection onBookNow={handleOpenBooking} locationFilter={appliedFilter} />
        <DriverSection onBookDriver={handleOpenDriverBooking} locationFilter={appliedFilter} />
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

      <DriverBookingDialog
        open={isDriverBookingOpen}
        onOpenChange={setIsDriverBookingOpen}
        defaultDriver={selectedDriver}
      />

      {/* Dashboard quick-access for logged-in users */}
      {user && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
          <Button
            size="sm"
            className="shadow-lg"
            onClick={() => {
              if (user.role === "admin") window.location.href = "/admin";
              else if (user.role === "owner") window.location.href = "/owner";
              else if (user.role === "driver") window.location.href = "/driver";
            }}
          >
            My Dashboard →
          </Button>
        </div>
      )}
    </div>
  );
}
