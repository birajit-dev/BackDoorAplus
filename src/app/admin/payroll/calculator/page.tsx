'use client';
import { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiCalendar, FiClock, FiTrendingUp, FiFileText,
  FiSave, FiDownload, FiCheck, FiAlertCircle, FiEdit, FiPlus,
  FiUsers, FiPercent
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PayrollCalculation {
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  payType: 'hourly' | 'salary' | 'commission';
  
  // Hours and Rate
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  hourlyRate: number;
  overtimeRate: number;
  doubleTimeRate: number;
  
  // Salary Information
  annualSalary: number;
  payPeriodsPerYear: number;
  
  // Commission
  commissionRate: number;
  salesAmount: number;
  commissionAmount: number;
  
  // Bonuses and Additional Pay
  bonuses: number;
  reimbursements: number;
  allowances: number;
  
  // Gross Pay Calculation
  regularPay: number;
  overtimePay: number;
  doubleTimePay: number;
  salaryPay: number;
  totalGrossPay: number;
  
  // Deductions
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  stateDisability: number;
  unemploymentTax: number;
  
  // Benefits Deductions
  healthInsurance: number;
  dentalInsurance: number;
  visionInsurance: number;
  lifeInsurance: number;
  retirement401k: number;
  retirement401kMatch: number;
  
  // Other Deductions
  unionDues: number;
  garnishments: number;
  loanDeductions: number;
  otherDeductions: number;
  
  // Net Pay
  totalDeductions: number;
  netPay: number;
  
  // Tax Information
  ytdGrossPay: number;
  ytdFederalTax: number;
  ytdStateTax: number;
  ytdSocialSecurity: number;
  ytdMedicare: number;
  ytdNetPay: number;
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface TaxRates {
  federal: {
    single: TaxBracket[];
    marriedJoint: TaxBracket[];
    marriedSeparate: TaxBracket[];
    headOfHousehold: TaxBracket[];
  };
  state: {
    [state: string]: TaxBracket[];
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
    federal: { rate: number; cap: number; };
    state: { [state: string]: { rate: number; cap: number; } };
  };
  disability: {
    [state: string]: { rate: number; cap: number; };
  };
}

const currentTaxRates: TaxRates = {
  federal: {
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182050, rate: 0.24 },
      { min: 182051, max: 231250, rate: 0.32 },
      { min: 231251, max: 578125, rate: 0.35 },
      { min: 578126, max: Infinity, rate: 0.37 }
    ],
    marriedJoint: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22001, max: 89450, rate: 0.12 },
      { min: 89451, max: 190750, rate: 0.22 },
      { min: 190751, max: 364200, rate: 0.24 },
      { min: 364201, max: 462500, rate: 0.32 },
      { min: 462501, max: 693750, rate: 0.35 },
      { min: 693751, max: Infinity, rate: 0.37 }
    ],
    marriedSeparate: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182100, rate: 0.24 },
      { min: 182101, max: 231250, rate: 0.32 },
      { min: 231251, max: 346875, rate: 0.35 },
      { min: 346876, max: Infinity, rate: 0.37 }
    ],
    headOfHousehold: [
      { min: 0, max: 15700, rate: 0.10 },
      { min: 15701, max: 59850, rate: 0.12 },
      { min: 59851, max: 95350, rate: 0.22 },
      { min: 95351, max: 182050, rate: 0.24 },
      { min: 182051, max: 231250, rate: 0.32 },
      { min: 231251, max: 578100, rate: 0.35 },
      { min: 578101, max: Infinity, rate: 0.37 }
    ]
  },
  state: {
    NY: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8501, max: 11700, rate: 0.045 },
      { min: 11701, max: 13900, rate: 0.0525 },
      { min: 13901, max: 80650, rate: 0.059 },
      { min: 80651, max: 215400, rate: 0.0645 },
      { min: 215401, max: 1077550, rate: 0.0685 },
      { min: 1077551, max: Infinity, rate: 0.0882 }
    ],
    CA: [
      { min: 0, max: 10099, rate: 0.01 },
      { min: 10100, max: 23942, rate: 0.02 },
      { min: 23943, max: 37788, rate: 0.04 },
      { min: 37789, max: 52455, rate: 0.06 },
      { min: 52456, max: 66295, rate: 0.08 },
      { min: 66296, max: 338639, rate: 0.093 },
      { min: 338640, max: 406364, rate: 0.103 },
      { min: 406365, max: 677278, rate: 0.113 },
      { min: 677279, max: Infinity, rate: 0.123 }
    ]
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
    federal: { rate: 0.006, cap: 7000 },
    state: {
      NY: { rate: 0.025, cap: 12300 },
      CA: { rate: 0.034, cap: 7000 }
    }
  },
  disability: {
    NY: { rate: 0.005, cap: 142800 },
    CA: { rate: 0.009, cap: 153164 }
  }
};

const PayrollCalculatorForm = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    payType: 'hourly',
    payPeriod: 'bi-weekly',
    
    // Hourly Information
    regularHours: '',
    overtimeHours: '',
    doubleTimeHours: '',
    hourlyRate: '',
    
    // Salary Information
    annualSalary: '',
    
    // Commission
    commissionRate: '',
    salesAmount: '',
    
    // Additional Pay
    bonuses: '',
    reimbursements: '',
    allowancesAmount: '',
    
    // Employee Information
    filingStatus: 'single',
    taxAllowances: '0',
    additionalWithholding: '',
    state: 'NY',
    
    // Benefits
    healthInsurance: '',
    dentalInsurance: '',
    visionInsurance: '',
    lifeInsurance: '',
    retirement401k: '',
    retirement401kMatch: '',
    
    // Other Deductions
    unionDues: '',
    garnishments: '',
    loanDeductions: '',
    otherDeductions: ''
  });

  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateTax = (income: number, brackets: TaxBracket[]) => {
    let tax = 0;
    for (const bracket of brackets) {
      if (income > bracket.min) {
        const taxableIncome = Math.min(income, bracket.max) - bracket.min + 1;
        tax += taxableIncome * bracket.rate;
      }
    }
    return tax;
  };

  const calculatePayroll = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const payType = formData.payType as 'hourly' | 'salary' | 'commission';
      const regularHours = parseFloat(formData.regularHours) || 0;
      const overtimeHours = parseFloat(formData.overtimeHours) || 0;
      const doubleTimeHours = parseFloat(formData.doubleTimeHours) || 0;
      const hourlyRate = parseFloat(formData.hourlyRate) || 0;
      const annualSalary = parseFloat(formData.annualSalary) || 0;
      
      // Calculate gross pay based on pay type
      let regularPay = 0;
      let overtimePay = 0;
      let doubleTimePay = 0;
      let salaryPay = 0;
      
      if (payType === 'hourly') {
        regularPay = regularHours * hourlyRate;
        overtimePay = overtimeHours * (hourlyRate * 1.5);
        doubleTimePay = doubleTimeHours * (hourlyRate * 2);
      } else if (payType === 'salary') {
        const payPeriodsPerYear = formData.payPeriod === 'weekly' ? 52 : 
                                 formData.payPeriod === 'bi-weekly' ? 26 : 
                                 formData.payPeriod === 'semi-monthly' ? 24 : 12;
        salaryPay = annualSalary / payPeriodsPerYear;
      }
      
      const bonuses = parseFloat(formData.bonuses) || 0;
      const reimbursements = parseFloat(formData.reimbursements) || 0;
      const allowances = parseFloat(formData.allowancesAmount) || 0;
      const commissionAmount = (parseFloat(formData.salesAmount) || 0) * ((parseFloat(formData.commissionRate) || 0) / 100);
      
      const totalGrossPay = regularPay + overtimePay + doubleTimePay + salaryPay + bonuses + reimbursements + allowances + commissionAmount;
      
      // Calculate taxes
      const federalBrackets = currentTaxRates.federal[formData.filingStatus as keyof typeof currentTaxRates.federal];
      const stateBrackets = currentTaxRates.state[formData.state] || [];
      
      const annualizedIncome = totalGrossPay * (formData.payPeriod === 'weekly' ? 52 : 
                                               formData.payPeriod === 'bi-weekly' ? 26 : 
                                               formData.payPeriod === 'semi-monthly' ? 24 : 12);
      
      const federalTax = calculateTax(annualizedIncome, federalBrackets) / (formData.payPeriod === 'weekly' ? 52 : 
                                                                          formData.payPeriod === 'bi-weekly' ? 26 : 
                                                                          formData.payPeriod === 'semi-monthly' ? 24 : 12);
      const stateTax = calculateTax(annualizedIncome, stateBrackets) / (formData.payPeriod === 'weekly' ? 52 : 
                                                                       formData.payPeriod === 'bi-weekly' ? 26 : 
                                                                       formData.payPeriod === 'semi-monthly' ? 24 : 12);
      
      const socialSecurity = Math.min(totalGrossPay * currentTaxRates.socialSecurity.rate, 
                                     currentTaxRates.socialSecurity.cap * currentTaxRates.socialSecurity.rate / 26);
      
      const medicare = totalGrossPay * currentTaxRates.medicare.rate;
      const additionalMedicare = annualizedIncome > currentTaxRates.medicare.additionalThreshold ? 
                                totalGrossPay * currentTaxRates.medicare.additionalRate : 0;
      
      const stateDisability = formData.state in currentTaxRates.disability ? 
                             Math.min(totalGrossPay * currentTaxRates.disability[formData.state].rate,
                                    currentTaxRates.disability[formData.state].cap * currentTaxRates.disability[formData.state].rate / 26) : 0;
      
      // Benefits deductions
      const healthInsurance = parseFloat(formData.healthInsurance) || 0;
      const dentalInsurance = parseFloat(formData.dentalInsurance) || 0;
      const visionInsurance = parseFloat(formData.visionInsurance) || 0;
      const lifeInsurance = parseFloat(formData.lifeInsurance) || 0;
      const retirement401k = totalGrossPay * ((parseFloat(formData.retirement401k) || 0) / 100);
      const retirement401kMatch = Math.min(retirement401k, totalGrossPay * 0.06); // Max 6% match
      
      // Other deductions
      const unionDues = parseFloat(formData.unionDues) || 0;
      const garnishments = parseFloat(formData.garnishments) || 0;
      const loanDeductions = parseFloat(formData.loanDeductions) || 0;
      const otherDeductions = parseFloat(formData.otherDeductions) || 0;
      const additionalWithholding = parseFloat(formData.additionalWithholding) || 0;
      
      const totalDeductions = federalTax + stateTax + socialSecurity + medicare + additionalMedicare + 
                             stateDisability + healthInsurance + dentalInsurance + visionInsurance + 
                             lifeInsurance + retirement401k + unionDues + garnishments + loanDeductions + 
                             otherDeductions + additionalWithholding;
      
      const netPay = totalGrossPay - totalDeductions;
      
      const calculationResult: PayrollCalculation = {
        employeeId: formData.employeeId,
        employeeName: 'Selected Employee',
        payPeriod: formData.payPeriod,
        payType: payType,
        
        regularHours,
        overtimeHours,
        doubleTimeHours,
        hourlyRate,
        overtimeRate: hourlyRate * 1.5,
        doubleTimeRate: hourlyRate * 2,
        
        annualSalary,
        payPeriodsPerYear: formData.payPeriod === 'weekly' ? 52 : 
                          formData.payPeriod === 'bi-weekly' ? 26 : 
                          formData.payPeriod === 'semi-monthly' ? 24 : 12,
        
        commissionRate: parseFloat(formData.commissionRate) || 0,
        salesAmount: parseFloat(formData.salesAmount) || 0,
        commissionAmount,
        
        bonuses,
        reimbursements,
        allowances,
        
        regularPay,
        overtimePay,
        doubleTimePay,
        salaryPay,
        totalGrossPay,
        
        federalTax,
        stateTax,
        socialSecurity,
        medicare: medicare + additionalMedicare,
        stateDisability,
        unemploymentTax: 0, // Employer paid
        
        healthInsurance,
        dentalInsurance,
        visionInsurance,
        lifeInsurance,
        retirement401k,
        retirement401kMatch,
        
        unionDues,
        garnishments,
        loanDeductions,
        otherDeductions: otherDeductions + additionalWithholding,
        
        totalDeductions,
        netPay,
        
        // Mock YTD data
        ytdGrossPay: totalGrossPay * 10,
        ytdFederalTax: federalTax * 10,
        ytdStateTax: stateTax * 10,
        ytdSocialSecurity: socialSecurity * 10,
        ytdMedicare: (medicare + additionalMedicare) * 10,
        ytdNetPay: netPay * 10
      };
      
      setCalculation(calculationResult);
      setIsCalculating(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FiDollarSign className="mr-2" />
            Payroll Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="hours">Hours & Pay</TabsTrigger>
              <TabsTrigger value="deductions">Deductions & Benefits</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">Employee</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => handleInputChange('employeeId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson (EMP001)</SelectItem>
                      <SelectItem value="2">Michael Chen (EMP002)</SelectItem>
                      <SelectItem value="3">Emily Rodriguez (EMP003)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="payType">Pay Type</Label>
                  <Select value={formData.payType} onValueChange={(value) => handleInputChange('payType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="payPeriod">Pay Period</Label>
                  <Select value={formData.payPeriod} onValueChange={(value) => handleInputChange('payPeriod', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                      <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select value={formData.filingStatus} onValueChange={(value) => handleInputChange('filingStatus', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="marriedJoint">Married Filing Jointly</SelectItem>
                      <SelectItem value="marriedSeparate">Married Filing Separately</SelectItem>
                      <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="taxAllowances">Tax Allowances</Label>
                  <Input
                    id="taxAllowances"
                    type="number"
                    value={formData.taxAllowances}
                    onChange={(e) => handleInputChange('taxAllowances', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="space-y-4">
              {formData.payType === 'hourly' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="regularHours">Regular Hours</Label>
                    <Input
                      id="regularHours"
                      type="number"
                      step="0.25"
                      value={formData.regularHours}
                      onChange={(e) => handleInputChange('regularHours', e.target.value)}
                      placeholder="40"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      placeholder="25.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="overtimeHours">Overtime Hours (1.5x)</Label>
                    <Input
                      id="overtimeHours"
                      type="number"
                      step="0.25"
                      value={formData.overtimeHours}
                      onChange={(e) => handleInputChange('overtimeHours', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="doubleTimeHours">Double Time Hours (2x)</Label>
                    <Input
                      id="doubleTimeHours"
                      type="number"
                      step="0.25"
                      value={formData.doubleTimeHours}
                      onChange={(e) => handleInputChange('doubleTimeHours', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {formData.payType === 'salary' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualSalary">Annual Salary ($)</Label>
                    <Input
                      id="annualSalary"
                      type="number"
                      value={formData.annualSalary}
                      onChange={(e) => handleInputChange('annualSalary', e.target.value)}
                      placeholder="75000"
                    />
                  </div>
                </div>
              )}

              {formData.payType === 'commission' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.01"
                      value={formData.commissionRate}
                      onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                      placeholder="3.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="salesAmount">Sales Amount ($)</Label>
                    <Input
                      id="salesAmount"
                      type="number"
                      value={formData.salesAmount}
                      onChange={(e) => handleInputChange('salesAmount', e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                </div>
              )}

              <Separator />

              <h3 className="text-lg font-semibold">Additional Pay</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bonuses">Bonuses ($)</Label>
                  <Input
                    id="bonuses"
                    type="number"
                    step="0.01"
                    value={formData.bonuses}
                    onChange={(e) => handleInputChange('bonuses', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reimbursements">Reimbursements ($)</Label>
                  <Input
                    id="reimbursements"
                    type="number"
                    step="0.01"
                    value={formData.reimbursements}
                    onChange={(e) => handleInputChange('reimbursements', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="allowancesAmount">Allowances ($)</Label>
                  <Input
                    id="allowancesAmount"
                    type="number"
                    step="0.01"
                    value={formData.allowancesAmount}
                    onChange={(e) => handleInputChange('allowancesAmount', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-4">
              <h3 className="text-lg font-semibold">Benefits Deductions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="healthInsurance">Health Insurance ($)</Label>
                  <Input
                    id="healthInsurance"
                    type="number"
                    step="0.01"
                    value={formData.healthInsurance}
                    onChange={(e) => handleInputChange('healthInsurance', e.target.value)}
                    placeholder="125.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dentalInsurance">Dental Insurance ($)</Label>
                  <Input
                    id="dentalInsurance"
                    type="number"
                    step="0.01"
                    value={formData.dentalInsurance}
                    onChange={(e) => handleInputChange('dentalInsurance', e.target.value)}
                    placeholder="25.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="visionInsurance">Vision Insurance ($)</Label>
                  <Input
                    id="visionInsurance"
                    type="number"
                    step="0.01"
                    value={formData.visionInsurance}
                    onChange={(e) => handleInputChange('visionInsurance', e.target.value)}
                    placeholder="10.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lifeInsurance">Life Insurance ($)</Label>
                  <Input
                    id="lifeInsurance"
                    type="number"
                    step="0.01"
                    value={formData.lifeInsurance}
                    onChange={(e) => handleInputChange('lifeInsurance', e.target.value)}
                    placeholder="15.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="retirement401k">401k Contribution (%)</Label>
                  <Input
                    id="retirement401k"
                    type="number"
                    step="0.1"
                    value={formData.retirement401k}
                    onChange={(e) => handleInputChange('retirement401k', e.target.value)}
                    placeholder="5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="retirement401kMatch">401k Match (%)</Label>
                  <Input
                    id="retirement401kMatch"
                    type="number"
                    step="0.1"
                    value={formData.retirement401kMatch}
                    onChange={(e) => handleInputChange('retirement401kMatch', e.target.value)}
                    placeholder="3"
                    disabled
                  />
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-semibold">Other Deductions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unionDues">Union Dues ($)</Label>
                  <Input
                    id="unionDues"
                    type="number"
                    step="0.01"
                    value={formData.unionDues}
                    onChange={(e) => handleInputChange('unionDues', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="garnishments">Garnishments ($)</Label>
                  <Input
                    id="garnishments"
                    type="number"
                    step="0.01"
                    value={formData.garnishments}
                    onChange={(e) => handleInputChange('garnishments', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="loanDeductions">Loan Deductions ($)</Label>
                  <Input
                    id="loanDeductions"
                    type="number"
                    step="0.01"
                    value={formData.loanDeductions}
                    onChange={(e) => handleInputChange('loanDeductions', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="additionalWithholding">Additional Withholding ($)</Label>
                  <Input
                    id="additionalWithholding"
                    type="number"
                    step="0.01"
                    value={formData.additionalWithholding}
                    onChange={(e) => handleInputChange('additionalWithholding', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {calculation ? (
                <PayrollResults calculation={calculation} />
              ) : (
                <div className="text-center py-8">
                  <FiDollarSign className="mx-auto text-4xl text-slate-300 mb-4" />
                  <p className="text-slate-500">Click "Calculate Payroll" to see results</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              onClick={calculatePayroll}
              disabled={isCalculating}
              className="min-w-[150px]"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <FiDollarSign className="mr-2" />
                  Calculate Payroll
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PayrollResults = ({ calculation }: { calculation: PayrollCalculation }) => {
  return (
    <div className="space-y-6">
      {/* Gross Pay Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Gross Pay Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {calculation.payType === 'hourly' && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${calculation.regularPay.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600">Regular Pay</div>
                  <div className="text-xs text-slate-500">
                    {calculation.regularHours}h × ${calculation.hourlyRate}
                  </div>
                </div>
                
                {calculation.overtimePay > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${calculation.overtimePay.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600">Overtime Pay</div>
                    <div className="text-xs text-slate-500">
                      {calculation.overtimeHours}h × ${calculation.overtimeRate.toFixed(2)}
                    </div>
                  </div>
                )}
                
                {calculation.doubleTimePay > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      ${calculation.doubleTimePay.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600">Double Time</div>
                    <div className="text-xs text-slate-500">
                      {calculation.doubleTimeHours}h × ${calculation.doubleTimeRate.toFixed(2)}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {calculation.payType === 'salary' && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${calculation.salaryPay.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">Salary Pay</div>
                <div className="text-xs text-slate-500">
                  ${calculation.annualSalary.toLocaleString()} / {calculation.payPeriodsPerYear}
                </div>
              </div>
            )}
            
            {calculation.commissionAmount > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${calculation.commissionAmount.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">Commission</div>
                <div className="text-xs text-slate-500">
                  {calculation.commissionRate}% of ${calculation.salesAmount.toLocaleString()}
                </div>
              </div>
            )}
            
            {(calculation.bonuses + calculation.reimbursements + calculation.allowances) > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(calculation.bonuses + calculation.reimbursements + calculation.allowances).toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">Additional Pay</div>
                <div className="text-xs text-slate-500">Bonuses + Reimbursements</div>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              ${calculation.totalGrossPay.toFixed(2)}
            </div>
            <div className="text-lg text-slate-600">Total Gross Pay</div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Tax Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Federal Income Tax:</span>
                <span className="font-semibold">${calculation.federalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>State Income Tax:</span>
                <span className="font-semibold">${calculation.stateTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Social Security (6.2%):</span>
                <span className="font-semibold">${calculation.socialSecurity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Medicare (1.45%):</span>
                <span className="font-semibold">${calculation.medicare.toFixed(2)}</span>
              </div>
              {calculation.stateDisability > 0 && (
                <div className="flex justify-between">
                  <span>State Disability:</span>
                  <span className="font-semibold">${calculation.stateDisability.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-red-600">
                <span>Total Tax Deductions:</span>
                <span>${(calculation.federalTax + calculation.stateTax + calculation.socialSecurity + calculation.medicare + calculation.stateDisability).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Benefit Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calculation.healthInsurance > 0 && (
                <div className="flex justify-between">
                  <span>Health Insurance:</span>
                  <span className="font-semibold">${calculation.healthInsurance.toFixed(2)}</span>
                </div>
              )}
              {calculation.dentalInsurance > 0 && (
                <div className="flex justify-between">
                  <span>Dental Insurance:</span>
                  <span className="font-semibold">${calculation.dentalInsurance.toFixed(2)}</span>
                </div>
              )}
              {calculation.visionInsurance > 0 && (
                <div className="flex justify-between">
                  <span>Vision Insurance:</span>
                  <span className="font-semibold">${calculation.visionInsurance.toFixed(2)}</span>
                </div>
              )}
              {calculation.lifeInsurance > 0 && (
                <div className="flex justify-between">
                  <span>Life Insurance:</span>
                  <span className="font-semibold">${calculation.lifeInsurance.toFixed(2)}</span>
                </div>
              )}
              {calculation.retirement401k > 0 && (
                <div className="flex justify-between">
                  <span>401k Contribution:</span>
                  <span className="font-semibold">${calculation.retirement401k.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-blue-600">
                <span>Total Benefit Deductions:</span>
                <span>${(calculation.healthInsurance + calculation.dentalInsurance + calculation.visionInsurance + calculation.lifeInsurance + calculation.retirement401k).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Net Pay */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Net Pay Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">
                ${calculation.totalGrossPay.toFixed(2)}
              </div>
              <div className="text-slate-600">Gross Pay</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-red-600">
                -${calculation.totalDeductions.toFixed(2)}
              </div>
              <div className="text-slate-600">Total Deductions</div>
            </div>
            
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <div className="text-4xl font-bold text-green-700">
                ${calculation.netPay.toFixed(2)}
              </div>
              <div className="text-green-600 font-semibold">NET PAY</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Year-to-Date Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Year-to-Date Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-blue-600">
                ${calculation.ytdGrossPay.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">YTD Gross</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-red-600">
                ${calculation.ytdFederalTax.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">YTD Federal Tax</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-red-600">
                ${calculation.ytdStateTax.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">YTD State Tax</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-red-600">
                ${(calculation.ytdSocialSecurity + calculation.ytdMedicare).toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">YTD FICA</div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-green-600">
                ${calculation.ytdNetPay.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">YTD Net Pay</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button>
          <FiSave className="mr-2" />
          Save Payroll
        </Button>
        <Button variant="outline">
          <FiDownload className="mr-2" />
          Generate Pay Stub
        </Button>
        <Button variant="outline">
          <FiFileText className="mr-2" />
          Print Summary
        </Button>
      </div>
    </div>
  );
};

export default function PayrollCalculatorPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Advanced Payroll Calculator</h1>
          <p className="text-slate-600">Calculate comprehensive payroll with taxes, benefits, and deductions</p>
        </div>
      </div>

      <PayrollCalculatorForm />
    </div>
  );
}
