import { useState } from 'react';
import { Plus, X, Clock, Calendar } from 'lucide-react';

const MedicationReminder = ({ onSubmit }) => {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '09:00',
    notes: '',
  });

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage) return;

    setMedications([...medications, { ...newMed, id: Date.now() }]);
    setNewMed({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: '09:00',
      notes: '',
    });
  };

  const handleRemoveMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleSave = () => {
    onSubmit(medications);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Medication Reminders</h3>

        {/* Add New Medication Form */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name
              </label>
              <input
                type="text"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter medication name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage
              </label>
              <input
                type="text"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 10mg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                value={newMed.time}
                onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={newMed.notes}
              onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Additional instructions..."
            />
          </div>

          <button
            onClick={handleAddMedication}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <Plus className="w-4 h-4" />
            Add Medication
          </button>
        </div>

        {/* Medications List */}
        {medications.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Added Medications</h4>
            {medications.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <button
                      onClick={() => handleRemoveMedication(med.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{med.dosage}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {med.time}
                    </span>
                  </div>
                  {med.notes && (
                    <p className="mt-1 text-xs text-gray-500">{med.notes}</p>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Save Reminders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationReminder;