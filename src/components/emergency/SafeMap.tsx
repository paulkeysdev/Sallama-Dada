import { useState, useEffect } from "react";
import { MapPin, Navigation, Shield, Phone, Building2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

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
    id: "6",
    name: "Central Police Station Nairobi",
    type: "police",
    address: "Moi Avenue, Nairobi",
    lat: -1.2841,
    lng: 36.8219,
    phone: "+254-20-2222222",
    isVerified: true,
    hours: "24/7"
  },
  {
    id: "7",
    name: "Kilimani Police Station",
    type: "police",
    address: "Argwings Kodhek Rd, Nairobi",
    lat: -1.2921,
    lng: 36.7836,
    phone: "+254-20-2722354",
    isVerified: true,
    hours: "24/7"
  },
  {
    id: "8",
    name: "Parklands Police Station",
    type: "police",
    address: "Ojijo Rd, Parklands, Nairobi",
    lat: -1.2635,
    lng: 36.8167,
    phone: "+254-20-3741211",
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

const mapContainerStyle = {
  width: "100%",
  height: "256px", // h-64
};

const SafeMap = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [places, setPlaces] = useState<SafeLocation[]>([]);

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

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!userLocation) return;
      try {
        const types = ["hospital", "police"];
        let allResults: SafeLocation[] = [];
        for (const type of types) {
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=3000&type=${type}&key=AIzaSyB4if5Ir7Gxea1nnxnQG3uIrkGkv9cIV9I`;
          const res = await axios.get(url);
          if (res.data.results) {
            allResults = allResults.concat(
              res.data.results.map((place: any, idx: number) => ({
                id: `${type}-${place.place_id || idx}`,
                name: place.name,
                type: type as "hospital" | "police",
                address: place.vicinity || place.formatted_address || "Unknown address",
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
                phone: undefined,
                isVerified: false,
                hours: "Unknown",
                distanceKm: getDistanceFromLatLonInKm(
                  userLocation.lat,
                  userLocation.lng,
                  place.geometry.location.lat,
                  place.geometry.location.lng
                ),
              }))
            );
          }
        }
        setPlaces(allResults);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchNearbyPlaces();
  }, [userLocation]);

  // Filter static safe spaces to only those within 3km of the user
  const filteredSafeSpaces = userLocation
    ? safeLocations
        .filter(loc => loc.type === "safe_space")
        .map(loc => ({
          ...loc,
          distanceKm: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, loc.lat, loc.lng)
        }))
        .filter(loc => loc.distanceKm <= 3)
    : safeLocations.filter(loc => loc.type === "safe_space");

  // Merge dynamic and filtered static locations
  let allLocations: SafeLocation[] = [
    ...places,
    ...filteredSafeSpaces,
  ];

  if (selectedFilter !== "all") {
    allLocations = allLocations.filter(location => location.type === selectedFilter);
  }
  if (userLocation) {
    allLocations = allLocations.sort((a, b) => (a.distanceKm! - b.distanceKm!));
  }

  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB4if5Ir7Gxea1nnxnQG3uIrkGkv9cIV9I", // Your API key
  });

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

          {/* Real Google Map Area */}
          <div className="h-64 rounded-lg mb-6 overflow-hidden">
            {isLoaded && userLocation ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                zoom={15}
              >
                <Marker position={userLocation} label="You" />
                {allLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={{ lat: location.lat, lng: location.lng }}
                    label={getLocationIcon(location.type)}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-muted/50 rounded-lg">
                <MapPin className="w-12 h-12 mb-2 text-primary" />
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
            )}
          </div>

          {/* Locations List */}
          <div className="space-y-3">
            {allLocations.map((location) => (
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