import { useState, useEffect } from 'react';
import { Plus, X, Clock, Calendar, AlertTriangle, Check } from 'lucide-react';
import { formatTime, generateMedicationSchedule } from '@/lib/utils';

const MedicationCard = ({ medication, onDelete, onToggle }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-medium text-gray-900">{medication.name}</h3>
        <p className="text-sm text-gray-500">{medication.dosage}</p>
      </div>
      <button
        onClick={() => onDelete(medication.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
      <span className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        {medication.frequency}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {medication.time}
      </span>
    </div>

    {medication.notes && (
      <p className="mt-2 text-sm text-gray-500">{medication.notes}</p>
    )}

    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={() => onToggle(medication.id)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          medication.taken
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {medication.taken ? (
          <>
            <Check className="w-4 h-4" />
            Taken
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            Not taken
          </>
        )}
      </button>
    </div>
  </div>
);

const MedicationForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '09:00',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: Date.now() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medication Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dosage
          </label>
          <input
            type="text"
            required
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="daily">Daily</option>
            <option value="twice_daily">Twice Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Add Medication
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const MedicationReminder = () => {
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [upcomingDoses, setUpcomingDoses] = useState([]);

  useEffect(() => {
    // Load medications from localStorage on mount
    const savedMedications = localStorage.getItem('medications');
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications));
    }
  }, []);

  useEffect(() => {
    // Save medications to localStorage whenever they change
    localStorage.setItem('medications', JSON.stringify(medications));
    
    // Generate upcoming doses
    const allSchedules = medications.flatMap(med => generateMedicationSchedule(med));
    const sortedSchedules = allSchedules.sort((a, b) => new Date(a.time) - new Date(b.time));
    setUpcomingDoses(sortedSchedules.slice(0, 5));
  }, [medications]);

  const handleAddMedication = (medication) => {
    setMedications([...medications, medication]);
    setShowForm(false);
  };

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleToggleMedication = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Medication Reminders</h2>
          <p className="text-sm text-gray-500">Track your medications and set reminders</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <Plus className="w-4 h-4" />
          Add Medication
        </button>
      </div>

      {/* Upcoming Doses */}
      {upcomingDoses.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-3">Upcoming Doses</h3>
          <div className="space-y-3">
            {upcomingDoses.map((dose, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{dose.medicationName}</p>
                    <p className="text-xs text-gray-500">{dose.dosage}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{formatTime(dose.time)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medication Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Medication</h3>
            <MedicationForm
              onSubmit={handleAddMedication}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            onDelete={handleDeleteMedication}
            onToggle={handleToggleMedication}
          />
        ))}
      </div>

      {medications.length === 0 && !showForm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added</h3>
          <p className="text-sm text-gray-500 mb-4">
            Add your medications to get reminders and track your doses
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Add Your First Medication
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicationReminder;