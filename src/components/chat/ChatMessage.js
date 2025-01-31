import { Bot, User, CheckCircle2, Clock } from 'lucide-react';

const MessageStatus = ({ status }) => {
  switch (status) {
    case 'sent':
      return <CheckCircle2 className="w-4 h-4 text-gray-400" />;
    case 'delivered':
      return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    case 'error':
      return <Clock className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const ChatMessage = ({ message, isBot }) => {
  return (
    <div className={`flex gap-4 p-4 ${isBot ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex-shrink-0">
        {isBot ? (
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-600" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm text-gray-500">
            {isBot ? 'HealthMate' : 'You'}
          </span>
          {!isBot && <MessageStatus status={message.status} />}
        </div>
        <div className="prose max-w-none text-gray-900"> {/* Changed from default gray color */}
  {message.content}
  {message.suggestion && (
    <div className="mt-2 text-sm text-primary-600">
      Suggested follow-up: {message.suggestion}
    </div>
  )}
</div>
        {message.visualization && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            {message.visualization}
          </div>
        )}
        {message.links && message.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.links.map((link, index) => (
              <button
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;