import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { fetchPublic } from '../lib/supabase';
import { toast } from 'sonner';
import { Sparkles, Loader2, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { MapSelector } from '../components/MapSelector';
import { DollarSign, Users, Heart } from 'lucide-react';

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

interface QuizResults {
  categories: string[];
  radius: number;
  location: { lat: number; lng: number } | null;
}

export function Quiz() {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState<number[]>([25]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const navigate = useNavigate();

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleGetMatches = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one cause category');
      return;
    }

    setLoading(true);
    try {
      const preferences: QuizResults = {
        categories: selectedCategories,
        radius: radius[0],
        location,
      };

      const response = await fetchPublic('/match', {
        method: 'POST',
        body: JSON.stringify({ preferences, location }),
      });

      setMatches(response.matches || []);
      setStep(3);
      
      if (response.matches?.length === 0) {
        toast.info('No matches found. Try adjusting your preferences or explore all campaigns.');
      } else {
        toast.success(`Found ${response.matches.length} matching campaigns!`);
      }
    } catch (error: any) {
      console.error('Match error:', error);
      toast.error(error.message || 'Failed to find matches');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, selectedRadius?: number) => {
    setLocation({ lat, lng });
    if (selectedRadius) {
      setRadius([selectedRadius]);
    }
    toast.success('Location selected!');
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step
                      ? 'w-12 bg-gray-700'
                      : s < step
                      ? 'w-8 bg-gray-400'
                      : 'w-8 bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Step {step} of 3
            </p>
          </div>

          {/* Step 1: Category Selection */}
          {step === 1 && (
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Sparkles className="size-6" />
                  <CardTitle className="text-2xl text-gray-900">What Causes Matter to You?</CardTitle>
                </div>
                <CardDescription>
                  Select all the categories that align with your values. Our AI will match you
                  with relevant campaigns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCategories.includes(category.id)
                          ? 'border-gray-700 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label
                        htmlFor={category.id}
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <span className="text-2xl">{category.emoji}</span>
                        <span className="font-medium">{category.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={selectedCategories.length === 0}
                    size="lg"
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    Next: Location
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location & Radius */}
          {step === 2 && (
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MapPin className="size-6" />
                  <CardTitle className="text-2xl text-gray-900">Where Do You Want to Help?</CardTitle>
                </div>
                <CardDescription>
                  Enter an address or zip code, select your radius, and we'll find campaigns in your area.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <MapSelector onLocationSelect={handleLocationSelect} />
                  {location && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="size-4" />
                      Location confirmed with {radius[0]} mile radius
                    </p>
                  )}
                </div>

                <div className="flex justify-between gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    size="lg"
                    className="border-gray-200"
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleGetMatches}
                    disabled={loading || !location}
                    size="lg"
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Finding Matches...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4 mr-2" />
                        Get My Matches
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div className="space-y-6">
              <Card className="bg-gray-700 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="size-6" />
                    Your Personalized Matches
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    We found {matches.length} campaigns that align with your preferences
                  </CardDescription>
                </CardHeader>
              </Card>

              {matches.length === 0 ? (
                <Card className="bg-white border-gray-200">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600 mb-4">
                      No campaigns match your current criteria. Try adjusting your preferences or
                      browse all campaigns.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => setStep(1)} variant="outline" className="border-gray-200">
                        Adjust Preferences
                      </Button>
                      <Button onClick={() => navigate('/dashboard')} className="bg-gray-700 hover:bg-gray-800">
                        Browse All Campaigns
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-6">
                    {matches.map((campaign) => {
                      const progress = ((campaign.currentAmount || 0) / campaign.goalAmount) * 100;
                      const needsUrgent = campaign.urgent;
                      
                      return (
                        <Card 
                          key={campaign.id} 
                          className={`bg-white hover:shadow-xl transition-all cursor-pointer ${
                            needsUrgent ? 'border-2 border-red-200' : 'border-gray-200'
                          }`}
                          onClick={() => navigate(`/campaign/${campaign.id}`)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {needsUrgent && (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                      URGENT
                                    </span>
                                  )}
                                  {campaign.campaignType === 'personal' && (
                                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                                      Personal
                                    </span>
                                  )}
                                </div>
                                <CardTitle className="text-xl mb-2 text-gray-900">{campaign.title}</CardTitle>
                                <CardDescription className="text-base line-clamp-2">
                                  {campaign.personalStory || campaign.description}
                                </CardDescription>
                              </div>
                              <div className="ml-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
                                {CATEGORIES.find((c) => c.id === campaign.category)?.emoji}{' '}
                                {CATEGORIES.find((c) => c.id === campaign.category)?.label}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {/* Progress Bar */}
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-gray-600">
                                    {progress.toFixed(0)}% funded
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    ${campaign.currentAmount?.toLocaleString() || 0} of $
                                    {campaign.goalAmount?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-gray-600 to-gray-800 h-3 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(progress, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Need Type Badges */}
                              <div className="flex flex-wrap gap-2">
                                {(campaign.needType === 'money' || campaign.needType === 'both') && (
                                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <DollarSign className="size-3" />
                                    Donations needed
                                  </span>
                                )}
                                {campaign.volunteerNeeds && (
                                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <Users className="size-3" />
                                    Volunteers needed
                                  </span>
                                )}
                                {campaign.goodsNeeded && (
                                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <Heart className="size-3" />
                                    Goods needed
                                  </span>
                                )}
                              </div>

                              {/* Location and Action */}
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="size-4" />
                                  <span>{campaign.locationName || 'Location available'}</span>
                                </div>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/campaign/${campaign.id}`);
                                  }}
                                  size="sm"
                                  className="bg-gray-700 hover:bg-gray-800"
                                >
                                  View Details
                                  <ArrowRight className="size-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 justify-center mt-8">
                    <Button onClick={() => setStep(1)} variant="outline" className="border-gray-200">
                      <ArrowLeft className="size-4 mr-2" />
                      Retake Quiz
                    </Button>
                    <Button onClick={() => navigate('/dashboard')} className="bg-gray-700 hover:bg-gray-800">
                      Browse All Campaigns
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}