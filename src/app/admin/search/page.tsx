'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, FiFilter, FiMapPin, FiHome, FiDollarSign, FiMaximize,
  FiHeart, FiEye, FiCalendar, FiUser, FiWifi, FiTv,
  FiCoffee, FiShield, FiWind, FiDroplet, FiZap, FiSun
} from 'react-icons/fi';
import { IoBed } from 'react-icons/io5';
import { MdBathtub, MdPool, MdFitnessCenter, MdPets } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: 'house' | 'condo' | 'apartment' | 'commercial' | 'land';
  status: 'active' | 'pending' | 'sold';
  bedrooms?: number;
  bathrooms?: number;
  sqft: number;
  images: string[];
  agent: string;
  dateAdded: string;
  views: number;
  featured: boolean;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  description: string;
}

interface SearchFilters {
  query: string;
  priceRange: [number, number];
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  sqftRange: [number, number];
}

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    address: '123 Oak Street, Downtown, NY 10001',
    price: 450000,
    type: 'condo',
    status: 'active',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: ['/images/property1.jpg'],
    agent: 'Sarah Johnson',
    dateAdded: '2024-01-15',
    views: 245,
    featured: true,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    amenities: ['wifi', 'parking', 'gym', 'pool', 'security'],
    description: 'Beautiful modern condo with city views and premium amenities.'
  },
  {
    id: '2',
    title: 'Luxury Family Home',
    address: '456 Maple Avenue, Suburbs, NY 10002',
    price: 750000,
    type: 'house',
    status: 'active',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    images: ['/images/property2.jpg'],
    agent: 'Mike Chen',
    dateAdded: '2024-01-10',
    views: 189,
    featured: false,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    amenities: ['parking', 'garden', 'fireplace', 'ac', 'heating'],
    description: 'Spacious family home with large backyard and modern kitchen.'
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    address: '789 Pine Street, Midtown, NY 10003',
    price: 280000,
    type: 'apartment',
    status: 'active',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    images: ['/images/property3.jpg'],
    agent: 'Lisa Wang',
    dateAdded: '2024-01-20',
    views: 156,
    featured: true,
    coordinates: { lat: 40.7505, lng: -73.9934 },
    amenities: ['wifi', 'laundry', 'elevator', 'doorman'],
    description: 'Perfect starter home in the heart of the city.'
  }
];

const amenityOptions = [
  { id: 'wifi', label: 'WiFi', icon: <FiWifi /> },
  { id: 'parking', label: 'Parking', icon: <FiHome /> },
  { id: 'gym', label: 'Gym', icon: <MdFitnessCenter /> },
  { id: 'pool', label: 'Pool', icon: <MdPool /> },
  { id: 'security', label: 'Security', icon: <FiShield /> },
  { id: 'laundry', label: 'Laundry', icon: <FiDroplet /> },
  { id: 'ac', label: 'Air Conditioning', icon: <FiWind /> },
  { id: 'heating', label: 'Heating', icon: <FiZap /> },
  { id: 'balcony', label: 'Balcony', icon: <FiSun /> },
  { id: 'garden', label: 'Garden', icon: <FiSun /> },
  { id: 'fireplace', label: 'Fireplace', icon: <FiZap /> },
  { id: 'elevator', label: 'Elevator', icon: <FiMaximize /> },
  { id: 'doorman', label: 'Doorman', icon: <FiUser /> },
  { id: 'pets', label: 'Pet Friendly', icon: <MdPets /> }
];

// Google Maps component
const GoogleMap = ({ 
  properties, 
  hoveredProperty, 
  selectedProperty, 
  onPropertySelect 
}: { 
  properties: Property[], 
  hoveredProperty: Property | null,
  selectedProperty: Property | null,
  onPropertySelect: (property: Property | null) => void
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      // Initialize map
      const map = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Clear existing info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // Add markers for all properties
      properties.forEach(property => {
        const isSelected = selectedProperty?.id === property.id;
        const isHovered = hoveredProperty?.id === property.id;
        
        const marker = new (window as any).google.maps.Marker({
          position: property.coordinates,
          map: map,
          title: property.title,
          icon: {
            url: isSelected 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
                </svg>
              `)
              : isHovered 
                ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="#ffffff" stroke-width="3"/>
                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
                  </svg>
                `)
                : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#64748b" stroke="#ffffff" stroke-width="2"/>
                    <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">$</text>
                  </svg>
                `),
            scaledSize: new (window as any).google.maps.Size(
              isSelected || isHovered ? 32 : 24,
              isSelected || isHovered ? 32 : 24
            )
          }
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          if (selectedProperty?.id === property.id) {
            onPropertySelect(null); // Deselect if already selected
          } else {
            onPropertySelect(property); // Select property
          }
        });

        markersRef.current.push(marker);
      });

      // Add search radius circle (example: 2km radius from center)
      const searchRadius = new (window as any).google.maps.Circle({
        strokeColor: '#2563eb',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2563eb',
        fillOpacity: 0.1,
        map: map,
        center: { lat: 40.7128, lng: -74.0060 },
        radius: 2000, // 2km radius
      });

      circleRef.current = searchRadius;

      // Add polygon area (example: downtown area)
      const downtownArea = new (window as any).google.maps.Polygon({
        paths: [
          { lat: 40.7000, lng: -74.0200 },
          { lat: 40.7200, lng: -74.0200 },
          { lat: 40.7200, lng: -73.9900 },
          { lat: 40.7000, lng: -73.9900 }
        ],
        strokeColor: '#16a34a',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#16a34a',
        fillOpacity: 0.15,
        map: map
      });

      polygonRef.current = downtownArea;

      // Center map on selected/hovered property or fit all markers
      if (selectedProperty) {
        map.setCenter(selectedProperty.coordinates);
        map.setZoom(15);
      } else if (hoveredProperty) {
        map.setCenter(hoveredProperty.coordinates);
        map.setZoom(15);
      } else if (properties.length > 0) {
        const bounds = new (window as any).google.maps.LatLngBounds();
        properties.forEach(property => {
          bounds.extend(property.coordinates);
        });
        map.fitBounds(bounds);
      }
    };

    // Load Google Maps API if not already loaded
    if (typeof (window as any).google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD_e9oLPJPgTHLfcua98DZXFmHt_r2lMOI&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // Cleanup shapes
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
      
      // Cleanup info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [properties, hoveredProperty, selectedProperty]);

  // Show info window when property is hovered or selected
  useEffect(() => {
    const activeProperty = selectedProperty || hoveredProperty;
    
    if (activeProperty && mapInstanceRef.current) {
      // Close existing info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // Create new info window with detailed content
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
              <div style="width: 80px; height: 60px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <div style="flex: 1; min-width: 0;">
                <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1e293b; line-height: 1.2;">${activeProperty.title}</h3>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; line-height: 1.3;">${activeProperty.address}</p>
                <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${selectedProperty ? '#dc2626' : '#2563eb'};">
                  ${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(activeProperty.price)}
                </p>
              </div>
            </div>
            
            ${activeProperty.bedrooms ? `
              <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 13px; color: #64748b;">
                <span style="display: flex; align-items: center; gap: 4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM19 7h-8v7H3V6c0-.55-.45-1-1-1s-1 .45-1 1v12c0 .55.45 1 1 1s1-.45 1-1v-2h18v2c0 .55.45 1 1 1s1-.45 1-1V10c0-1.65-1.35-3-3-3z"/>
                  </svg>
                  ${activeProperty.bedrooms} bed
                </span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 2v1h6V2h2v1h1c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h1V2h2zm9 16V8H6v10h12z"/>
                  </svg>
                  ${activeProperty.bathrooms} bath
                </span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                  </svg>
                  ${activeProperty.sqft.toLocaleString()} sqft
                </span>
              </div>
            ` : ''}
            
            <div style="margin-bottom: 12px;">
              <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.4;">${activeProperty.description}</p>
            </div>
            
            ${activeProperty.amenities.length > 0 ? `
              <div style="margin-bottom: 12px;">
                <div style="display: flex; flex-wrap: gap: 4px;">
                  ${activeProperty.amenities.slice(0, 4).map(amenityId => {
                    const amenity = amenityOptions.find(a => a.id === amenityId);
                    return amenity ? `<span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500;">${amenity.label}</span>` : '';
                  }).join('')}
                  ${activeProperty.amenities.length > 4 ? `<span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500;">+${activeProperty.amenities.length - 4} more</span>` : ''}
                </div>
              </div>
            ` : ''}
            
            <div style="display: flex; justify-between; align-items: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">
              <span style="display: flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                ${activeProperty.views} views
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                ${activeProperty.agent}
              </span>
            </div>
            ${selectedProperty ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                <div style="background: #fef2f2; color: #dc2626; padding: 6px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; text-align: center;">
                  Selected Property
                </div>
              </div>
            ` : ''}
          </div>
        `,
        position: activeProperty.coordinates,
        pixelOffset: new (window as any).google.maps.Size(0, -10)
      });

      infoWindow.open(mapInstanceRef.current);
      infoWindowRef.current = infoWindow;
    } else if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, [hoveredProperty, selectedProperty]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    priceRange: [0, 1000000],
    propertyType: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    amenities: [],
    sqftRange: [0, 5000]
  });

  // Filter properties based on search criteria
  useEffect(() => {
    let filtered = properties.filter(property => {
      // Text search
      const matchesQuery = filters.query === '' || 
        property.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.query.toLowerCase());

      // Price range
      const matchesPrice = property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1];

      // Property type
      const matchesType = filters.propertyType === 'all' || 
        property.type === filters.propertyType;

      // Bedrooms
      const matchesBedrooms = filters.bedrooms === 'all' || 
        (property.bedrooms && property.bedrooms.toString() === filters.bedrooms);

      // Bathrooms
      const matchesBathrooms = filters.bathrooms === 'all' || 
        (property.bathrooms && property.bathrooms.toString() === filters.bathrooms);

      // Square footage
      const matchesSqft = property.sqft >= filters.sqftRange[0] && 
        property.sqft <= filters.sqftRange[1];

      // Amenities
      const matchesAmenities = filters.amenities.length === 0 || 
        filters.amenities.every(amenity => property.amenities.includes(amenity));

      return matchesQuery && matchesPrice && matchesType && 
             matchesBedrooms && matchesBathrooms && matchesSqft && matchesAmenities;
    });

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      priceRange: [0, 1000000],
      propertyType: 'all',
      bedrooms: 'all',
      bathrooms: 'all',
      amenities: [],
      sqftRange: [0, 5000]
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePropertySelect = (property: Property | null) => {
    setSelectedProperty(property);
  };

  const handlePropertyClick = (property: Property) => {
    if (selectedProperty?.id === property.id) {
      setSelectedProperty(null); // Deselect if already selected
    } else {
      setSelectedProperty(property); // Select property
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Property Search</h1>
              <p className="text-slate-600 mt-1">Find your perfect property</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by location, property name, or address..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FiFilter className="w-4 h-4" />
              Filters
              {(filters.amenities.length > 0 || filters.propertyType !== 'all') && (
                <Badge variant="secondary" className="ml-1">
                  {filters.amenities.length + (filters.propertyType !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={1000000}
                    min={0}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {amenityOptions.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={amenity.id}
                      checked={filters.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label 
                      htmlFor={amenity.id} 
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      {amenity.icon}
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Properties List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {filteredProperties.length} Properties Found
              </h2>
              {selectedProperty && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProperty(null)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear Selection
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                {filteredProperties.map((property) => (
                  <Card 
                    key={property.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProperty?.id === property.id 
                        ? 'ring-2 ring-red-500 bg-red-50' 
                        : hoveredProperty?.id === property.id 
                          ? 'ring-2 ring-blue-500' 
                          : ''
                    }`}
                    onMouseEnter={() => setHoveredProperty(property)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    onClick={() => handlePropertyClick(property)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Property Image */}
                        <div className="w-32 h-24 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <FiHome className="w-8 h-8 text-slate-400" />
                        </div>
                        
                        {/* Property Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-900 truncate">
                                {property.title}
                              </h3>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                                <FiMapPin className="w-3 h-3" />
                                {property.address}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {property.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              {selectedProperty?.id === property.id && (
                                <Badge variant="destructive">Selected</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                            {property.bedrooms && (
                              <span className="flex items-center gap-1">
                                <IoBed className="w-4 h-4" />
                                {property.bedrooms} bed
                              </span>
                            )}
                            {property.bathrooms && (
                              <span className="flex items-center gap-1">
                                <MdBathtub className="w-4 h-4" />
                                {property.bathrooms} bath
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <FiMaximize className="w-4 h-4" />
                              {property.sqft.toLocaleString()} sqft
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${
                              selectedProperty?.id === property.id ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              {formatPrice(property.price)}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <FiEye className="w-3 h-3" />
                                {property.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiUser className="w-3 h-3" />
                                {property.agent}
                              </span>
                            </div>
                          </div>
                          
                          {/* Amenities */}
                          {property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {property.amenities.slice(0, 4).map((amenityId) => {
                                const amenity = amenityOptions.find(a => a.id === amenityId);
                                return amenity ? (
                                  <Badge key={amenityId} variant="outline" className="text-xs">
                                    {amenity.label}
                                  </Badge>
                                ) : null;
                              })}
                              {property.amenities.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{property.amenities.length - 4} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredProperties.length === 0 && (
                  <div className="text-center py-12">
                    <FiHome className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No properties found</h3>
                    <p className="text-slate-600">Try adjusting your search filters</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <GoogleMap 
              properties={filteredProperties} 
              hoveredProperty={hoveredProperty}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
