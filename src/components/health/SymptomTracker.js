import { useState } from 'react';
import { Slider } from '@headlessui/react';

const symptoms = [
  'Headache',
  'Fatigue',
  'Fever',
  'Cough',
  'Nausea',
  'Body ache',
  'Sore throat',
  'Shortness of breath',
];

const SymptomTracker = ({ onSubmit }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [notes, setNotes] = useState('');

  const handleSeverityChange = (symptom, severity) => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [symptom]: severity
    }));
  };

  const handleSubmit = () => {
    const formattedSymptoms = Object.entries(selectedSymptoms).map(([name, severity]) => ({
      name,
      severity,
      timestamp: new Date().toISOString(),
    }));

    onSubmit({
      symptoms: formattedSymptoms,
      notes,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Track Your Symptoms</h3>

        <div className="space-y-6">
          {symptoms.map((symptom) => (
            <div key={symptom}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{symptom}</label>
                <span className="text-sm text-gray-500">
                  {selectedSymptoms[symptom] ? `${selectedSymptoms[symptom]}/10` : 'None'}
                </span>
              </div>
              <Slider
                value={selectedSymptoms[symptom] || 0}
                onChange={(value) => handleSeverityChange(symptom, value)}
                min={0}
                max={10}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-full"
              >
                <div
                  className="absolute h-2 bg-primary-600 rounded-full"
                  style={{
                    width: `${((selectedSymptoms[symptom] || 0) / 10) * 100}%`,
                  }}
                />
                <div
                  className="absolute w-4 h-4 bg-white border-2 border-primary-600 rounded-full -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${((selectedSymptoms[symptom] || 0) / 10) * 100}%`,
                    top: '50%',
                  }}
                />
              </Slider>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe any other symptoms or concerns..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Log Symptoms
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomTracker;