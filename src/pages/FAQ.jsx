import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I post an ad on ZayToo?',
      answer: 'To post an ad, you need to create an account and log in. Then click on the "Sell" button in the navigation menu, fill in the product details, upload images, and submit your ad for approval.'
    },
    {
      question: 'Is it free to post ads?',
      answer: 'Yes, posting regular ads is completely free. However, you can choose to feature your ad for better visibility by paying a small fee.'
    },
    {
      question: 'How long does it take for my ad to be approved?',
      answer: 'Most ads are reviewed and approved within 24 hours. You will receive a notification once your ad is live.'
    },
    {
      question: 'How do I contact a seller?',
      answer: 'Each ad has a "Chat on WhatsApp" button. Click it to start a conversation with the seller directly on WhatsApp.'
    },
    {
      question: 'Can I edit my ad after posting?',
      answer: 'Currently, you cannot edit ads directly. If you need to make changes, please delete the ad and create a new one with the updated information.'
    },
    {
      question: 'What are featured ads?',
      answer: 'Featured ads appear at the top of search results and category pages, giving your product maximum visibility. You can feature your ad for various durations.'
    },
    {
      question: 'How do I mark my item as sold?',
      answer: 'Go to your dashboard, find the ad, and change its status to "Sold" using the status dropdown menu.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we take privacy seriously. Your email is never displayed publicly. Only your WhatsApp number is shown to potential buyers.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - ZayToo</title>
        <meta name="description" content="Frequently asked questions about ZayToo marketplace." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-balance">
            Frequently Asked Questions
          </h1>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border shadow-sm rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors">
                <AccordionTrigger className="text-foreground hover:text-primary text-left font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQ;