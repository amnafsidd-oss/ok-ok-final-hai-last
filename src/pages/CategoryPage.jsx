import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, Filter } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [ads, setAds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await pb.collection('locations').getFullList({ $autoCancel: false });
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        let filter = `status = "active" && category = "${categoryName}"`;
        
        if (searchQuery) {
          filter += ` && title ~ "${searchQuery}"`;
        }
        if (selectedLocation && selectedLocation !== 'all') {
          filter += ` && location = "${selectedLocation}"`;
        }

        const result = await pb.collection('ads').getFullList({
          filter,
          sort: '-is_featured,-created',
          expand: 'user_id',
          $autoCancel: false
        });

        setAds(result);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchAds();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [categoryName, searchQuery, selectedLocation]);

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
        <title>{`${categoryName} - ZayToo`}</title>
        <meta name="description" content={`Browse ${categoryName} listings on ZayToo. Find the best deals in Pakistan.`} />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-balance">
            {categoryName}
          </h1>

          {/* Filters */}
          <div className="bg-card border border-border shadow-sm rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search in this category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted text-foreground placeholder:text-muted-foreground transition-all duration-200"
                />
              </div>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-muted text-foreground">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-card border-border shadow-sm rounded-2xl">
                  <div className="aspect-video bg-muted animate-pulse rounded-t-2xl"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-6 bg-muted rounded animate-pulse w-1/2"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">No listings available in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <Link key={ad.id} to={`/product/${ad.id}`}>
                  <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col rounded-2xl">
                    <div className="relative aspect-video bg-muted">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={pb.files.getUrl(ad, ad.images[0])}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      {ad.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-medium rounded-lg shadow-sm">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
                        {ad.title}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-3 drop-shadow-sm">
                        {formatPrice(ad.price)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                        <span className="font-medium">{ad.location}</span>
                        <span>{getTimeAgo(ad.created)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;