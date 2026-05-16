import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const TrackOrder = () => {
  return (
    <>
      <Helmet>
        <title>Track Order - ZayToo</title>
        <meta name="description" content="Track your order on ZayToo." />
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
            Track Your Order
          </h1>

          <Card className="bg-card border-border shadow-sm rounded-2xl">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Order Tracking
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                ZayToo is a peer-to-peer marketplace. Buyers and sellers communicate directly through WhatsApp to arrange delivery and payment.
              </p>
              <p className="text-muted-foreground">
                For any questions about your purchase, please contact the seller directly via WhatsApp using the button on their listing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TrackOrder;