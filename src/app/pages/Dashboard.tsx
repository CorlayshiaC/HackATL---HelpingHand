import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { fetchPublic, supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Loader2, Search, Plus, MapPin, Heart, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { UserStats } from '../components/UserStats';

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

export function Dashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    loadCampaigns();
  }, []);

  useEffect(() => {
    // Filter campaigns based on search
    if (searchQuery.trim() === '') {
      setFilteredCampaigns(campaigns);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCampaigns(
        campaigns.filter(
          (c) =>
            c.title?.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query) ||
            c.locationName?.toLowerCase().includes(query) ||
            c.category?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, campaigns]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetchPublic('/campaigns');
      setCampaigns(response.campaigns || []);
      setFilteredCampaigns(response.campaigns || []);
    } catch (error: any) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId) || { emoji: '📌', label: 'Other' };
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Browse Causes</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Discover causes making a difference in communities worldwide
            </p>
          </div>

          {/* User Stats (only shown when logged in) */}
          {user && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Impact</h2>
              <UserStats />
            </>
          )}

          {/* General Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
                <TrendingUp className="size-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{campaigns.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
                <Heart className="size-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {new Set(campaigns.map((c) => c.category)).size}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Goal</CardTitle>
                <MapPin className="size-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  ${campaigns.reduce((sum, c) => sum + (c.goalAmount || 0), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search campaigns by title, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <Button asChild variant="outline" className="bg-white border-gray-200">
              <Link to="/quiz">Take Quiz</Link>
            </Button>
            {user && (
              <Button asChild className="bg-gray-700 hover:bg-gray-800">
                <Link to="/create">
                  <Plus className="size-4 mr-2" />
                  Create
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-gray-600" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-20 text-center">
              <Heart className="size-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No Campaigns Found</h3>
              <p className="text-gray-600 mb-6">
                {campaigns.length === 0
                  ? "Be the first to create a campaign!"
                  : "No campaigns match your search. Try different keywords."}
              </p>
              {user && campaigns.length === 0 && (
                <Button asChild className="bg-gray-700 hover:bg-gray-800">
                  <Link to="/create">
                    <Plus className="size-5 mr-2" />
                    Create Campaign
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => {
              const categoryInfo = getCategoryInfo(campaign.category);
              const progress = campaign.goalAmount > 0
                ? (campaign.currentAmount / campaign.goalAmount) * 100
                : 0;

              return (
                <Card
                  key={campaign.id}
                  className="bg-white border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/campaign/${campaign.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">{categoryInfo.emoji}</div>
                      <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {categoryInfo.label}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-gray-900">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Raised</span>
                        <span className="font-semibold text-gray-900">
                          ${(campaign.currentAmount || 0).toLocaleString()} of $
                          {campaign.goalAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-700 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progress.toFixed(0)}% funded</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="size-4" />
                        <span className="truncate">{campaign.locationName || 'Global'}</span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        by {campaign.creatorName || 'Anonymous'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}