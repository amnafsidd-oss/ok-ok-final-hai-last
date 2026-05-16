import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';
import { Trash2, LayoutDashboard } from 'lucide-react';

const AdminPortal = () => {
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', city: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const adsData = await pb.collection('ads').getFullList({
        sort: '-created',
        expand: 'user_id',
        $autoCancel: false
      });
      const usersData = await pb.collection('users').getFullList({ $autoCancel: false });
      const locationsData = await pb.collection('locations').getFullList({ $autoCancel: false });
      
      setAds(adsData);
      setUsers(usersData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    
    try {
      await pb.collection('ads').delete(adId, { $autoCancel: false });
      toast.success('Ad deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Failed to delete ad');
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocation.name) return;
    
    try {
      await pb.collection('locations').create(newLocation, { $autoCancel: false });
      toast.success('Location added successfully');
      setNewLocation({ name: '', city: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location');
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    
    try {
      await pb.collection('locations').delete(locationId, { $autoCancel: false });
      toast.success('Location deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal - ZayToo</title>
        <meta name="description" content="Admin portal for managing ZayToo marketplace." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Admin Portal</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Tabs defaultValue="ads" className="space-y-6">
              <TabsList className="bg-muted p-1 rounded-xl">
                <TabsTrigger value="ads" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  Ads Management
                </TabsTrigger>
                <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  User Management
                </TabsTrigger>
                <TabsTrigger value="locations" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  Location Management
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ads" className="space-y-4">
                <Card className="bg-card border-border shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">All Ads ({ads.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ads.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No ads found.</p>
                      ) : (
                        ads.map((ad) => (
                          <div key={ad.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 border border-border rounded-xl gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground text-lg">{ad.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                By: <span className="font-medium text-foreground">{ad.expand?.user_id?.name || ad.expand?.user_id?.email || 'Unknown'}</span> • {ad.category} • {ad.location}
                              </p>
                              <Badge variant={ad.status === 'active' ? 'default' : 'secondary'} className="mt-3">
                                {ad.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteAd(ad.id)}
                                className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <Card className="bg-card border-border shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">All Users ({users.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{user.name || 'No name provided'}</h3>
                              {user.is_admin && (
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0">Admin</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                            <p className="text-sm text-muted-foreground">Phone: {user.phone || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="locations" className="space-y-6">
                <Card className="bg-card border-border shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">Add New Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddLocation} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground">Location Name</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="e.g. Karachi"
                            value={newLocation.name}
                            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                            required
                            className="bg-background text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-foreground">City (Optional)</Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="e.g. Sindh"
                            value={newLocation.city}
                            onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                            className="bg-background text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Add Location
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">All Locations ({locations.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {locations.map((location) => (
                        <div key={location.id} className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
                          <div>
                            <h3 className="font-semibold text-foreground">{location.name}</h3>
                            {location.city && (
                              <p className="text-sm text-muted-foreground">{location.city}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLocation(location.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminPortal;