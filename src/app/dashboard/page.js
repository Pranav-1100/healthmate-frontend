'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { healthAPI } from '@/lib/api';
import { Activity, Heart, TrendingUp, UserCheck, AlertCircle, Calendar, Brain, Scale } from 'lucide-react';

const HealthMetricCard = ({ title, value, icon: Icon, trend, color = 'blue', subtitle }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
    {trend && (
      <p className={`mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
      </p>
    )}
  </div>
);

export default function DashboardPage() {
  const [healthReport, setHealthReport] = useState(null);
  const [healthTrends, setHealthTrends] = useState(null);
  const [symptoms, setSymptoms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportData, trendsData, symptomsData] = await Promise.all([
          healthAPI.getReport(),
          healthAPI.getTrends(),
          healthAPI.getSymptoms()
        ]);

        setHealthReport(reportData);
        setHealthTrends(trendsData);
        setSymptoms(symptomsData);
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </AppLayout>
    );
  }

  // Prepare symptoms data for chart
  const symptomChartData = [];
  if (symptoms) {
    for (let key in symptoms) {
      if (key !== 'timeframe' && key !== 'total_interactions') {
        symptomChartData.push({
          symptom: symptoms[key],
          count: 1
        });
      }
    }
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your health metrics and trends for the last {healthTrends?.timeframe || '30 days'}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HealthMetricCard
            title="BMI Score"
            value={healthReport?.healthMetrics?.bmi?.toFixed(1) || 'N/A'}
            subtitle={healthReport?.healthMetrics?.bmiCategory}
            icon={Activity}
            color="blue"
          />
          <HealthMetricCard
            title="Health Status"
            value={healthReport?.healthMetrics?.generalHealth?.status || 'N/A'}
            subtitle={healthReport?.healthMetrics?.generalHealth?.generatedAt ? 
              new Date(healthReport.healthMetrics.generalHealth.generatedAt).toLocaleDateString() : ''}
            icon={Heart}
            color="red"
          />
          <HealthMetricCard
            title="Total Interactions"
            value={symptoms?.total_interactions || healthTrends?.totalInteractions || 0}
            subtitle={`Last ${healthTrends?.timeframe || '30 days'}`}
            icon={Brain}
            color="purple"
          />
          <HealthMetricCard
            title="Active Status"
            value={healthReport?.healthMetrics?.generalHealth?.status || 'Active'}
            icon={Activity}
            color="green"
          />
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Health Analysis</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-600">
              {healthReport?.healthMetrics?.generalHealth?.assessment || healthTrends?.analysis || 'No recent analysis available.'}
            </pre>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Symptoms Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Symptoms</h2>
            {symptomChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={symptomChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="symptom" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No recent symptoms reported
              </div>
            )}
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Risk Factors</h2>
            <div className="space-y-4">
              {healthReport?.healthMetrics?.riskFactors?.map((risk, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    {typeof risk === 'string' ? (
                      <p className="text-sm text-gray-900">{risk}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900">{risk.RiskFactor}</p>
                        <p className="text-sm text-gray-500">{risk.Description}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-600">
              {healthTrends?.recommendedActions || healthReport?.recommendations || 'No recommendations available at this time.'}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}