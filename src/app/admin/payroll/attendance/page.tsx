'use client';
import { useState, useEffect } from 'react';
import { 
  FiClock, FiCalendar, FiUsers, FiCheck, FiX, FiEdit, FiDownload,
  FiPlus, FiSearch, FiFilter, FiTrendingUp, FiAlertCircle, FiEye,
  FiPlay, FiPause, FiSquare, FiRefreshCw, FiFileText, FiMapPin
} from 'react-icons/fi';
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

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_break' | 'clocked_in';
  location?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  payType: 'hourly' | 'salary';
  hourlyRate?: number;
  salary?: number;
  workSchedule: {
    monday: { start: string; end: string; };
    tuesday: { start: string; end: string; };
    wednesday: { start: string; end: string; };
    thursday: { start: string; end: string; };
    friday: { start: string; end: string; };
    saturday?: { start: string; end: string; };
    sunday?: { start: string; end: string; };
  };
  status: 'active' | 'inactive';
}

interface AttendanceSummary {
  employeeId: string;
  employeeName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  attendanceRate: number;
}

const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    employeeId: 'EMP001',
    department: 'Sales',
    position: 'Senior Real Estate Agent',
    payType: 'salary',
    salary: 75000,
    workSchedule: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    employeeId: 'EMP002',
    department: 'Operations',
    position: 'Property Manager',
    payType: 'salary',
    salary: 65000,
    workSchedule: {
      monday: { start: '08:30', end: '17:30' },
      tuesday: { start: '08:30', end: '17:30' },
      wednesday: { start: '08:30', end: '17:30' },
      thursday: { start: '08:30', end: '17:30' },
      friday: { start: '08:30', end: '17:30' }
    },
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    employeeId: 'EMP003',
    department: 'Administration',
    position: 'Administrative Assistant',
    payType: 'hourly',
    hourlyRate: 22,
    workSchedule: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    },
    status: 'active'
  }
];

const sampleTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    date: '2024-01-22',
    clockIn: '08:55',
    clockOut: '17:10',
    breakStart: '12:00',
    breakEnd: '13:00',
    totalHours: 8.25,
    regularHours: 8,
    overtimeHours: 0.25,
    status: 'present',
    location: 'Main Office',
    approvedBy: 'Manager',
    approvedAt: '2024-01-22T18:00:00Z'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Michael Chen',
    date: '2024-01-22',
    clockIn: '08:35',
    clockOut: '17:45',
    breakStart: '12:30',
    breakEnd: '13:30',
    totalHours: 9.17,
    regularHours: 8,
    overtimeHours: 1.17,
    status: 'present',
    location: 'Property Site',
    approvedBy: 'Manager',
    approvedAt: '2024-01-22T18:00:00Z'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Emily Rodriguez',
    date: '2024-01-22',
    clockIn: '09:15',
    clockOut: '17:00',
    breakStart: '12:00',
    breakEnd: '12:30',
    totalHours: 7.25,
    regularHours: 7.25,
    overtimeHours: 0,
    status: 'late',
    location: 'Main Office',
    notes: 'Traffic delay - approved late arrival'
  },
  {
    id: '4',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    date: '2024-01-23',
    clockIn: '09:00',
    status: 'clocked_in',
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    location: 'Main Office'
  }
];

const TimeClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isClockingIn, setIsClockingIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockAction = async (action: 'clock_in' | 'clock_out' | 'break_start' | 'break_end') => {
    if (!selectedEmployee) return;
    
    setIsClockingIn(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`${action} for employee ${selectedEmployee} at ${currentTime.toLocaleTimeString()}`);
      setIsClockingIn(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FiClock className="mr-2" />
          Time Clock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-lg text-slate-600">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <Separator />

        <div>
          <Label htmlFor="employee-select">Select Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Choose employee" />
            </SelectTrigger>
            <SelectContent>
              {sampleEmployees.map(emp => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleClockAction('clock_in')}
            disabled={!selectedEmployee || isClockingIn}
          >
            <FiPlay className="mr-2" />
            Clock In
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleClockAction('clock_out')}
            disabled={!selectedEmployee || isClockingIn}
          >
            <FiSquare className="mr-2" />
            Clock Out
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleClockAction('break_start')}
            disabled={!selectedEmployee || isClockingIn}
          >
            <FiPause className="mr-2" />
            Start Break
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleClockAction('break_end')}
            disabled={!selectedEmployee || isClockingIn}
          >
            <FiPlay className="mr-2" />
            End Break
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AttendanceTable = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(sampleTimeEntries);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterEmployee, setFilterEmployee] = useState<string>('all');

  const filteredEntries = timeEntries.filter(entry => {
    const matchesDate = entry.date === selectedDate;
    const matchesEmployee = filterEmployee === 'all' || entry.employeeId === filterEmployee;
    return matchesDate && matchesEmployee;
  });

  const getStatusColor = (status: TimeEntry['status']) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half_day': return 'bg-blue-100 text-blue-800';
      case 'on_break': return 'bg-purple-100 text-purple-800';
      case 'clocked_in': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalHours = (clockIn: string, clockOut?: string, breakStart?: string, breakEnd?: string) => {
    if (!clockOut) return 0;
    
    const start = new Date(`2024-01-01T${clockIn}:00`);
    const end = new Date(`2024-01-01T${clockOut}:00`);
    let totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    if (breakStart && breakEnd) {
      const breakStartTime = new Date(`2024-01-01T${breakStart}:00`);
      const breakEndTime = new Date(`2024-01-01T${breakEnd}:00`);
      const breakMinutes = (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60);
      totalMinutes -= breakMinutes;
    }
    
    return Math.round((totalMinutes / 60) * 100) / 100;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Daily Attendance</CardTitle>
          <div className="flex items-center space-x-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Select value={filterEmployee} onValueChange={setFilterEmployee}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {sampleEmployees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Employee</th>
                <th className="text-left p-3">Clock In</th>
                <th className="text-left p-3">Clock Out</th>
                <th className="text-left p-3">Break</th>
                <th className="text-left p-3">Total Hours</th>
                <th className="text-left p-3">Overtime</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">
                    <div>
                      <div className="font-semibold">{entry.employeeName}</div>
                      <div className="text-sm text-slate-500">
                        {sampleEmployees.find(emp => emp.id === entry.employeeId)?.employeeId}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-mono">{entry.clockIn}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono">{entry.clockOut || '--:--'}</span>
                  </td>
                  <td className="p-3">
                    {entry.breakStart && entry.breakEnd ? (
                      <span className="font-mono text-sm">
                        {entry.breakStart} - {entry.breakEnd}
                      </span>
                    ) : (
                      <span className="text-slate-400">No break</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{entry.totalHours.toFixed(2)}h</span>
                  </td>
                  <td className="p-3">
                    <span className={entry.overtimeHours > 0 ? 'text-orange-600 font-semibold' : 'text-slate-400'}>
                      {entry.overtimeHours.toFixed(2)}h
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <FiMapPin className="mr-1 text-xs" />
                      {entry.location || 'N/A'}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <FiEdit className="text-xs" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FiEye className="text-xs" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-8">
            <FiCalendar className="mx-auto text-4xl text-slate-300 mb-4" />
            <p className="text-slate-500">No attendance records found for selected date</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AttendanceSummaryWidget = () => {
  const [summaryPeriod, setSummaryPeriod] = useState('current_month');
  
  // Calculate attendance summary (mock data for now)
  const summaryData: AttendanceSummary[] = [
    {
      employeeId: '1',
      employeeName: 'Sarah Johnson',
      totalDays: 22,
      presentDays: 21,
      absentDays: 1,
      lateDays: 2,
      totalHours: 168.5,
      regularHours: 168,
      overtimeHours: 0.5,
      attendanceRate: 95.5
    },
    {
      employeeId: '2',
      employeeName: 'Michael Chen',
      totalDays: 22,
      presentDays: 22,
      absentDays: 0,
      lateDays: 0,
      totalHours: 182.3,
      regularHours: 176,
      overtimeHours: 6.3,
      attendanceRate: 100
    },
    {
      employeeId: '3',
      employeeName: 'Emily Rodriguez',
      totalDays: 22,
      presentDays: 20,
      absentDays: 2,
      lateDays: 3,
      totalHours: 156.75,
      regularHours: 156.75,
      overtimeHours: 0,
      attendanceRate: 90.9
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Attendance Summary</CardTitle>
          <Select value={summaryPeriod} onValueChange={setSummaryPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_week">This Week</SelectItem>
              <SelectItem value="current_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="current_quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaryData.map((summary) => (
            <div key={summary.employeeId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold">{summary.employeeName}</h4>
                <Badge className={
                  summary.attendanceRate >= 95 ? 'bg-green-100 text-green-800' :
                  summary.attendanceRate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {summary.attendanceRate}% Attendance
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{summary.presentDays}</div>
                  <div className="text-slate-600">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{summary.absentDays}</div>
                  <div className="text-slate-600">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{summary.lateDays}</div>
                  <div className="text-slate-600">Late</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{summary.totalHours}</div>
                  <div className="text-slate-600">Total Hours</div>
                </div>
              </div>
              
              {summary.overtimeHours > 0 && (
                <div className="mt-3 p-2 bg-orange-50 rounded">
                  <div className="text-sm text-orange-800">
                    <strong>Overtime:</strong> {summary.overtimeHours} hours
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function AttendancePage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Attendance Management</h1>
          <p className="text-slate-600">Track employee time, attendance, and work hours</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <FiFileText className="mr-2" />
            Timesheets
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Employees Present</p>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <FiUsers className="text-2xl text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Hours Today</p>
                <p className="text-3xl font-bold text-blue-600">64.5</p>
              </div>
              <FiClock className="text-2xl text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Overtime Hours</p>
                <p className="text-3xl font-bold text-orange-600">2.5</p>
              </div>
              <FiTrendingUp className="text-2xl text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-purple-600">95.2%</p>
              </div>
              <FiCheck className="text-2xl text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Time Clock */}
        <div className="lg:col-span-1">
          <TimeClockWidget />
        </div>

        {/* Attendance Summary */}
        <div className="lg:col-span-2">
          <AttendanceSummaryWidget />
        </div>
      </div>

      {/* Attendance Table */}
      <AttendanceTable />
    </div>
  );
}
