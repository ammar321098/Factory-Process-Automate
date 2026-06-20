'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, Clock, Package, TrendingUp, Users, AlertCircle, CheckCircle, Edit, Trash2, Plus, Calendar } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  salaryType: 'Monthly' | 'Per Piece' | 'Hourly' | 'Daily';
  monthlySalary?: number;
  perPieceRate?: number;
  hourlyRate?: number;
  dailyRate?: number;
  piecesProduced?: number;
  hoursWorked?: number;
  daysWorked?: number;
}

interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  salaryType: string;
  period: string;
  amount: number;
  piecesProduced?: number;
  hoursWorked?: number;
  daysWorked?: number;
  overtime?: number;
  bonus?: number;
  deductions?: number;
  netAmount: number;
  date: string;
  status: 'Pending' | 'Paid' | 'Approved';
}

export function SalaryManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      department: 'Production',
      position: 'Machine Operator',
      salaryType: 'Per Piece',
      perPieceRate: 2.50,
      piecesProduced: 120
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      department: 'Quality Control',
      position: 'QC Inspector',
      salaryType: 'Monthly',
      monthlySalary: 3500
    },
    {
      id: '3',
      name: 'Mike Wilson',
      department: 'Production',
      position: 'Assembly Worker',
      salaryType: 'Hourly',
      hourlyRate: 18.50,
      hoursWorked: 40
    }
  ]);

  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Smith',
      salaryType: 'Per Piece',
      period: '2024-01',
      amount: 300,
      piecesProduced: 120,
      netAmount: 300,
      date: '2024-01-31',
      status: 'Paid'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Sarah Johnson',
      salaryType: 'Monthly',
      period: '2024-01',
      amount: 3500,
      netAmount: 3500,
      date: '2024-01-31',
      status: 'Paid'
    }
  ]);

  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateSalary = (employee: Employee) => {
    let amount = 0;
    
    switch (employee.salaryType) {
      case 'Monthly':
        amount = employee.monthlySalary || 0;
        break;
      case 'Per Piece':
        amount = (employee.perPieceRate || 0) * (employee.piecesProduced || 0);
        break;
      case 'Hourly':
        amount = (employee.hourlyRate || 0) * (employee.hoursWorked || 0);
        break;
      case 'Daily':
        amount = (employee.dailyRate || 0) * (employee.daysWorked || 0);
        break;
    }
    
    return amount;
  };

  const handleCalculateSalary = (employee: Employee) => {
    setIsCalculating(true);
    const amount = calculateSalary(employee);
    
    // Simulate calculation delay
    setTimeout(() => {
      const newRecord: SalaryRecord = {
        id: Date.now().toString(),
        employeeId: employee.id,
        employeeName: employee.name,
        salaryType: employee.salaryType,
        period: new Date().toISOString().slice(0, 7),
        amount,
        piecesProduced: employee.piecesProduced,
        hoursWorked: employee.hoursWorked,
        daysWorked: employee.daysWorked,
        netAmount: amount,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      
      setSalaryRecords(prev => [newRecord, ...prev]);
      setIsCalculating(false);
    }, 1000);
  };

  const getSalaryTypeIcon = (type: string) => {
    switch (type) {
      case 'Monthly': return <DollarSign className="h-4 w-4" />;
      case 'Per Piece': return <Package className="h-4 w-4" />;
      case 'Hourly': return <Clock className="h-4 w-4" />;
      case 'Daily': return <Calendar className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Approved': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Salary Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage employee salaries and payments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'employees', name: 'Employees', count: employees.length },
            { id: 'records', name: 'Salary Records', count: salaryRecords.length },
            { id: 'calculator', name: 'Salary Calculator', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <div key={employee.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{employee.department}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      {getSalaryTypeIcon(employee.salaryType)}
                      <span className="text-xs font-medium">{employee.salaryType}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rate:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${employee.salaryType === 'Monthly' ? employee.monthlySalary : 
                          employee.salaryType === 'Per Piece' ? employee.perPieceRate :
                          employee.salaryType === 'Hourly' ? employee.hourlyRate :
                          employee.dailyRate}/{
                          employee.salaryType === 'Monthly' ? 'month' :
                          employee.salaryType === 'Per Piece' ? 'piece' :
                          employee.salaryType === 'Hourly' ? 'hour' : 'day'
                        }
                      </span>
                    </div>

                    {employee.salaryType === 'Per Piece' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Pieces:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{employee.piecesProduced || 0}</span>
                      </div>
                    )}

                    {employee.salaryType === 'Hourly' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Hours:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{employee.hoursWorked || 0}</span>
                      </div>
                    )}

                    {employee.salaryType === 'Daily' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Days:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{employee.daysWorked || 0}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Total:</span>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        ${calculateSalary(employee).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <button
                      onClick={() => handleCalculateSalary(employee)}
                      disabled={isCalculating}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isCalculating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Calculator className="h-4 w-4" />
                      )}
                      <span>Calculate</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {salaryRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{record.employeeName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">ID: {record.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            {getSalaryTypeIcon(record.salaryType)}
                            <span className="text-sm text-gray-900 dark:text-white">{record.salaryType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {record.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">${record.amount.toFixed(2)}</div>
                          {record.piecesProduced && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{record.piecesProduced} pieces</div>
                          )}
                          {record.hoursWorked && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{record.hoursWorked} hours</div>
                          )}
                          {record.daysWorked && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{record.daysWorked} days</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Salary Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="monthly">Monthly</option>
                      <option value="per-piece">Per Piece</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rate ($)</label>
                    <input type="number" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                    <input type="number" step="0.1" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calculation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Base Amount:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Overtime:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Bonus:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Deductions:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">-$0.00</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">Total:</span>
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">$0.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                    <Calculator className="h-4 w-4" />
                    <span>Calculate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalaryManagement;
