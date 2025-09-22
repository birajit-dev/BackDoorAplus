'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiCalendar, FiClock, FiMapPin, FiUser, FiPhone, FiMail, 
  FiHome, FiCheck, FiX, FiAlertCircle, FiSave, FiSend,
  FiUsers, FiFileText, FiCamera, FiDollarSign
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'buyer' | 'seller' | 'renter' | 'landlord';
  status: 'active' | 'inactive';
  preferences?: {
    propertyTypes: string[];
    priceRange: { min: number; max: number };
    locations: string[];
  };
}

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: 'house' | 'condo' | 'apartment' | 'commercial' | 'land';
  status: 'active' | 'pending' | 'sold';
  agent: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  availability: {
    [key: string]: string[]; // day: available times
  };
}

interface AppointmentFormData {
  type: 'showing' | 'consultation' | 'inspection' | 'meeting';
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  clientId: string;
  agentId: string;
  propertyId?: string;
  location: string;
  reminders: string[];
  priority: 'low' | 'medium' | 'high';
  notes: string;
  requiresPreparation: boolean;
  documents: string[];
}

const sampleClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    type: 'buyer',
    status: 'active',
    preferences: {
      propertyTypes: ['house', 'condo'],
      priceRange: { min: 300000, max: 600000 },
      locations: ['Downtown', 'Suburbia']
    }
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 987-6543',
    type: 'seller',
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1 (555) 456-7890',
    type: 'renter',
    status: 'active'
  }
];

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    address: '123 Oak Street, Downtown, NY 10001',
    price: 450000,
    type: 'condo',
    status: 'active',
    agent: 'Sarah Johnson'
  },
  {
    id: '2',
    title: 'Luxury Family Home',
    address: '456 Pine Avenue, Suburbia, NY 10002',
    price: 750000,
    type: 'house',
    status: 'active',
    agent: 'Michael Chen'
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    address: '789 Business Blvd, Commercial District, NY 10003',
    price: 1200000,
    type: 'commercial',
    status: 'pending',
    agent: 'Emily Rodriguez'
  }
];

const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@apluslocators.com',
    phone: '+1 (555) 111-2222',
    specialties: ['Luxury Homes', 'Condos', 'First-time Buyers'],
    availability: {
      'monday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      'tuesday': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      'wednesday': ['10:00', '11:00', '14:00', '15:00', '16:00'],
      'thursday': ['09:00', '10:00', '11:00', '13:00', '14:00'],
      'friday': ['09:00', '10:00', '11:00', '14:00', '15:00']
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@apluslocators.com',
    phone: '+1 (555) 222-3333',
    specialties: ['Family Homes', 'Investment Properties', 'Property Management'],
    availability: {
      'monday': ['10:00', '11:00', '14:00', '15:00', '16:00'],
      'tuesday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
      'wednesday': ['09:00', '10:00', '11:00', '13:00', '14:00'],
      'thursday': ['10:00', '11:00', '14:00', '15:00', '16:00'],
      'friday': ['09:00', '10:00', '11:00', '13:00', '14:00']
    }
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@apluslocators.com',
    phone: '+1 (555) 333-4444',
    specialties: ['Commercial Properties', 'Land Development', 'Investment Analysis'],
    availability: {
      'monday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
      'tuesday': ['10:00', '11:00', '13:00', '14:00', '15:00'],
      'wednesday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
      'thursday': ['09:00', '10:00', '11:00', '13:00', '14:00'],
      'friday': ['10:00', '11:00', '14:00', '15:00', '16:00']
    }
  }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const durations = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' }
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients] = useState<Client[]>(sampleClients);
  const [properties] = useState<Property[]>(sampleProperties);
  const [agents] = useState<Agent[]>(sampleAgents);
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    type: 'showing',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    clientId: '',
    agentId: '',
    propertyId: '',
    location: '',
    reminders: ['15'],
    priority: 'medium',
    notes: '',
    requiresPreparation: false,
    documents: []
  });

  const handleInputChange = (field: keyof AppointmentFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAvailableTimeSlots = () => {
    if (!formData.date || !formData.agentId) return [];
    
    const selectedAgent = agents.find(agent => agent.id === formData.agentId);
    if (!selectedAgent) return [];
    
    const dayOfWeek = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    return selectedAgent.availability[dayOfWeek] || [];
  };

  const selectedClient = clients.find(client => client.id === formData.clientId);
  const selectedAgent = agents.find(agent => agent.id === formData.agentId);
  const selectedProperty = properties.find(property => property.id === formData.propertyId);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Appointment booked:', formData);
      setIsSubmitting(false);
      router.push('/admin/calendar');
    }, 2000);
  };

  const generateTitle = () => {
    let title = '';
    switch (formData.type) {
      case 'showing':
        title = `Property Showing${selectedProperty ? ` - ${selectedProperty.title}` : ''}`;
        break;
      case 'consultation':
        title = `Client Consultation${selectedClient ? ` with ${selectedClient.name}` : ''}`;
        break;
      case 'inspection':
        title = `Property Inspection${selectedProperty ? ` - ${selectedProperty.address}` : ''}`;
        break;
      case 'meeting':
        title = `Meeting${selectedClient ? ` with ${selectedClient.name}` : ''}`;
        break;
    }
    return title;
  };

  useEffect(() => {
    if (formData.type || selectedClient || selectedProperty) {
      const title = generateTitle();
      if (title !== formData.title) {
        handleInputChange('title', title);
      }
    }
  }, [formData.type, selectedClient, selectedProperty]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Book Appointment</h1>
          <p className="text-slate-600">Schedule appointments, showings, and consultations</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <FiX className="mr-2" />
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Type & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiCalendar className="mr-2" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Appointment Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="showing">Property Showing</SelectItem>
                      <SelectItem value="consultation">Client Consultation</SelectItem>
                      <SelectItem value="inspection">Property Inspection</SelectItem>
                      <SelectItem value="meeting">General Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Appointment Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Property Showing - Downtown Condo"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional details about the appointment..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiClock className="mr-2" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimeSlots().map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(duration => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Reminders</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['15', '30', '60', '1440'].map(minutes => (
                    <Button
                      key={minutes}
                      variant={formData.reminders.includes(minutes) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newReminders = formData.reminders.includes(minutes)
                          ? formData.reminders.filter(r => r !== minutes)
                          : [...formData.reminders, minutes];
                        handleInputChange('reminders', newReminders);
                      }}
                    >
                      {minutes === '1440' ? '1 day' : `${minutes} min`} before
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiUsers className="mr-2" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientId">Client *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="agentId">Assigned Agent *</Label>
                  <Select value={formData.agentId} onValueChange={(value) => handleInputChange('agentId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.type === 'showing' || formData.type === 'inspection') && (
                <div>
                  <Label htmlFor="propertyId">Property</Label>
                  <Select value={formData.propertyId} onValueChange={(value) => handleInputChange('propertyId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title} - ${property.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiMapPin className="mr-2" />
                Location & Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder={selectedProperty ? selectedProperty.address : "Enter meeting location"}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special instructions, requirements, or notes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-blue-600" />
                <span className="text-sm">
                  {formData.date ? new Date(formData.date).toLocaleDateString() : 'No date selected'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <FiClock className="text-green-600" />
                <span className="text-sm">
                  {formData.time || 'No time selected'} 
                  {formData.duration && ` (${formData.duration} min)`}
                </span>
              </div>
              
              {selectedClient && (
                <div className="flex items-center space-x-2">
                  <FiUser className="text-purple-600" />
                  <span className="text-sm">{selectedClient.name}</span>
                </div>
              )}
              
              {selectedAgent && (
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-orange-600" />
                  <span className="text-sm">Agent: {selectedAgent.name}</span>
                </div>
              )}
              
              {selectedProperty && (
                <div className="flex items-center space-x-2">
                  <FiHome className="text-red-600" />
                  <span className="text-sm">{selectedProperty.title}</span>
                </div>
              )}
              
              <Separator />
              
              <Badge className={
                formData.priority === 'high' ? 'bg-red-100 text-red-800' :
                formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }>
                {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
              </Badge>
            </CardContent>
          </Card>

          {/* Client Information */}
          {selectedClient && (
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{selectedClient.name}</p>
                  <p className="text-sm text-slate-600">{selectedClient.type.charAt(0).toUpperCase() + selectedClient.type.slice(1)}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <FiMail className="text-slate-400" />
                    <span>{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-slate-400" />
                    <span>{selectedClient.phone}</span>
                  </div>
                </div>

                {selectedClient.preferences && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Preferences</h4>
                    <div className="space-y-1 text-xs">
                      <p>Budget: ${selectedClient.preferences.priceRange.min.toLocaleString()} - ${selectedClient.preferences.priceRange.max.toLocaleString()}</p>
                      <p>Types: {selectedClient.preferences.propertyTypes.join(', ')}</p>
                      <p>Areas: {selectedClient.preferences.locations.join(', ')}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Property Information */}
          {selectedProperty && (
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{selectedProperty.title}</p>
                  <p className="text-sm text-slate-600">{selectedProperty.address}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ${selectedProperty.price.toLocaleString()}
                  </span>
                  <Badge className={
                    selectedProperty.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedProperty.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {selectedProperty.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-slate-600">
                  <p>Type: {selectedProperty.type.charAt(0).toUpperCase() + selectedProperty.type.slice(1)}</p>
                  <p>Listing Agent: {selectedProperty.agent}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.title || !formData.date || !formData.time || !formData.clientId || !formData.agentId}
              >
                <FiCheck className="mr-2" />
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </Button>
              
              <Button variant="outline" className="w-full">
                <FiSave className="mr-2" />
                Save as Draft
              </Button>
              
              <Button variant="outline" className="w-full">
                <FiSend className="mr-2" />
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          {/* Preparation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Preparation Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Confirm property access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Prepare property information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Review client preferences</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Prepare contracts/documents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Check calendar for conflicts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
