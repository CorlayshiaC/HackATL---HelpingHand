import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { fetchWithAuth, supabase } from '../lib/supabase';
import { Loader2, DollarSign, Users, Heart, Clock, MapPin, Calendar } from 'lucide-react';

export function Impact() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    donationCount: 0,
    volunteerCommitments: 0,
    hoursCommitted: 0,
  });
  const [donations, setDonations] = useState<any[]>([]);
  const [volunteerCommitments, setVolunteerCommitments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        navigate('/signin');
        return;
      }
      
      setUser(session.user);
      
      // Load stats and history
      await Promise.all([
        loadStats(),
        loadDonationHistory(),
        loadVolunteerHistory()
      ]);
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth('/user-stats');
      setStats(response);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadDonationHistory = async () => {
    try {
      const response = await fetchWithAuth('/my-donations');
      setDonations(response.donations || []);
    } catch (error) {
      console.error('Error loading donation history:', error);
    }
  };

  const loadVolunteerHistory = async () => {
    try {
      const response = await fetchWithAuth('/my-volunteers');
      setVolunteerCommitments(response.commitments || []);
    } catch (error) {
      console.error('Error loading volunteer history:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
        <Loader2 className="size-12 animate-spin text-gray-600" />
      </div>
    );
  }

  const totalImpactValue = stats.totalDonated + (stats.hoursCommitted * 25);

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Your Impact</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Track your contributions and see the difference you're making in your community
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Donated
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${stats.totalDonated.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.donationCount} {stats.donationCount === 1 ? 'donation' : 'donations'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Campaigns Supported
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.campaignsSupported}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Different causes helped
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Volunteer Hours
              </CardTitle>
              <Clock className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.hoursCommitted}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.volunteerCommitments} {stats.volunteerCommitments === 1 ? 'commitment' : 'commitments'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Impact Value
              </CardTitle>
              <Heart className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${totalImpactValue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Money + volunteer time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Donation History */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation History</h2>
          {donations.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="py-12 text-center">
                <DollarSign className="size-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No donations yet</h3>
                <p className="text-gray-600 mb-6">
                  Start making a difference by supporting campaigns you care about
                </p>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-700 hover:bg-gray-800"
                >
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <Card 
                  key={donation.id} 
                  className="bg-white border-gray-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/campaign/${donation.campaignId}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {donation.campaignTitle || 'Campaign'}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {donation.campaignLocation || 'Location'}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${donation.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Volunteer Commitments */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Commitments</h2>
          {volunteerCommitments.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="py-12 text-center">
                <Clock className="size-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No volunteer commitments yet</h3>
                <p className="text-gray-600 mb-6">
                  Donate your time to help causes that need volunteers
                </p>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-700 hover:bg-gray-800"
                >
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {volunteerCommitments.map((commitment) => (
                <Card 
                  key={commitment.id} 
                  className="bg-white border-gray-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/campaign/${commitment.campaignId}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {commitment.campaignTitle || 'Campaign'}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(commitment.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {commitment.campaignLocation || 'Location'}
                          </span>
                        </CardDescription>
                        {commitment.message && (
                          <p className="text-sm text-gray-600 mt-2">{commitment.message}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {commitment.hours}h
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
