import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const QuickAssessment = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 'feeling',
      question: 'How are you feeling today?',
      type: 'scale',
      options: [
        { value: 1, label: 'Very Poor' },
        { value: 2, label: 'Poor' },
        { value: 3, label: 'Fair' },
        { value: 4, label: 'Good' },
        { value: 5, label: 'Excellent' },
      ],
    },
    {
      id: 'sleep',
      question: 'How well did you sleep last night?',
      type: 'hours',
      min: 0,
      max: 12,
    },
    {
      id: 'symptoms',
      question: 'Are you experiencing any symptoms?',
      type: 'multiselect',
      options: [
        'Headache',
        'Fatigue',
        'Fever',
        'Cough',
        'Nausea',
        'None',
      ],
    },
    {
      id: 'stress',
      question: 'What is your stress level?',
      type: 'scale',
      options: [
        { value: 1, label: 'Very Low' },
        { value: 2, label: 'Low' },
        { value: 3, label: 'Moderate' },
        { value: 4, label: 'High' },
        { value: 5, label: 'Very High' },
      ],
    },
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="grid grid-cols-5 gap-2">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className="p-3 text-center border rounded-lg hover:bg-gray-50"
              >
                <div className="text-2xl mb-1">{option.value}</div>
                <div className="text-sm text-gray-500">{option.label}</div>
              </button>
            ))}
          </div>
        );

      case 'hours':
        return (
          <div className="flex items-center justify-center gap-4">
            <input
              type="number"
              min={question.min}
              max={question.max}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="w-20 px-3 py-2 text-center border rounded-lg"
            />
            <span className="text-gray-500">hours</span>
          </div>
        );

      case 'multiselect':
        return (
          <div className="grid grid-cols-2 gap-2">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className="p-3 text-center border rounded-lg hover:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary-600 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-500 text-center">
          Question {currentStep + 1} of {questions.length}
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-medium text-gray-900">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answer Options */}
      {renderQuestion(currentQuestion)}

      {/* Navigation */}
      {currentStep > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-gray-500 hover:text-gray-700"
          >
            Back to previous question
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickAssessment;