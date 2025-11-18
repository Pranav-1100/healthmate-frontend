'use client';

import { useState, useEffect } from 'react';
import { doctorAPI } from '@/lib/api';
import {
  Search,
  MapPin,
  Phone,
  Star,
  Navigation,
  Loader2,
  AlertCircle,
  Stethoscope,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function DoctorsPage() {
  const [searchMode, setSearchMode] = useState('symptoms'); // 'symptoms' or 'specialty'
  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('Mumbai');
  const [radius, setRadius] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSymptomSearch = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please enter your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setDoctors([]);
    setAiAnalysis(null);

    try {
      const response = await doctorAPI.searchBySymptoms(symptoms);
      setDoctors(response.doctors || []);
      setAiAnalysis(response.aiAnalysis);
      setSuccess(`Found ${response.doctors?.length || 0} doctors`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search doctors');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtySearch = async (e) => {
    e.preventDefault();
    if (!specialty.trim()) {
      setError('Please enter a specialty');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setDoctors([]);
    setAiAnalysis(null);

    try {
      const response = await doctorAPI.searchBySpecialty(specialty, location, radius);
      setDoctors(response.doctors || []);
      setSuccess(`Found ${response.doctors?.length || 0} ${specialty} doctors in ${response.location}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search doctors');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (doctor) => {
    if (doctor.geometry?.location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${doctor.geometry.location.lat},${doctor.geometry.location.lng}`;
      window.open(url, '_blank');
    }
  };

  const handleBookOnPracto = async (doctor) => {
    setLoading(true);
    try {
      const response = await doctorAPI.checkPractoAvailability(
        doctor.name,
        location,
        aiAnalysis?.determinedSpecialty || specialty
      );
      if (response.practoUrl) {
        window.open(response.practoUrl, '_blank');
      }
    } catch (err) {
      setError('Could not check Practo availability');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return badges[urgency] || badges.medium;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            Find Doctors
          </h1>
          <p className="text-gray-600 mt-2">Search for doctors by symptoms or specialty</p>
        </div>

        {/* Search Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSearchMode('symptoms')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchMode === 'symptoms'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Search by Symptoms (AI-Powered)
            </button>
            <button
              onClick={() => setSearchMode('specialty')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchMode === 'specialty'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Search by Specialty
            </button>
          </div>

          {/* Symptoms Search Form */}
          {searchMode === 'symptoms' && (
            <form onSubmit={handleSymptomSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your symptoms
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., chest pain, shortness of breath, dizziness..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find Doctors
                  </>
                )}
              </button>
            </form>
          )}

          {/* Specialty Search Form */}
          {searchMode === 'specialty' && (
            <form onSubmit={handleSpecialtySearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g., Cardiologist, Dentist..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius (meters)
                  </label>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1000}>1 km</option>
                    <option value={2000}>2 km</option>
                    <option value={5000}>5 km</option>
                    <option value={10000}>10 km</option>
                    <option value={20000}>20 km</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Doctors
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Success/Error Messages */}
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

        {/* AI Analysis Display */}
        {aiAnalysis && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">AI Analysis</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-blue-800">Determined Specialty:</span>
                <p className="text-blue-900 font-semibold">{aiAnalysis.determinedSpecialty}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-800">Urgency Level:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyBadge(aiAnalysis.urgency)}`}>
                  {aiAnalysis.urgency?.toUpperCase()}
                </span>
              </div>
              {aiAnalysis.reasoning && (
                <div>
                  <span className="text-sm font-medium text-blue-800">Reasoning:</span>
                  <p className="text-blue-900 mt-1">{aiAnalysis.reasoning}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doctors List */}
        {doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  {doctor.types && (
                    <p className="text-sm text-gray-600">{doctor.types[0]?.replace(/_/g, ' ')}</p>
                  )}
                </div>

                {doctor.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-gray-900">{doctor.rating}</span>
                    </div>
                    {doctor.user_ratings_total && (
                      <span className="text-sm text-gray-600">({doctor.user_ratings_total} reviews)</span>
                    )}
                  </div>
                )}

                {doctor.formatted_phone_number && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${doctor.formatted_phone_number}`} className="hover:text-blue-600">
                      {doctor.formatted_phone_number}
                    </a>
                  </div>
                )}

                {doctor.formatted_address && (
                  <div className="flex items-start gap-2 mb-3 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{doctor.formatted_address}</span>
                  </div>
                )}

                {doctor.opening_hours && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className={doctor.opening_hours.open_now ? 'text-green-600 font-medium' : 'text-red-600'}>
                      {doctor.opening_hours.open_now ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleGetDirections(doctor)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </button>
                  <button
                    onClick={() => handleBookOnPracto(doctor)}
                    className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Practo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && doctors.length === 0 && (success || error) && !error && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
