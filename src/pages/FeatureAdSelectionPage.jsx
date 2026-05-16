
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { PackageSearch, ArrowRight, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { toast } from 'sonner';

const FeatureAdSelectionPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [processingPlan, setProcessingPlan] = useState(null);

  const plans = [
    {
      duration: 7,
      title: '1 Week',
      price: 1000,
      description: 'Perfect for quick sales',
      features: ['Top placement for 7 days', 'Highlight badge', 'Reach more buyers fast']
    },
    {
      duration: 15,
      title: '15 Days',
      price: 1750,
      recommended: true,
      description: 'Best value for visibility',
      features: ['Top placement for 15 days', 'Highlight badge', 'Sustained visibility', 'Cost effective']
    },
    {
      duration: 30,
      title: '1 Month',
      price: 2500,
      description: 'Maximum exposure',
      features: ['Top placement for 30 days', 'Highlight badge', 'Maximum buyer reach', 'Set and forget']
    }
  ];

  useEffect(() => {
    const fetchActiveAds = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const result = await pb.collection('ads').getList(1, 50, {
          filter: `user_id = "${currentUser.id}" && status = "active"`,
          sort: '-created',
          $autoCancel: false
        });
        setAds(result.items);
      } catch (error) {
        console.error('Error fetching ads:', error);
        toast.error('Failed to load your ads.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAds();
  }, [currentUser]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePlanSelection = async (plan) => {
    if (!currentUser?.id) {
      toast.error('Please log in to feature your ad');
      navigate('/login');
      return;
    }

    const token = pb.authStore.token;
    console.log('[FEATURE_AD] Token from pb.authStore:', token);
    console.log('[FEATURE_AD] localStorage pocketbase_auth:', localStorage.getItem('pocketbase_auth'));

    if (!token) {
      console.error('No auth token found in PocketBase store');
      toast.error('Authentication error. Please log in again.');
      navigate('/login');
      return;
    }

    setProcessingPlan(plan.duration);

    try {
      // Step 1 & 2: Extract email from currentUser or fetch from PocketBase
      let cust_email = currentUser.email || '';
      let cust_name = currentUser.name || '';

      // If email is not in currentUser, fetch the full user profile
      if (!cust_email) {
        try {
          const userProfile = await pb.collection('users').getOne(currentUser.id, { $autoCancel: false });
          cust_email = userProfile.email || '';
          cust_name = userProfile.name || cust_name;
        } catch (fetchError) {
          console.error('Failed to fetch user profile:', fetchError);
        }
      }

      // Step 3: Validate email exists
      if (!cust_email || cust_email.trim() === '') {
        toast.error('Please add an email to your profile before making a payment');
        setProcessingPlan(null);
        return;
      }

      // Step 4 & 7: Ensure name is a non-empty string (use email as fallback)
      if (!cust_name || cust_name.trim() === '') {
        cust_name = cust_email.split('@')[0]; // Use email prefix as fallback name
      }

      const origin = window.location.origin;
      const success_url = `${origin}/feature-success?session_id={BASKET_ID}`;
      const failure_url = `${origin}/feature-cancel`;
      const notify_url = `${origin}/hcgi/api/payfast/notify`;

      // Validate that all three URLs are non-empty strings
      if (
        typeof success_url !== 'string' || success_url.trim() === '' ||
        typeof failure_url !== 'string' || failure_url.trim() === '' ||
        typeof notify_url !== 'string' || notify_url.trim() === ''
      ) {
        toast.error('Payment configuration error: Invalid redirect URLs');
        setProcessingPlan(null);
        return;
      }

      const ad_id = selectedAd.id;
      const amount = plan.price;
      const user_id = currentUser.id;

      const requestBody = {
        ad_id,
        amount,
        duration: plan.duration,
        user_id,
        customer_email: cust_email.trim(),
        customer_name: cust_name.trim(),
        success_url,
        failure_url,
        notify_url
      };

      // Step 5: Console log for verification
      console.log('Payment Request Body:', requestBody);

      // Step 6: Make API call with email, name and URLs included
      const response = await apiServerClient.fetch('/payfast/create-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 401) {
        toast.error('Your session expired. Please log in again.');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Checkout creation failed');
      }

      const data = await response.json();
      
      toast.success('Redirecting to secure checkout...');
      
      // Create hidden HTML form with all fields from response
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
      form.style.display = 'none';

      const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const finalSuccessUrl = `${window.location.origin}/feature-success?session_id=${data.session_id}`;
      const finalFailureUrl = `${window.location.origin}/feature-cancel`;

      const formFields = {
        MERCHANT_ID: data.MERCHANT_ID,
        MERCHANT_NAME: data.MERCHANT_NAME,
        TOKEN: data.TOKEN || data.ACCESS_TOKEN,
        PROCCODE: data.PROCCODE,
        TXNAMT: data.TXNAMT,
        CUSTOMER_MOBILE_NO: data.CUSTOMER_MOBILE_NO || '00000000000',
        CUSTOMER_EMAIL_ADDRESS: data.CUSTOMER_EMAIL_ADDRESS || cust_email.trim(),
        SIGNATURE: data.SIGNATURE,
        VERSION: data.VERSION,
        TXNDESC: data.TXNDESC,
        SUCCESS_URL: finalSuccessUrl,
        FAILURE_URL: finalFailureUrl,
        BASKET_ID: data.BASKET_ID,
        ORDER_DATE: orderDate,
        CHECKOUT_URL: data.CHECKOUT_URL || '',
        CURRENCY_CODE: data.CURRENCY_CODE || 'PKR'
      };

      Object.entries(formFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      });

      console.log('Submitting GoPayFast form with fields:', formFields);
      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout. Please try again.');
      setProcessingPlan(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Feature Your Ad - ZayToo</title>
        <meta name="description" content="Select an ad and choose a promotion plan to reach more buyers on ZayToo." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!selectedAd ? (
            <>
              <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Feature Your Ad</h1>
                <p className="text-muted-foreground text-lg">
                  Boost your visibility. Select an active ad below to promote it to the top of search results.
                </p>
              </div>

              {!currentUser?.id ? (
                <Card className="bg-card border-border shadow-sm rounded-2xl text-center py-16">
                  <CardContent>
                    <PackageSearch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Authentication Required</h3>
                    <p className="text-muted-foreground mb-6">Please log in to view and feature your ads.</p>
                    <Link to="/login">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6">
                        Log In
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : loading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-card border-border shadow-sm rounded-xl">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-24 h-24 bg-muted rounded-lg animate-pulse shrink-0"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-muted rounded animate-pulse w-3/4"></div>
                          <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
                        </div>
                        <div className="w-24 h-10 bg-muted rounded-lg animate-pulse shrink-0"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : ads.length === 0 ? (
                <Card className="bg-card border-border shadow-sm rounded-2xl text-center py-16">
                  <CardContent>
                    <PackageSearch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No active ads found</h3>
                    <p className="text-muted-foreground mb-6">You need an active listing to feature it.</p>
                    <Link to="/sell">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6">
                        Post a New Ad
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {ads.map((ad) => (
                    <Card key={ad.id} className="bg-card border-border shadow-sm rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-full sm:w-32 aspect-video sm:aspect-square bg-muted rounded-lg overflow-hidden shrink-0">
                          {ad.images && ad.images.length > 0 ? (
                            <img
                              src={pb.files.getUrl(ad, ad.images[0])}
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
                            {ad.title}
                          </h3>
                          <p className="text-primary font-bold">
                            {formatPrice(ad.price)}
                          </p>
                          {ad.is_featured && (
                            <p className="text-sm text-accent-foreground bg-accent inline-block px-2 py-0.5 rounded mt-2">
                              Already Featured
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 mt-4 sm:mt-0">
                          <Button 
                            onClick={() => setSelectedAd(ad)}
                            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Select Ad
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedAd(null)}
                className="mb-6 text-foreground hover:text-primary transition-colors -ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Ad Selection
              </Button>

              <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose Your Promotion Plan</h1>
                <p className="text-muted-foreground text-lg">
                  Get up to 10x more views by featuring: <strong className="text-foreground">{selectedAd.title}</strong>
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
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm flex items-center">
                        <Zap className="w-4 h-4 mr-1 fill-current" />
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

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block w-full mt-auto">
                              <Button 
                                onClick={() => handlePlanSelection(plan)}
                                disabled={processingPlan !== null || !currentUser?.id}
                                className={`w-full h-12 text-base font-semibold transition-transform active:scale-[0.98] ${
                                  plan.recommended 
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                    : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                                }`}
                              >
                                {processingPlan === plan.duration ? 'Processing...' : `Select ${plan.title}`}
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!currentUser?.id && (
                            <TooltipContent>
                              <p>Please log in to feature your ad</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FeatureAdSelectionPage;
