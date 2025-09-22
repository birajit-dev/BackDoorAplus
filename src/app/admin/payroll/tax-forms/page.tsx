'use client';
import { useState, useEffect } from 'react';
import { 
  FiFileText, FiDownload, FiPrinter, FiMail, FiCalendar, FiCheck,
  FiAlertCircle, FiClock, FiUsers, FiDollarSign, FiTrendingUp,
  FiEdit, FiEye, FiSend, FiRefreshCw, FiUpload, FiSearch
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

interface TaxForm {
  id: string;
  formType: 'W2' | 'W4' | '1099' | '941' | '940' | 'I9' | 'W9' | 'State';
  formName: string;
  description: string;
  employeeId?: string;
  employeeName?: string;
  taxYear: number;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  dueDate: string;
  status: 'draft' | 'completed' | 'filed' | 'overdue';
  filedDate?: string;
  amount?: number;
  createdAt: string;
  lastModified: string;
  data: any;
}

interface TaxDeadline {
  id: string;
  formType: string;
  description: string;
  dueDate: string;
  frequency: 'annual' | 'quarterly' | 'monthly';
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  daysUntilDue: number;
}

interface W2Data {
  employeeInfo: {
    name: string;
    ssn: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  employerInfo: {
    name: string;
    ein: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  wages: {
    wages: number;
    federalWithholding: number;
    socialSecurityWages: number;
    socialSecurityWithholding: number;
    medicareWages: number;
    medicareWithholding: number;
    socialSecurityTips: number;
    allocatedTips: number;
    dependentCareBenefits: number;
    nonqualifiedPlans: number;
    codes: string[];
    stateWages: number;
    stateWithholding: number;
    localWages: number;
    localWithholding: number;
  };
}

interface Form941Data {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  employerInfo: {
    name: string;
    ein: string;
    address: string;
  };
  wages: {
    totalWages: number;
    totalTaxableWages: number;
    federalIncomeTax: number;
    totalTaxBeforeAdjustments: number;
    totalTaxAfterAdjustments: number;
    totalDeposits: number;
    balanceDue: number;
    overpayment: number;
  };
  employees: {
    numberOfEmployees: number;
    totalWagesSubjectToSocialSecurity: number;
    totalWagesSubjectToMedicare: number;
    socialSecurityTax: number;
    medicareTax: number;
    additionalMedicareTax: number;
  };
}

const sampleTaxForms: TaxForm[] = [
  {
    id: '1',
    formType: 'W2',
    formName: 'Form W-2 - Sarah Johnson',
    description: 'Wage and Tax Statement for 2023',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    taxYear: 2023,
    dueDate: '2024-01-31',
    status: 'completed',
    filedDate: '2024-01-25',
    createdAt: '2024-01-15T10:00:00Z',
    lastModified: '2024-01-25T14:30:00Z',
    data: {
      wages: 75000,
      federalWithholding: 12500,
      socialSecurityWages: 75000,
      socialSecurityWithholding: 4650,
      medicareWages: 75000,
      medicareWithholding: 1087.50
    }
  },
  {
    id: '2',
    formType: '941',
    formName: 'Form 941 - Q4 2023',
    description: 'Employer\'s Quarterly Federal Tax Return',
    taxYear: 2023,
    quarter: 'Q4',
    dueDate: '2024-01-31',
    status: 'filed',
    filedDate: '2024-01-30',
    amount: 25000,
    createdAt: '2024-01-10T09:00:00Z',
    lastModified: '2024-01-30T16:00:00Z',
    data: {
      totalWages: 195000,
      federalIncomeTax: 32500,
      socialSecurityTax: 12090,
      medicareTax: 2827.50,
      totalTax: 47417.50
    }
  },
  {
    id: '3',
    formType: '1099',
    formName: 'Form 1099-NEC - John Contractor',
    description: 'Nonemployee Compensation',
    taxYear: 2023,
    dueDate: '2024-01-31',
    status: 'draft',
    amount: 15000,
    createdAt: '2024-01-20T11:00:00Z',
    lastModified: '2024-01-22T10:15:00Z',
    data: {
      payerInfo: {
        name: 'Apluslocators LLC',
        tin: '12-3456789'
      },
      payeeInfo: {
        name: 'John Contractor',
        tin: '987-65-4321'
      },
      nonemployeeCompensation: 15000
    }
  },
  {
    id: '4',
    formType: '941',
    formName: 'Form 941 - Q1 2024',
    description: 'Employer\'s Quarterly Federal Tax Return',
    taxYear: 2024,
    quarter: 'Q1',
    dueDate: '2024-04-30',
    status: 'draft',
    amount: 28000,
    createdAt: '2024-01-25T12:00:00Z',
    lastModified: '2024-01-25T12:00:00Z',
    data: {
      totalWages: 210000,
      federalIncomeTax: 35000,
      socialSecurityTax: 13020,
      medicareTax: 3045,
      totalTax: 51065
    }
  }
];

const taxDeadlines: TaxDeadline[] = [
  {
    id: '1',
    formType: 'Form 941',
    description: 'Q1 2024 Quarterly Federal Tax Return',
    dueDate: '2024-04-30',
    frequency: 'quarterly',
    status: 'due_soon',
    daysUntilDue: 15
  },
  {
    id: '2',
    formType: 'Form W-2',
    description: '2024 Employee W-2 Forms',
    dueDate: '2025-01-31',
    frequency: 'annual',
    status: 'upcoming',
    daysUntilDue: 365
  },
  {
    id: '3',
    formType: 'State Tax Return',
    description: 'New York State Quarterly Return',
    dueDate: '2024-04-30',
    frequency: 'quarterly',
    status: 'due_soon',
    daysUntilDue: 15
  },
  {
    id: '4',
    formType: 'Form 940',
    description: 'Federal Unemployment Tax Return',
    dueDate: '2025-01-31',
    frequency: 'annual',
    status: 'upcoming',
    daysUntilDue: 365
  }
];

const TaxFormsGrid = () => {
  const [forms, setForms] = useState<TaxForm[]>(sampleTaxForms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (form.employeeName && form.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    const matchesType = filterType === 'all' || form.formType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: TaxForm['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'filed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormIcon = (formType: string) => {
    switch (formType) {
      case 'W2': return <FiUsers className="text-blue-600" />;
      case '941': return <FiDollarSign className="text-green-600" />;
      case '1099': return <FiFileText className="text-purple-600" />;
      case 'W4': return <FiEdit className="text-orange-600" />;
      default: return <FiFileText className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-slate-400" />
                <Input 
                  placeholder="Search forms..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Form Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="W2">W-2 Forms</SelectItem>
                <SelectItem value="941">Form 941</SelectItem>
                <SelectItem value="1099">1099 Forms</SelectItem>
                <SelectItem value="W4">W-4 Forms</SelectItem>
                <SelectItem value="State">State Forms</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="filed">Filed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tax Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-slate-100">
                    {getFormIcon(form.formType)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{form.formName}</h3>
                    <p className="text-sm text-slate-600">{form.description}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(form.status)}>
                  {form.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Tax Year:</span>
                    <div className="font-semibold">{form.taxYear}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Due Date:</span>
                    <div className="font-semibold">{new Date(form.dueDate).toLocaleDateString()}</div>
                  </div>
                  {form.quarter && (
                    <div>
                      <span className="text-slate-500">Quarter:</span>
                      <div className="font-semibold">{form.quarter}</div>
                    </div>
                  )}
                  {form.amount && (
                    <div>
                      <span className="text-slate-500">Amount:</span>
                      <div className="font-semibold">${form.amount.toLocaleString()}</div>
                    </div>
                  )}
                </div>

                {form.employeeName && (
                  <div className="text-sm">
                    <span className="text-slate-500">Employee:</span>
                    <div className="font-semibold">{form.employeeName}</div>
                  </div>
                )}

                {form.filedDate && (
                  <div className="text-sm text-green-600">
                    <FiCheck className="inline mr-1" />
                    Filed on {new Date(form.filedDate).toLocaleDateString()}
                  </div>
                )}

                <Separator />

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <FiEye className="mr-2 text-xs" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <FiEdit className="mr-2 text-xs" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <FiDownload className="mr-2 text-xs" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FiFileText className="mx-auto text-6xl text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Tax Forms Found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search criteria or create a new form.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const TaxDeadlines = () => {
  const getDeadlineStatus = (status: TaxDeadline['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'due_soon': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineIcon = (status: TaxDeadline['status']) => {
    switch (status) {
      case 'upcoming': return <FiCalendar className="text-blue-600" />;
      case 'due_soon': return <FiAlertCircle className="text-yellow-600" />;
      case 'overdue': return <FiAlertCircle className="text-red-600" />;
      case 'completed': return <FiCheck className="text-green-600" />;
      default: return <FiClock className="text-slate-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FiCalendar className="mr-2" />
          Tax Deadlines & Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {taxDeadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-slate-100">
                  {getDeadlineIcon(deadline.status)}
                </div>
                <div>
                  <h4 className="font-semibold">{deadline.formType}</h4>
                  <p className="text-sm text-slate-600">{deadline.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                    <span>Due: {new Date(deadline.dueDate).toLocaleDateString()}</span>
                    <span>Frequency: {deadline.frequency}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className={getDeadlineStatus(deadline.status)}>
                  {deadline.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="text-sm text-slate-600 mt-1">
                  {deadline.daysUntilDue > 0 ? `${deadline.daysUntilDue} days` : 'Overdue'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const FormTemplates = () => {
  const formTemplates = [
    {
      id: 'w2',
      name: 'Form W-2',
      description: 'Wage and Tax Statement',
      icon: <FiUsers className="text-2xl" />,
      color: 'bg-blue-100 text-blue-800',
      href: '/admin/payroll/tax-forms/templates?form=w2'
    },
    {
      id: 'w4',
      name: 'Form W-4',
      description: 'Employee\'s Withholding Certificate',
      icon: <FiEdit className="text-2xl" />,
      color: 'bg-green-100 text-green-800',
      href: '/admin/payroll/tax-forms/templates?form=w4'
    },
    {
      id: '941',
      name: 'Form 941',
      description: 'Employer\'s Quarterly Federal Tax Return',
      icon: <FiDollarSign className="text-2xl" />,
      color: 'bg-purple-100 text-purple-800',
      href: '/admin/payroll/tax-forms/templates?form=941'
    },
    {
      id: '1099',
      name: 'Form 1099-NEC',
      description: 'Nonemployee Compensation',
      icon: <FiFileText className="text-2xl" />,
      color: 'bg-orange-100 text-orange-800',
      href: '/admin/payroll/tax-forms/templates?form=1099'
    },
    {
      id: '940',
      name: 'Form 940',
      description: 'Employer\'s Annual Federal Unemployment Tax Return',
      icon: <FiTrendingUp className="text-2xl" />,
      color: 'bg-red-100 text-red-800',
      href: '/admin/payroll/tax-forms/templates?form=940'
    },
    {
      id: 'i9',
      name: 'Form I-9',
      description: 'Employment Eligibility Verification',
      icon: <FiUsers className="text-2xl" />,
      color: 'bg-indigo-100 text-indigo-800',
      href: '/admin/payroll/tax-forms/templates?form=i9'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Tax Form</CardTitle>
        <p className="text-sm text-slate-600">Select a form template to get started</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formTemplates.map((template) => (
            <a key={template.id} href={template.href}>
              <Button
                variant="outline"
                className="h-24 w-full flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow"
              >
                <div className={`p-2 rounded-full ${template.color}`}>
                  {template.icon}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{template.name}</div>
                  <div className="text-xs text-slate-500">{template.description}</div>
                </div>
              </Button>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TaxComplianceOverview = () => {
  const complianceData = {
    currentQuarter: 'Q1 2024',
    totalEmployees: 8,
    formsCompleted: 12,
    formsPending: 3,
    estimatedTaxLiability: 47500,
    lastFilingDate: '2024-01-30'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Forms Completed</p>
              <p className="text-3xl font-bold text-green-600">{complianceData.formsCompleted}</p>
            </div>
            <FiCheck className="text-2xl text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Forms Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{complianceData.formsPending}</p>
            </div>
            <FiClock className="text-2xl text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tax Liability</p>
              <p className="text-3xl font-bold text-blue-600">${complianceData.estimatedTaxLiability.toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-2xl text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Employees</p>
              <p className="text-3xl font-bold text-purple-600">{complianceData.totalEmployees}</p>
            </div>
            <FiUsers className="text-2xl text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function TaxFormsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Tax Forms & Compliance</h1>
          <p className="text-slate-600">Manage tax forms, deadlines, and compliance requirements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FiUpload className="mr-2" />
            Import Data
          </Button>
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Bulk Export
          </Button>
          <Button variant="outline">
            <FiRefreshCw className="mr-2" />
            Sync IRS
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <TaxComplianceOverview />

      {/* Tax Deadline Alert */}
      <Alert className="mb-8 border-yellow-200 bg-yellow-50">
        <FiAlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Upcoming Deadline:</strong> Form 941 (Q1 2024) is due in 15 days on April 30, 2024.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Tax Forms</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="templates">Create Forms</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <TaxFormsGrid />
        </TabsContent>

        <TabsContent value="deadlines">
          <TaxDeadlines />
        </TabsContent>

        <TabsContent value="templates">
          <FormTemplates />
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Federal Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Quarterly 941 Filing</span>
                        <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Annual W-2 Distribution</span>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>940 FUTA Filing</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Due Jan 31</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">State Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>NY State Quarterly</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Unemployment Insurance</span>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Disability Insurance</span>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Trail & Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <h4 className="font-semibold">Q4 2023 Form 941</h4>
                      <p className="text-sm text-slate-600">Filed January 30, 2024</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FiEye className="mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <FiDownload className="mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <h4 className="font-semibold">2023 W-2 Forms</h4>
                      <p className="text-sm text-slate-600">Distributed January 25, 2024</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FiEye className="mr-2" />
                        View All
                      </Button>
                      <Button size="sm" variant="outline">
                        <FiMail className="mr-2" />
                        Resend
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
