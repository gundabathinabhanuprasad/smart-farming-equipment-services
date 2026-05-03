import React from "react";
import { Link } from "wouter";
import { Tractor, Shield, Award, CheckCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-md text-primary-foreground">
                <Tractor className="h-6 w-6" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">KhetBook</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-xs">
              Democratizing modern farming equipment through a transparent, reliable, and accessible community network.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center text-sm font-medium text-background/80">
                <Shield className="h-4 w-4 mr-1 text-primary" />
                100% Secure
              </div>
              <div className="flex items-center text-sm font-medium text-background/80">
                <Award className="h-4 w-4 mr-1 text-primary" />
                ISO Certified
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#equipment" className="text-background/70 hover:text-primary transition-colors">Book Equipment</a></li>
              <li><a href="#insights" className="text-background/70 hover:text-primary transition-colors">Smart Insights</a></li>
              <li><a href="#operators" className="text-background/70 hover:text-primary transition-colors">Our Operators</a></li>
              <li><a href="#testimonials" className="text-background/70 hover:text-primary transition-colors">Farmer Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">For Owners</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">List Your Tractor</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Revenue Calculator</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Insurance Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Owner Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Legal & Gov</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li className="pt-2">
                <div className="flex items-center p-2 rounded bg-white/5 border border-white/10 w-fit">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-xs text-white/90 font-medium">MSME Registered</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} KhetBook Technologies Pvt Ltd. All rights reserved.</p>
          <p>Proudly built for Indian Farmers 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
