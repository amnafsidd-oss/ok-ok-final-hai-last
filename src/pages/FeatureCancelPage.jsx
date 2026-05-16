import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const FeatureCancelPage = () => {
  return (
    <>
      <Helmet>
        <title>Payment Cancelled - ZayToo</title>
        <meta name="description" content="Your payment was cancelled." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-card border-border shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Payment Cancelled</h1>
            <p className="text-muted-foreground mb-8">
              Your payment was not completed. You can try again anytime.
            </p>

            <div className="space-y-3">
              <Link to="/feature-ad-selection" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base transition-transform active:scale-[0.98]">
                  Try Again
                </Button>
              </Link>
              <Link to="/dashboard" className="block">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted h-12 text-base">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </>
  );
};

export default FeatureCancelPage;