import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, ArrowRight, Smartphone, Car, Home as HomeIcon, Building, Laptop, Sofa, Bike, Shirt, BookOpen, Briefcase, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const categoryIcons = {
  'Mobiles': Smartphone,
  'Cars': Car,
  'Property for Sale': HomeIcon,
  'Property for Rent': Building,
  'Electronics': Laptop,
  'Furniture': Sofa,
  'Bikes': Bike,
  'Clothes': Shirt,
  'Books': BookOpen,
  'Services': Wrench,
  'Jobs': Briefcase
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredAds, setFeaturedAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await pb.collection('categories').getFullList({ $autoCancel: false });
        setCategories(categoriesData);

        const adsData = await pb.collection('ads').getList(1, 6, {
          filter: 'is_featured = true && status = "active"',
          sort: '-created',
          expand: 'user_id',
          $autoCancel: false
        });
        setFeaturedAds(adsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    return 'Just now';
  };

  return (
    <>
      <Helmet>
        <title>ZayToo - Buy and Sell Products Online in Pakistan</title>
        <meta name="description" content="ZayToo is your trusted marketplace for buying and selling products across Pakistan. Browse mobiles, cars, property, electronics, and more." />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#0a0a0a] border-b border-border py-20 md:py-32 overflow-hidden">
        {/* Subtle background noise/gradient to break up flat black */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight text-balance drop-shadow-md" style={{ letterSpacing: '-0.02em' }}>
              Buy and sell anything in Pakistan
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-[65ch] mx-auto text-balance drop-shadow-sm">
              Join thousands of buyers and sellers on Pakistan's most trusted marketplace. Post your ad today and connect with local buyers instantly.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative shadow-2xl rounded-2xl bg-card border border-border flex items-center p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <Search className="w-6 h-6 text-muted-foreground ml-3 shrink-0" />
              <Input
                type="text"
                placeholder="Search for mobiles, cars, property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-14 bg-transparent border-0 text-foreground text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-14 text-base font-semibold"
              >
                Search
              </Button>
            </form>

            <div className="mt-10">
              <Link to="/sell">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 font-semibold shadow-sm">
                  Start Selling
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center text-balance">
              Browse by category
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category, index) => {
                const Icon = categoryIcons[category.name] || Briefcase;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                  >
                    <Link to={`/category/${encodeURIComponent(category.name)}`}>
                      <Card className="bg-card border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer h-full rounded-2xl group">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                          <div className="w-14 h-14 mb-4 bg-muted group-hover:bg-primary/10 rounded-2xl flex items-center justify-center transition-colors">
                            <Icon className="w-7 h-7 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Ads Section */}
      {featuredAds.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                  Featured listings
                </h2>
                <Link to="/listings">
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted hidden sm:flex font-medium">
                    View All
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {featuredAds.map((ad, index) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Link to={`/product/${ad.id}`}>
                      <Card className="bg-card border-border shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col rounded-2xl group">
                        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                          {ad.images && ad.images.length > 0 ? (
                            <img
                              src={pb.files.getUrl(ad, ad.images[0])}
                              alt={ad.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Smartphone className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-medium rounded-lg shadow-sm">
                            Featured
                          </Badge>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
                            {ad.title}
                          </h3>
                          <p className="text-2xl font-bold text-primary mb-4 drop-shadow-sm">
                            {formatPrice(ad.price)}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                            <span className="truncate font-medium pr-2">{ad.location}</span>
                            <span className="shrink-0">{getTimeAgo(ad.created)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center sm:hidden">
                <Link to="/listings" className="w-full">
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted font-medium">
                    View All Ads
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default HomePage;