const ChatSuggestions = ({ suggestions, onSelect }) => {
    return (
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Suggested Questions</h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default ChatSuggestions;
  
  export const defaultSuggestions = [
    "What's my current health status?",
    "How can I improve my sleep?",
    "What are common symptoms of anxiety?",
    "Should I be concerned about my headaches?",
    "What's a healthy diet for my condition?",
    "When should I see a doctor?",
  ];