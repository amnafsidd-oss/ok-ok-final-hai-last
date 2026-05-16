import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [currentUser]);

  const fetchAds = async () => {
    try {
      const result = await pb.collection('ads').getFullList({
        filter: `user_id = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setAds(result);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      await pb.collection('ads').delete(adId, { $autoCancel: false });
      toast('Ad deleted successfully');
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast('Failed to delete ad');
    }
  };

  const handleStatusChange = async (adId, newStatus) => {
    try {
      await pb.collection('ads').update(adId, { status: newStatus }, { $autoCancel: false });
      toast('Status updated successfully');
      fetchAds();
    } catch (error) {
      console.error('Error updating status:', error);
      toast('Failed to update status');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>My Dashboard - ZayToo</title>
        <meta name="description" content="Manage your ads and listings on ZayToo." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Ads</h1>
            <Link to="/sell">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto transition-transform active:scale-[0.98]">
                <Plus className="w-5 h-5 mr-2" />
                Post New Ad
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-card border-border shadow-sm rounded-2xl">
                  <div className="aspect-[4/3] bg-muted animate-pulse rounded-t-2xl"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-6 bg-muted rounded animate-pulse w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border shadow-sm rounded-2xl">
              <h3 className="text-xl font-semibold text-foreground mb-2">No ads yet</h3>
              <p className="text-muted-foreground mb-6">Start selling by posting your first ad</p>
              <Link to="/sell">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-[0.98]">
                  Post Your First Ad
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <Card key={ad.id} className="bg-card border-border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
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
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-medium rounded-lg">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{ad.title}</h3>
                      <p className="text-xl font-bold text-primary">{formatPrice(ad.price)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">Status:</span>
                      <Select
                        value={ad.status}
                        onValueChange={(value) => handleStatusChange(ad.id, value)}
                      >
                        <SelectTrigger className="h-9 w-full bg-muted border-transparent focus:ring-primary text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2 pt-2 border-t border-border">
                      <Link to={`/product/${ad.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-border text-foreground hover:bg-muted">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(ad.id)}
                        className="px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserDashboard;