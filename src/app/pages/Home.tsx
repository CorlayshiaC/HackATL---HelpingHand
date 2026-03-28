import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Sparkles, ArrowRight, Users, DollarSign, Globe, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/supabase';

export function Home() {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<any[]>([]);

  useEffect(() => {
    loadFeaturedCampaigns();
  }, []);

  const loadFeaturedCampaigns = async () => {
    try {
      const response = await fetchWithAuth('/campaigns');
      // Get first 3 campaigns for featured section
      setFeaturedCampaigns((response.campaigns || []).slice(0, 3));
    } catch (error) {
      console.error('Error loading featured campaigns:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: 'bg-blue-100 text-blue-700',
      environment: 'bg-green-100 text-green-700',
      health: 'bg-pink-100 text-pink-700',
      education: 'bg-purple-100 text-purple-700',
      food: 'bg-orange-100 text-orange-700',
      housing: 'bg-yellow-100 text-yellow-700',
      arts: 'bg-indigo-100 text-indigo-700',
      community: 'bg-teal-100 text-teal-700',
      youth: 'bg-cyan-100 text-cyan-700',
      seniors: 'bg-amber-100 text-amber-700',
      animals: 'bg-lime-100 text-lime-700',
      disaster: 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const campaignImages = [
    'https://images.unsplash.com/photo-1760842543713-108c3cadbba1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXJjdWl0JTIwYm9hcmQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NDU5NDI3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1759334536558-84e96b73789c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZvcmVzdCUyMHN1bmxpZ2h0fGVufDF8fHx8MTc3NDcxNzc1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBoZWFsdGglMjBzY3JlZW5pbmd8ZW58MXx8fHwxNzc0NzE3NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f3ef]">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto pt-20 pb-16 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Sparkles className="size-4" />
              <span>AI-Powered Giving</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Small gifts,{' '}
              <span className="text-gray-400">big change</span>
              <br />
              in your community
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover local causes that matter to you. Our AI matches you with community projects based on your passions and location — anywhere in the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-[#b5a390] hover:bg-[#a39280] text-white rounded-lg px-6 gap-2 shadow-sm"
              >
                <Link to="/quiz">
                  <Sparkles className="size-5" />
                  Take the Match Quiz
                </Link>
              </Button>
              <Button 
                asChild 
                variant="ghost" 
                size="lg"
                className="text-gray-700 hover:text-gray-900 gap-2"
              >
                <Link to="/dashboard">
                  Browse Causes
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-5xl mx-auto py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white border-gray-200 text-center">
              <CardContent className="pt-12 pb-8">
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-gray-100 mb-4">
                  <Users className="size-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Local</h3>
                <p className="text-gray-600 text-sm">Community Members</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 text-center">
              <CardContent className="pt-12 pb-8">
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-gray-100 mb-4">
                  <DollarSign className="size-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">$1+</h3>
                <p className="text-gray-600 text-sm">Micro-Donations</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 text-center">
              <CardContent className="pt-12 pb-8">
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-gray-100 mb-4">
                  <Globe className="size-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Global</h3>
                <p className="text-gray-600 text-sm">Location-Based</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it Works */}
        <section className="max-w-5xl mx-auto py-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="text-6xl font-bold text-gray-200 mb-4">01</div>
                <CardTitle className="text-xl mb-3">Take the Quiz</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Answer a few fun questions about what you care about — education, environment, animals, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="text-6xl font-bold text-gray-200 mb-4">02</div>
                <CardTitle className="text-xl mb-3">Get AI Matches</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Our AI finds local causes that align with your passions and location. It's like a matchmaker for giving.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="text-6xl font-bold text-gray-200 mb-4">03</div>
                <CardTitle className="text-xl mb-3">Give & Track Impact</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Donate as little as $1 to causes you love. Watch your community impact grow over time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Featured Causes */}
        <section className="max-w-6xl mx-auto py-16 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Featured causes</h2>
            <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
              <Link to="/dashboard">
                View all
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign, index) => (
              <Link key={campaign.id} to={`/campaign/${campaign.id}`}>
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={campaignImages[index] || campaignImages[0]}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}>
                        {campaign.category}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">{campaign.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2 mb-3">
                      {campaign.description}
                    </CardDescription>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="size-4" />
                      <span>{campaign.locationName || 'Global'}</span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}