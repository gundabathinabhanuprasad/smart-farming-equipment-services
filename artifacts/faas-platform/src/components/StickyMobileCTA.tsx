import { Button } from "@/components/ui/button";
import { CalendarClock, Phone } from "lucide-react";

interface StickyMobileCTAProps {
  onBookNow: () => void;
}

export function StickyMobileCTA({ onBookNow }: StickyMobileCTAProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-3 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 h-12 text-foreground border-border" 
          asChild
        >
          <a href="tel:+911800123456">
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </a>
        </Button>
        <Button 
          className="flex-1 h-12 shadow-md" 
          onClick={onBookNow}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Book Now
        </Button>
      </div>
    </div>
  );
}
