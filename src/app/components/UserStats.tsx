import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, Users, Heart, Clock } from 'lucide-react';
import { fetchWithAuth } from '../lib/supabase';

export function UserStats() {
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    donationCount: 0,
    volunteerCommitments: 0,
    hoursCommitted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError(false);
      const response = await fetchWithAuth('/user-stats');
      setStats(response);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setError(true);
      // Set default stats on error
      setStats({
        totalDonated: 0,
        campaignsSupported: 0,
        donationCount: 0,
        volunteerCommitments: 0,
        hoursCommitted: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return null; // Silently hide stats on error
  }

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Donated
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
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
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
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
          <Clock className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
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
            Community Impact
          </CardTitle>
          <Heart className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalDonated + (stats.hoursCommitted * 25)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total value contributed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}