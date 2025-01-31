import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { chatAPI } from '@/lib/api';

const ChatHistory = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChatHistory();
      setChats(response.chats);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No chat history yet</p>
        </div>
      ) : (
        chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <MessageSquare className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {chat.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(chat.createdAt).toLocaleDateString()} · {chat.messageType}
                </p>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default ChatHistory;