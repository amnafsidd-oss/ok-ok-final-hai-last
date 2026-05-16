import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Calendar, Share2, Flag, MessageCircle, ChevronLeft, ChevronRight, Store, Clock, Phone } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const adData = await pb.collection('ads').getOne(adId, {
          expand: 'user_id',
          $autoCancel: false
        });
        setAd(adData);
      } catch (error) {
        console.error('Error fetching ad:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [adId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleReport = () => {
    toast.success('Report submitted. We will review this ad.');
  };

  const nextImage = () => {
    if (ad.images && ad.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
    }
  };

  const prevImage = () => {
    if (ad.images && ad.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  const handleWhatsAppChat = () => {
    if (!ad?.whatsapp_number) return;
    const cleanNumber = ad.whatsapp_number.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi, I am interested in your product: ${ad.title}`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!ad) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
          <div className="text-center bg-card border border-border p-8 rounded-2xl shadow-sm max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-3">Product not found</h2>
            <p className="text-muted-foreground mb-6">This ad may have been removed or is no longer available.</p>
            <Link to="/listings">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${ad.title} - ZayToo`}</title>
        <meta name="description" content={ad.description?.substring(0, 150) || `Buy ${ad.title} on ZayToo.`} />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border overflow-hidden shadow-sm rounded-2xl">
                <div className="relative aspect-[4/3] md:aspect-video bg-muted">
                  {ad.images && ad.images.length > 0 ? (
                    <>
                      <img
                        src={pb.files.getUrl(ad, ad.images[currentImageIndex])}
                        alt={ad.title}
                        className="w-full h-full object-contain bg-black/5"
                      />
                      {ad.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/20 px-3 py-2 rounded-full backdrop-blur-md">
                            {ad.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                aria-label={`Go to image ${index + 1}`}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground font-medium">No image available</span>
                    </div>
                  )}
                  {ad.is_featured && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-medium px-3 py-1 text-sm shadow-sm rounded-lg">
                      Featured
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Description */}
              <Card className="bg-card border-border mt-8 shadow-sm rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                    <Store className="w-5 h-5 mr-2 text-primary" />
                    Product Description
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {ad.description || 'No description provided by the seller.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <Card className="bg-card border-border shadow-sm rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                  {ad.status === 'sold' && (
                    <Badge variant="secondary" className="mb-4">
                      SOLD
                    </Badge>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">{ad.title}</h1>
                  <p className="text-4xl font-extrabold text-primary mb-6 tracking-tight">
                    {formatPrice(ad.price)}
                  </p>

                  <div className="space-y-4 mb-8 bg-muted/50 p-4 rounded-xl">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{ad.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <span>Posted on {formatDate(ad.created)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex-1 border-border text-foreground hover:bg-muted"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReport}
                      className="flex-1 border-border text-foreground hover:bg-muted"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Information Card */}
              <Card className="bg-card border-border shadow-lg shadow-primary/5 rounded-2xl overflow-hidden">
                <div className="bg-primary/10 border-b border-primary/10 px-6 py-4">
                  <h3 className="font-bold text-foreground flex items-center">
                    Seller Information
                  </h3>
                </div>
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold text-lg text-muted-foreground">
                        {ad.expand?.user_id?.name ? ad.expand.user_id.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {ad.expand?.user_id?.name || 'ZayToo User'}
                      </p>
                      <p className="text-sm text-muted-foreground">Member since {ad.expand?.user_id ? new Date(ad.expand.user_id.created).getFullYear() : '2024'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start text-sm">
                      <Phone className="w-4 h-4 mr-3 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{ad.whatsapp_number}</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-foreground">{ad.location}</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <Clock className="w-4 h-4 mr-3 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-foreground">Working Hours: 9am to 6pm</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      onClick={handleWhatsAppChat}
                      className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/90 h-12 text-base font-semibold shadow-sm transition-transform active:scale-[0.98]"
                    >
                      <MessageCircle className="w-5 h-5 mr-2 fill-current" />
                      Chat on WhatsApp
                    </Button>
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

export default ProductDetailPage;