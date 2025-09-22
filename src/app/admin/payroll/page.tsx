'use client';
import { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiUsers, FiFileText, FiDownload,
  FiPlus, FiEdit, FiTrash2, FiEye, FiCalendar, FiTrendingUp,
  FiAlertCircle, FiCheck, FiClock, FiFilter, FiSearch
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

interface Employee {
  id: string;
  name: string;
  position: string;
  employeeId: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: number;
  payType: 'salary' | 'hourly' | 'commission';
  hourlyRate?: number;
  commissionRate?: number;
  department: string;
  status: 'active' | 'inactive';
  taxInfo: {
    ssn: string;
    filingStatus: 'single' | 'married' | 'head_of_household';
    allowances: number;
    additionalWithholding: number;
    state: string;
  };
  benefits: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    retirement401k: number; // percentage
    lifeInsurance: boolean;
  };
}

interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  payDate: string;
  grossPay: number;
  hoursWorked?: number;
  overtimeHours?: number;
  commissionAmount?: number;
  bonuses: number;
  deductions: {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    healthInsurance: number;
    dentalInsurance: number;
    retirement401k: number;
    other: number;
  };
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  checkNumber?: string;
}

interface TaxRate {
  year: number;
  federal: {
    brackets: Array<{
      min: number;
      max: number;
      rate: number;
    }>;
    standardDeduction: {
      single: number;
      married: number;
      headOfHousehold: number;
    };
  };
  socialSecurity: {
    rate: number;
    cap: number;
  };
  medicare: {
    rate: number;
    additionalRate: number;
    additionalThreshold: number;
  };
  unemployment: {
    rate: number;
    cap: number;
  };
}

const currentTaxRates: TaxRate = {
  year: 2024,
  federal: {
    brackets: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182050, rate: 0.24 },
      { min: 182051, max: 231250, rate: 0.32 },
      { min: 231251, max: 578125, rate: 0.35 },
      { min: 578126, max: Infinity, rate: 0.37 }
    ],
    standardDeduction: {
      single: 13850,
      married: 27700,
      headOfHousehold: 20800
    }
  },
  socialSecurity: {
    rate: 0.062,
    cap: 160200
  },
  medicare: {
    rate: 0.0145,
    additionalRate: 0.009,
    additionalThreshold: 200000
  },
  unemployment: {
    rate: 0.006,
    cap: 7000
  }
};

const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Senior Real Estate Agent',
    employeeId: 'EMP001',
    email: 'sarah.johnson@apluslocators.com',
    phone: '+1 (555) 123-4567',
    hireDate: '2023-01-15',
    salary: 75000,
    payType: 'salary',
    commissionRate: 3,
    department: 'Sales',
    status: 'active',
    taxInfo: {
      ssn: '***-**-1234',
      filingStatus: 'single',
      allowances: 1,
      additionalWithholding: 0,
      state: 'NY'
    },
    benefits: {
      healthInsurance: true,
      dentalInsurance: true,
      retirement401k: 5,
      lifeInsurance: true
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Property Manager',
    employeeId: 'EMP002',
    email: 'michael.chen@apluslocators.com',
    phone: '+1 (555) 234-5678',
    hireDate: '2022-08-20',
    salary: 65000,
    payType: 'salary',
    department: 'Operations',
    status: 'active',
    taxInfo: {
      ssn: '***-**-5678',
      filingStatus: 'married',
      allowances: 2,
      additionalWithholding: 100,
      state: 'NY'
    },
    benefits: {
      healthInsurance: true,
      dentalInsurance: false,
      retirement401k: 6,
      lifeInsurance: true
    }
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'Administrative Assistant',
    employeeId: 'EMP003',
    email: 'emily.rodriguez@apluslocators.com',
    phone: '+1 (555) 345-6789',
    hireDate: '2023-03-10',
    salary: 0,
    payType: 'hourly',
    hourlyRate: 22,
    department: 'Administration',
    status: 'active',
    taxInfo: {
      ssn: '***-**-9012',
      filingStatus: 'single',
      allowances: 0,
      additionalWithholding: 50,
      state: 'NY'
    },
    benefits: {
      healthInsurance: true,
      dentalInsurance: false,
      retirement401k: 3,
      lifeInsurance: false
    }
  }
];

const calculatePayrollTaxes = (grossPay: number, employee: Employee): PayrollEntry['deductions'] => {
  // Federal income tax calculation (simplified)
  const federalTax = grossPay * 0.12; // Simplified calculation
  
  // State tax (NY example)
  const stateTax = grossPay * 0.068;
  
  // Social Security
  const socialSecurity = Math.min(grossPay * currentTaxRates.socialSecurity.rate, 
    currentTaxRates.socialSecurity.cap * currentTaxRates.socialSecurity.rate);
  
  // Medicare
  const medicare = grossPay * currentTaxRates.medicare.rate;
  
  // Benefits deductions
  const healthInsurance = employee.benefits.healthInsurance ? 250 : 0;
  const dentalInsurance = employee.benefits.dentalInsurance ? 50 : 0;
  const retirement401k = grossPay * (employee.benefits.retirement401k / 100);
  
  return {
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    healthInsurance,
    dentalInsurance,
    retirement401k,
    other: employee.taxInfo.additionalWithholding
  };
};

const PayrollSummary = () => {
  const [employees] = useState<Employee[]>(sampleEmployees);
  const [currentPeriod, setCurrentPeriod] = useState('2024-01');

  const totalEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalPayroll = employees.reduce((sum, emp) => {
    if (emp.payType === 'salary') {
      return sum + (emp.salary / 12); // Monthly salary
    } else if (emp.payType === 'hourly' && emp.hourlyRate) {
      return sum + (emp.hourlyRate * 160); // Assuming 160 hours per month
    }
    return sum;
  }, 0);

  const totalTaxes = totalPayroll * 0.25; // Approximate total tax rate
  const netPayroll = totalPayroll - totalTaxes;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Employees</p>
              <p className="text-3xl font-bold">{totalEmployees}</p>
            </div>
            <FiUsers className="text-2xl text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Gross Payroll</p>
              <p className="text-3xl font-bold">${totalPayroll.toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-2xl text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Taxes</p>
              <p className="text-3xl font-bold">${totalTaxes.toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-2xl text-red-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Net Payroll</p>
              <p className="text-3xl font-bold">${netPayroll.toLocaleString()}</p>
            </div>
            <FiTrendingUp className="text-2xl text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EmployeeList = () => {
  const [employees] = useState<Employee[]>(sampleEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Employee Management</CardTitle>
          <Button>
            <FiPlus className="mr-2" />
            Add Employee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search employees..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{employee.name}</h3>
                    <Badge variant="outline">{employee.employeeId}</Badge>
                    <Badge className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {employee.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600">{employee.position} • {employee.department}</p>
                  <div className="flex items-center space-x-6 mt-2 text-sm text-slate-500">
                    <span>Hire Date: {new Date(employee.hireDate).toLocaleDateString()}</span>
                    <span>
                      Pay: {employee.payType === 'salary' ? `$${employee.salary.toLocaleString()}/year` : 
                            employee.payType === 'hourly' ? `$${employee.hourlyRate}/hour` : 'Commission'}
                    </span>
                    <span>Filing: {employee.taxInfo.filingStatus.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <FiEye className="text-xs" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FiEdit className="text-xs" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FiFileText className="text-xs" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PayrollCalculator = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [payPeriod, setPayPeriod] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [bonuses, setBonuses] = useState('');
  const [commissionAmount, setCommissionAmount] = useState('');

  const employees = sampleEmployees;
  const employee = employees.find(emp => emp.id === selectedEmployee);

  const calculatePayroll = () => {
    if (!employee) return null;

    let grossPay = 0;
    
    if (employee.payType === 'salary') {
      grossPay = employee.salary / 26; // Bi-weekly
    } else if (employee.payType === 'hourly' && employee.hourlyRate) {
      const regular = Math.min(parseFloat(hoursWorked) || 0, 40) * employee.hourlyRate;
      const overtime = Math.max((parseFloat(hoursWorked) || 0) - 40, 0) * employee.hourlyRate * 1.5;
      grossPay = regular + overtime;
    }

    grossPay += parseFloat(bonuses) || 0;
    grossPay += parseFloat(commissionAmount) || 0;

    const deductions = calculatePayrollTaxes(grossPay, employee);
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    const netPay = grossPay - totalDeductions;

    return {
      grossPay,
      deductions,
      totalDeductions,
      netPay
    };
  };

  const calculation = calculatePayroll();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employee">Select Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="payPeriod">Pay Period</Label>
            <Input
              id="payPeriod"
              type="date"
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
            />
          </div>
        </div>

        {employee && employee.payType === 'hourly' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input
                id="hoursWorked"
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                placeholder="40"
              />
            </div>
            <div>
              <Label htmlFor="overtimeHours">Overtime Hours</Label>
              <Input
                id="overtimeHours"
                type="number"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bonuses">Bonuses</Label>
            <Input
              id="bonuses"
              type="number"
              value={bonuses}
              onChange={(e) => setBonuses(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="commissionAmount">Commission</Label>
            <Input
              id="commissionAmount"
              type="number"
              value={commissionAmount}
              onChange={(e) => setCommissionAmount(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        {calculation && (
          <div className="mt-8">
            <Separator className="mb-6" />
            <h3 className="text-lg font-semibold mb-4">Payroll Calculation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">Gross Pay</h4>
                <div className="text-2xl font-bold">${calculation.grossPay.toFixed(2)}</div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">Deductions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Federal Tax:</span>
                    <span>${calculation.deductions.federalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Tax:</span>
                    <span>${calculation.deductions.stateTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Security:</span>
                    <span>${calculation.deductions.socialSecurity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medicare:</span>
                    <span>${calculation.deductions.medicare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Insurance:</span>
                    <span>${calculation.deductions.healthInsurance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>401k:</span>
                    <span>${calculation.deductions.retirement401k.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Deductions:</span>
                    <span>${calculation.totalDeductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Net Pay:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculation.netPay.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button>
                <FiCheck className="mr-2" />
                Process Payroll
              </Button>
              <Button variant="outline">
                <FiDownload className="mr-2" />
                Generate Pay Stub
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function PayrollPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Payroll Management</h1>
          <p className="text-slate-600">Manage employee payroll, taxes, and benefits</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Export Reports
          </Button>
          <Button variant="outline">
            <FiFileText className="mr-2" />
            Tax Forms
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <PayrollSummary />

      {/* Tax Compliance Alert */}
      <Alert className="mb-8 border-yellow-200 bg-yellow-50">
        <FiAlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Quarterly tax filing due in 15 days. Ensure all payroll records are up to date.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calculator">Payroll Calculator</TabsTrigger>
          <TabsTrigger value="employees">Employee Management</TabsTrigger>
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <PayrollCalculator />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeeList />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Tax Reports & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiFileText className="text-2xl" />
                  <span>Form 941</span>
                  <span className="text-xs text-slate-500">Quarterly Federal Tax Return</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiFileText className="text-2xl" />
                  <span>W-2 Forms</span>
                  <span className="text-xs text-slate-500">Annual Wage Statements</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiFileText className="text-2xl" />
                  <span>1099 Forms</span>
                  <span className="text-xs text-slate-500">Independent Contractor Forms</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiDollarSign className="text-2xl" />
                  <span>Tax Liability</span>
                  <span className="text-xs text-slate-500">Current Tax Obligations</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiTrendingUp className="text-2xl" />
                  <span>Payroll Summary</span>
                  <span className="text-xs text-slate-500">Year-to-Date Reports</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiDollarSign className="text-2xl" />
                  <span>State Reports</span>
                  <span className="text-xs text-slate-500">State Tax Filings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
