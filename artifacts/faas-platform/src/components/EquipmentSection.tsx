import { motion } from "framer-motion";
import { useListEquipment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, User, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import rotavatorImg from "@/assets/images/rotavator.png";
import harvesterImg from "@/assets/images/harvester.png";
import seedDrillImg from "@/assets/images/seed-drill.png";
import cultivatorImg from "@/assets/images/cultivator.png";
import sprayerImg from "@/assets/images/sprayer.png";
import tractorImg from "@/assets/images/hero-tractor.png";

// Fallback image map
const imageMap: Record<string, string> = {
  rotavator: rotavatorImg,
  harvester: harvesterImg,
  "seed drill": seedDrillImg,
  cultivator: cultivatorImg,
  sprayer: sprayerImg,
  tractor: tractorImg,
};

function getEquipmentImage(name: string, imageUrl: string | null) {
  if (imageUrl && imageUrl.startsWith("http")) return imageUrl;
  const lowercaseName = name.toLowerCase();
  for (const key of Object.keys(imageMap)) {
    if (lowercaseName.includes(key)) {
      return imageMap[key];
    }
  }
  return tractorImg; // default fallback
}

interface EquipmentSectionProps {
  onBookNow: (equipmentId: number) => void;
  locationFilter?: string;
}

export function EquipmentSection({ onBookNow, locationFilter }: EquipmentSectionProps) {
  const { data: allEquipment, isLoading } = useListEquipment();

  const equipmentList = locationFilter
    ? allEquipment?.filter(e => {
        const v = locationFilter.toLowerCase();
        return (
          (e as unknown as { village?: string }).village?.toLowerCase().includes(v) ||
          (e as unknown as { district?: string }).district?.toLowerCase().includes(v)
        );
      })
    : allEquipment;

  return (
    <section id="equipment" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Available Equipment
            </h2>
            <p className="text-muted-foreground text-lg">
              Book well-maintained tractors and implements. All equipment comes with an experienced operator.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-xl overflow-hidden flex flex-col h-[480px]">
                <Skeleton className="h-[220px] w-full rounded-none" />
                <div className="p-5 flex flex-col flex-grow gap-4">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="mt-auto pt-4 flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {equipmentList?.map((equipment, index) => (
              <motion.div
                key={equipment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-card-border rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-[220px] overflow-hidden bg-muted/30">
                  <img
                    src={getEquipmentImage(equipment.name, equipment.imageUrl)}
                    alt={equipment.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground font-semibold">
                      {equipment.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={equipment.available ? "default" : "destructive"}
                      className={equipment.available ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {equipment.available ? "Available Now" : "Currently Booked"}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-xl font-bold text-foreground line-clamp-1" title={equipment.name}>
                      {equipment.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-2 py-0.5 rounded text-sm font-medium shrink-0">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {equipment.rating?.toFixed(1) || "New"}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                    {equipment.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {equipment.operatorName && (
                      <div className="flex items-center text-sm text-foreground">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Operator: <span className="font-medium">{equipment.operatorName}</span></span>
                      </div>
                    )}
                    {equipment.village && (
                      <div className="flex items-center text-sm text-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Location: <span className="font-medium">{equipment.village}</span></span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto border-t pt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-primary">
                        ₹{equipment.pricePerHour}
                        <span className="text-sm font-normal text-muted-foreground">/hr</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        ₹{equipment.pricePerDay}/day
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-[200px]">Day rate applies for bookings of 8 hours or more.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <Button 
                      onClick={() => onBookNow(equipment.id)} 
                      disabled={!equipment.available}
                    >
                      Book This
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
