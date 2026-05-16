import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ReturnPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Return & Refund Policy - ZayToo</title>
        <meta name="description" content="Return and refund policy for ZayToo marketplace." />
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
            Return & Refund Policy
          </h1>

          <div className="space-y-6">
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                ZayToo is a peer-to-peer marketplace platform that connects buyers and sellers directly. We do not handle transactions, shipping, or returns ourselves. All sales are conducted between individual users.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Buyer Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Inspect items thoroughly before completing the purchase</li>
                <li>Communicate clearly with sellers about product condition and details</li>
                <li>Arrange returns or refunds directly with the seller if needed</li>
                <li>Report fraudulent listings to our admin team</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Seller Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate descriptions and photos of items</li>
                <li>Disclose any defects or issues with the product</li>
                <li>Honor any return agreements made with buyers</li>
                <li>Respond promptly to buyer inquiries</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you encounter issues with a transaction:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>First, try to resolve the issue directly with the other party</li>
                <li>Document all communication and evidence</li>
                <li>If unresolved, contact our support team for assistance</li>
                <li>We may mediate disputes but cannot guarantee specific outcomes</li>
              </ol>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Featured Ad Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                Payments for featured ad placements are non-refundable once the ad goes live. If there is a technical issue preventing your ad from being featured, please contact support within 24 hours.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReturnPolicy;