import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, CheckCircle } from 'lucide-react';

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

const mockData: FinanceData = {
  status: "draft",
  fields: [
    {
      fieldKey: "Directors",
      category: "headcount",
      grouped: true,
      status: "draft",
      months: [
        { month: "jan", value: 200000, head_count: 10, salary: 20000 },
        { month: "feb", value: 252000, head_count: 12, salary: 21000 },
        { month: "mar", value: 240000, head_count: 10, salary: 24000 },
      ]
    },
    {
      fieldKey: "rent_expense",
      grouped: false,
      status: "draft",
      months: [
        { month: "jan", value: 15000 },
        { month: "feb", value: 15000 },
        { month: "mar", value: 16000 },
      ]
    },
    {
      fieldKey: "office_supplies",
      grouped: false,
      status: "draft",
      months: [
        { month: "jan", value: 2500 },
        { month: "feb", value: 3200 },
        { month: "mar", value: 2800 },
      ]
    }
  ]
};

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export function FinanceTracker() {
  const [data, setData] = useState<FinanceData>(mockData);

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
                  ? { ...month, [key]: value }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Finance Tracker
            </h1>
            <p className="text-muted-foreground mt-2">Manage your monthly financial data</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              variant={data.status === 'draft' ? 'secondary' : 'default'}
              className={data.status === 'draft' ? 'bg-accent text-accent-foreground' : 'bg-success text-success-foreground'}
            >
              {data.status === 'draft' ? (
                <>
                  <FileText className="w-3 h-3 mr-1" />
                  Draft
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Submitted
                </>
              )}
            </Badge>
            
            {isEditable && (
              <Button variant="primary" className="bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all duration-300">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-6">
          {data.fields.map((field, fieldIndex) => (
            <Card 
              key={field.fieldKey} 
              className="shadow-card border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-foreground">
                    {formatFieldName(field.fieldKey)}
                  </CardTitle>
                  {field.category && (
                    <Badge variant="outline" className="text-xs">
                      {field.category}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {field.grouped ? (
                  /* Grouped fields with table layout */
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Month</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Head Count</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Salary</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {field.months.map((month, monthIndex) => (
                          <tr 
                            key={month.month} 
                            className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-3 px-2 font-medium capitalize text-foreground">
                              {month.month}
                            </td>
                            <td className="py-3 px-2">
                              {isEditable ? (
                                <Input
                                  type="number"
                                  value={month.head_count || 0}
                                  onChange={(e) => updateFieldValue(fieldIndex, monthIndex, 'head_count', parseInt(e.target.value) || 0)}
                                  className="w-24 h-8 border-input-border bg-input"
                                />
                              ) : (
                                <span className="text-foreground">{month.head_count || 0}</span>
                              )}
                            </td>
                            <td className="py-3 px-2">
                              {isEditable ? (
                                <Input
                                  type="number"
                                  value={month.salary || 0}
                                  onChange={(e) => updateFieldValue(fieldIndex, monthIndex, 'salary', parseInt(e.target.value) || 0)}
                                  className="w-32 h-8 border-input-border bg-input"
                                />
                              ) : (
                                <span className="text-foreground">{formatCurrency(month.salary || 0)}</span>
                              )}
                            </td>
                            <td className="py-3 px-2 font-semibold text-success">
                              {formatCurrency(month.value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Single input fields */
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {field.months.map((month, monthIndex) => (
                      <div key={month.month} className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground capitalize">
                          {month.month}
                        </label>
                        {isEditable ? (
                          <Input
                            type="number"
                            value={month.value}
                            onChange={(e) => updateFieldValue(fieldIndex, monthIndex, 'value', parseInt(e.target.value) || 0)}
                            className="border-input-border bg-input"
                          />
                        ) : (
                          <div className="p-3 bg-muted rounded-md text-foreground font-medium">
                            {formatCurrency(month.value)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="shadow-card border-0 bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-success">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {MONTHS.slice(0, 3).map(month => {
                const total = data.fields.reduce((sum, field) => {
                  const monthData = field.months.find(m => m.month === month);
                  return sum + (monthData?.value || 0);
                }, 0);
                
                return (
                  <div key={month} className="p-4 bg-card rounded-lg border border-border/50">
                    <div className="text-sm text-muted-foreground capitalize mb-1">{month}</div>
                    <div className="text-lg font-bold text-success">{formatCurrency(total)}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}