import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const TermsConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - ZayToo</title>
        <meta name="description" content="Terms and conditions for using ZayToo marketplace." />
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
            Terms & Conditions
          </h1>

          <div className="space-y-6">
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using ZayToo, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must provide accurate and complete information</li>
                <li>One person may not maintain multiple accounts</li>
                <li>We reserve the right to suspend or terminate accounts that violate our terms</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Listing Guidelines</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When posting ads on ZayToo, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate descriptions and genuine photos of items</li>
                <li>Not post prohibited items (weapons, illegal goods, counterfeit items)</li>
                <li>Not engage in fraudulent or misleading practices</li>
                <li>Respect intellectual property rights</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Transactions</h2>
              <p className="text-muted-foreground leading-relaxed">
                ZayToo is a platform that connects buyers and sellers. We do not participate in transactions between users. All sales, payments, and deliveries are arranged directly between buyers and sellers. ZayToo is not responsible for the quality, safety, or legality of items listed.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Featured Ads</h2>
              <p className="text-muted-foreground leading-relaxed">
                Featured ad placements are paid services that give your listing priority visibility. Payment for featured ads is non-refundable once the ad goes live. We reserve the right to remove featured ads that violate our guidelines.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Posting false, misleading, or fraudulent listings</li>
                <li>Harassing or threatening other users</li>
                <li>Attempting to circumvent our systems or security measures</li>
                <li>Using automated tools to scrape or collect data</li>
                <li>Impersonating other users or entities</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                ZayToo is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform, including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms & Conditions, please contact us through the admin portal.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsConditions;