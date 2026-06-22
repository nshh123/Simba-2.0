import React from 'react';
import { Mail, Phone, MapPin, Clock, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">About Simba</h1>
        <p className="text-xl text-muted-foreground">Your trusted retail partner in Rwanda since 2007.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-12">
        {/* History Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-8 shadow-sm h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <History className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our History</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2007, Simba Supermarket has grown from a single store to become one of Rwanda's leading and most trusted retail chains.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to providing our customers with the highest quality products, exceptional service, and a modern shopping experience, whether in-store or online.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-8 shadow-sm h-full">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-0.5">Email Support</p>
                  <a href="mailto:info@simbasupermarket.rw" className="text-muted-foreground hover:text-primary transition-colors">
                    info@simbasupermarket.rw
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-0.5">Local Phone Lines</p>
                  <p className="text-muted-foreground">Customer Service: +250 788 123 456</p>
                  <p className="text-muted-foreground">Delivery Team: +250 788 654 321</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-0.5">Operating Hours</p>
                  <p className="text-muted-foreground">Mon - Sun: 8:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/">
          <Button size="lg" className="font-bold">
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
