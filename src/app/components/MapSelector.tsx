import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Locate, Loader2, Search } from 'lucide-react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, radius?: number) => void;
  initialLocation?: { lat: number; lng: number };
}

export function MapSelector({ onLocationSelect, initialLocation }: MapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [radius, setRadius] = useState('10'); // in miles

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

      // Initialize map centered on US (or initial location)
      const center = initialLocation || { lat: 33.7490, lng: -84.3880 }; // Atlanta default
      const map = L.map(mapRef.current!).setView([center.lat, center.lng], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add click handler
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        updateLocationOnMap(lat, lng, L);
      });

      mapInstanceRef.current = map;

      // Add initial marker if location provided
      if (initialLocation) {
        updateLocationOnMap(initialLocation.lat, initialLocation.lng, L);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update circle when radius changes
  useEffect(() => {
    if (selectedLocation) {
      import('leaflet').then((L) => {
        updateLocationOnMap(selectedLocation.lat, selectedLocation.lng, L);
      });
    }
  }, [radius]);

  const updateLocationOnMap = (lat: number, lng: number, L: any) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker and circle
    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (circleRef.current) {
      circleRef.current.remove();
    }

    // Add new marker
    markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);

    // Add radius circle (convert miles to meters: 1 mile = 1609.34 meters)
    const radiusInMeters = parseFloat(radius) * 1609.34;
    circleRef.current = L.circle([lat, lng], {
      radius: radiusInMeters,
      color: '#6b7280',
      fillColor: '#6b7280',
      fillOpacity: 0.15,
      weight: 2
    }).addTo(mapInstanceRef.current);

    // Fit map to show the entire circle
    mapInstanceRef.current.fitBounds(circleRef.current.getBounds(), { padding: [50, 50] });

    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng, parseFloat(radius));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter an address or click on the map.');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        import('leaflet').then((L) => {
          if (mapInstanceRef.current) {
            updateLocationOnMap(latitude, longitude, L);
          }
        });
        
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error details:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });
        
        let errorMessage = 'Unable to retrieve your location. ';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage += 'Location access was denied. Please enable location permissions in your browser settings, or enter an address instead.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage += 'Location information is unavailable. Please enter an address or click on the map to select a location.';
            break;
          case 3: // TIMEOUT
            errorMessage += 'Location request timed out. Please try again or enter an address instead.';
            break;
          default:
            errorMessage += 'An unknown error occurred. Please enter an address or click on the map.';
        }
        
        alert(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 10000,
        maximumAge: 60000 // Allow cached position up to 1 minute old
      }
    );
  };

  const searchAddress = async () => {
    if (!addressInput.trim()) {
      alert('Please enter an address or zip code');
      return;
    }

    setSearchingAddress(true);
    try {
      // Use Nominatim geocoding service (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        import('leaflet').then((L) => {
          if (mapInstanceRef.current) {
            updateLocationOnMap(latitude, longitude, L);
          }
        });
      } else {
        alert('Address not found. Please try a different address or zip code.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to search for address. Please try again.');
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Search */}
      <div className="space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="address" className="text-sm text-gray-700 mb-2 block">
              Address or Zip Code
            </Label>
            <div className="flex gap-2">
              <Input
                id="address"
                type="text"
                placeholder="Enter address or zip code"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white border-gray-200"
              />
              <Button
                onClick={searchAddress}
                disabled={searchingAddress}
                className="bg-gray-700 hover:bg-gray-800"
              >
                {searchingAddress ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Search className="size-4 md:mr-2" />
                    <span className="hidden md:inline">Search</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="radius" className="text-sm text-gray-700 mb-2 block">
              Radius (miles)
            </Label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 miles</SelectItem>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
                <SelectItem value="50">50 miles</SelectItem>
                <SelectItem value="100">100 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
        <div ref={mapRef} className="h-[400px] w-full" />
        <div className="absolute top-4 right-4 z-[1000]">
          <Button
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            size="sm"
            className="shadow-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
          >
            {loadingLocation ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Locate className="size-4 md:mr-2" />
                <span className="hidden md:inline">Use My Location</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 flex items-start gap-2">
        <MapPin className="size-4 mt-0.5 flex-shrink-0" />
        <span>
          Enter an address/zip code and select a radius, use your current location, or click anywhere on the map. 
          The circle shows your selected search area.
        </span>
      </p>
    </div>
  );
}