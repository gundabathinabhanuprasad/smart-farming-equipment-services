import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Star, ShieldCheck, Car, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buildUrl } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

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

interface DriverSectionProps {
  onBookDriver: (driver: Driver) => void;
  locationFilter?: string;
}

export function DriverSection({ onBookDriver, locationFilter }: DriverSectionProps) {
  const params = new URLSearchParams();
  if (locationFilter) params.set("village", locationFilter);

  const { data: drivers, isLoading } = useQuery<Driver[]>({
    queryKey: ["drivers", locationFilter],
    queryFn: () => fetch(buildUrl(`/api/drivers${params.toString() ? `?${params}` : ""}`)).then(r => r.json()) as Promise<Driver[]>,
  });

  return (
    <section id="drivers" className="py-16 md:py-24 bg-card border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 bg-green-50 text-green-700 border-green-200">Available Now</Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Hire a Skilled Driver
            </h2>
            <p className="text-muted-foreground text-lg">
              Experienced, verified tractor operators from your region — ready when you need them.
            </p>
          </div>
          <Button onClick={() => onBookDriver({ id: 0, userName: null, userPhone: null, experience: 0, pricePerHour: 0, available: true, village: null, district: null, rating: 0, totalBookings: 0, bio: null })} variant="outline">
            Post Open Request
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border rounded-2xl p-6 bg-card flex flex-col items-center text-center">
                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-40 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : drivers && drivers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {drivers.map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-card border rounded-2xl p-6 text-center flex flex-col items-center hover:shadow-lg transition-shadow relative group"
              >
                <div className="absolute top-3 right-3">
                  <Badge className={driver.available ? "bg-green-100 text-green-800 text-xs" : "bg-muted text-muted-foreground text-xs"}>
                    {driver.available ? "Online" : "Busy"}
                  </Badge>
                </div>

                <div className="relative mb-4 mt-2">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {(driver.userName ?? "D").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1">{driver.userName ?? "Driver"}</h3>

                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {driver.village ?? driver.district ?? "Local Area"}
                </div>

                <div className="grid grid-cols-3 gap-2 w-full mb-4 text-xs border rounded-lg overflow-hidden">
                  <div className="py-2 bg-muted/30 flex flex-col items-center">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="h-3 w-3 fill-current mr-0.5" />
                      {driver.rating.toFixed(1)}
                    </div>
                    <span className="text-muted-foreground">Rating</span>
                  </div>
                  <div className="py-2 bg-muted/30 flex flex-col items-center border-x">
                    <div className="flex items-center font-bold text-foreground">
                      <Clock className="h-3 w-3 mr-0.5 text-primary" />
                      {driver.experience}y
                    </div>
                    <span className="text-muted-foreground">Exp</span>
                  </div>
                  <div className="py-2 bg-muted/30 flex flex-col items-center">
                    <div className="flex items-center font-bold text-foreground">
                      <Car className="h-3 w-3 mr-0.5 text-primary" />
                      {driver.totalBookings}
                    </div>
                    <span className="text-muted-foreground">Jobs</span>
                  </div>
                </div>

                {driver.bio && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 italic">{driver.bio}</p>
                )}

                <div className="text-primary font-bold text-lg mb-4">Rs.{driver.pricePerHour}/hr</div>

                <div className="flex gap-2 w-full mt-auto">
                  <Button
                    className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                    onClick={() => onBookDriver(driver)}
                    disabled={!driver.available}
                  >
                    Book Driver
                  </Button>
                  {driver.userPhone && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={`tel:${driver.userPhone}`}><Phone className="h-4 w-4" /></a>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-2xl">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No drivers available in this area yet</p>
            <p className="text-sm mt-1">Try a different location or post an open request</p>
            <Button className="mt-4" onClick={() => onBookDriver({ id: 0, userName: null, userPhone: null, experience: 0, pricePerHour: 0, available: true, village: null, district: null, rating: 0, totalBookings: 0, bio: null })}>
              Post Open Request
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
