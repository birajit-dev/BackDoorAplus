'use client';
import { useState, useEffect } from 'react';
import { 
  FiCalendar, FiClock, FiMapPin, FiUser, FiPhone, FiMail, 
  FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiFilter, FiSearch, FiHome,
  FiCheckSquare, FiSquare, FiAlertCircle, FiStar
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'appointment' | 'task' | 'meeting' | 'showing';
  date: string;
  time: string;
  duration: number; // in minutes
  description?: string;
  location?: string;
  client?: {
    name: string;
    email: string;
    phone: string;
  };
  property?: {
    id: string;
    address: string;
  };
  agent: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  priority?: 'low' | 'medium' | 'high';
  googleEventId?: string;
  reminders?: number[]; // minutes before event
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  relatedProperty?: string;
  category: 'administrative' | 'property' | 'client' | 'marketing';
  createdAt: string;
}

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Property Showing - Downtown Condo',
    type: 'showing',
    date: '2024-01-22',
    time: '10:00',
    duration: 60,
    description: 'Show the modern downtown condo to potential buyers',
    location: '123 Oak Street, Downtown, NY 10001',
    client: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567'
    },
    property: {
      id: '1',
      address: '123 Oak Street, Downtown'
    },
    agent: 'Sarah Johnson',
    status: 'scheduled',
    priority: 'high',
    reminders: [15, 60]
  },
  {
    id: '2',
    title: 'Client Consultation',
    type: 'appointment',
    date: '2024-01-22',
    time: '14:00',
    duration: 90,
    description: 'Initial consultation with new clients looking for family home',
    location: 'Office',
    client: {
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 987-6543'
    },
    agent: 'Michael Chen',
    status: 'scheduled',
    priority: 'medium',
    reminders: [30]
  },
  {
    id: '3',
    title: 'Property Inspection',
    type: 'task',
    date: '2024-01-23',
    time: '09:00',
    duration: 120,
    description: 'Conduct property inspection for new listing',
    location: '456 Pine Avenue, Suburbia',
    agent: 'Emily Rodriguez',
    status: 'scheduled',
    priority: 'high'
  }
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Update property photos',
    description: 'Take new professional photos for 123 Oak Street listing',
    dueDate: '2024-01-25',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Sarah Johnson',
    relatedProperty: '123 Oak Street',
    category: 'property',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Prepare market analysis report',
    description: 'Create CMA for Pine Avenue property',
    dueDate: '2024-01-24',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'Michael Chen',
    category: 'administrative',
    createdAt: '2024-01-19'
  },
  {
    id: '3',
    title: 'Follow up with potential buyer',
    description: 'Call John Smith about downtown condo feedback',
    dueDate: '2024-01-23',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'Sarah Johnson',
    category: 'client',
    createdAt: '2024-01-18'
  }
];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month's days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <FiCalendar className="mr-2" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <FiChevronLeft />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <FiChevronRight />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-slate-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isSelected = day.date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                  !day.isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'bg-white'
                } ${isToday ? 'border-blue-500 bg-blue-50' : 'border-slate-200'} ${
                  isSelected ? 'ring-2 ring-blue-300' : ''
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white truncate ${
                        event.type === 'appointment' ? 'bg-blue-500' :
                        event.type === 'showing' ? 'bg-green-500' :
                        event.type === 'task' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-slate-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => filter === 'all' || task.status === filter);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <FiCheckSquare className="text-green-600" />;
      case 'in-progress': return <FiClock className="text-blue-600" />;
      default: return <FiSquare className="text-slate-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Task Management</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <FiPlus className="mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg hover:shadow-sm transition-shadow ${
                  task.status === 'completed' ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-1"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                        <span>Assigned to: {task.assignedTo}</span>
                        {task.dueDate && (
                          <span className="flex items-center">
                            <FiCalendar className="mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <FiEdit className="text-xs" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <FiTrash2 className="text-xs" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);

  const connectGoogleCalendar = async () => {
    // Simulate Google Calendar connection
    setTimeout(() => {
      setIsGoogleConnected(true);
    }, 1000);
  };

  const syncWithGoogle = async () => {
    // Simulate sync with Google Calendar
    console.log('Syncing with Google Calendar...');
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Calendar & Appointments</h1>
          <p className="text-slate-600">Manage your schedule, appointments, and tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isGoogleConnected ? (
            <Button onClick={connectGoogleCalendar} variant="outline">
              <FiCalendar className="mr-2" />
              Connect Google Calendar
            </Button>
          ) : (
            <Button onClick={syncWithGoogle} variant="outline">
              <FiRefreshCw className="mr-2" />
              Sync with Google
            </Button>
          )}
          <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
            <DialogTrigger asChild>
              <Button>
                <FiPlus className="mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Schedule a new appointment, showing, or task
                </DialogDescription>
              </DialogHeader>
              {/* Event creation form would go here */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="showing">Property Showing</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowNewEventDialog(false)}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Google Calendar Status */}
      {isGoogleConnected && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <FiCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Google Calendar connected successfully. Events will sync automatically.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList />
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      event.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                      event.type === 'showing' ? 'bg-green-100 text-green-600' :
                      event.type === 'task' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {event.type === 'showing' ? <FiHome /> : 
                       event.type === 'task' ? <FiCheckSquare /> : <FiCalendar />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="text-sm text-slate-600 flex items-center space-x-4">
                        <span className="flex items-center">
                          <FiCalendar className="mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" />
                          {event.time}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <FiMapPin className="mr-1" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={
                      event.priority === 'high' ? 'bg-red-100 text-red-800' :
                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {event.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
