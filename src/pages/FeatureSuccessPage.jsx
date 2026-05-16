import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const FeatureSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (sessionId) {
      const fetchPayment = async () => {
        try {
          const response = await apiServerClient.fetch(`/payfast/session/${sessionId}`);
          const data = await response.json();
          setPayment(data);
        } catch (error) {
          console.error('Error fetching payment:', error);
        }
      };

      fetchPayment();
    }
  }, [sessionId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>Payment Successful - ZayToo</title>
        <meta name="description" content="Your payment was successful. Your ad is now featured on ZayToo." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-card border-border shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful</h1>
            <p className="text-muted-foreground mb-8">
              Your ad is now featured and will appear at the top of search results
            </p>

            {payment && (
              <div className="bg-muted/50 rounded-xl p-5 mb-8 text-left border border-border">
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-muted-foreground font-medium">Status</span>
                  <span className="text-sm font-semibold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded">{payment.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground font-medium">Amount</span>
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(payment.amount)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link to="/dashboard" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base transition-transform active:scale-[0.98]">
                  View My Ads
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted h-12 text-base">
                  Back to Home
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

export default FeatureSuccessPage;