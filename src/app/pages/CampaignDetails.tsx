import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { fetchWithAuth, supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Loader2, MapPin, ExternalLink, Heart, ArrowLeft, DollarSign, Users } from 'lucide-react';

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

export function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/campaigns');
      const foundCampaign = response.campaigns.find((c: any) => c.id === id);
      
      if (!foundCampaign) {
        toast.error('Campaign not found');
        navigate('/dashboard');
        return;
      }

      setCampaign(foundCampaign);
    } catch (error: any) {
      console.error('Error loading campaign:', error);
      toast.error('Failed to load campaign');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to make a donation');
      navigate('/signin');
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setDonating(true);
    try {
      const response = await fetchWithAuth('/donate', {
        method: 'POST',
        body: JSON.stringify({
          campaignId: campaign.id,
          amount,
        }),
      });

      setCampaign(response.campaign);
      setDonationAmount('');
      toast.success(`Thank you for your ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} donation!`);
    } catch (error: any) {
      console.error('Donation error:', error);
      toast.error(error.message || 'Failed to process donation');
    } finally {
      setDonating(false);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId) || { emoji: '📌', label: 'Other' };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  const categoryInfo = getCategoryInfo(campaign.category);
  const progress = campaign.goalAmount > 0
    ? (campaign.currentAmount / campaign.goalAmount) * 100
    : 0;
  const remainingAmount = campaign.goalAmount - campaign.currentAmount;

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        className="mb-6"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Campaigns
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{categoryInfo.emoji}</div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {categoryInfo.label}
                </div>
              </div>
              <CardTitle className="text-3xl">{campaign.title}</CardTitle>
              <CardDescription className="text-base flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <Users className="size-4" />
                  By {campaign.creatorName || 'Anonymous'}
                </span>
                {campaign.locationName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {campaign.locationName}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About This Campaign</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              {campaign.websiteUrl && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-3">Learn More</h3>
                  <a
                    href={campaign.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <ExternalLink className="size-4" />
                    Visit Campaign Website
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    Click to learn more about this organization and their work
                  </p>
                </div>
              )}

              {campaign.location && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-3">Location</h3>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <MapPin className="size-4 inline mr-1" />
                      Latitude: {campaign.location.lat.toFixed(4)}, 
                      Longitude: {campaign.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-2xl">
                ${campaign.currentAmount?.toLocaleString() || 0}
              </CardTitle>
              <CardDescription>
                raised of ${campaign.goalAmount?.toLocaleString()} goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {progress.toFixed(1)}% funded • ${remainingAmount.toLocaleString()} to go
                </p>
              </div>

              {user ? (
                <form onSubmit={handleDonate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Donation Amount (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="25"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={donating} className="w-full" size="lg">
                    {donating ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="size-4 mr-2" />
                        Donate Now
                      </>
                    )}
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    {[10, 25, 50].map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDonationAmount(amount.toString())}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    Sign in to support this campaign
                  </p>
                  <Button asChild className="w-full" size="lg">
                    <Link to="/signin">
                      Sign In to Donate
                    </Link>
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-gray-600">
                <p className="font-medium mb-2">📋 Note:</p>
                <p>
                  This is a development platform. In production, donations would be processed
                  through secure payment providers like Stripe or PayPal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
