import React, { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const PropertyLocationMap = ({ property }) => {
  const [coordinates, setCoordinates] = useState({ lat: 25.2048, lng: 55.2708 }); // Default to Dubai
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  // Load Google Maps JavaScript API with Marker library
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAsSnLmp0FYZEaFmTa7Ot8NmJf6pJmgzEA",
    libraries: ["places"], // Include Places API
  });

  // Function to initialize the map
  const initializeMap = async () => {
    if (!isLoaded) return;
    
    const mapDiv = document.getElementById("property-map");
    if (!mapDiv) return;

    // Import Advanced Marker library dynamically as recommended
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
    
    // Create the map instance with required mapId for advanced markers
    const mapInstance = new window.google.maps.Map(mapDiv, {
      center: coordinates,
      zoom: 15,
      scrollwheel: false,
      mapId: "4d2efa2d0d964508c9b84c0a", // Required for advanced markers
    });
    
    setMap(mapInstance);
    
    // Create info window
    const infoWindowInstance = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; max-width: 200px;">
          <p style="font-weight: 600; margin: 0;">${property?.title || "Property Location"}</p>
          <p style="margin-top: 4px; margin-bottom: 0;">${locationText}</p>
        </div>
      `,
    });
    setInfoWindow(infoWindowInstance);

    // Create and add the Advanced Marker
    const markerInstance = new AdvancedMarkerElement({
      position: coordinates,
      map: mapInstance,
      title: property?.title || "Property Location",
    });
    
    // Add click event to marker
    markerInstance.addListener("click", () => {
      infoWindowInstance.open({
        anchor: markerInstance,
        map: mapInstance,
      });
    });
    
    setMarker(markerInstance);
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      setIsLoading(true);
      setError(null);

      // Get full address from property
      const address = [
        property?.propertyaddress,
        property?.subcommunity,
        property?.community,
        property?.country || "UAE",
      ]
        .filter(Boolean)
        .join(", ");
      console.log("Constructed address:", address); // Debug log

      setLocationText(address);

      if (!address || address === ", , UAE") {
        setError("No valid address provided");
        setIsLoading(false);
        return;
      }

      if (!isLoaded) return;

      // Use Google Places API for geocoding
      const geocoder = new window.google.maps.Geocoder();
      try {
        const results = await new Promise((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            console.log("Geocode status:", status); // Debug log
            console.log("Geocode results:", results); // Debug log
            if (status === window.google.maps.GeocoderStatus.OK) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed with status: ${status}`));
            }
          });
        });

        if (results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          const newCoords = { lat: lat(), lng: lng() };
          console.log("New coordinates:", newCoords); // Debug log
          setCoordinates(newCoords);
        } else {
          // Fallback to community if detailed address fails
          if (property?.community) {
            const fallbackResults = await new Promise((resolve, reject) => {
              geocoder.geocode(
                { address: `${property.community}, UAE` },
                (results, status) => {
                  console.log("Fallback geocode status:", status); // Debug log
                  console.log("Fallback geocode results:", results); // Debug log
                  if (status === window.google.maps.GeocoderStatus.OK) {
                    resolve(results);
                  } else {
                    reject(new Error(`Fallback geocoding failed with status: ${status}`));
                  }
                }
              );
            });

            if (fallbackResults && fallbackResults.length > 0) {
              const { lat, lng } = fallbackResults[0].geometry.location;
              const newCoords = { lat: lat(), lng: lng() };
              console.log("Fallback coordinates:", newCoords); // Debug log
              setCoordinates(newCoords);
            } else {
              setError("Location not found");
            }
          } else {
            setError("Location not found");
          }
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Failed to load map location");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [property, isLoaded]);

  // Initialize or update map when coordinates change or map loads
  useEffect(() => {
    if (isLoaded && !isLoading && !error) {
      if (map) {
        // Update existing map
        map.setCenter(coordinates);
        
        if (marker) {
          marker.position = coordinates;
        }
      } else {
        // Initialize map
        initializeMap();
      }
    }
  }, [isLoaded, isLoading, coordinates, error]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (marker) {
        marker.map = null;
      }
      setMap(null);
      setMarker(null);
      setInfoWindow(null);
    };
  }, []);

  return (
    <div className="w-full mt-8">
      <h2 className="text-3xl mb-6 font-playfair text-[#00603A]">
        Location Map
      </h2>
      <div className="w-full relative h-96 border border-gray-200">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <p className="text-red-600 font-medium">{error}</p>
            <p className="mt-2 text-gray-500 text-sm">
              Please check the property address details
            </p>
          </div>
        ) : !isLoaded || isLoading ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <p className="text-gray-600">Loading map...</p>
          </div>
        ) : (
          <div id="property-map" className="w-full h-full"></div>
        )}
      </div>
    </div>
  );
};

export default PropertyLocationMap;