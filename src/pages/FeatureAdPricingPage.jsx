import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const FeatureAdPricingPage = () => {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  const plans = [
    {
      duration: '7',
      title: '1 Week',
      price: 950,
      description: 'Perfect for quick sales',
      features: ['Top placement for 7 days', 'Highlight badge', 'Reach more buyers fast']
    },
    {
      duration: '15',
      title: '15 Days',
      price: 1500,
      recommended: true,
      description: 'Best value for visibility',
      features: ['Top placement for 15 days', 'Highlight badge', 'Sustained visibility', 'Cost effective']
    },
    {
      duration: '30',
      title: '1 Month',
      price: 2500,
      description: 'Maximum exposure',
      features: ['Top placement for 30 days', 'Highlight badge', 'Maximum buyer reach', 'Set and forget']
    }
  ];

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const adData = await pb.collection('ads').getOne(adId, { $autoCancel: false });
        setAd(adData);
      } catch (error) {
        toast('Failed to load ad details.');
        navigate('/feature-ad-selection');
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [adId, navigate]);

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
        <title>Select Plan - ZayToo</title>
        <meta name="description" content="Choose a plan to feature your ad on ZayToo." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/feature-ad-selection">
            <Button variant="ghost" className="mb-6 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
          </Link>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose Your Promotion Plan</h1>
            <p className="text-muted-foreground text-lg">
              Get up to 10x more views by featuring your ad: <strong className="text-foreground">{ad?.title}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.duration} 
                className={`relative flex flex-col rounded-2xl transition-transform hover:-translate-y-1 ${
                  plan.recommended 
                    ? 'border-2 border-primary shadow-xl bg-card' 
                    : 'border border-border shadow-sm bg-card'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center pt-8 pb-4">
                  <CardTitle className="text-xl font-medium text-muted-foreground mb-2">{plan.title}</CardTitle>
                  <div className="text-4xl font-extrabold text-foreground">
                    {formatPrice(plan.price)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-6">
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className={`w-5 h-5 mr-3 shrink-0 ${plan.recommended ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/feature-ad-payment/${adId}/${plan.duration}`} className="block w-full mt-auto">
                    <Button 
                      className={`w-full h-12 text-base font-semibold transition-transform active:scale-[0.98] ${
                        plan.recommended 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                      }`}
                    >
                      Select {plan.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FeatureAdPricingPage;