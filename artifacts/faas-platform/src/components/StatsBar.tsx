import React from "react";
import { motion } from "framer-motion";
import { useGetPlatformStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Tractor, CalendarCheck, MapPin } from "lucide-react";

export function StatsBar() {
  const { data: stats, isLoading } = useGetPlatformStats();

  const statItems = [
    {
      label: "Happy Farmers",
      value: stats?.totalFarmers || 0,
      icon: Users,
      suffix: "+",
    },
    {
      label: "Equipment Ready",
      value: stats?.totalEquipment || 0,
      icon: Tractor,
      suffix: "+",
    },
    {
      label: "Successful Bookings",
      value: stats?.totalBookings || 0,
      icon: CalendarCheck,
      suffix: "+",
    },
    {
      label: "Villages Covered",
      value: stats?.villagesCovered || 0,
      icon: MapPin,
      suffix: "",
    },
  ];

  return (
    <section className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x-0 md:divide-x divide-primary-foreground/20">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-4"
            >
              <div className="bg-primary-foreground/10 p-3 rounded-full mb-4">
                <item.icon className="h-6 w-6 text-accent" />
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-24 bg-primary-foreground/20 mb-2" />
              ) : (
                <div className="text-3xl md:text-4xl font-bold font-serif mb-1">
                  {item.value.toLocaleString()}
                  {item.suffix}
                </div>
              )}
              <div className="text-sm md:text-base text-primary-foreground/80 font-medium">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
