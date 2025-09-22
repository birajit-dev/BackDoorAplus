'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHome, FiMapPin, FiDollarSign, FiUpload, FiSave, FiX, 
  FiMaximize, FiCalendar, FiUser, FiCamera,
  FiPlus, FiTrash2, FiCheck, FiWifi, FiTv, FiCoffee,
  FiShield, FiWind, FiDroplet, FiZap, FiSun
} from 'react-icons/fi';
import { IoBed } from 'react-icons/io5';
import { MdBathtub, MdPool, MdFitnessCenter, MdPets } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface BedroomData {
  bed: string;
  bath: number;
  sqft: number;
  price: number;
}

interface SchoolData {
  name: string;
  rating?: number;
  distance?: number;
  address: string;
  type: 'public' | 'private' | 'charter';
}

interface PropertyFormData {
  property_name: string;
  type: string;
  city: string;
  county: string;
  state: string;
  address: string;
  latitude: string;
  longitude: string;
  bed_rooms: BedroomData[];
  room_available: string;
  property_styles: string[];
  promo_code: string;
  website_link: string;
  status: string;
  asap: boolean;
  keyword: string;
  metadesc: string;
  schools: {
    elementary: SchoolData;
    middle: SchoolData;
    high: SchoolData;
  };
  property_amenities: {
    // Basic Living Essentials
    air_conditioning: string;
    heating: string;
    hot_water: string;
    electricity: string;
    running_water: string;
    // Kitchen Basics
    refrigerator: string;
    stove: string;
    oven: string;
    microwave: string;
    // Bathroom Essentials
    toilet: string;
    shower: string;
    bathtub: string;
    // Laundry
    in_unit_laundry: string;
    laundry_facility: string;
    // Storage
    closet_space: string;
    storage_unit: string;
    // Safety & Security
    smoke_detector: string;
    carbon_monoxide_detector: string;
    fire_extinguisher: string;
    security_locks: string;
    // Connectivity
    internet_access: string;
    phone_line: string;
    // Parking
    parking_space: string;
    // Utilities
    trash_collection: string;
    water_included: string;
    electricity_included: string;
    gas_included: string;
    // Basic Comfort
    windows: string;
    flooring: string;
    lighting: string;
    ventilation: string;
  };
  image: File | null;
}

const propertyTypes = [
  'Apartment', 'House', 'Condo', 'Townhouse', 'Commercial', 'Land'
];

const propertyStatuses = [
  'Available', 'Rented', 'Pending', 'Draft'
];

const propertyStyles = [
  'Townhomes', 'Lofts', 'High-rise', 'Live/Work', 'Garden Style', 'Mid-rise'
];

const schoolTypes = ['public', 'private', 'charter'] as const;

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    property_name: '',
    type: '',
    city: '',
    county: '',
    state: '',
    address: '',
    latitude: '',
    longitude: '',
    bed_rooms: [
      { bed: 'Studio', bath: 1, sqft: 0, price: 0 }
    ],
    room_available: 'yes',
    property_styles: [],
    promo_code: '',
    website_link: '',
    status: 'Draft',
    asap: false,
    keyword: '',
    metadesc: '',
    schools: {
      elementary: { name: '', rating: undefined, distance: undefined, address: '', type: 'public' },
      middle: { name: '', rating: undefined, distance: undefined, address: '', type: 'public' },
      high: { name: '', rating: undefined, distance: undefined, address: '', type: 'public' }
    },
    property_amenities: {
      air_conditioning: 'no',
      heating: 'no',
      hot_water: 'no',
      electricity: 'no',
      running_water: 'no',
      refrigerator: 'no',
      stove: 'no',
      oven: 'no',
      microwave: 'no',
      toilet: 'no',
      shower: 'no',
      bathtub: 'no',
      in_unit_laundry: 'no',
      laundry_facility: 'no',
      closet_space: 'no',
      storage_unit: 'no',
      smoke_detector: 'no',
      carbon_monoxide_detector: 'no',
      fire_extinguisher: 'no',
      security_locks: 'no',
      internet_access: 'no',
      phone_line: 'no',
      parking_space: 'no',
      trash_collection: 'no',
      water_included: 'no',
      electricity_included: 'no',
      gas_included: 'no',
      windows: 'no',
      flooring: 'no',
      lighting: 'no',
      ventilation: 'no'
    },
    image: null
  });

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBedroomChange = (index: number, field: keyof BedroomData, value: any) => {
    setFormData(prev => ({
      ...prev,
      bed_rooms: prev.bed_rooms.map((room, i) => 
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  const addBedroomUnit = () => {
    setFormData(prev => ({
      ...prev,
      bed_rooms: [...prev.bed_rooms, { bed: '1', bath: 1, sqft: 0, price: 0 }]
    }));
  };

  const removeBedroomUnit = (index: number) => {
    if (formData.bed_rooms.length > 1) {
      setFormData(prev => ({
        ...prev,
        bed_rooms: prev.bed_rooms.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSchoolChange = (level: 'elementary' | 'middle' | 'high', field: keyof SchoolData, value: any) => {
    setFormData(prev => ({
      ...prev,
      schools: {
        ...prev.schools,
        [level]: {
          ...prev.schools[level],
          [field]: value
        }
      }
    }));
  };

  const handleAmenityToggle = (amenity: keyof PropertyFormData['property_amenities']) => {
    setFormData(prev => ({
      ...prev,
      property_amenities: {
        ...prev.property_amenities,
        [amenity]: prev.property_amenities[amenity] === 'yes' ? 'no' : 'yes'
      }
    }));
  };

  const handleStyleToggle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      property_styles: prev.property_styles.includes(style)
        ? prev.property_styles.filter(s => s !== style)
        : [...prev.property_styles, style]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleSubmit = async (status: string) => {
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Basic property information
      formDataToSend.append('property_name', formData.property_name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('county', formData.county);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('room_available', formData.room_available);
      formDataToSend.append('promo_code', formData.promo_code);
      formDataToSend.append('website_link', formData.website_link);
      formDataToSend.append('status', status);
      formDataToSend.append('asap', formData.asap ? 'on' : 'off');
      formDataToSend.append('keyword', formData.keyword);
      formDataToSend.append('metadesc', formData.metadesc);

      // Bedroom data
      formDataToSend.append('bed_rooms', JSON.stringify(formData.bed_rooms));

      // Property styles
      formDataToSend.append('property_styles', JSON.stringify(formData.property_styles));

      // Schools
      formDataToSend.append('schools', JSON.stringify(formData.schools));

      // Amenities
      formDataToSend.append('property_amenities', JSON.stringify(formData.property_amenities));

      // Image
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/property`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/properties');
      } else {
        console.error('Error:', result.message);
        // Handle error - you might want to show a toast or alert
      }
    } catch (error) {
      console.error('Submit error:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Add New Property</h1>
          <p className="text-slate-600">Create a new property listing</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <FiX className="mr-2" />
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiHome className="mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="property_name">Property Name *</Label>
                  <Input 
                    id="property_name"
                    placeholder="e.g., Modern Downtown Apartment"
                    value={formData.property_name}
                    onChange={(e) => handleInputChange('property_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="room_available">Room Available</Label>
                  <Select value={formData.room_available} onValueChange={(value) => handleInputChange('room_available', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="promo_code">Promo Code</Label>
                  <Input 
                    id="promo_code"
                    placeholder="SPECIAL2024"
                    value={formData.promo_code}
                    onChange={(e) => handleInputChange('promo_code', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website_link">Website Link</Label>
                <Input 
                  id="website_link"
                  placeholder="https://example.com"
                  value={formData.website_link}
                  onChange={(e) => handleInputChange('website_link', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keyword">SEO Keywords</Label>
                  <Input 
                    id="keyword"
                    placeholder="apartment, downtown, luxury"
                    value={formData.keyword}
                    onChange={(e) => handleInputChange('keyword', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="asap"
                    checked={formData.asap}
                    onCheckedChange={(checked) => handleInputChange('asap', checked as boolean)}
                  />
                  <Label htmlFor="asap">Available ASAP</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="metadesc">Meta Description</Label>
                <Textarea 
                  id="metadesc"
                  placeholder="Brief description for search engines..."
                  value={formData.metadesc}
                  onChange={(e) => handleInputChange('metadesc', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiMapPin className="mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input 
                  id="address"
                  placeholder="123 Oak Street"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="county">County</Label>
                  <Input 
                    id="county"
                    placeholder="Manhattan"
                    value={formData.county}
                    onChange={(e) => handleInputChange('county', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input 
                    id="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input 
                    id="latitude"
                    placeholder="40.7128"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input 
                    id="longitude"
                    placeholder="-74.0060"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unit Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiMaximize className="mr-2" />
                  Unit Details
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addBedroomUnit}
                  className="flex items-center"
                >
                  <FiPlus className="mr-1 w-4 h-4" />
                  Add Unit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.bed_rooms.map((room, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">{room.bed === 'Studio' ? 'Studio' : `${room.bed} Bedroom`} Unit</h4>
                    {formData.bed_rooms.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeBedroomUnit(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Bedrooms</Label>
                      <Select 
                        value={room.bed} 
                        onValueChange={(value) => handleBedroomChange(index, 'bed', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="1">1 Bedroom</SelectItem>
                          <SelectItem value="2">2 Bedrooms</SelectItem>
                          <SelectItem value="3">3 Bedrooms</SelectItem>
                          <SelectItem value="4">4 Bedrooms</SelectItem>
                          <SelectItem value="5">5+ Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input 
                        type="number"
                        min="1"
                        value={room.bath}
                        onChange={(e) => handleBedroomChange(index, 'bath', parseInt(e.target.value) || 1)}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <Label>Square Feet</Label>
                      <Input 
                        type="number"
                        min="0"
                        value={room.sqft}
                        onChange={(e) => handleBedroomChange(index, 'sqft', parseInt(e.target.value) || 0)}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <Label>Price ($)</Label>
                      <Input 
                        type="number"
                        min="0"
                        value={room.price}
                        onChange={(e) => handleBedroomChange(index, 'price', parseInt(e.target.value) || 0)}
                        placeholder="1200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Property Styles */}
          <Card>
            <CardHeader>
              <CardTitle>Property Styles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyStyles.map(style => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox 
                      id={style}
                      checked={formData.property_styles.includes(style)}
                      onCheckedChange={() => handleStyleToggle(style)}
                    />
                    <Label htmlFor={style}>{style}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Property Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Living Essentials */}
              <div>
                <h4 className="font-semibold mb-3">Basic Living Essentials</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'air_conditioning', label: 'Air Conditioning', icon: <FiWind /> },
                    { key: 'heating', label: 'Heating', icon: <FiSun /> },
                    { key: 'hot_water', label: 'Hot Water', icon: <FiDroplet /> },
                    { key: 'electricity', label: 'Electricity', icon: <FiZap /> },
                    { key: 'running_water', label: 'Running Water', icon: <FiDroplet /> }
                  ].map(amenity => (
                    <div 
                      key={amenity.key} 
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleAmenityToggle(amenity.key as keyof typeof formData.property_amenities)}
                    >
                      {amenity.icon}
                      <Label className="text-sm cursor-pointer flex-1">{amenity.label}</Label>
                      {formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' && (
                        <FiCheck className="text-blue-600 w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Kitchen Basics */}
              <div>
                <h4 className="font-semibold mb-3">Kitchen Basics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'refrigerator', label: 'Refrigerator' },
                    { key: 'stove', label: 'Stove' },
                    { key: 'oven', label: 'Oven' },
                    { key: 'microwave', label: 'Microwave' }
                  ].map(amenity => (
                    <div 
                      key={amenity.key} 
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleAmenityToggle(amenity.key as keyof typeof formData.property_amenities)}
                    >
                      <Label className="text-sm cursor-pointer flex-1">{amenity.label}</Label>
                      {formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' && (
                        <FiCheck className="text-blue-600 w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Bathroom Essentials */}
              <div>
                <h4 className="font-semibold mb-3">Bathroom Essentials</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'toilet', label: 'Toilet' },
                    { key: 'shower', label: 'Shower' },
                    { key: 'bathtub', label: 'Bathtub' }
                  ].map(amenity => (
                    <div 
                      key={amenity.key} 
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleAmenityToggle(amenity.key as keyof typeof formData.property_amenities)}
                    >
                      <Label className="text-sm cursor-pointer flex-1">{amenity.label}</Label>
                      {formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' && (
                        <FiCheck className="text-blue-600 w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Other Amenities */}
              <div>
                <h4 className="font-semibold mb-3">Other Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'in_unit_laundry', label: 'In-Unit Laundry' },
                    { key: 'laundry_facility', label: 'Laundry Facility' },
                    { key: 'parking_space', label: 'Parking Space' },
                    { key: 'internet_access', label: 'Internet Access', icon: <FiWifi /> },
                    { key: 'security_locks', label: 'Security Locks', icon: <FiShield /> },
                    { key: 'smoke_detector', label: 'Smoke Detector' },
                    { key: 'carbon_monoxide_detector', label: 'CO Detector' },
                    { key: 'fire_extinguisher', label: 'Fire Extinguisher' },
                    { key: 'phone_line', label: 'Phone Line' },
                    { key: 'trash_collection', label: 'Trash Collection' },
                    { key: 'water_included', label: 'Water Included' },
                    { key: 'electricity_included', label: 'Electricity Included' },
                    { key: 'gas_included', label: 'Gas Included' },
                    { key: 'closet_space', label: 'Closet Space' },
                    { key: 'storage_unit', label: 'Storage Unit' },
                    { key: 'windows', label: 'Windows' },
                    { key: 'flooring', label: 'Quality Flooring' },
                    { key: 'lighting', label: 'Good Lighting' },
                    { key: 'ventilation', label: 'Ventilation' }
                  ].map(amenity => (
                    <div 
                      key={amenity.key} 
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleAmenityToggle(amenity.key as keyof typeof formData.property_amenities)}
                    >
                      {amenity.icon && amenity.icon}
                      <Label className="text-sm cursor-pointer flex-1">{amenity.label}</Label>
                      {formData.property_amenities[amenity.key as keyof typeof formData.property_amenities] === 'yes' && (
                        <FiCheck className="text-blue-600 w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Information */}
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(['elementary', 'middle', 'high'] as const).map(level => (
                <div key={level}>
                  <h4 className="font-semibold mb-3 capitalize">{level} School</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>School Name</Label>
                      <Input 
                        placeholder={`${level.charAt(0).toUpperCase() + level.slice(1)} School`}
                        value={formData.schools[level].name}
                        onChange={(e) => handleSchoolChange(level, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Rating (1-10)</Label>
                      <Input 
                        type="number"
                        min="1"
                        max="10"
                        placeholder="8"
                        value={formData.schools[level].rating || ''}
                        onChange={(e) => handleSchoolChange(level, 'rating', parseInt(e.target.value) || undefined)}
                      />
                    </div>
                    <div>
                      <Label>Distance (miles)</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        value={formData.schools[level].distance || ''}
                        onChange={(e) => handleSchoolChange(level, 'distance', parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address</Label>
                      <Input 
                        placeholder="School address"
                        value={formData.schools[level].address}
                        onChange={(e) => handleSchoolChange(level, 'address', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select 
                        value={formData.schools[level].type} 
                        onValueChange={(value) => handleSchoolChange(level, 'type', value as typeof schoolTypes[number])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolTypes.map(type => (
                            <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {level !== 'high' && <Separator className="mt-6" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Property Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiCamera className="mr-2" />
                Property Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <FiUpload className="mx-auto text-4xl text-slate-400 mb-4" />
                <p className="text-slate-600 mb-4">Upload property image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FiPlus className="mr-2" />
                    Choose Image
                  </label>
                </Button>
              </div>

              {formData.image && (
                <div className="relative bg-slate-100 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-2">{formData.image.name}</div>
                  <div className="text-xs text-slate-500">{(formData.image.size / 1024 / 1024).toFixed(2)} MB</div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 text-red-600"
                    onClick={removeImage}
                  >
                    <FiTrash2 className="text-xs" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => handleSubmit('Available')}
                  disabled={isSubmitting}
                >
                  <FiSave className="mr-2" />
                  {isSubmitting ? 'Publishing...' : 'Publish Property'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSubmit('Draft')}
                  disabled={isSubmitting}
                >
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Property Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-lg font-semibold">{formData.property_name || 'Property Name'}</div>
              <div className="text-sm text-slate-600">{formData.address || 'Address'}</div>
              <div className="text-sm text-slate-600">{formData.city}, {formData.state}</div>
              <div className="flex justify-between text-sm">
                <span>{formData.room_available === 'yes' ? 'Available' : 'Not Available'}</span>
                <span>{formData.type || 'Type'}</span>
              </div>
              <div className="text-xs text-slate-500">
                Units: {formData.bed_rooms.length}
              </div>
              <div className="text-xs text-slate-500">
                Styles: {formData.property_styles.length > 0 ? formData.property_styles.join(', ') : 'None selected'}
              </div>
              <div className="text-xs text-slate-500">
                Amenities: {Object.values(formData.property_amenities).filter(v => v === 'yes').length} selected
              </div>
              <Badge className="w-full justify-center">
                {formData.status || 'Status'}
              </Badge>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Make sure to fill in all required fields marked with * to publish your property listing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
