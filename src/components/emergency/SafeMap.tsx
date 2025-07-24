import { useState, useEffect } from "react";
import { MapPin, Navigation, Shield, Phone, Building2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Helper to calculate distance between two lat/lng points (Haversine formula)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

interface SafeLocation {
  id: string;
  name: string;
  type: "police" | "hospital" | "safe_space";
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  isVerified: boolean;
  hours: string;
  distanceKm?: number;
}

// Example locations with coordinates (replace with real data as needed)
const safeLocations: SafeLocation[] = [
  {
    id: "1",
    name: "Kabete Police Station",
    type: "police",
    address: "123 Main Street, Downtown",
    lat: -1.2647,
    lng: 36.7156,
    phone: "+1-555-POLICE",
    isVerified: true,
    hours: "24/7"
  },
  {
    id: "2",
    name: "City General Hospital",
    type: "hospital",
    address: "456 Health Avenue",
    lat: -1.2620,
    lng: 36.8000,
    phone: "+1-555-HOSPITAL",
    isVerified: true,
    hours: "24/7"
  },
  {
    id: "3",
    name: "Women's Shelter & Support Center",
    type: "safe_space",
    address: "789 Safety Street",
    lat: -1.2700,
    lng: 36.7900,
    phone: "+1-555-SHELTER",
    isVerified: true,
    hours: "24/7 Hotline"
  },
  {
    id: "4",
    name: "Community Safety Center",
    type: "safe_space",
    address: "321 Community Lane",
    lat: -1.2500,
    lng: 36.7800,
    phone: "+1-555-COMMUNITY",
    isVerified: true,
    hours: "8 AM - 10 PM"
  },
  {
    id: "5",
    name: "North District Hospital",
    type: "hospital",
    address: "654 North Road",
    lat: -1.2400,
    lng: 36.7700,
    phone: "+1-555-NORTH",
    isVerified: true,
    hours: "24/7"
  }
];

const getLocationIcon = (type: string) => {
  switch (type) {
    case "police": return "🚓";
    case "hospital": return "🏥";
    case "safe_space": return "🛡️";
    default: return "📍";
  }
};

const getLocationColor = (type: string) => {
  switch (type) {
    case "police": return "text-blue-600";
    case "hospital": return "text-red-600";
    case "safe_space": return "text-green-600";
    default: return "text-muted-foreground";
  }
};

const SafeMap = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to retrieve your location.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  const callLocation = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const getDirections = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // Filter and sort locations by distance if userLocation is available
  let filteredLocations = safeLocations;
  if (selectedFilter !== "all") {
    filteredLocations = filteredLocations.filter(location => location.type === selectedFilter);
  }
  if (userLocation) {
    filteredLocations = filteredLocations
      .map(location => ({
        ...location,
        distanceKm: getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          location.lat,
          location.lng
        )
      }))
      .sort((a, b) => (a.distanceKm! - b.distanceKm!));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Safe Locations Near You</CardTitle>
              <p className="text-sm text-muted-foreground">
                Find nearby police stations, hospitals, and verified safe spaces
              </p>
            </div>
            <Button onClick={requestLocation} variant="outline">
              <Navigation className="w-4 h-4 mr-2" />
              Update Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
            >
              <Filter className="w-4 h-4 mr-2" />
              All Locations
            </Button>
            <Button
              variant={selectedFilter === "police" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("police")}
            >
              🚓 Police
            </Button>
            <Button
              variant={selectedFilter === "hospital" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("hospital")}
            >
              🏥 Hospitals
            </Button>
            <Button
              variant={selectedFilter === "safe_space" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("safe_space")}
            >
              🛡️ Safe Spaces
            </Button>
          </div>

          {/* Mock Map Area */}
          <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10" />
            <div className="text-center z-10">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Interactive Map View</p>
              {userLocation ? (
                <div className="text-sm text-primary mt-2">
                  <strong>Your Location:</strong><br />
                  Lat: {userLocation.lat.toFixed(5)}, Lng: {userLocation.lng.toFixed(5)}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click 'Update Location' to enable map
                </p>
              )}
              {locationError && (
                <p className="text-xs text-red-500 mt-2">{locationError}</p>
              )}
            </div>
            {/* Mock location pins */}
            <div className="absolute top-1/4 left-1/4 text-2xl animate-bounce">🚓</div>
            <div className="absolute top-1/3 right-1/3 text-2xl animate-bounce" style={{ animationDelay: "0.5s" }}>🏥</div>
            <div className="absolute bottom-1/3 left-1/2 text-2xl animate-bounce" style={{ animationDelay: "1s" }}>🛡️</div>
            {/* Show user's location as a pin if available */}
            {userLocation && (
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              >
                <span className="text-3xl">📍</span>
                <div className="text-xs text-primary text-center">You</div>
              </div>
            )}
          </div>

          {/* Locations List */}
          <div className="space-y-3">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="transition-all hover:shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">{getLocationIcon(location.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{location.name}</h3>
                          {location.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{location.address}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {userLocation && location.distanceKm !== undefined ? (
                            <span>📍 {location.distanceKm.toFixed(2)} km away</span>
                          ) : (
                            <span>📍 Distance unknown</span>
                          )}
                          <span>🕒 {location.hours}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {location.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => callLocation(location.phone!)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => getDirections(location.address)}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Instructions */}
      <Card className="bg-emergency/5 border-emergency/20">
        <CardContent className="p-4">
          <h3 className="font-medium text-emergency mb-2">🚨 In Case of Emergency</h3>
          <div className="text-sm space-y-1">
            <p>• Call local emergency services first (911, 999, etc.)</p>
            <p>• Use the nearest safe location as a meeting point for help</p>
            <p>• Share your location with trusted contacts</p>
            <p>• If safe to do so, head to the nearest verified location</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeMap;