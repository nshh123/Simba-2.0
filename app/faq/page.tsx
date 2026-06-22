'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: "How does delivery work on public holidays?",
    answer: "Our delivery service operates on a special schedule during public holidays. We typically stop taking same-day delivery orders at 2:00 PM on holidays to ensure all staff have time with their families. Please check our homepage for specific holiday announcements.",
  },
  {
    question: "What is your return policy for fresh vegetables?",
    answer: "We guarantee the freshness of all our produce. If you are not satisfied with the quality of any fresh vegetables or fruits upon delivery or pick-up, please notify us within 24 hours. We will replace the item or issue a full refund to your original payment method.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer: "Yes, we do! You can select 'Cash on Delivery' at checkout. You simply pay the full amount when you collect your order or when it's delivered to you. We also offer a MoMo Deposit option for securing items in advance.",
  },
  {
    question: "What happens if I miss my pick-up window?",
    answer: "If you are running late, your order will be safely stored. Refrigerated or frozen items will be kept at the appropriate temperature. We hold pick-up orders until the end of the business day. If uncollected, we will contact you to reschedule.",
  },
  {
    question: "Can I modify my order after placing it?",
    answer: "You cannot modify an order yourself once it is placed. However, if you contact our customer support team immediately at info@simbasupermarket.rw or call us, we can typically make changes if the order hasn't been prepared or dispatched yet.",
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[70vh]">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">Find answers to common questions about shopping with Simba.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-primary shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 ml-4" />
                )}
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center bg-muted/50 p-8 rounded-2xl">
        <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">Our customer support team is here to help you.</p>
        <Link href="/about">
          <Button variant="outline" size="lg" className="font-bold">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  );
}
