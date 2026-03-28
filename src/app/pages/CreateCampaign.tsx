import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { fetchWithAuth, supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Loader2, Plus, MapPin } from 'lucide-react';
import { MapSelector } from '../components/MapSelector';

const CATEGORIES = [
  { id: 'education', label: 'Education & Learning', emoji: '📚' },
  { id: 'health', label: 'Health & Wellness', emoji: '🏥' },
  { id: 'environment', label: 'Environment & Climate', emoji: '🌱' },
  { id: 'food', label: 'Food Security', emoji: '🍲' },
  { id: 'housing', label: 'Housing & Shelter', emoji: '🏠' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎨' },
  { id: 'technology', label: 'Technology Access', emoji: '💻' },
  { id: 'community', label: 'Community Development', emoji: '🤝' },
  { id: 'youth', label: 'Youth Programs', emoji: '👶' },
  { id: 'seniors', label: 'Senior Care', emoji: '👵' },
  { id: 'animals', label: 'Animal Welfare', emoji: '🐾' },
  { id: 'disaster', label: 'Disaster Relief', emoji: '🚨' },
];

export function CreateCampaign() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goalAmount: '',
    locationName: '',
    websiteUrl: '',
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Please sign in to create a campaign');
        navigate('/signin');
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.goalAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const campaignData = {
        ...formData,
        goalAmount: parseFloat(formData.goalAmount),
        location,
      };

      const response = await fetchWithAuth('/campaigns', {
        method: 'POST',
        body: JSON.stringify(campaignData),
      });

      toast.success('Campaign created successfully!');
      navigate(`/campaign/${response.campaign.id}`);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Create a Campaign</h1>
          <p className="text-gray-600 text-lg">
            Share your cause with the community and start making a difference
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your campaign. Be specific and compelling!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Campaign Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Community Garden Project"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell people about your campaign, why it matters, and how the funds will be used..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <span>{cat.emoji}</span>
                          <span>{cat.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalAmount">
                  Funding Goal (USD) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="goalAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="1000"
                  value={formData.goalAmount}
                  onChange={(e) => handleChange('goalAmount', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  placeholder="e.g., Atlanta, GA or your city name"
                  value={formData.locationName}
                  onChange={(e) => handleChange('locationName', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Enter the city or region where your campaign is based
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Select Location on Map
                </Label>
                <MapSelector onLocationSelect={handleLocationSelect} />
                {location && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <MapPin className="size-4" />
                    Location selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://yourorganization.org"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Add a link to your organization or campaign website for more information
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
