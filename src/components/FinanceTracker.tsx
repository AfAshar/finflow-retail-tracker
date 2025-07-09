import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Disclosure } from '@headlessui/react';
import { 
  DocumentCheckIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon, 
  ArrowTrendingUpIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface MonthData {
  month: string;
  value: number;
  head_count?: number;
  salary?: number;
}

interface Field {
  fieldKey: string;
  category?: string;
  grouped: boolean;
  status: 'draft' | 'submitted';
  months: MonthData[];
}

interface FinanceData {
  status: 'draft' | 'submitted';
  fields: Field[];
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Expanded mock data with more fields and categories
const mockData: FinanceData = {
  status: "draft",
  fields: [
    // Headcount fields
    {
      fieldKey: "Directors",
      category: "headcount",
      grouped: true,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 200000 + (index * 5000),
        head_count: 10 + Math.floor(index / 3),
        salary: 20000 + (index * 500)
      }))
    },
    {
      fieldKey: "Senior_Managers",
      category: "headcount",
      grouped: true,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 150000 + (index * 3000),
        head_count: 15 + Math.floor(index / 2),
        salary: 10000 + (index * 300)
      }))
    },
    {
      fieldKey: "Junior_Staff",
      category: "headcount",
      grouped: true,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 80000 + (index * 2000),
        head_count: 25 + Math.floor(index / 2),
        salary: 3200 + (index * 100)
      }))
    },
    {
      fieldKey: "Contractors",
      category: "headcount",
      grouped: true,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 45000 + (index * 1500),
        head_count: 8 + Math.floor(index / 4),
        salary: 5000 + (index * 200)
      }))
    },
    // Operational expenses
    {
      fieldKey: "office_rent",
      category: "operational",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 15000 + (index * 200)
      }))
    },
    {
      fieldKey: "utilities",
      category: "operational",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 2500 + (index * 100)
      }))
    },
    {
      fieldKey: "office_supplies",
      category: "operational",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 1200 + (index * 50)
      }))
    },
    {
      fieldKey: "internet_telecom",
      category: "operational",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 800 + (index * 25)
      }))
    },
    // Technology expenses
    {
      fieldKey: "software_licenses",
      category: "technology",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 5000 + (index * 200)
      }))
    },
    {
      fieldKey: "cloud_services",
      category: "technology",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 3200 + (index * 150)
      }))
    },
    {
      fieldKey: "hardware_equipment",
      category: "technology",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 2000 + (index * 100)
      }))
    },
    // Marketing expenses
    {
      fieldKey: "digital_advertising",
      category: "marketing",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 8000 + (index * 300)
      }))
    },
    {
      fieldKey: "content_creation",
      category: "marketing",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 3500 + (index * 150)
      }))
    },
    {
      fieldKey: "events_sponsorship",
      category: "marketing",
      grouped: false,
      status: "draft",
      months: MONTHS.map((month, index) => ({
        month,
        value: 5000 + (index * 200)
      }))
    }
  ]
};

const categoryConfig = {
  headcount: { 
    label: 'Human Resources', 
    icon: UsersIcon, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  operational: { 
    label: 'Operational Expenses', 
    icon: BuildingOfficeIcon, 
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  technology: { 
    label: 'Technology & Infrastructure', 
    icon: ComputerDesktopIcon, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  marketing: { 
    label: 'Marketing & Sales', 
    icon: CurrencyDollarIcon, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
};

export function FinanceTracker() {
  const [data, setData] = useState<FinanceData>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    headcount: true,
    operational: false,
    technology: false,
    marketing: false
  });

  const isEditable = data.status === 'draft';

  const updateFieldValue = (fieldIndex: number, monthIndex: number, key: keyof MonthData, value: number) => {
    if (!isEditable) return;
    
    setData(prev => ({
      ...prev,
      fields: prev.fields.map((field, fIndex) => 
        fIndex === fieldIndex 
          ? {
              ...field,
              months: field.months.map((month, mIndex) => 
                mIndex === monthIndex 
                  ? { 
                      ...month, 
                      [key]: value,
                      // Auto-calculate total for grouped fields
                      ...(field.grouped && (key === 'head_count' || key === 'salary') ? {
                        value: (key === 'head_count' ? value : month.head_count || 0) * 
                               (key === 'salary' ? value : month.salary || 0)
                      } : {})
                    }
                  : month
              )
            }
          : field
      )
    }));
  };

  const formatFieldName = (fieldKey: string) => {
    return fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonthShort = (month: string) => {
    return month.charAt(0).toUpperCase() + month.slice(1, 3);
  };

  const groupedFields = data.fields.reduce((acc, field, index) => {
    const category = field.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...field, index });
    return acc;
  }, {} as Record<string, Array<Field & { index: number }>>);

  const filteredFields = Object.entries(groupedFields).reduce((acc, [category, fields]) => {
    const filtered = fields.filter(field => 
      formatFieldName(field.fieldKey).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, Array<Field & { index: number }>>);

  const toggleSection = (category: string) => {
    setOpenSections(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const calculateCategoryTotal = (category: string) => {
    const fields = groupedFields[category] || [];
    return fields.reduce((total, field) => {
      return total + field.months.reduce((monthTotal, month) => monthTotal + month.value, 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Finance Tracker
            </h1>
            <p className="text-muted-foreground mt-2">Comprehensive monthly financial data management</p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none lg:w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-input-border bg-input"
              />
            </div>
            
            <Badge 
              variant={data.status === 'draft' ? 'secondary' : 'default'}
              className={data.status === 'draft' ? 'bg-accent text-accent-foreground' : 'bg-success text-success-foreground'}
            >
              {data.status === 'draft' ? (
                <>
                  <DocumentTextIcon className="w-3 h-3 mr-1" />
                  Draft
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-3 h-3 mr-1" />
                  Submitted
                </>
              )}
            </Badge>
            
            {isEditable && (
              <Button variant="primary" className="bg-gradient-to-r from-primary to-primary-glow">
                <DocumentCheckIcon className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const total = calculateCategoryTotal(key);
            const Icon = config.icon;
            return (
              <Card key={key} className={`${config.bgColor} ${config.borderColor} border shadow-sm hover:shadow-md transition-all duration-300`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className="font-medium text-sm">{config.label}</span>
                    </div>
                    <div className={`text-lg font-bold ${config.color}`}>
                      {formatCurrency(total)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Fields by Category */}
        <div className="space-y-6">
          {Object.entries(filteredFields).map(([category, fields]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig];
            const Icon = config?.icon || BuildingOfficeIcon;
            const isOpen = openSections[category];
            
            return (
              <Card key={category} className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button 
                        onClick={() => toggleSection(category)}
                        className="w-full"
                      >
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className={`w-6 h-6 ${config?.color || 'text-muted-foreground'}`} />
                              <CardTitle className="text-xl">
                                {config?.label || category}
                              </CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {fields.length} fields
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-success">
                                {formatCurrency(calculateCategoryTotal(category))}
                              </span>
                              {isOpen ? (
                                <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Disclosure.Button>
                      
                      {isOpen && (
                        <Disclosure.Panel static>
                          <CardContent className="pt-0 space-y-6">
                            {fields.map((field) => (
                              <div key={field.fieldKey} className="border border-border/50 rounded-lg p-4 bg-background/50">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {formatFieldName(field.fieldKey)}
                                  </h3>
                                  {field.grouped && (
                                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                      Headcount & Salary
                                    </Badge>
                                  )}
                                </div>
                                
                                {field.grouped ? (
                                  /* Grouped fields with horizontal scroll table */
                                  <div className="overflow-x-auto">
                                    <div className="min-w-[1200px]">
                                      <div className="grid grid-cols-13 gap-1 text-xs font-medium text-muted-foreground mb-2 px-2">
                                        <div>Month</div>
                                        {MONTHS.map(month => (
                                          <div key={month} className="text-center">
                                            {formatMonthShort(month)}
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {/* Head Count Row */}
                                      <div className="grid grid-cols-13 gap-1 mb-2">
                                        <div className="text-sm font-medium text-foreground py-2 px-2">Head Count</div>
                                        {field.months.map((month, monthIndex) => (
                                          <div key={month.month} className="p-1">
                                            {isEditable ? (
                                              <Input
                                                type="number"
                                                value={month.head_count || 0}
                                                onChange={(e) => updateFieldValue(field.index, monthIndex, 'head_count', parseInt(e.target.value) || 0)}
                                                className="h-8 text-xs text-center border-input-border bg-input"
                                              />
                                            ) : (
                                              <div className="h-8 flex items-center justify-center text-xs bg-muted rounded text-foreground">
                                                {month.head_count || 0}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {/* Salary Row */}
                                      <div className="grid grid-cols-13 gap-1 mb-2">
                                        <div className="text-sm font-medium text-foreground py-2 px-2">Salary</div>
                                        {field.months.map((month, monthIndex) => (
                                          <div key={month.month} className="p-1">
                                            {isEditable ? (
                                              <Input
                                                type="number"
                                                value={month.salary || 0}
                                                onChange={(e) => updateFieldValue(field.index, monthIndex, 'salary', parseInt(e.target.value) || 0)}
                                                className="h-8 text-xs text-center border-input-border bg-input"
                                              />
                                            ) : (
                                              <div className="h-8 flex items-center justify-center text-xs bg-muted rounded text-foreground">
                                                {formatCurrency(month.salary || 0)}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {/* Total Row */}
                                      <div className="grid grid-cols-13 gap-1 border-t border-border/50 pt-2">
                                        <div className="text-sm font-bold text-success py-2 px-2">Total</div>
                                        {field.months.map((month) => (
                                          <div key={month.month} className="p-1">
                                            <div className="h-8 flex items-center justify-center text-xs font-bold text-success bg-success/10 rounded border border-success/20">
                                              {formatCurrency(month.value).replace('$', '').replace(',', 'K').slice(0, -3) + 'K'}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Single input fields - responsive grid */
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                    {field.months.map((month, monthIndex) => (
                                      <div key={month.month} className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground capitalize">
                                          {formatMonthShort(month.month)}
                                        </label>
                                        {isEditable ? (
                                          <Input
                                            type="number"
                                            value={month.value}
                                            onChange={(e) => updateFieldValue(field.index, monthIndex, 'value', parseInt(e.target.value) || 0)}
                                            className="h-9 text-sm border-input-border bg-input"
                                          />
                                        ) : (
                                          <div className="h-9 flex items-center justify-center text-sm bg-muted rounded text-foreground font-medium">
                                            {formatCurrency(month.value)}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        </Disclosure.Panel>
                      )}
                    </>
                  )}
                </Disclosure>
              </Card>
            );
          })}
        </div>

        {/* Annual Summary */}
        <Card className="shadow-card border-0 bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-success flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5" />
              Annual Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12 gap-3">
              {MONTHS.map(month => {
                const total = data.fields.reduce((sum, field) => {
                  const monthData = field.months.find(m => m.month === month);
                  return sum + (monthData?.value || 0);
                }, 0);
                
                return (
                  <div key={month} className="p-3 bg-card rounded-lg border border-border/50 hover:shadow-md transition-all duration-300">
                    <div className="text-xs text-muted-foreground uppercase mb-1 font-medium">{month}</div>
                    <div className="text-sm lg:text-base font-bold text-success">{formatCurrency(total)}</div>
                  </div>
                );
              })}
            </div>
            
            {/* Annual Total */}
            <div className="mt-6 p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Annual Total</span>
                <span className="text-2xl font-bold text-success">
                  {formatCurrency(data.fields.reduce((sum, field) => 
                    sum + field.months.reduce((monthSum, month) => monthSum + month.value, 0), 0
                  ))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}