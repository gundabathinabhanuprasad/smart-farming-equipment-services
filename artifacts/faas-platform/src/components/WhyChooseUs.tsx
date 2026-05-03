import { motion } from "framer-motion";
import { Clock, Users, ShieldCheck, TrendingUp, Handshake } from "lucide-react";

const benefits = [
  {
    title: "Instant Booking",
    description: "Book equipment in under 2 minutes. Get confirmation instantly via SMS and WhatsApp.",
    icon: Clock,
  },
  {
    title: "Verified Local Operators",
    description: "Our operators are trained, verified, and belong to your local farming community.",
    icon: Users,
  },
  {
    title: "Transparent & Fair Pricing",
    description: "No hidden charges. Pay standard hourly rates regulated by our community guidelines.",
    icon: ShieldCheck,
  },
  {
    title: "AI Farming Insights",
    description: "Get free personalized crop, weather, and soil insights when you book with us.",
    icon: TrendingUp,
  },
  {
    title: "Conflict-Free Scheduling",
    description: "Our system ensures equipment is never double-booked during peak harvest seasons.",
    icon: Handshake,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Why Farmers Choose KhetBook
          </h2>
          <p className="text-muted-foreground text-lg">
            We are building a trusted network of equipment owners and farmers to make modern farming accessible to everyone.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-background border rounded-xl p-6 md:p-8 hover:shadow-md transition-shadow"
            >
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
