'use client';
import { useState, useEffect } from 'react';
import { 
  FiBarChart, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers,
  FiDownload, FiPrinter, FiMail, FiCalendar, FiClock, FiPercent,
  FiPieChart, FiActivity, FiTarget, FiFilter, FiRefreshCw
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PayrollSummary {
  period: string;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxes: number;
  totalDeductions: number;
  employeeCount: number;
  overtimeHours: number;
  overtimePay: number;
  averagePay: number;
  payrollCost: number;
}

interface EmployeePayrollData {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  payType: 'hourly' | 'salary';
  grossPay: number;
  netPay: number;
  taxes: number;
  deductions: number;
  hoursWorked: number;
  overtimeHours: number;
  payPeriods: number;
  ytdGross: number;
  ytdNet: number;
  ytdTaxes: number;
}

interface DepartmentSummary {
  department: string;
  employeeCount: number;
  totalGrossPay: number;
  totalNetPay: number;
  averagePay: number;
  totalHours: number;
  payrollCost: number;
}

interface TaxSummary {
  federalIncomeTax: number;
  stateIncomeTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  unemploymentTax: number;
  stateDisabilityTax: number;
  totalTaxes: number;
  employerTaxes: number;
  totalTaxLiability: number;
}

const samplePayrollSummary: PayrollSummary[] = [
  {
    period: '2024-01',
    totalGrossPay: 195000,
    totalNetPay: 142350,
    totalTaxes: 39000,
    totalDeductions: 13650,
    employeeCount: 8,
    overtimeHours: 24,
    overtimePay: 3600,
    averagePay: 24375,
    payrollCost: 215400
  },
  {
    period: '2024-02',
    totalGrossPay: 203000,
    totalNetPay: 148190,
    totalTaxes: 40600,
    totalDeductions: 14210,
    employeeCount: 8,
    overtimeHours: 32,
    overtimePay: 4800,
    averagePay: 25375,
    payrollCost: 224300
  },
  {
    period: '2024-03',
    totalGrossPay: 198500,
    totalNetPay: 144935,
    totalTaxes: 39700,
    totalDeductions: 13865,
    employeeCount: 8,
    overtimeHours: 18,
    overtimePay: 2700,
    averagePay: 24812.50,
    payrollCost: 219350
  }
];

const sampleEmployeeData: EmployeePayrollData[] = [
  {
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    department: 'Sales',
    position: 'Senior Real Estate Agent',
    payType: 'salary',
    grossPay: 6250,
    netPay: 4562.50,
    taxes: 1250,
    deductions: 437.50,
    hoursWorked: 160,
    overtimeHours: 0,
    payPeriods: 12,
    ytdGross: 75000,
    ytdNet: 54750,
    ytdTaxes: 15000
  },
  {
    employeeId: '2',
    employeeName: 'Michael Chen',
    department: 'Operations',
    position: 'Property Manager',
    payType: 'salary',
    grossPay: 5416.67,
    netPay: 3953.34,
    taxes: 1083.33,
    deductions: 380,
    hoursWorked: 160,
    overtimeHours: 8,
    payPeriods: 12,
    ytdGross: 65000,
    ytdNet: 47440,
    ytdTaxes: 13000
  },
  {
    employeeId: '3',
    employeeName: 'Emily Rodriguez',
    department: 'Administration',
    position: 'Administrative Assistant',
    payType: 'hourly',
    grossPay: 3520,
    netPay: 2569.60,
    taxes: 704,
    deductions: 246.40,
    hoursWorked: 160,
    overtimeHours: 0,
    payPeriods: 12,
    ytdGross: 42240,
    ytdNet: 30835.20,
    ytdTaxes: 8448
  }
];

const sampleDepartmentData: DepartmentSummary[] = [
  {
    department: 'Sales',
    employeeCount: 4,
    totalGrossPay: 25000,
    totalNetPay: 18250,
    averagePay: 6250,
    totalHours: 640,
    payrollCost: 27500
  },
  {
    department: 'Operations',
    employeeCount: 2,
    totalGrossPay: 10833.34,
    totalNetPay: 7906.68,
    averagePay: 5416.67,
    totalHours: 320,
    payrollCost: 11916.67
  },
  {
    department: 'Administration',
    employeeCount: 2,
    totalGrossPay: 7040,
    totalNetPay: 5139.20,
    averagePay: 3520,
    totalHours: 320,
    payrollCost: 7744
  }
];

const sampleTaxData: TaxSummary = {
  federalIncomeTax: 32500,
  stateIncomeTax: 13650,
  socialSecurityTax: 12090,
  medicareTax: 2827.50,
  unemploymentTax: 1170,
  stateDisabilityTax: 975,
  totalTaxes: 63212.50,
  employerTaxes: 15087.50,
  totalTaxLiability: 78300
};

const PayrollOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-03');
  const currentData = samplePayrollSummary.find(data => data.period === selectedPeriod) || samplePayrollSummary[0];
  
  const monthlyTrendData = {
    labels: samplePayrollSummary.map(data => {
      const [year, month] = data.period.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Gross Pay',
        data: samplePayrollSummary.map(data => data.totalGrossPay),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Net Pay',
        data: samplePayrollSummary.map(data => data.totalNetPay),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Total Taxes',
        data: samplePayrollSummary.map(data => data.totalTaxes),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Gross Pay</p>
                <p className="text-3xl font-bold text-blue-600">${currentData.totalGrossPay.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+4.1% from last month</p>
              </div>
              <FiDollarSign className="text-2xl text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Net Pay</p>
                <p className="text-3xl font-bold text-green-600">${currentData.totalNetPay.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+3.8% from last month</p>
              </div>
              <FiTrendingUp className="text-2xl text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Taxes</p>
                <p className="text-3xl font-bold text-red-600">${currentData.totalTaxes.toLocaleString()}</p>
                <p className="text-sm text-slate-600 mt-1">{((currentData.totalTaxes / currentData.totalGrossPay) * 100).toFixed(1)}% of gross</p>
              </div>
              <FiPercent className="text-2xl text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Average Pay</p>
                <p className="text-3xl font-bold text-purple-600">${currentData.averagePay.toLocaleString()}</p>
                <p className="text-sm text-slate-600 mt-1">{currentData.employeeCount} employees</p>
              </div>
              <FiUsers className="text-2xl text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payroll Trends</CardTitle>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {samplePayrollSummary.map(data => (
                  <SelectItem key={data.period} value={data.period}>
                    {new Date(data.period + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Line data={monthlyTrendData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }} />
        </CardContent>
      </Card>

      {/* Overtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overtime Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Overtime Hours</span>
                <span className="font-semibold">{currentData.overtimeHours} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Overtime Pay</span>
                <span className="font-semibold">${currentData.overtimePay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>% of Total Pay</span>
                <span className="font-semibold">{((currentData.overtimePay / currentData.totalGrossPay) * 100).toFixed(1)}%</span>
              </div>
              <Separator />
              <div className="text-sm text-slate-600">
                Overtime costs have {currentData.overtimeHours > 25 ? 'increased' : 'decreased'} compared to target levels.
                Consider workload distribution optimization.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Base Payroll</span>
                <span className="font-semibold">${currentData.totalGrossPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Employer Taxes</span>
                <span className="font-semibold">${(currentData.totalTaxes * 0.25).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Benefits</span>
                <span className="font-semibold">${(currentData.totalDeductions * 0.6).toFixed(0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Payroll Cost</span>
                <span>${currentData.payrollCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EmployeeReports = () => {
  const [sortBy, setSortBy] = useState('grossPay');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredEmployees = sampleEmployeeData.filter(emp => 
    filterDepartment === 'all' || emp.department === filterDepartment
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case 'grossPay': return b.grossPay - a.grossPay;
      case 'netPay': return b.netPay - a.netPay;
      case 'name': return a.employeeName.localeCompare(b.employeeName);
      case 'department': return a.department.localeCompare(b.department);
      default: return 0;
    }
  });

  const departments = Array.from(new Set(sampleEmployeeData.map(emp => emp.department)));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Filter by Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grossPay">Gross Pay (High to Low)</SelectItem>
                  <SelectItem value="netPay">Net Pay (High to Low)</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Pay Type</th>
                  <th className="text-left p-3">Gross Pay</th>
                  <th className="text-left p-3">Taxes</th>
                  <th className="text-left p-3">Deductions</th>
                  <th className="text-left p-3">Net Pay</th>
                  <th className="text-left p-3">Hours</th>
                  <th className="text-left p-3">YTD Gross</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee) => (
                  <tr key={employee.employeeId} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      <div>
                        <div className="font-semibold">{employee.employeeName}</div>
                        <div className="text-sm text-slate-500">{employee.position}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{employee.department}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={employee.payType === 'salary' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {employee.payType.charAt(0).toUpperCase() + employee.payType.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">${employee.grossPay.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-red-600">${employee.taxes.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <span>${employee.deductions.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-green-600">${employee.netPay.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{employee.hoursWorked}h regular</div>
                        {employee.overtimeHours > 0 && (
                          <div className="text-orange-600">{employee.overtimeHours}h overtime</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">${employee.ytdGross.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DepartmentAnalysis = () => {
  const departmentChartData = {
    labels: sampleDepartmentData.map(dept => dept.department),
    datasets: [{
      label: 'Total Payroll Cost',
      data: sampleDepartmentData.map(dept => dept.payrollCost),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(249, 115, 22)',
        'rgb(139, 92, 246)'
      ],
      borderWidth: 1
    }]
  };

  const employeeDistributionData = {
    labels: sampleDepartmentData.map(dept => dept.department),
    datasets: [{
      data: sampleDepartmentData.map(dept => dept.employeeCount),
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F97316',
        '#8B5CF6'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="space-y-6">
      {/* Department Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleDepartmentData.map((dept) => (
          <Card key={dept.department}>
            <CardHeader>
              <CardTitle className="text-lg">{dept.department}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Employees:</span>
                  <span className="font-semibold">{dept.employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Payroll:</span>
                  <span className="font-semibold">${dept.totalGrossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Average Pay:</span>
                  <span className="font-semibold">${dept.averagePay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Hours:</span>
                  <span className="font-semibold">{dept.totalHours}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Payroll Cost:</span>
                  <span className="font-bold text-blue-600">${dept.payrollCost.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payroll Cost by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={departmentChartData} options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={employeeDistributionData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom' as const,
                },
              },
            }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TaxReports = () => {
  const taxBreakdownData = {
    labels: ['Federal Income Tax', 'State Income Tax', 'Social Security', 'Medicare', 'Unemployment', 'State Disability'],
    datasets: [{
      data: [
        sampleTaxData.federalIncomeTax,
        sampleTaxData.stateIncomeTax,
        sampleTaxData.socialSecurityTax,
        sampleTaxData.medicareTax,
        sampleTaxData.unemploymentTax,
        sampleTaxData.stateDisabilityTax
      ],
      backgroundColor: [
        '#EF4444',
        '#F97316',
        '#F59E0B',
        '#10B981',
        '#3B82F6',
        '#8B5CF6'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="space-y-6">
      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Employee Taxes</p>
                <p className="text-3xl font-bold text-red-600">${sampleTaxData.totalTaxes.toLocaleString()}</p>
              </div>
              <FiTrendingDown className="text-2xl text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Employer Taxes</p>
                <p className="text-3xl font-bold text-orange-600">${sampleTaxData.employerTaxes.toLocaleString()}</p>
              </div>
              <FiPercent className="text-2xl text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tax Liability</p>
                <p className="text-3xl font-bold text-purple-600">${sampleTaxData.totalTaxLiability.toLocaleString()}</p>
              </div>
              <FiDollarSign className="text-2xl text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Effective Tax Rate</p>
                <p className="text-3xl font-bold text-blue-600">32.4%</p>
              </div>
              <FiBarChart className="text-2xl text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={taxBreakdownData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom' as const,
                },
              },
            }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Tax Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Federal Income Tax</span>
                <span className="font-semibold">${sampleTaxData.federalIncomeTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>State Income Tax</span>
                <span className="font-semibold">${sampleTaxData.stateIncomeTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Social Security Tax</span>
                <span className="font-semibold">${sampleTaxData.socialSecurityTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Medicare Tax</span>
                <span className="font-semibold">${sampleTaxData.medicareTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Unemployment Tax</span>
                <span className="font-semibold">${sampleTaxData.unemploymentTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>State Disability Tax</span>
                <span className="font-semibold">${sampleTaxData.stateDisabilityTax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Employee Taxes</span>
                <span className="text-red-600">${sampleTaxData.totalTaxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span>Employer Match/Taxes</span>
                <span className="text-orange-600">${sampleTaxData.employerTaxes.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold text-xl">
                <span>Total Tax Liability</span>
                <span className="text-purple-600">${sampleTaxData.totalTaxLiability.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function PayrollReportsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Payroll Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive payroll analysis and reporting</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FiRefreshCw className="mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Export Reports
          </Button>
          <Button variant="outline">
            <FiPrinter className="mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <FiMail className="mr-2" />
            Email Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employee Reports</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="taxes">Tax Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PayrollOverview />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeeReports />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentAnalysis />
        </TabsContent>

        <TabsContent value="taxes">
          <TaxReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
