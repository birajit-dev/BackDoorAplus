'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUsers, FiEdit, FiDollarSign, FiFileText, FiTrendingUp, FiCheck,
  FiArrowLeft, FiSave, FiDownload, FiPrinter, FiMail, FiAlertCircle
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// 2025 Tax Rates and Constants
const TAX_RATES_2025 = {
  socialSecurity: {
    rate: 0.062,
    cap: 176100 // 2025 cap
  },
  medicare: {
    rate: 0.0145,
    additionalRate: 0.009,
    additionalThreshold: 200000
  },
  federalUnemployment: {
    rate: 0.006,
    cap: 7000
  },
  federalIncomeTax: {
    single: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11601, max: 47150, rate: 0.12 },
      { min: 47151, max: 100525, rate: 0.22 },
      { min: 100526, max: 191675, rate: 0.24 },
      { min: 191676, max: 243725, rate: 0.32 },
      { min: 243726, max: 609350, rate: 0.35 },
      { min: 609351, max: Infinity, rate: 0.37 }
    ],
    marriedJoint: [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23201, max: 94300, rate: 0.12 },
      { min: 94301, max: 201050, rate: 0.22 },
      { min: 201051, max: 383350, rate: 0.24 },
      { min: 383351, max: 487450, rate: 0.32 },
      { min: 487451, max: 731200, rate: 0.35 },
      { min: 731201, max: Infinity, rate: 0.37 }
    ]
  },
  stateRates: {
    NY: {
      rate: 0.068,
      brackets: [
        { min: 0, max: 8500, rate: 0.04 },
        { min: 8501, max: 11700, rate: 0.045 },
        { min: 11701, max: 13900, rate: 0.0525 },
        { min: 13901, max: 80650, rate: 0.059 },
        { min: 80651, max: 215400, rate: 0.0645 },
        { min: 215401, max: 1077550, rate: 0.0685 },
        { min: 1077551, max: Infinity, rate: 0.0882 }
      ],
      disability: 0.005,
      unemployment: 0.025
    },
    CA: {
      rate: 0.08,
      brackets: [
        { min: 0, max: 10099, rate: 0.01 },
        { min: 10100, max: 23942, rate: 0.02 },
        { min: 23943, max: 37788, rate: 0.04 },
        { min: 37789, max: 52455, rate: 0.06 },
        { min: 52456, max: 66295, rate: 0.08 },
        { min: 66296, max: 338639, rate: 0.093 },
        { min: 338640, max: 406364, rate: 0.103 },
        { min: 406365, max: 677278, rate: 0.113 },
        { min: 677279, max: Infinity, rate: 0.123 }
      ],
      disability: 0.009,
      unemployment: 0.034
    }
  }
};

const FormW2Template = ({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    // Employee Information
    employeeName: '',
    employeeSSN: '',
    employeeAddress: '',
    employeeCity: '',
    employeeState: '',
    employeeZip: '',
    
    // Employer Information
    employerName: 'Apluslocators LLC',
    employerEIN: '12-3456789',
    employerAddress: '123 Business Ave',
    employerCity: 'New York',
    employerState: 'NY',
    employerZip: '10001',
    
    // Wage Information
    wages: '',
    federalWithholding: '',
    socialSecurityWages: '',
    socialSecurityWithholding: '',
    medicareWages: '',
    medicareWithholding: '',
    socialSecurityTips: '',
    allocatedTips: '',
    dependentCareBenefits: '',
    nonqualifiedPlans: '',
    
    // State Information
    stateWages: '',
    stateWithholding: '',
    localWages: '',
    localWithholding: '',
    
    // Other
    taxYear: '2024',
    controlNumber: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTaxes = () => {
    const wages = parseFloat(formData.wages) || 0;
    if (wages === 0) return;

    // Calculate Social Security
    const ssWages = Math.min(wages, TAX_RATES_2025.socialSecurity.cap);
    const ssWithholding = ssWages * TAX_RATES_2025.socialSecurity.rate;
    
    // Calculate Medicare
    const medicareWithholding = wages * TAX_RATES_2025.medicare.rate;
    
    // Update form with calculated values
    setFormData(prev => ({
      ...prev,
      socialSecurityWages: ssWages.toFixed(2),
      socialSecurityWithholding: ssWithholding.toFixed(2),
      medicareWages: wages.toFixed(2),
      medicareWithholding: medicareWithholding.toFixed(2)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      formType: 'W2',
      taxYear: parseInt(formData.taxYear),
      data: formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Form W-2 - Wage and Tax Statement</h2>
        <div className="text-sm text-slate-600">Tax Year: {formData.taxYear}</div>
      </div>

      <Alert>
        <FiAlertCircle className="h-4 w-4" />
        <AlertDescription>
          Form W-2 must be provided to employees by January 31, 2025, and filed with the SSA by February 28, 2025.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="employee" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employee">Employee Info</TabsTrigger>
          <TabsTrigger value="wages">Wages & Withholding</TabsTrigger>
          <TabsTrigger value="state">State & Local</TabsTrigger>
        </TabsList>

        <TabsContent value="employee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeName">Employee Name *</Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => handleInputChange('employeeName', e.target.value)}
                    placeholder="Last, First Middle"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employeeSSN">Social Security Number *</Label>
                  <Input
                    id="employeeSSN"
                    value={formData.employeeSSN}
                    onChange={(e) => handleInputChange('employeeSSN', e.target.value)}
                    placeholder="000-00-0000"
                    maxLength={11}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="employeeAddress">Address *</Label>
                <Input
                  id="employeeAddress"
                  value={formData.employeeAddress}
                  onChange={(e) => handleInputChange('employeeAddress', e.target.value)}
                  placeholder="Street address"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employeeCity">City *</Label>
                  <Input
                    id="employeeCity"
                    value={formData.employeeCity}
                    onChange={(e) => handleInputChange('employeeCity', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employeeState">State *</Label>
                  <Select value={formData.employeeState} onValueChange={(value) => handleInputChange('employeeState', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
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
                  <Label htmlFor="employeeZip">ZIP Code *</Label>
                  <Input
                    id="employeeZip"
                    value={formData.employeeZip}
                    onChange={(e) => handleInputChange('employeeZip', e.target.value)}
                    placeholder="00000"
                    maxLength={5}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Wages and Tax Withholding</CardTitle>
                <Button type="button" onClick={calculateTaxes} variant="outline" size="sm">
                  <FiDollarSign className="mr-2" />
                  Calculate Taxes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wages">Box 1 - Wages, tips, other compensation *</Label>
                  <Input
                    id="wages"
                    type="number"
                    step="0.01"
                    value={formData.wages}
                    onChange={(e) => handleInputChange('wages', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="federalWithholding">Box 2 - Federal income tax withheld</Label>
                  <Input
                    id="federalWithholding"
                    type="number"
                    step="0.01"
                    value={formData.federalWithholding}
                    onChange={(e) => handleInputChange('federalWithholding', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="socialSecurityWages">Box 3 - Social security wages</Label>
                  <Input
                    id="socialSecurityWages"
                    type="number"
                    step="0.01"
                    value={formData.socialSecurityWages}
                    onChange={(e) => handleInputChange('socialSecurityWages', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="socialSecurityWithholding">Box 4 - Social security tax withheld</Label>
                  <Input
                    id="socialSecurityWithholding"
                    type="number"
                    step="0.01"
                    value={formData.socialSecurityWithholding}
                    onChange={(e) => handleInputChange('socialSecurityWithholding', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="medicareWages">Box 5 - Medicare wages and tips</Label>
                  <Input
                    id="medicareWages"
                    type="number"
                    step="0.01"
                    value={formData.medicareWages}
                    onChange={(e) => handleInputChange('medicareWages', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="medicareWithholding">Box 6 - Medicare tax withheld</Label>
                  <Input
                    id="medicareWithholding"
                    type="number"
                    step="0.01"
                    value={formData.medicareWithholding}
                    onChange={(e) => handleInputChange('medicareWithholding', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="socialSecurityTips">Box 7 - Social security tips</Label>
                  <Input
                    id="socialSecurityTips"
                    type="number"
                    step="0.01"
                    value={formData.socialSecurityTips}
                    onChange={(e) => handleInputChange('socialSecurityTips', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="allocatedTips">Box 8 - Allocated tips</Label>
                  <Input
                    id="allocatedTips"
                    type="number"
                    step="0.01"
                    value={formData.allocatedTips}
                    onChange={(e) => handleInputChange('allocatedTips', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="dependentCareBenefits">Box 10 - Dependent care benefits</Label>
                  <Input
                    id="dependentCareBenefits"
                    type="number"
                    step="0.01"
                    value={formData.dependentCareBenefits}
                    onChange={(e) => handleInputChange('dependentCareBenefits', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="nonqualifiedPlans">Box 11 - Nonqualified plans</Label>
                  <Input
                    id="nonqualifiedPlans"
                    type="number"
                    step="0.01"
                    value={formData.nonqualifiedPlans}
                    onChange={(e) => handleInputChange('nonqualifiedPlans', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="state" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>State and Local Tax Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stateWages">Box 16 - State wages, tips, etc.</Label>
                  <Input
                    id="stateWages"
                    type="number"
                    step="0.01"
                    value={formData.stateWages}
                    onChange={(e) => handleInputChange('stateWages', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stateWithholding">Box 17 - State income tax</Label>
                  <Input
                    id="stateWithholding"
                    type="number"
                    step="0.01"
                    value={formData.stateWithholding}
                    onChange={(e) => handleInputChange('stateWithholding', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="localWages">Box 18 - Local wages, tips, etc.</Label>
                  <Input
                    id="localWages"
                    type="number"
                    step="0.01"
                    value={formData.localWages}
                    onChange={(e) => handleInputChange('localWages', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="localWithholding">Box 19 - Local income tax</Label>
                  <Input
                    id="localWithholding"
                    type="number"
                    step="0.01"
                    value={formData.localWithholding}
                    onChange={(e) => handleInputChange('localWithholding', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <FiSave className="mr-2" />
          Save W-2 Form
        </Button>
      </div>
    </form>
  );
};

const Form941Template = ({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    quarter: 'Q1',
    year: '2024',
    employerName: 'Apluslocators LLC',
    employerEIN: '12-3456789',
    employerAddress: '123 Business Ave, New York, NY 10001',
    
    // Line 1 - Number of employees
    numberOfEmployees: '',
    
    // Line 2 - Wages, tips, and other compensation
    totalWages: '',
    
    // Line 3 - Federal income tax withheld
    federalIncomeTax: '',
    
    // Line 5a - Taxable social security wages
    socialSecurityWages: '',
    
    // Line 5b - Taxable social security tips
    socialSecurityTips: '',
    
    // Line 5c - Taxable Medicare wages & tips
    medicareWages: '',
    
    // Line 5d - Taxable wages & tips subject to Additional Medicare Tax
    additionalMedicareWages: '',
    
    // Calculated fields
    socialSecurityTax: '',
    socialSecurityTipsTax: '',
    medicareTax: '',
    additionalMedicareTax: '',
    totalTaxes: '',
    
    // Deposits
    totalDeposits: '',
    balanceDue: '',
    overpayment: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTaxes = () => {
    const ssWages = parseFloat(formData.socialSecurityWages) || 0;
    const ssTips = parseFloat(formData.socialSecurityTips) || 0;
    const medicareWages = parseFloat(formData.medicareWages) || 0;
    const additionalMedicareWages = parseFloat(formData.additionalMedicareWages) || 0;
    
    // Calculate taxes
    const ssWagesTax = ssWages * TAX_RATES_2025.socialSecurity.rate * 2; // Employee + employer
    const ssTipsTax = ssTips * TAX_RATES_2025.socialSecurity.rate * 2;
    const medicareTax = medicareWages * TAX_RATES_2025.medicare.rate * 2; // Employee + employer
    const additionalMedicareTax = additionalMedicareWages * TAX_RATES_2025.medicare.additionalRate;
    
    const federalTax = parseFloat(formData.federalIncomeTax) || 0;
    const totalTaxes = federalTax + ssWagesTax + ssTipsTax + medicareTax + additionalMedicareTax;
    
    setFormData(prev => ({
      ...prev,
      socialSecurityTax: ssWagesTax.toFixed(2),
      socialSecurityTipsTax: ssTipsTax.toFixed(2),
      medicareTax: medicareTax.toFixed(2),
      additionalMedicareTax: additionalMedicareTax.toFixed(2),
      totalTaxes: totalTaxes.toFixed(2)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      formType: '941',
      quarter: formData.quarter,
      year: parseInt(formData.year),
      data: formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Form 941 - Employer's Quarterly Federal Tax Return</h2>
        <div className="text-sm text-slate-600">{formData.quarter} {formData.year}</div>
      </div>

      <Alert>
        <FiAlertCircle className="h-4 w-4" />
        <AlertDescription>
          Form 941 must be filed by the last day of the month following the end of the quarter.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quarter">Quarter</Label>
              <Select value={formData.quarter} onValueChange={(value) => handleInputChange('quarter', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
                  <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
                  <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
                  <SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Wages and Tax Information</CardTitle>
            <Button type="button" onClick={calculateTaxes} variant="outline" size="sm">
              <FiDollarSign className="mr-2" />
              Calculate Taxes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numberOfEmployees">Line 1 - Number of employees</Label>
              <Input
                id="numberOfEmployees"
                type="number"
                value={formData.numberOfEmployees}
                onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="totalWages">Line 2 - Total wages, tips, and other compensation</Label>
              <Input
                id="totalWages"
                type="number"
                step="0.01"
                value={formData.totalWages}
                onChange={(e) => handleInputChange('totalWages', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="federalIncomeTax">Line 3 - Federal income tax withheld</Label>
              <Input
                id="federalIncomeTax"
                type="number"
                step="0.01"
                value={formData.federalIncomeTax}
                onChange={(e) => handleInputChange('federalIncomeTax', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socialSecurityWages">Line 5a - Taxable social security wages</Label>
              <Input
                id="socialSecurityWages"
                type="number"
                step="0.01"
                value={formData.socialSecurityWages}
                onChange={(e) => handleInputChange('socialSecurityWages', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="socialSecurityTax">Line 5a - Social security tax (calculated)</Label>
              <Input
                id="socialSecurityTax"
                type="number"
                step="0.01"
                value={formData.socialSecurityTax}
                readOnly
                className="bg-slate-50"
              />
            </div>
            <div>
              <Label htmlFor="medicareWages">Line 5c - Taxable Medicare wages & tips</Label>
              <Input
                id="medicareWages"
                type="number"
                step="0.01"
                value={formData.medicareWages}
                onChange={(e) => handleInputChange('medicareWages', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="medicareTax">Line 5c - Medicare tax (calculated)</Label>
              <Input
                id="medicareTax"
                type="number"
                step="0.01"
                value={formData.medicareTax}
                readOnly
                className="bg-slate-50"
              />
            </div>
            <div>
              <Label htmlFor="additionalMedicareWages">Line 5d - Additional Medicare Tax wages</Label>
              <Input
                id="additionalMedicareWages"
                type="number"
                step="0.01"
                value={formData.additionalMedicareWages}
                onChange={(e) => handleInputChange('additionalMedicareWages', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="additionalMedicareTax">Line 5d - Additional Medicare tax (calculated)</Label>
              <Input
                id="additionalMedicareTax"
                type="number"
                step="0.01"
                value={formData.additionalMedicareTax}
                readOnly
                className="bg-slate-50"
              />
            </div>
          </div>

          <Separator />

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total taxes (Line 6):</span>
              <span className="text-2xl font-bold text-blue-600">
                ${formData.totalTaxes || '0.00'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalDeposits">Line 11 - Total deposits for this quarter</Label>
              <Input
                id="totalDeposits"
                type="number"
                step="0.01"
                value={formData.totalDeposits}
                onChange={(e) => handleInputChange('totalDeposits', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="balanceDue">Line 12 - Balance due</Label>
              <Input
                id="balanceDue"
                type="number"
                step="0.01"
                value={formData.balanceDue}
                onChange={(e) => handleInputChange('balanceDue', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <FiSave className="mr-2" />
          Save Form 941
        </Button>
      </div>
    </form>
  );
};

const Form1099Template = ({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    taxYear: '2024',
    
    // Payer Information
    payerName: 'Apluslocators LLC',
    payerTIN: '12-3456789',
    payerAddress: '123 Business Ave',
    payerCity: 'New York',
    payerState: 'NY',
    payerZip: '10001',
    payerPhone: '(555) 123-4567',
    
    // Recipient Information
    recipientName: '',
    recipientTIN: '',
    recipientAddress: '',
    recipientCity: '',
    recipientState: '',
    recipientZip: '',
    
    // Payment Information
    nonemployeeCompensation: '',
    federalIncomeTaxWithheld: '',
    
    // Other
    accountNumber: '',
    secondTINNotice: false,
    statePayerNumber: '',
    stateIncome: '',
    stateIncomeTaxWithheld: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      formType: '1099',
      taxYear: parseInt(formData.taxYear),
      data: formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Form 1099-NEC - Nonemployee Compensation</h2>
        <div className="text-sm text-slate-600">Tax Year: {formData.taxYear}</div>
      </div>

      <Alert>
        <FiAlertCircle className="h-4 w-4" />
        <AlertDescription>
          Form 1099-NEC must be provided to recipients by January 31, 2025, and filed with the IRS by February 28, 2025.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Recipient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientName">Recipient's name *</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Individual or business name"
                required
              />
            </div>
            <div>
              <Label htmlFor="recipientTIN">Recipient's TIN *</Label>
              <Input
                id="recipientTIN"
                value={formData.recipientTIN}
                onChange={(e) => handleInputChange('recipientTIN', e.target.value)}
                placeholder="000-00-0000 or 00-0000000"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="recipientAddress">Recipient's address *</Label>
            <Input
              id="recipientAddress"
              value={formData.recipientAddress}
              onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
              placeholder="Street address"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="recipientCity">City *</Label>
              <Input
                id="recipientCity"
                value={formData.recipientCity}
                onChange={(e) => handleInputChange('recipientCity', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="recipientState">State *</Label>
              <Select value={formData.recipientState} onValueChange={(value) => handleInputChange('recipientState', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
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
              <Label htmlFor="recipientZip">ZIP Code *</Label>
              <Input
                id="recipientZip"
                value={formData.recipientZip}
                onChange={(e) => handleInputChange('recipientZip', e.target.value)}
                placeholder="00000"
                maxLength={5}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="accountNumber">Account number (optional)</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              placeholder="For payer's records"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nonemployeeCompensation">Box 1 - Nonemployee compensation *</Label>
              <Input
                id="nonemployeeCompensation"
                type="number"
                step="0.01"
                value={formData.nonemployeeCompensation}
                onChange={(e) => handleInputChange('nonemployeeCompensation', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="federalIncomeTaxWithheld">Box 4 - Federal income tax withheld</Label>
              <Input
                id="federalIncomeTaxWithheld"
                type="number"
                step="0.01"
                value={formData.federalIncomeTaxWithheld}
                onChange={(e) => handleInputChange('federalIncomeTaxWithheld', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="secondTINNotice"
              checked={formData.secondTINNotice}
              onChange={(e) => handleInputChange('secondTINNotice', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="secondTINNotice">2nd TIN Notice</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>State Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="statePayerNumber">State/Payer's state no.</Label>
              <Input
                id="statePayerNumber"
                value={formData.statePayerNumber}
                onChange={(e) => handleInputChange('statePayerNumber', e.target.value)}
                placeholder="State number"
              />
            </div>
            <div>
              <Label htmlFor="stateIncome">State income</Label>
              <Input
                id="stateIncome"
                type="number"
                step="0.01"
                value={formData.stateIncome}
                onChange={(e) => handleInputChange('stateIncome', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stateIncomeTaxWithheld">State income tax withheld</Label>
              <Input
                id="stateIncomeTaxWithheld"
                type="number"
                step="0.01"
                value={formData.stateIncomeTaxWithheld}
                onChange={(e) => handleInputChange('stateIncomeTaxWithheld', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <FiSave className="mr-2" />
          Save 1099-NEC Form
        </Button>
      </div>
    </form>
  );
};

export default function TaxFormTemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSaveForm = (formData: any) => {
    console.log('Saving form:', formData);
    // Here you would save to your backend/database
    alert('Form saved successfully!');
    router.push('/admin/payroll/tax-forms');
  };

  const handleCancel = () => {
    setSelectedTemplate(null);
  };

  if (selectedTemplate) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
            <FiArrowLeft className="mr-2" />
            Back to Templates
          </Button>
        </div>
        
        {selectedTemplate === 'w2' && (
          <FormW2Template onSave={handleSaveForm} onCancel={handleCancel} />
        )}
        {selectedTemplate === '941' && (
          <Form941Template onSave={handleSaveForm} onCancel={handleCancel} />
        )}
        {selectedTemplate === '1099' && (
          <Form1099Template onSave={handleSaveForm} onCancel={handleCancel} />
        )}
      </div>
    );
  }

  const formTemplates = [
    {
      id: 'w2',
      name: 'Form W-2',
      description: 'Wage and Tax Statement',
      icon: <FiUsers className="text-3xl" />,
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      details: 'Annual wage and tax statement for employees',
      dueDate: 'Due: January 31, 2025'
    },
    {
      id: 'w4',
      name: 'Form W-4',
      description: 'Employee\'s Withholding Certificate',
      icon: <FiEdit className="text-3xl" />,
      color: 'bg-green-100 text-green-800 hover:bg-green-200',
      details: 'Employee tax withholding allowance certificate',
      dueDate: 'As needed'
    },
    {
      id: '941',
      name: 'Form 941',
      description: 'Employer\'s Quarterly Federal Tax Return',
      icon: <FiDollarSign className="text-3xl" />,
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      details: 'Quarterly federal tax return for employers',
      dueDate: 'Due: End of month following quarter'
    },
    {
      id: '1099',
      name: 'Form 1099-NEC',
      description: 'Nonemployee Compensation',
      icon: <FiFileText className="text-3xl" />,
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      details: 'Report payments to independent contractors',
      dueDate: 'Due: January 31, 2025'
    },
    {
      id: '940',
      name: 'Form 940',
      description: 'Employer\'s Annual Federal Unemployment Tax Return',
      icon: <FiTrendingUp className="text-3xl" />,
      color: 'bg-red-100 text-red-800 hover:bg-red-200',
      details: 'Annual federal unemployment tax return',
      dueDate: 'Due: January 31, 2025'
    },
    {
      id: 'i9',
      name: 'Form I-9',
      description: 'Employment Eligibility Verification',
      icon: <FiCheck className="text-3xl" />,
      color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      details: 'Verify employee eligibility to work in the US',
      dueDate: 'Within 3 days of hire'
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Create New Tax Form</h1>
          <p className="text-slate-600">Select a form template to get started - All forms comply with 2025 USA tax regulations</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <FiArrowLeft className="mr-2" />
          Back to Tax Forms
        </Button>
      </div>

      {/* 2025 Tax Updates Alert */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <FiAlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>2025 Tax Year Updates:</strong> All forms include the latest tax rates and thresholds for 2025. 
          Social Security wage base: $176,100 | Standard deduction increases | Updated tax brackets.
        </AlertDescription>
      </Alert>

      {/* Form Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto p-4 rounded-full ${template.color} transition-colors duration-300 group-hover:scale-110`}>
                {template.icon}
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{template.name}</h3>
                <p className="text-sm text-slate-600">{template.description}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm text-slate-700">{template.details}</p>
                <div className="text-xs text-orange-600 font-semibold">
                  {template.dueDate}
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template.id);
                  }}
                >
                  Create {template.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tax Compliance Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>2025 Tax Compliance Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Social Security</h4>
              <p className="text-sm text-slate-600 mb-1">Rate: 6.2% (Employee + Employer)</p>
              <p className="text-sm text-slate-600">Wage Base: $176,100 (2025)</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Medicare</h4>
              <p className="text-sm text-slate-600 mb-1">Rate: 1.45% (Employee + Employer)</p>
              <p className="text-sm text-slate-600">Additional: 0.9% on wages over $200,000</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Federal Unemployment</h4>
              <p className="text-sm text-slate-600 mb-1">Rate: 0.6% (Employer only)</p>
              <p className="text-sm text-slate-600">Wage Base: $7,000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
