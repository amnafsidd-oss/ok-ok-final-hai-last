import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';

const FeatureAdPage = () => {
  const { adId, planDuration } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Validate and parse duration
  const durationMap = {
    '7': 950,
    '15': 1500,
    '30': 2500
  };
  const amount = durationMap[planDuration];

  useEffect(() => {
    if (!amount) {
      toast('Invalid plan selected');
      navigate('/feature-ad-selection');
      return;
    }

    const fetchAd = async () => {
      try {
        const adData = await pb.collection('ads').getOne(adId, { $autoCancel: false });
        
        if (adData.user_id !== currentUser.id) {
          toast('You can only feature your own ads');
          navigate('/dashboard');
          return;
        }
        
        setAd(adData);
      } catch (error) {
        console.error('Error fetching ad:', error);
        toast('Failed to load ad details');
        navigate('/feature-ad-selection');
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [adId, currentUser, navigate, amount]);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const response = await apiServerClient.fetch('/payfast/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId: ad.id,
          duration: parseInt(planDuration, 10),
          amount: amount,
          description: `Feature Ad - ${planDuration} days`
        })
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      const data = await response.json();
      window.open(data.paymentUrl, '_blank');
      
      toast('Redirecting to secure payment gateway...');
    } catch (error) {
      console.error('Payment error:', error);
      toast('Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - ZayToo</title>
        <meta name="description" content="Secure checkout to feature your ad on ZayToo." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/feature-ad-pricing/${adId}`}>
            <Button variant="ghost" className="mb-6 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Plan
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="bg-card border-border shadow-sm rounded-2xl h-fit">
              <CardHeader className="bg-muted/30 border-b border-border rounded-t-2xl pb-4">
                <CardTitle className="text-foreground text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                    {ad.images && ad.images.length > 0 ? (
                      <img
                        src={pb.files.getUrl(ad, ad.images[0])}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground line-clamp-2 leading-snug mb-1">{ad.title}</p>
                    <p className="text-sm text-muted-foreground">Listing Price: {formatPrice(ad.price)}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Promotion Plan</span>
                    <span className="font-medium text-foreground">{planDuration} Days Feature</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(amount)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Total to Pay</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Action */}
            <div className="space-y-6">
              <Card className="bg-card border-border shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    You will be redirected to our secure payment gateway (PayFast) to complete your transaction. Your ad will be featured immediately upon successful payment.
                  </p>
                  
                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-semibold transition-transform active:scale-[0.98]"
                  >
                    {processing ? 'Processing...' : `Pay ${formatPrice(amount)}`}
                  </Button>
                  
                  <div className="mt-4 text-center">
                    <span className="text-xs text-muted-foreground flex items-center justify-center">
                      <Lock className="w-3 h-3 mr-1" /> Payments secured by PayFast
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FeatureAdPage;