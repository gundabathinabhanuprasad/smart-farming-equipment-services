import React from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-card border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Need Help Booking?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our support team and local village operator network are ready to assist you. Call us or send a WhatsApp message.
            </p>

            <div className="space-y-6">
              <div className="flex items-start p-4 rounded-xl bg-background border">
                <Phone className="h-6 w-6 text-primary mr-4 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Toll-Free Helpline</h4>
                  <p className="text-2xl font-bold text-primary mb-1">+91 1800-123-4567</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Available 6:00 AM to 8:00 PM Daily
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-background border">
                <MessageCircle className="h-6 w-6 text-green-600 mr-4 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">WhatsApp Support</h4>
                  <p className="text-foreground mb-2">Message us for quick bookings and updates.</p>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                    <a href="https://wa.me/918001234567" target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl p-8 border shadow-sm flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6 text-center">Visit Our Village Centers</h3>
            <p className="text-center text-muted-foreground mb-8">
              Prefer booking in person? We have operator hubs in over 50+ villages. Look for the green KhetBook banner at your local panchayat center.
            </p>
            
            <div className="space-y-4 max-w-md mx-auto w-full">
              <div className="flex items-center p-3 border rounded-lg bg-muted/30">
                <MapPin className="h-5 w-5 text-primary mr-3" />
                <span className="font-medium">Palwal Hub (Main)</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg bg-muted/30">
                <MapPin className="h-5 w-5 text-primary mr-3" />
                <span className="font-medium">Hodal Center</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg bg-muted/30">
                <MapPin className="h-5 w-5 text-primary mr-3" />
                <span className="font-medium">Hassanpur Block</span>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm font-medium text-primary">
              Ask your Sarpanch for the local KhetBook Operator number.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
