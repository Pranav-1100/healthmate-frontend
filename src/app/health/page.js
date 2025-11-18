'use client';

import { useState, useEffect } from 'react';
import { healthAPI } from '@/lib/api';
import {
  Activity,
  TrendingUp,
  Heart,
  AlertCircle,
  Loader2,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';

export default function HealthPage() {
  const [dashboard, setDashboard] = useState(null);
  const [trends, setTrends] = useState(null);
  const [report, setReport] = useState(null);
  const [symptoms, setSymptoms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'trends', 'report', 'symptoms'

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await healthAPI.getDashboard();
      setDashboard(response);
    } catch (err) {
      setError('Failed to load health dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await healthAPI.getTrends();
      setTrends(response);
    } catch (err) {
      setError('Failed to load trends');
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await healthAPI.getReport();
      setReport(response);
    } catch (err) {
      setError('Failed to load health report');
    } finally {
      setLoading(false);
    }
  };

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const response = await healthAPI.getSymptoms();
      setSymptoms(response);
    } catch (err) {
      setError('Failed to load symptoms');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');

    if (tab === 'trends' && !trends) {
      fetchTrends();
    } else if (tab === 'report' && !report) {
      fetchReport();
    } else if (tab === 'symptoms' && !symptoms) {
      fetchSymptoms();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            Health Tracking
          </h1>
          <p className="text-gray-600 mt-2">Monitor your health metrics and trends</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => handleTabChange('trends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'trends' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Trends
          </button>
          <button
            onClick={() => handleTabChange('report')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'report' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Health Report
          </button>
          <button
            onClick={() => handleTabChange('symptoms')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'symptoms' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Symptoms
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Dashboard Tab */}
        {!loading && activeTab === 'dashboard' && (
          <div className="space-y-6">
            {dashboard ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Chats</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {dashboard.totalChats || 0}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Health Score</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {dashboard.healthScore || 'N/A'}
                        </p>
                      </div>
                      <Heart className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Last Check</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {dashboard.lastCheckup ? new Date(dashboard.lastCheckup).toLocaleDateString() : 'No data'}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {dashboard.recentSymptoms && dashboard.recentSymptoms.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Symptoms</h2>
                    <div className="flex flex-wrap gap-2">
                      {dashboard.recentSymptoms.map((symptom, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {dashboard.recommendations && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-3">Recommendations</h2>
                    <div className="text-blue-800 whitespace-pre-wrap">
                      {dashboard.recommendations}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No health data yet</h3>
                <p className="text-gray-600">Start chatting with the AI to track your health</p>
              </div>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {!loading && activeTab === 'trends' && (
          <div className="space-y-6">
            {trends ? (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Health Trends</h2>
                    <span className="text-sm text-gray-600">
                      {trends.timeframe || 'Last 30 days'}
                    </span>
                  </div>

                  {trends.totalInteractions !== undefined && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Total Interactions</p>
                      <p className="text-2xl font-bold text-gray-900">{trends.totalInteractions}</p>
                    </div>
                  )}

                  {trends.analysis && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">AI Analysis</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {trends.analysis}
                      </div>
                    </div>
                  )}

                  {trends.recentSymptoms && trends.recentSymptoms.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Recent Symptoms</h3>
                      <div className="flex flex-wrap gap-2">
                        {trends.recentSymptoms.map((symptom, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {trends.recommendedActions && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-2">Recommended Actions</h3>
                      <div className="text-sm text-green-800 whitespace-pre-wrap">
                        {trends.recommendedActions}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trends data available</h3>
                <p className="text-gray-600">Continue using the app to see your health trends</p>
              </div>
            )}
          </div>
        )}

        {/* Report Tab */}
        {!loading && activeTab === 'report' && (
          <div className="space-y-6">
            {report ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Health Report</h2>
                  {report.generatedAt && (
                    <span className="text-sm text-gray-600">
                      Generated: {new Date(report.generatedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {report.healthMetrics && (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium text-gray-900">Health Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.healthMetrics.bmi && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">BMI</p>
                          <p className="text-xl font-bold text-gray-900">{report.healthMetrics.bmi}</p>
                          {report.healthMetrics.bmiCategory && (
                            <p className="text-sm text-gray-600 mt-1">{report.healthMetrics.bmiCategory}</p>
                          )}
                        </div>
                      )}
                      {report.healthMetrics.generalHealth && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">General Health</p>
                          <p className="text-sm text-gray-700 mt-2">
                            {report.healthMetrics.generalHealth.status || report.healthMetrics.generalHealth.assessment}
                          </p>
                        </div>
                      )}
                    </div>

                    {report.healthMetrics.riskFactors && report.healthMetrics.riskFactors.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">Risk Factors</h4>
                        <ul className="space-y-2">
                          {report.healthMetrics.riskFactors.map((risk, idx) => (
                            <li key={idx} className="text-sm text-yellow-800">
                              {typeof risk === 'string' ? risk : risk.RiskFactor || risk.Description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {report.trends && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Trends Analysis</h3>
                    <div className="text-sm text-blue-800 whitespace-pre-wrap">
                      {report.trends.analysis || report.trends.recommendedActions}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No health report available</h3>
                <p className="text-gray-600">Your health report will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Symptoms Tab */}
        {!loading && activeTab === 'symptoms' && (
          <div className="space-y-6">
            {symptoms ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reported Symptoms</h2>
                {symptoms.timeframe && (
                  <p className="text-sm text-gray-600 mb-4">Timeframe: {symptoms.timeframe}</p>
                )}

                <div className="space-y-2">
                  {Object.entries(symptoms)
                    .filter(([key]) => !['timeframe', 'total_interactions'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{value}</span>
                        <Heart className="w-5 h-5 text-red-500" />
                      </div>
                    ))}
                </div>

                {symptoms.total_interactions && (
                  <div className="mt-4 text-sm text-gray-600">
                    Total interactions: {symptoms.total_interactions}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No symptoms recorded</h3>
                <p className="text-gray-600">Start chatting with the AI to track your symptoms</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
