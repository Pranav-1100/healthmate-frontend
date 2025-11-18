'use client';

import { useState, useEffect } from 'react';
import { prescriptionAPI } from '@/lib/api';
import {
  FilePlus,
  Calendar,
  User,
  Pill,
  Loader2,
  AlertCircle,
  Plus,
  X,
  Filter,
  Eye,
  Trash2,
  Activity
} from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [filters, setFilters] = useState({
    doctorName: '',
    diagnosis: '',
    startDate: '',
    endDate: ''
  });
  const [formData, setFormData] = useState({
    prescriptionDate: new Date().toISOString().split('T')[0],
    doctorName: '',
    diagnosis: '',
    symptoms: '',
    notes: '',
    followUpDate: '',
    medications: []
  });
  const [currentMedication, setCurrentMedication] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchStats();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await prescriptionAPI.getAll(filters);
      setPrescriptions(response.prescriptions || []);
    } catch (err) {
      setError('Failed to load prescriptions');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await prescriptionAPI.getStats();
      setStats(response);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const handleAddMedication = () => {
    if (!currentMedication.medicationName || !currentMedication.dosage) {
      setError('Medication name and dosage are required');
      return;
    }

    setFormData({
      ...formData,
      medications: [...formData.medications, { ...currentMedication }]
    });

    setCurrentMedication({
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setError('');
  };

  const handleRemoveMedication = (index) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index)
    });
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();

    if (!formData.prescriptionDate) {
      setError('Prescription date is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await prescriptionAPI.create(formData);
      setSuccess('Prescription created successfully!');
      setShowCreateModal(false);
      setFormData({
        prescriptionDate: new Date().toISOString().split('T')[0],
        doctorName: '',
        diagnosis: '',
        symptoms: '',
        notes: '',
        followUpDate: '',
        medications: []
      });
      fetchPrescriptions();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create prescription');
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      await prescriptionAPI.delete(id);
      setSuccess('Prescription deleted successfully');
      fetchPrescriptions();
      fetchStats();
    } catch (err) {
      setError('Failed to delete prescription');
    }
  };

  const viewPrescription = async (prescription) => {
    try {
      const fullPrescription = await prescriptionAPI.getById(prescription.id);
      setSelectedPrescription(fullPrescription);
      setShowDetailModal(true);
    } catch (err) {
      setError('Failed to load prescription details');
    }
  };

  const applyFilters = async () => {
    fetchPrescriptions();
  };

  const clearFilters = () => {
    setFilters({
      doctorName: '',
      diagnosis: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FilePlus className="w-8 h-8 text-blue-600" />
              Prescriptions
            </h1>
            <p className="text-gray-600 mt-2">Manage your medical prescriptions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Prescription
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPrescriptions || 0}</p>
                </div>
                <FilePlus className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Medications</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMedications || 0}</p>
                </div>
                <Pill className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Doctors</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.uniqueDoctors || 0}</p>
                </div>
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.prescriptionsThisMonth || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Doctor name"
              value={filters.doctorName}
              onChange={(e) => setFilters({...filters, doctorName: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Diagnosis"
              value={filters.diagnosis}
              onChange={(e) => setFilters({...filters, diagnosis: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              placeholder="Start date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              placeholder="End date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {prescription.doctorName || 'Unknown'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(prescription.prescriptionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewPrescription(prescription)}
                      className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {prescription.diagnosis && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Diagnosis: </span>
                    <span className="text-gray-900">{prescription.diagnosis}</span>
                  </div>
                )}

                {prescription.symptoms && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Symptoms: </span>
                    <span className="text-gray-600">{prescription.symptoms}</span>
                  </div>
                )}

                {prescription.followUpDate && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Follow-up: </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                      {new Date(prescription.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {prescription.Medications && prescription.Medications.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medications ({prescription.Medications.length})
                    </h4>
                    <div className="space-y-2">
                      {prescription.Medications.slice(0, 3).map((med, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                          <span className="font-medium text-gray-900">{med.medicationName}</span>
                          {med.dosage && <span className="text-gray-600"> - {med.dosage}</span>}
                          {med.frequency && <span className="text-gray-600"> ({med.frequency})</span>}
                        </div>
                      ))}
                      {prescription.Medications.length > 3 && (
                        <button
                          onClick={() => viewPrescription(prescription)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View {prescription.Medications.length - 3} more...
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {prescription.notes && (
                  <div className="mt-4 bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-600 italic">{prescription.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FilePlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions yet</h3>
            <p className="text-gray-600 mb-4">Create your first prescription to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Prescription
            </button>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">New Prescription</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePrescription} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prescription Date *
                    </label>
                    <input
                      type="date"
                      value={formData.prescriptionDate}
                      onChange={(e) => setFormData({...formData, prescriptionDate: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                      placeholder="Dr. Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    placeholder="e.g., Viral Fever"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    placeholder="Describe symptoms..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Medications Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Medications
                  </h3>

                  {/* Current Medications List */}
                  {formData.medications.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.medications.map((med, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-3 flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{med.medicationName}</p>
                            <p className="text-sm text-gray-600">
                              {med.dosage} - {med.frequency} - {med.duration}
                            </p>
                            {med.instructions && (
                              <p className="text-sm text-gray-500 italic">{med.instructions}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(idx)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Medication Form */}
                  <div className="space-y-3 bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Medication Name *"
                        value={currentMedication.medicationName}
                        onChange={(e) => setCurrentMedication({...currentMedication, medicationName: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Dosage *"
                        value={currentMedication.dosage}
                        onChange={(e) => setCurrentMedication({...currentMedication, dosage: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g., twice daily)"
                        value={currentMedication.frequency}
                        onChange={(e) => setCurrentMedication({...currentMedication, frequency: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 7 days)"
                        value={currentMedication.duration}
                        onChange={(e) => setCurrentMedication({...currentMedication, duration: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Instructions (e.g., Take after meals)"
                      value={currentMedication.instructions}
                      onChange={(e) => setCurrentMedication({...currentMedication, instructions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Medication
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
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <FilePlus className="w-5 h-5" />
                        Create Prescription
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Prescription Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded p-4">
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium text-gray-900">Dr. {selectedPrescription.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedPrescription.prescriptionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-medium text-gray-900">{selectedPrescription.diagnosis || 'N/A'}</p>
                  </div>
                  {selectedPrescription.followUpDate && (
                    <div>
                      <p className="text-sm text-gray-600">Follow-up</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedPrescription.followUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {selectedPrescription.symptoms && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Symptoms</h3>
                    <p className="text-gray-700 bg-gray-50 rounded p-3">{selectedPrescription.symptoms}</p>
                  </div>
                )}

                {selectedPrescription.Medications && selectedPrescription.Medications.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Medications
                    </h3>
                    <div className="space-y-3">
                      {selectedPrescription.Medications.map((med, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{med.medicationName}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {med.dosage && (
                              <div>
                                <span className="text-gray-600">Dosage:</span>
                                <span className="ml-2 text-gray-900">{med.dosage}</span>
                              </div>
                            )}
                            {med.frequency && (
                              <div>
                                <span className="text-gray-600">Frequency:</span>
                                <span className="ml-2 text-gray-900">{med.frequency}</span>
                              </div>
                            )}
                            {med.duration && (
                              <div>
                                <span className="text-gray-600">Duration:</span>
                                <span className="ml-2 text-gray-900">{med.duration}</span>
                              </div>
                            )}
                          </div>
                          {med.instructions && (
                            <p className="mt-2 text-sm text-gray-600 italic">{med.instructions}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPrescription.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-700 bg-gray-50 rounded p-3 italic">{selectedPrescription.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
