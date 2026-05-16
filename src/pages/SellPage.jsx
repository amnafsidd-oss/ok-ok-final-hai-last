import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Upload, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';

const SellPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    whatsapp_number: currentUser?.whatsapp_number || '',
    images: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await pb.collection('categories').getFullList({ $autoCancel: false });
        const locationsData = await pb.collection('locations').getFullList({ $autoCancel: false });
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = [...formData.images, ...files];
    setFormData({ ...formData, images: newImages });

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', currentUser.id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('whatsapp_number', formData.whatsapp_number);
      formDataToSend.append('status', 'active'); // Immediately active
      formDataToSend.append('is_featured', false);

      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await pb.collection('ads').create(formDataToSend, { $autoCancel: false });
      
      toast.success('Your ad is now live on the marketplace!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error('Failed to create ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sell Your Product - ZayToo</title>
        <meta name="description" content="Post your product for sale on ZayToo. Reach thousands of buyers across Pakistan." />
      </Helmet>
      <Header />

      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-card border-border shadow-lg rounded-2xl">
            <CardHeader className="border-b border-border pb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Post your ad</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-foreground font-medium">Product Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. iPhone 13 Pro Max 256GB"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="bg-muted text-foreground placeholder:text-muted-foreground text-base h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your product in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="bg-muted text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="price" className="text-foreground font-medium">Price (PKR) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="50000"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="bg-muted text-foreground placeholder:text-muted-foreground text-base h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-foreground font-medium">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="bg-muted text-foreground h-12">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-foreground font-medium">Location *</Label>
                    <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                      <SelectTrigger className="bg-muted text-foreground h-12">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.name}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="whatsapp_number" className="text-foreground font-medium">WhatsApp Number *</Label>
                  <Input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    required
                    className="bg-muted text-foreground placeholder:text-muted-foreground text-base h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground font-medium">Product Images * (Max 5)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      disabled={formData.images.length >= 5}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                      <span className="text-sm font-medium text-foreground mb-1">Click to upload images</span>
                      <span className="text-xs text-muted-foreground">({formData.images.length}/5 uploaded)</span>
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 shadow-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 transition-transform active:scale-[0.98]"
                  >
                    {loading ? 'Publishing...' : 'Publish Ad'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SellPage;