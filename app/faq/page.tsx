'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: t('faqQ1'), answer: t('faqA1') },
    { question: t('faqQ2'), answer: t('faqA2') },
    { question: t('faqQ3'), answer: t('faqA3') },
    { question: t('faqQ4'), answer: t('faqA4') },
    { question: t('faqQ5'), answer: t('faqA5') }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[70vh]">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">{t('faqTitle')}</h1>
        <p className="text-lg text-muted-foreground">{t('faqDesc')}</p>
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
        <h2 className="text-xl font-bold mb-2">{t('stillHaveQuestions')}</h2>
        <p className="text-muted-foreground mb-6">{t('customerSupport')}</p>
        <Link href="/about">
          <Button variant="outline" size="lg" className="font-bold">
            {t('contactUs')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
