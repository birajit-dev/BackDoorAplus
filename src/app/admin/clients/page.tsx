'use client';
import { useState } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign, FiCalendar,
  FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiDownload,
  FiHome, FiHeart, FiClock, FiTrendingUp, FiUsers, FiStar
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'buyer' | 'seller' | 'renter' | 'landlord' | 'investor';
  status: 'active' | 'inactive' | 'prospect' | 'closed';
  joinDate: string;
  lastContact: string;
  assignedAgent: string;
  totalTransactions: number;
  totalValue: number;
  preferences?: {
    propertyTypes: string[];
    priceRange: { min: number; max: number };
    locations: string[];
    bedrooms?: number;
    bathrooms?: number;
  };
  notes: string;
  rating: number;
  source: 'referral' | 'website' | 'social_media' | 'walk_in' | 'advertising';
  properties: Array<{
    id: string;
    title: string;
    status: 'interested' | 'viewed' | 'offered' | 'purchased' | 'sold';
    date: string;
  }>;
}

const sampleClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    type: 'buyer',
    status: 'active',
    joinDate: '2024-01-15',
    lastContact: '2024-01-20',
    assignedAgent: 'Sarah Johnson',
    totalTransactions: 0,
    totalValue: 0,
    preferences: {
      propertyTypes: ['house', 'condo'],
      priceRange: { min: 300000, max: 600000 },
      locations: ['Downtown', 'Suburbia'],
      bedrooms: 3,
      bathrooms: 2
    },
    notes: 'First-time buyer, pre-approved for $550k mortgage. Looking for family home with good schools.',
    rating: 4,
    source: 'website',
    properties: [
      { id: '1', title: 'Modern Downtown Condo', status: 'viewed', date: '2024-01-18' },
      { id: '2', title: 'Suburban Family Home', status: 'interested', date: '2024-01-20' }
    ]
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 987-6543',
    type: 'seller',
    status: 'active',
    joinDate: '2023-12-10',
    lastContact: '2024-01-19',
    assignedAgent: 'Michael Chen',
    totalTransactions: 1,
    totalValue: 450000,
    preferences: {
      propertyTypes: ['condo'],
      priceRange: { min: 400000, max: 500000 },
      locations: ['Downtown']
    },
    notes: 'Selling downtown condo to upgrade to larger home. Timeline flexible.',
    rating: 5,
    source: 'referral',
    properties: [
      { id: '3', title: 'Downtown Condo Unit 4B', status: 'sold', date: '2024-01-15' }
    ]
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1 (555) 456-7890',
    type: 'investor',
    status: 'active',
    joinDate: '2023-11-05',
    lastContact: '2024-01-21',
    assignedAgent: 'Emily Rodriguez',
    totalTransactions: 3,
    totalValue: 1200000,
    preferences: {
      propertyTypes: ['apartment', 'commercial'],
      priceRange: { min: 200000, max: 800000 },
      locations: ['Commercial District', 'University Area']
    },
    notes: 'Real estate investor focused on rental properties. Cash buyer.',
    rating: 5,
    source: 'advertising',
    properties: [
      { id: '4', title: 'Student Apartment Complex', status: 'purchased', date: '2023-12-01' },
      { id: '5', title: 'Commercial Office Space', status: 'offered', date: '2024-01-20' }
    ]
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 234-5678',
    type: 'renter',
    status: 'prospect',
    joinDate: '2024-01-18',
    lastContact: '2024-01-18',
    assignedAgent: 'David Wilson',
    totalTransactions: 0,
    totalValue: 0,
    preferences: {
      propertyTypes: ['apartment'],
      priceRange: { min: 1500, max: 2500 },
      locations: ['Downtown', 'Midtown'],
      bedrooms: 1,
      bathrooms: 1
    },
    notes: 'Young professional looking for modern apartment near public transportation.',
    rating: 3,
    source: 'social_media',
    properties: []
  }
];

const ClientCard = ({ client }: { client: Client }) => {
  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Client['type']) => {
    switch (type) {
      case 'buyer': return 'bg-blue-100 text-blue-800';
      case 'seller': return 'bg-green-100 text-green-800';
      case 'renter': return 'bg-yellow-100 text-yellow-800';
      case 'landlord': return 'bg-purple-100 text-purple-800';
      case 'investor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <FiUser className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{client.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getTypeColor(client.type)}>
                  {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                </Badge>
                <Badge className={getStatusColor(client.status)}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(client.rating)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-slate-600">
              <FiMail className="text-xs" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <FiPhone className="text-xs" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <FiUser className="text-xs" />
              <span>Agent: {client.assignedAgent}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-blue-600">{client.totalTransactions}</div>
              <div className="text-xs text-slate-600">Transactions</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-green-600">
                ${client.totalValue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600">Total Value</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-purple-600">{client.properties.length}</div>
              <div className="text-xs text-slate-600">Properties</div>
            </div>
          </div>

          {/* Preferences */}
          {client.preferences && (
            <div className="text-sm">
              <h4 className="font-medium mb-2">Preferences</h4>
              <div className="space-y-1 text-slate-600">
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-xs" />
                  <span>${client.preferences.priceRange.min.toLocaleString()} - ${client.preferences.priceRange.max.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiHome className="text-xs" />
                  <span>{client.preferences.propertyTypes.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-xs" />
                  <span>{client.preferences.locations.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Last Contact */}
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Joined: {new Date(client.joinDate).toLocaleDateString()}</span>
            <span>Last contact: {new Date(client.lastContact).toLocaleDateString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <FiEye className="mr-2 text-xs" />
              View
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <FiEdit className="mr-2 text-xs" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <FiCalendar className="mr-2 text-xs" />
              Schedule
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
              <FiTrash2 className="text-xs" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ClientsPage() {
  const [clients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || client.type === filterType;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'newest': return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case 'oldest': return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
      case 'value': return b.totalValue - a.totalValue;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  // Statistics
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    prospects: clients.filter(c => c.status === 'prospect').length,
    totalValue: clients.reduce((sum, c) => sum + c.totalValue, 0),
    averageRating: clients.reduce((sum, c) => sum + c.rating, 0) / clients.length
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Client Management</h1>
          <p className="text-slate-600">Manage your clients, leads, and relationships</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Export
          </Button>
          <Button>
            <FiPlus className="mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Clients</p>
                <p className="text-3xl font-bold">{stats.totalClients}</p>
              </div>
              <FiUsers className="text-2xl text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Clients</p>
                <p className="text-3xl font-bold">{stats.activeClients}</p>
              </div>
              <FiTrendingUp className="text-2xl text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Prospects</p>
                <p className="text-3xl font-bold">{stats.prospects}</p>
              </div>
              <FiClock className="text-2xl text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-3xl font-bold">${(stats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <FiDollarSign className="text-2xl text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Rating</p>
                <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
              <FiStar className="text-2xl text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-slate-400" />
                <Input 
                  placeholder="Search clients..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Client Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buyer">Buyers</SelectItem>
                <SelectItem value="seller">Sellers</SelectItem>
                <SelectItem value="renter">Renters</SelectItem>
                <SelectItem value="landlord">Landlords</SelectItem>
                <SelectItem value="investor">Investors</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="prospect">Prospects</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="value">Highest Value</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Empty State */}
      {sortedClients.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FiUsers className="mx-auto text-6xl text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Clients Found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search criteria or add a new client.</p>
            <Button>
              <FiPlus className="mr-2" />
              Add Your First Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
