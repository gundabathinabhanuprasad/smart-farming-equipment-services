import { motion } from "framer-motion";
import { useListTestimonials } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Quote, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import farmer1Img from "@/assets/images/farmer-1.png";
import farmer2Img from "@/assets/images/farmer-2.png";
import farmer3Img from "@/assets/images/farmer-3.png";

const avatarMap: Record<string, string> = {
  "1": farmer1Img,
  "2": farmer2Img,
  "3": farmer3Img,
};

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useListTestimonials();

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/5 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Hear from Our Farmers
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of progressive farmers who have transformed their operations using KhetBook.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background border rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials?.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative"
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 text-muted/30 rotate-180" />
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-foreground/90 leading-relaxed mb-6 flex-grow italic">
                  "{testimonial.content}"
                </blockquote>

                <div className="mt-auto space-y-4">
                  {testimonial.timeSaved && (
                    <div className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 py-1.5 px-3 rounded-full w-fit">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      Saved {testimonial.timeSaved}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={avatarMap[((index % 3) + 1).toString()] || testimonial.avatarUrl || ""} alt={testimonial.farmerName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {testimonial.farmerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-foreground">
                        {testimonial.farmerName}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        {testimonial.village}, {testimonial.state}
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted">
                          Used: {testimonial.equipmentUsed}
                        </span>
                      </div>
                    </div>
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
