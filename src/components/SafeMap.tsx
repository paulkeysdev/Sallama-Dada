import React, { useEffect, useRef, useState } from "react";

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyB4if5Ir7Gxea1nnxnQG3uIrkGkv9cIV9I";

type LatLng = {
  lat: number;
  lng: number;
};

const defaultCenter: LatLng = {
  lat: 6.5244, // Example: Lagos, Nigeria
  lng: 3.3792,
};

export default function SafeMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [map, setMap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if ((window as any).google?.maps) return; // Already loaded

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => {
      // Script loaded
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      () => setError("Unable to retrieve your location."),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Initialize map and update marker
  useEffect(() => {
    if (!(window as any).google?.maps || !mapRef.current) return;

    if (!map) {
      const newMap = new (window as any).google.maps.Map(mapRef.current, {
        center: userLocation || defaultCenter,
        zoom: 15,
      });
      setMap(newMap);
    } else if (userLocation) {
      map.setCenter(userLocation);
    }
  }, [userLocation, map]);

  // Add marker for user location
  useEffect(() => {
    if (!map || !userLocation) return;
    const marker = new (window as any).google.maps.Marker({
      position: userLocation,
      map,
      title: "Your Location",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
    });
    return () => marker.setMap(null);
  }, [map, userLocation]);

  return (
    <div style={{ width: "100%", height: "400px", position: "relative" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      />
      {error && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            color: "#d32f2f",
            zIndex: 2,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}