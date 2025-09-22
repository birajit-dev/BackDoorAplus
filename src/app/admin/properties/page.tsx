'use client';
import { useState, useEffect } from 'react';
import { 
  FiHome, FiMapPin, FiDollarSign, FiEdit, FiTrash2, FiEye, 
  FiPlus, FiSearch, FiFilter, FiDownload, FiCamera, FiCalendar,
  FiMaximize, FiHeart, FiUser, FiClock
} from 'react-icons/fi';
import { IoBed } from 'react-icons/io5';
import { MdBathtub } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: 'house' | 'condo' | 'apartment' | 'commercial' | 'land';
  status: 'active' | 'pending' | 'sold' | 'draft';
  bedrooms?: number;
  bathrooms?: number;
  sqft: number;
  images: string[];
  agent: string;
  dateAdded: string;
  lastUpdated: string;
  views: number;
  inquiries: number;
  featured: boolean;
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
    images: ['/images/property1.jpg', '/images/property1-2.jpg'],
    agent: 'Sarah Johnson',
    dateAdded: '2024-01-15',
    lastUpdated: '2024-01-20',
    views: 245,
    inquiries: 12,
    featured: true
  },
  {
    id: '2',
    title: 'Luxury Family Home',
    address: '456 Pine Avenue, Suburbia, NY 10002',
    price: 750000,
    type: 'house',
    status: 'active',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    images: ['/images/property2.jpg'],
    agent: 'Michael Chen',
    dateAdded: '2024-01-10',
    lastUpdated: '2024-01-18',
    views: 189,
    inquiries: 8,
    featured: false
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    address: '789 Business Blvd, Commercial District, NY 10003',
    price: 1200000,
    type: 'commercial',
    status: 'pending',
    sqft: 5000,
    images: ['/images/property3.jpg'],
    agent: 'Emily Rodriguez',
    dateAdded: '2024-01-05',
    lastUpdated: '2024-01-19',
    views: 67,
    inquiries: 3,
    featured: false
  },
  {
    id: '4',
    title: 'Cozy Studio Apartment',
    address: '321 Student Lane, University Area, NY 10004',
    price: 280000,
    type: 'apartment',
    status: 'active',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    images: ['/images/property4.jpg'],
    agent: 'David Wilson',
    dateAdded: '2024-01-12',
    lastUpdated: '2024-01-21',
    views: 156,
    inquiries: 15,
    featured: true
  },
  {
    id: '5',
    title: 'Development Land',
    address: 'Highway 101, Rural County, NY 10005',
    price: 95000,
    type: 'land',
    status: 'active',
    sqft: 43560,
    images: ['/images/land1.jpg'],
    agent: 'Lisa Thompson',
    dateAdded: '2024-01-08',
    lastUpdated: '2024-01-16',
    views: 89,
    inquiries: 4,
    featured: false
  }
];

const PropertyCard = ({ property }: { property: Property }) => {
  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'sold': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeIcon = (type: Property['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'house': return <FiHome className={`${iconClass} text-blue-600`} />;
      case 'condo': return <FiHome className={`${iconClass} text-emerald-600`} />;
      case 'apartment': return <FiHome className={`${iconClass} text-purple-600`} />;
      case 'commercial': return <FiHome className={`${iconClass} text-orange-600`} />;
      case 'land': return <FiMapPin className={`${iconClass} text-amber-600`} />;
      default: return <FiHome className={iconClass} />;
    }
  };

  const getTypeColor = (type: Property['type']) => {
    switch (type) {
      case 'house': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'condo': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'apartment': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'commercial': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'land': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02] bg-white overflow-hidden">
      {/* Image Placeholder with Gradient Overlay */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-lg">
              <FiHeart className="mr-1 w-3 h-3" />
              Featured
            </Badge>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className={`${getStatusColor(property.status)} border shadow-sm font-medium`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <Badge className={`${getTypeColor(property.type)} border shadow-sm font-medium`}>
            {getTypeIcon(property.type)}
            <span className="ml-1 capitalize">{property.type}</span>
          </Badge>
        </div>

        {/* Photo Count */}
        <div className="absolute bottom-3 right-3 z-10">
          <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
            <FiCamera className="mr-1 w-3 h-3" />
            {property.images.length}
          </Badge>
        </div>
      </div>

      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-4 sm:p-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {property.title}
              </h3>
              <p className="text-sm text-slate-600 flex items-start mt-2">
                <FiMapPin className="mr-2 mt-0.5 text-slate-400 flex-shrink-0 w-4 h-4" />
                <span className="line-clamp-2">{property.address}</span>
              </p>
            </div>

            {/* Price */}
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              ${property.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {property.bedrooms && (
              <div className="flex items-center bg-slate-50 rounded-full px-3 py-1">
                <IoBed className="mr-1.5 w-4 h-4 text-slate-500" />
                <span className="font-medium">{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center bg-slate-50 rounded-full px-3 py-1">
                <MdBathtub className="mr-1.5 w-4 h-4 text-slate-500" />
                <span className="font-medium">{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center bg-slate-50 rounded-full px-3 py-1">
              <FiMaximize className="mr-1.5 w-4 h-4 text-slate-500" />
              <span className="font-medium">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-100">
              <div className="text-lg sm:text-xl font-bold text-blue-600">{property.views}</div>
              <div className="text-xs text-blue-600/80 font-medium">Views</div>
            </div>
            <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-100">
              <div className="text-lg sm:text-xl font-bold text-emerald-600">{property.inquiries}</div>
              <div className="text-xs text-emerald-600/80 font-medium">Inquiries</div>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-100">
              <div className="text-lg sm:text-xl font-bold text-purple-600">{property.images.length}</div>
              <div className="text-xs text-purple-600/80 font-medium">Photos</div>
            </div>
          </div>
        </div>

        {/* Agent and Date Info */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-slate-600">
            <div className="flex items-center">
              <FiUser className="mr-2 w-4 h-4 text-slate-400" />
              <span className="font-medium">{property.agent}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-2 w-4 h-4 text-slate-400" />
              <span>Updated {new Date(property.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <Separator className="mx-4 sm:mx-6" />

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 bg-slate-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
              <FiEye className="mr-1.5 w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
            <Button size="sm" variant="outline" className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
              <FiEdit className="mr-1.5 w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button size="sm" variant="outline" className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors">
              <FiCamera className="mr-1.5 w-4 h-4" />
              <span className="hidden sm:inline">Photos</span>
            </Button>
            <Button size="sm" variant="outline" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
              <FiTrash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-high': return b.price - a.price;
      case 'price-low': return a.price - b.price;
      case 'newest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'oldest': return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case 'views': return b.views - a.views;
      default: return 0;
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Property Management</h1>
          <p className="text-slate-600">Manage your real estate listings and inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="w-full sm:w-auto">
            <FiDownload className="mr-2" />
            Export
          </Button>
          <Link href="/admin/properties/add">
            <Button className="w-full sm:w-auto">
              <FiPlus className="mr-2" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Search properties..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">Houses</SelectItem>
                <SelectItem value="condo">Condos</SelectItem>
                <SelectItem value="apartment">Apartments</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {sortedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Empty State */}
      {sortedProperties.length === 0 && (
        <Card className="text-center py-12 shadow-sm">
          <CardContent>
            <FiHome className="mx-auto text-6xl text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Properties Found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search criteria or add a new property.</p>
            <Link href="/admin/properties/add">
              <Button>
                <FiPlus className="mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
