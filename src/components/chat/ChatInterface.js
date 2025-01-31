import { useState, useEffect, useRef } from 'react';
import { Send, Image, BarChart2, Mic, Paperclip } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatSuggestions, { defaultSuggestions } from './ChatSuggestions';
import { useApp, actions } from '@/lib/context';
import { chatAPI } from '@/lib/api';

const ChatInterface = () => {
  const { state, dispatch } = useApp();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isVisualMode, setIsVisualMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && attachments.length === 0) return;

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setAttachments([]);
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage(inputMessage, 'general');
      setMessages(prev => {
        const updated = prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        );
        return [...updated, {
          id: response.id,
          content: response.response,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          suggestion: response.suggestion,
          links: response.links,
        }];
      });
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleVoiceInput = () => {
    // TODO: Implement voice input
    console.log('Voice input not implemented yet');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gray-50">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm mx-4 my-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="max-w-md text-center space-y-6">
                <div className="bg-primary-50 p-8 rounded-2xl">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome to HealthMate</h2>
                  <p className="text-gray-700 text-lg mb-8">
                    Your AI-powered health assistant. Ask me anything about your health, 
                    symptoms, or general wellness advice.
                  </p>
                </div>
                <ChatSuggestions
                  suggestions={defaultSuggestions}
                  onSelect={(suggestion) => setInputMessage(suggestion)}
                />
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isBot={message.sender === 'bot'}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 p-6 bg-white rounded-b-xl">
          <form onSubmit={handleSend} className="space-y-4">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-primary-50 rounded-full text-sm text-primary-700 flex items-center gap-2 transition-all hover:bg-primary-100"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="hover:text-primary-800 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder-gray-400 pr-36 shadow-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVisualMode(!isVisualMode)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-gray-900"
                    title="Show Analytics"
                  >
                    <BarChart2 className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-gray-900"
                    title="Attach Files"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-gray-900"
                    title="Voice Input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputMessage.trim() && attachments.length === 0}
              >
                <Send className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileAttachment}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Visualization Panel */}
      {isVisualMode && (
        <div className="w-96 bg-white rounded-xl shadow-sm m-4 overflow-hidden">
          <div className="sticky top-0 bg-white p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Health Insights</h2>
            <p className="text-sm text-gray-500 mt-1">Visual representation of your health data</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Recent Metrics */}
            <div className="bg-primary-50 p-6 rounded-xl">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Blood Pressure</p>
                  <p className="text-lg font-semibold text-gray-900">120/80</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Heart Rate</p>
                  <p className="text-lg font-semibold text-gray-900">72 bpm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-lg font-semibold text-gray-900">68 kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sleep</p>
                  <p className="text-lg font-semibold text-gray-900">7.5 hrs</p>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-6">
                {[
                  { time: '09:00 AM', event: 'Morning medication reminder' },
                  { time: '11:30 AM', event: 'Blood pressure reading' },
                  { time: '02:00 PM', event: 'Exercise session completed' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-20 flex-shrink-0">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow">
                  Log Symptoms
                </button>
                <button className="p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow">
                  Track Medication
                </button>
                <button className="p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow">
                  Record Vitals
                </button>
                <button className="p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;