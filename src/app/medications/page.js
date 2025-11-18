'use client';

import { useState, useEffect } from 'react';
import { medicationAPI } from '@/lib/api';
import {
  Pill,
  Plus,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Clock,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [showInteractionsModal, setShowInteractionsModal] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [interactions, setInteractions] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    condition: '',
    notes: '',
    reminderTimes: []
  });
  const [suggestionForm, setSuggestionForm] = useState({
    symptoms: '',
    condition: ''
  });
  const [currentReminderTime, setCurrentReminderTime] = useState('');

  useEffect(() => {
    fetchMedications();
    fetchPatterns();
  }, []);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const response = await medicationAPI.getAll(filter === 'active');
      setMedications(response.medications || []);
    } catch (err) {
      setError('Failed to load medications');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatterns = async () => {
    try {
      const response = await medicationAPI.getPatterns();
      setPatterns(response);
    } catch (err) {
      console.error('Patterns error:', err);
    }
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!formData.medicationName || !formData.dosage) {
      setError('Medication name and dosage are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await medicationAPI.add(formData);
      setSuccess('Medication added successfully!');
      setShowAddModal(false);
      setFormData({
        medicationName: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        condition: '',
        notes: '',
        reminderTimes: []
      });
      fetchMedications();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add medication');
      console.error('Add error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this medication?')) return;

    try {
      await medicationAPI.delete(id);
      setSuccess('Medication deleted successfully');
      fetchMedications();
    } catch (err) {
      setError('Failed to delete medication');
    }
  };

  const handleGetSuggestions = async (e) => {
    e.preventDefault();
    if (!suggestionForm.symptoms || !suggestionForm.condition) {
      setError('Please enter both symptoms and condition');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await medicationAPI.getSuggestions(
        suggestionForm.symptoms,
        suggestionForm.condition
      );
      setSuggestions(response);
      setShowSuggestionsModal(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get suggestions');
      console.error('Suggestions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInteractions = async (medicationName) => {
    setLoading(true);
    setError('');

    try {
      const response = await medicationAPI.checkInteractions(medicationName);
      setInteractions({...response, medicationName});
      setShowInteractionsModal(true);
    } catch (err) {
      setError('Failed to check interactions');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkEffectiveness = async (id, isEffective) => {
    try {
      await medicationAPI.update(id, { wasEffective: isEffective });
      setSuccess(`Marked as ${isEffective ? 'effective' : 'not effective'}`);
      fetchMedications();
      fetchPatterns();
    } catch (err) {
      setError('Failed to update medication');
    }
  };

  const handleAddReminderTime = () => {
    if (!currentReminderTime) return;
    setFormData({
      ...formData,
      reminderTimes: [...formData.reminderTimes, currentReminderTime]
    });
    setCurrentReminderTime('');
  };

  const handleRemoveReminderTime = (index) => {
    setFormData({
      ...formData,
      reminderTimes: formData.reminderTimes.filter((_, i) => i !== index)
    });
  };

  const filteredMedications = medications.filter(med => {
    if (filter === 'active') {
      return !med.endDate || new Date(med.endDate) >= new Date();
    } else if (filter === 'completed') {
      return med.endDate && new Date(med.endDate) < new Date();
    }
    return true;
  });

  const getEffectivenessBadge = (wasEffective) => {
    if (wasEffective === null || wasEffective === undefined) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Not Rated</span>;
    }
    return wasEffective ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Effective
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Not Effective
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Pill className="w-8 h-8 text-blue-600" />
              Medications
            </h1>
            <p className="text-gray-600 mt-2">Track your medications with AI-powered insights</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSuggestionsModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              AI Suggestions
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Medication
            </button>
          </div>
        </div>

        {/* AI Patterns Section */}
        {patterns && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              AI-Detected Patterns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patterns.commonConditions && patterns.commonConditions.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Common Conditions</h3>
                  <div className="space-y-1">
                    {patterns.commonConditions.slice(0, 3).map((condition, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{condition.condition}</span>
                        <span className="text-gray-500">{condition.count}x</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {patterns.effectiveMedications && patterns.effectiveMedications.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Most Effective</h3>
                  <div className="space-y-1">
                    {patterns.effectiveMedications.slice(0, 3).map((med, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{med.medicationName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {patterns.insights && patterns.insights.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Insights</h3>
                  <p className="text-sm text-gray-700 italic">{patterns.insights[0]}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Medications
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Medications List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredMedications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedications.map((med) => (
              <div key={med.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{med.medicationName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {(!med.endDate || new Date(med.endDate) >= new Date()) ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Completed</span>
                      )}
                      {getEffectivenessBadge(med.wasEffective)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  {med.dosage && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Pill className="w-4 h-4" />
                      <span>{med.dosage}</span>
                    </div>
                  )}
                  {med.frequency && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span>{med.frequency}</span>
                    </div>
                  )}
                  {med.condition && (
                    <div className="text-gray-700">
                      <span className="font-medium">For:</span> {med.condition}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(med.startDate).toLocaleDateString()}
                      {med.endDate && ` - ${new Date(med.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>

                {med.reminderTimes && med.reminderTimes.length > 0 && (
                  <div className="mb-4 bg-blue-50 rounded p-2">
                    <p className="text-xs font-medium text-blue-800 mb-1">Reminder Times:</p>
                    <div className="flex flex-wrap gap-1">
                      {med.reminderTimes.map((time, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {med.notes && (
                  <div className="mb-4 bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600 italic">{med.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {(!med.endDate || new Date(med.endDate) >= new Date()) && med.wasEffective === null && (
                    <>
                      <button
                        onClick={() => handleMarkEffectiveness(med.id, true)}
                        className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Effective
                      </button>
                      <button
                        onClick={() => handleMarkEffectiveness(med.id, false)}
                        className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Not Effective
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleCheckInteractions(med.medicationName)}
                  className="w-full mt-2 bg-yellow-50 text-yellow-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Check Interactions
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your medications</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Medication
            </button>
          </div>
        )}

        {/* Add Medication Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Medication</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddMedication} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medication Name *
                    </label>
                    <input
                      type="text"
                      value={formData.medicationName}
                      onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
                      required
                      placeholder="e.g., Paracetamol"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      required
                      placeholder="e.g., 500mg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={formData.frequency}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                      placeholder="e.g., Twice daily"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition/Reason
                    </label>
                    <input
                      type="text"
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                      placeholder="e.g., Headache"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Times
                  </label>
                  {formData.reminderTimes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.reminderTimes.map((time, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span className="text-sm">{time}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveReminderTime(idx)}
                            className="ml-1 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={currentReminderTime}
                      onChange={(e) => setCurrentReminderTime(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddReminderTime}
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add Medication
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Suggestions Modal */}
        {showSuggestionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  AI Medication Suggestions
                </h2>
                <button
                  onClick={() => {
                    setShowSuggestionsModal(false);
                    setSuggestions(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {!suggestions ? (
                  <form onSubmit={handleGetSuggestions} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your symptoms *
                      </label>
                      <textarea
                        value={suggestionForm.symptoms}
                        onChange={(e) => setSuggestionForm({...suggestionForm, symptoms: e.target.value})}
                        placeholder="e.g., severe headache, sensitivity to light..."
                        rows={4}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition *
                      </label>
                      <input
                        type="text"
                        value={suggestionForm.condition}
                        onChange={(e) => setSuggestionForm({...suggestionForm, condition: e.target.value})}
                        placeholder="e.g., Migraine"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Getting Suggestions...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Get AI Suggestions
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {suggestions.basedOnHistory && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-purple-900 font-medium flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Based on your medication history
                        </p>
                      </div>
                    )}

                    {suggestions.recommendations && suggestions.recommendations.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Recommended Medications:</h3>
                        <div className="space-y-3">
                          {suggestions.recommendations.map((rec, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{rec.medicationName}</h4>
                                {rec.basedOnHistory && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                    From your history
                                  </span>
                                )}
                              </div>
                              {rec.dosage && (
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Dosage:</span> {rec.dosage}
                                </p>
                              )}
                              {rec.frequency && (
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Frequency:</span> {rec.frequency}
                                </p>
                              )}
                              {rec.reason && (
                                <p className="text-sm text-gray-600 italic mt-2 bg-gray-50 rounded p-2">
                                  {rec.reason}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestions.warnings && suggestions.warnings.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Important Warnings:
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {suggestions.warnings.map((warning, idx) => (
                            <li key={idx} className="text-sm text-red-800">{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-900">
                        <strong>Disclaimer:</strong> These are AI-generated suggestions based on your medication history.
                        Always consult with a healthcare professional before taking any medication.
                      </p>
                    </div>

                    <button
                      onClick={() => setSuggestions(null)}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Get New Suggestions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Drug Interactions Modal */}
        {showInteractionsModal && interactions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  Drug Interactions for {interactions.medicationName}
                </h2>
                <button
                  onClick={() => {
                    setShowInteractionsModal(false);
                    setInteractions(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {interactions.interactions && interactions.interactions.length > 0 ? (
                  <>
                    {interactions.interactions.map((interaction, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-gray-900">{interaction.withMedication}</h3>
                          <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                            interaction.severity === 'high' ? 'bg-red-100 text-red-800' :
                            interaction.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {interaction.severity?.toUpperCase()} RISK
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{interaction.description}</p>
                      </div>
                    ))}

                    {interactions.advice && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">AI Advice:</h3>
                        <p className="text-sm text-blue-800">{interactions.advice}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Interactions Found</h3>
                    <p className="text-gray-600">
                      This medication appears to be safe with your current medications.
                    </p>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> Always consult your doctor or pharmacist about potential drug interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
