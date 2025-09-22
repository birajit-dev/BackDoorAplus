'use client';
import { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiTrendingUp, FiTrendingDown, FiPlus, FiEdit, FiTrash2,
  FiDownload, FiUpload, FiFileText, FiCalendar, FiSearch, FiFilter,
  FiPieChart, FiBarChart, FiCreditCard, FiShoppingCart, FiHome,
  FiUser, FiPhone, FiMail, FiMapPin, FiTag, FiCheckCircle
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'online';
  vendor?: string;
  client?: string;
  property?: string;
  receiptUrl?: string;
  taxDeductible: boolean;
  status: 'pending' | 'cleared' | 'reconciled';
  tags: string[];
  notes?: string;
  createdAt: string;
  createdBy: string;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  subcategories: string[];
  color: string;
  taxDeductible: boolean;
  description?: string;
}

const incomeCategories: Category[] = [
  {
    id: '1',
    name: 'Commission Income',
    type: 'income',
    subcategories: ['Sales Commission', 'Referral Commission', 'Listing Commission'],
    color: '#10B981',
    taxDeductible: false,
    description: 'Real estate sales commissions'
  },
  {
    id: '2',
    name: 'Property Management',
    type: 'income',
    subcategories: ['Management Fees', 'Maintenance Coordination', 'Tenant Placement'],
    color: '#3B82F6',
    taxDeductible: false,
    description: 'Property management services'
  },
  {
    id: '3',
    name: 'Rental Income',
    type: 'income',
    subcategories: ['Monthly Rent', 'Security Deposits', 'Late Fees'],
    color: '#8B5CF6',
    taxDeductible: false,
    description: 'Rental property income'
  },
  {
    id: '4',
    name: 'Consultation Services',
    type: 'income',
    subcategories: ['Investment Consulting', 'Market Analysis', 'Property Valuation'],
    color: '#F59E0B',
    taxDeductible: false,
    description: 'Professional consulting services'
  }
];

const expenseCategories: Category[] = [
  {
    id: '5',
    name: 'Office Expenses',
    type: 'expense',
    subcategories: ['Rent', 'Utilities', 'Office Supplies', 'Equipment', 'Software'],
    color: '#EF4444',
    taxDeductible: true,
    description: 'General office and administrative expenses'
  },
  {
    id: '6',
    name: 'Marketing & Advertising',
    type: 'expense',
    subcategories: ['Online Ads', 'Print Materials', 'Signage', 'Website', 'Social Media'],
    color: '#F97316',
    taxDeductible: true,
    description: 'Marketing and promotional expenses'
  },
  {
    id: '7',
    name: 'Professional Services',
    type: 'expense',
    subcategories: ['Legal Fees', 'Accounting', 'Insurance', 'Licenses', 'Training'],
    color: '#6366F1',
    taxDeductible: true,
    description: 'Professional and legal services'
  },
  {
    id: '8',
    name: 'Travel & Transportation',
    type: 'expense',
    subcategories: ['Vehicle Expenses', 'Gas', 'Parking', 'Public Transport', 'Meals'],
    color: '#14B8A6',
    taxDeductible: true,
    description: 'Business travel and transportation'
  },
  {
    id: '9',
    name: 'Employee Expenses',
    type: 'expense',
    subcategories: ['Salaries', 'Benefits', 'Payroll Taxes', 'Training', 'Equipment'],
    color: '#84CC16',
    taxDeductible: true,
    description: 'Employee-related expenses'
  }
];

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Commission Income',
    subcategory: 'Sales Commission',
    amount: 12500,
    description: 'Commission from 123 Oak Street sale',
    date: '2024-01-20',
    paymentMethod: 'bank_transfer',
    client: 'John Smith',
    property: '123 Oak Street',
    taxDeductible: false,
    status: 'cleared',
    tags: ['commission', 'residential'],
    createdAt: '2024-01-20T10:00:00Z',
    createdBy: 'Sarah Johnson'
  },
  {
    id: '2',
    type: 'expense',
    category: 'Marketing & Advertising',
    subcategory: 'Online Ads',
    amount: 850,
    description: 'Google Ads campaign for Q1',
    date: '2024-01-15',
    paymentMethod: 'credit_card',
    vendor: 'Google Ads',
    taxDeductible: true,
    status: 'cleared',
    tags: ['marketing', 'digital'],
    notes: 'Campaign for luxury properties',
    createdAt: '2024-01-15T14:30:00Z',
    createdBy: 'Michael Chen'
  },
  {
    id: '3',
    type: 'income',
    category: 'Property Management',
    subcategory: 'Management Fees',
    amount: 2400,
    description: 'Monthly management fees - January',
    date: '2024-01-01',
    paymentMethod: 'bank_transfer',
    taxDeductible: false,
    status: 'cleared',
    tags: ['management', 'monthly'],
    createdAt: '2024-01-01T09:00:00Z',
    createdBy: 'Emily Rodriguez'
  },
  {
    id: '4',
    type: 'expense',
    category: 'Office Expenses',
    subcategory: 'Software',
    amount: 299,
    description: 'CRM software subscription - annual',
    date: '2024-01-10',
    paymentMethod: 'credit_card',
    vendor: 'HubSpot',
    taxDeductible: true,
    status: 'cleared',
    tags: ['software', 'subscription', 'crm'],
    createdAt: '2024-01-10T11:15:00Z',
    createdBy: 'Sarah Johnson'
  },
  {
    id: '5',
    type: 'expense',
    category: 'Employee Expenses',
    subcategory: 'Salaries',
    amount: 15000,
    description: 'January payroll',
    date: '2024-01-31',
    paymentMethod: 'bank_transfer',
    taxDeductible: true,
    status: 'pending',
    tags: ['payroll', 'salaries'],
    createdAt: '2024-01-31T16:00:00Z',
    createdBy: 'HR System'
  }
];

const TransactionForm = ({ 
  transaction, 
  onSave, 
  onCancel 
}: { 
  transaction?: Transaction; 
  onSave: (transaction: Partial<Transaction>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    subcategory: transaction?.subcategory || '',
    amount: transaction?.amount?.toString() || '',
    description: transaction?.description || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    paymentMethod: transaction?.paymentMethod || 'credit_card',
    vendor: transaction?.vendor || '',
    client: transaction?.client || '',
    property: transaction?.property || '',
    taxDeductible: transaction?.taxDeductible || false,
    tags: transaction?.tags?.join(', ') || '',
    notes: transaction?.notes || ''
  });

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;
  const selectedCategory = categories.find(cat => cat.name === formData.category);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...transaction,
      type: formData.type as 'income' | 'expense',
      category: formData.category,
      subcategory: formData.subcategory,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      paymentMethod: formData.paymentMethod as Transaction['paymentMethod'],
      vendor: formData.vendor || undefined,
      client: formData.client || undefined,
      property: formData.property || undefined,
      taxDeductible: formData.taxDeductible,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      notes: formData.notes || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Transaction Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select 
            value={formData.subcategory} 
            onValueChange={(value) => handleInputChange('subcategory', value)}
            disabled={!selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategory?.subcategories.map(subcategory => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="online">Online Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the transaction"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.type === 'expense' && (
          <div>
            <Label htmlFor="vendor">Vendor/Supplier</Label>
            <Input
              id="vendor"
              value={formData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              placeholder="Vendor name"
            />
          </div>
        )}
        
        {formData.type === 'income' && (
          <div>
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => handleInputChange('client', e.target.value)}
              placeholder="Client name"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="property">Related Property</Label>
          <Input
            id="property"
            value={formData.property}
            onChange={(e) => handleInputChange('property', e.target.value)}
            placeholder="Property address or ID"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          placeholder="commission, residential, marketing"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="taxDeductible"
          checked={formData.taxDeductible}
          onChange={(e) => handleInputChange('taxDeductible', e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="taxDeductible">Tax Deductible</Label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <FiCheckCircle className="mr-2" />
          Save Transaction
        </Button>
      </div>
    </form>
  );
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.vendor && transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date_desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date_asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'amount_desc': return b.amount - a.amount;
      case 'amount_asc': return a.amount - b.amount;
      default: return 0;
    }
  });

  const handleSaveTransaction = (transactionData: Partial<Transaction>) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id 
          ? { ...t, ...transactionData, id: editingTransaction.id }
          : t
      ));
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        ...transactionData
      } as Transaction;
      setTransactions(prev => [newTransaction, ...prev]);
    }
    
    setShowTransactionDialog(false);
    setEditingTransaction(undefined);
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'cleared': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reconciled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allCategories = [...incomeCategories, ...expenseCategories];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-slate-400" />
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="amount_desc">Highest Amount</SelectItem>
                <SelectItem value="amount_asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transactions</CardTitle>
            <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTransaction(undefined)}>
                  <FiPlus className="mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTransaction ? 'Update the transaction details' : 'Enter the details for the new transaction'}
                  </DialogDescription>
                </DialogHeader>
                <TransactionForm
                  transaction={editingTransaction}
                  onSave={handleSaveTransaction}
                  onCancel={() => {
                    setShowTransactionDialog(false);
                    setEditingTransaction(undefined);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === 'income' ? 
                          <FiTrendingUp className={`text-green-600`} /> : 
                          <FiTrendingDown className={`text-red-600`} />
                        }
                      </div>
                      <div>
                        <h4 className="font-semibold">{transaction.description}</h4>
                        <p className="text-sm text-slate-600">
                          {transaction.category} {transaction.subcategory && `• ${transaction.subcategory}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">Date:</span> {new Date(transaction.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Method:</span> {transaction.paymentMethod.replace('_', ' ')}
                      </div>
                      {transaction.vendor && (
                        <div>
                          <span className="font-medium">Vendor:</span> {transaction.vendor}
                        </div>
                      )}
                      {transaction.client && (
                        <div>
                          <span className="font-medium">Client:</span> {transaction.client}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.toUpperCase()}
                      </Badge>
                      {transaction.taxDeductible && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Tax Deductible
                        </Badge>
                      )}
                      {transaction.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setShowTransactionDialog(true);
                        }}
                      >
                        <FiEdit className="text-xs" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <FiTrash2 className="text-xs" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedTransactions.length === 0 && (
            <div className="text-center py-8">
              <FiDollarSign className="mx-auto text-4xl text-slate-300 mb-4" />
              <p className="text-slate-500">No transactions found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const FinancialSummary = () => {
  const transactions = sampleTransactions;
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'cleared')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'cleared')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netIncome = totalIncome - totalExpenses;
  
  // Calculate by category for charts
  const incomeByCategory = incomeCategories.map(category => ({
    name: category.name,
    value: transactions
      .filter(t => t.type === 'income' && t.category === category.name && t.status === 'cleared')
      .reduce((sum, t) => sum + t.amount, 0),
    color: category.color
  })).filter(item => item.value > 0);
  
  const expensesByCategory = expenseCategories.map(category => ({
    name: category.name,
    value: transactions
      .filter(t => t.type === 'expense' && t.category === category.name && t.status === 'cleared')
      .reduce((sum, t) => sum + t.amount, 0),
    color: category.color
  })).filter(item => item.value > 0);

  const incomeChartData = {
    labels: incomeByCategory.map(item => item.name),
    datasets: [{
      data: incomeByCategory.map(item => item.value),
      backgroundColor: incomeByCategory.map(item => item.color),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const expenseChartData = {
    labels: expensesByCategory.map(item => item.name),
    datasets: [{
      data: expensesByCategory.map(item => item.value),
      backgroundColor: expensesByCategory.map(item => item.color),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Income</p>
                <p className="text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
              <FiTrendingUp className="text-2xl text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
              </div>
              <FiTrendingDown className="text-2xl text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Net Income</p>
                <p className={`text-3xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netIncome.toLocaleString()}
                </p>
              </div>
              <FiDollarSign className={`text-2xl ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Profit Margin</p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <FiPieChart className="text-2xl text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {incomeByCategory.length > 0 ? (
              <Doughnut data={incomeChartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} />
            ) : (
              <div className="text-center py-8 text-slate-500">
                No income data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <Doughnut data={expenseChartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} />
            ) : (
              <div className="text-center py-8 text-slate-500">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function AccountingPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Income & Expense Management</h1>
          <p className="text-slate-600">Track your business finances and manage accounting records</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FiUpload className="mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <FiFileText className="mr-2" />
            Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Financial Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <FinancialSummary />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionList />
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Income Categories</h3>
                  <div className="space-y-3">
                    {incomeCategories.map(category => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{category.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories.map(sub => (
                                <Badge key={sub} variant="outline" className="text-xs">
                                  {sub}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Expense Categories</h3>
                  <div className="space-y-3">
                    {expenseCategories.map(category => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{category.description}</p>
                            <div className="flex items-center space-x-2 mb-2">
                              {category.taxDeductible && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  Tax Deductible
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories.map(sub => (
                                <Badge key={sub} variant="outline" className="text-xs">
                                  {sub}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiFileText className="text-2xl" />
                  <span>Profit & Loss</span>
                  <span className="text-xs text-slate-500">Income statement</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiBarChart className="text-2xl" />
                  <span>Cash Flow</span>
                  <span className="text-xs text-slate-500">Money in and out</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiPieChart className="text-2xl" />
                  <span>Expense Report</span>
                  <span className="text-xs text-slate-500">Detailed breakdown</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiTrendingUp className="text-2xl" />
                  <span>Tax Report</span>
                  <span className="text-xs text-slate-500">Deductible expenses</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiCalendar className="text-2xl" />
                  <span>Monthly Summary</span>
                  <span className="text-xs text-slate-500">Period comparison</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FiDollarSign className="text-2xl" />
                  <span>Budget Analysis</span>
                  <span className="text-xs text-slate-500">Budget vs actual</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
