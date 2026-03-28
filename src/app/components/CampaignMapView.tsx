import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { MapPin, DollarSign, Users, Heart } from 'lucide-react';

interface CampaignMapViewProps {
  campaigns: any[];
  centerLocation: { lat: number; lng: number };
  radius: number;
  onCampaignClick: (campaignId: string) => void;
  categoryEmojis: Record<string, string>;
}

export function CampaignMapView({ 
  campaigns, 
  centerLocation, 
  radius,
  onCampaignClick,
  categoryEmojis 
}: CampaignMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circleRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Initialize map centered on selected location
      const map = L.map(mapRef.current!).setView([centerLocation.lat, centerLocation.lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);

      // Add radius circle (convert miles to meters: 1 mile = 1609.34 meters)
      const radiusInMeters = radius * 1609.34;
      circleRef.current = L.circle([centerLocation.lat, centerLocation.lng], {
        radius: radiusInMeters,
        color: '#374151',
        fillColor: '#9ca3af',
        fillOpacity: 0.1,
        weight: 2,
      }).addTo(map);

      // Add center location marker
      const centerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: #3b82f6;
            border: 4px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([centerLocation.lat, centerLocation.lng], { icon: centerIcon })
        .bindPopup('<div class="text-center font-semibold">📍 Your Selected Location</div>')
        .addTo(map);

      // Add campaign markers
      campaigns.forEach((campaign) => {
        if (!campaign.location?.lat || !campaign.location?.lng) return;

        const emoji = categoryEmojis[campaign.category] || '📌';
        const isUrgent = campaign.urgent;

        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: ${isUrgent ? '#fee2e2' : 'white'};
              border: 3px solid ${isUrgent ? '#dc2626' : '#374151'};
              border-radius: 50%;
              width: 42px;
              height: 42px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">
              ${emoji}
            </div>
          `,
          iconSize: [42, 42],
          iconAnchor: [21, 42],
          popupAnchor: [0, -42],
        });

        const progress = ((campaign.currentAmount || 0) / campaign.goalAmount) * 100;

        const popupContent = `
          <div style="padding: 12px; min-width: 250px;">
            <div style="margin-bottom: 12px;">
              <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                ${isUrgent ? '<span style="padding: 2px 8px; background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 600; border-radius: 9999px;">URGENT</span>' : ''}
                ${campaign.campaignType === 'personal' ? '<span style="padding: 2px 8px; background: #fce7f3; color: #ec4899; font-size: 11px; font-weight: 600; border-radius: 9999px;">Personal</span>' : ''}
              </div>
              <h3 style="font-weight: 700; font-size: 15px; margin-bottom: 4px; color: #111827; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${campaign.title}
              </h3>
              <p style="font-size: 13px; color: #4b5563; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${campaign.description}
              </p>
            </div>

            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="color: #6b7280;">${progress.toFixed(0)}% funded</span>
                <span style="font-weight: 600; color: #111827;">
                  $${(campaign.currentAmount || 0).toLocaleString()} / $${campaign.goalAmount.toLocaleString()}
                </span>
              </div>
              <div style="width: 100%; background: #e5e7eb; border-radius: 9999px; height: 8px;">
                <div style="background: #374151; height: 8px; border-radius: 9999px; width: ${Math.min(progress, 100)}%;"></div>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
              ${(campaign.needType === 'money' || campaign.needType === 'both') ? '<span style="padding: 2px 8px; background: #f0fdf4; color: #15803d; font-size: 11px; font-weight: 500; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px;">💵 Donations</span>' : ''}
              ${campaign.volunteerNeeds ? '<span style="padding: 2px 8px; background: #eff6ff; color: #1e40af; font-size: 11px; font-weight: 500; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px;">👥 Volunteers</span>' : ''}
              ${campaign.goodsNeeded ? '<span style="padding: 2px 8px; background: #faf5ff; color: #7c3aed; font-size: 11px; font-weight: 500; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px;">❤️ Goods</span>' : ''}
            </div>

            <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #4b5563; margin-bottom: 12px;">
              📍 <span>${campaign.locationName || 'Location available'}</span>
            </div>

            <button 
              onclick="window.dispatchEvent(new CustomEvent('campaign-click', { detail: '${campaign.id}' }))"
              style="width: 100%; padding: 8px 16px; background: #374151; color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 13px; cursor: pointer;"
              onmouseover="this.style.background='#1f2937'"
              onmouseout="this.style.background='#374151'"
            >
              View Details
            </button>
          </div>
        `;

        const marker = L.marker([campaign.location.lat, campaign.location.lng], { icon })
          .bindPopup(popupContent, { maxWidth: 300, minWidth: 250 })
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  useEffect(() => {
    // Listen for campaign click events from popup buttons
    const handleCampaignClick = (event: any) => {
      const campaignId = event.detail;
      onCampaignClick(campaignId);
    };

    window.addEventListener('campaign-click' as any, handleCampaignClick);

    return () => {
      window.removeEventListener('campaign-click' as any, handleCampaignClick);
    };
  }, [onCampaignClick]);

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
