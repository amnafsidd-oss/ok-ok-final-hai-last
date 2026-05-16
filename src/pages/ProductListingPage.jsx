import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, Filter } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const categoriesData = await pb.collection('categories').getFullList({ $autoCancel: false });
        const locationsData = await pb.collection('locations').getFullList({ $autoCancel: false });
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        let filter = 'status = "active"';
        
        if (searchQuery) {
          filter += ` && title ~ "${searchQuery}"`;
        }
        if (selectedCategory && selectedCategory !== 'all') {
          filter += ` && category = "${selectedCategory}"`;
        }
        if (selectedLocation && selectedLocation !== 'all') {
          filter += ` && location = "${selectedLocation}"`;
        }

        const result = await pb.collection('ads').getList(currentPage, 12, {
          filter,
          sort: '-is_featured,-created',
          expand: 'user_id',
          $autoCancel: false
        });

        setAds(result.items);
        setTotalPages(result.totalPages);
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
  }, [searchQuery, selectedCategory, selectedLocation, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
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
        <title>Browse Products - ZayToo</title>
        <meta name="description" content="Browse all products available on ZayToo. Filter by category, location, and search for specific items." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-balance">
            Browse all products
          </h1>

          {/* Filters */}
          <div className="bg-card border border-border shadow-sm rounded-2xl p-6 mb-10">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted text-foreground placeholder:text-muted-foreground transition-all duration-200"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}>
                <SelectTrigger className="bg-muted text-foreground">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={(val) => { setSelectedLocation(val); setCurrentPage(1); }}>
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
            </form>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
            <div className="text-center py-20 bg-card border border-border shadow-sm rounded-2xl">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ads.map((ad) => (
                  <Link key={ad.id} to={`/product/${ad.id}`}>
                    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col rounded-2xl">
                      <div className="relative aspect-[4/3] bg-muted">
                        {ad.images && ad.images.length > 0 ? (
                          <img
                            src={pb.files.getUrl(ad, ad.images[0])}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No image</span>
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
                        <p className="text-xl font-bold text-primary mb-3 drop-shadow-sm">
                          {formatPrice(ad.price)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                          <span className="font-medium truncate mr-2">{ad.location}</span>
                          <span className="shrink-0">{getTimeAgo(ad.created)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-border text-foreground hover:bg-muted transition-colors"
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-border text-foreground hover:bg-muted transition-colors"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductListingPage;