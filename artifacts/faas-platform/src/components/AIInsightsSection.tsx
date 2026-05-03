import React from "react";
import { motion } from "framer-motion";
import { useListInsights } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudRain, Sprout, AlertTriangle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AIInsightsSection() {
  const { data: insights, isLoading } = useListInsights();

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "weather":
        return CloudRain;
      case "crop":
        return Sprout;
      case "alert":
        return AlertTriangle;
      default:
        return BookOpen;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <section id="insights" className="py-16 md:py-24 bg-card/50 border-y">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            Smart Farming
          </Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            AI-Powered Crop & Weather Insights
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay ahead of the curve with real-time, localized farming advisories tailored to your region and crops.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-xl p-6 bg-background space-y-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights?.map((insight, index) => {
              const Icon = getIcon(insight.type);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-background border rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    insight.urgency === 'high' ? 'bg-red-500' : 
                    insight.urgency === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                  }`} />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-lg bg-primary/5 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className={getUrgencyColor(insight.urgency)}>
                      {insight.urgency} Priority
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {insight.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                    {insight.description}
                  </p>
                  
                  {insight.crop && (
                    <div className="mt-auto pt-4 border-t flex items-center text-xs font-medium text-foreground">
                      <span className="text-muted-foreground mr-1">Relevant for:</span>
                      {insight.crop}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
