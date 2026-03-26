import React, { useState } from 'react';
import { Bot, Sparkles, Send, Brain, Thermometer, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../components/common/Card';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuthStore } from '../store/authStore';
import { useHealthStore } from '../store/healthStore';
import { useReminderStore } from '../store/reminderStore';
import { aiService } from '../services/aiService';

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuthStore();
  const { metrics } = useHealthStore();
  const { reminders } = useReminderStore();
  
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = query;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const medications = reminders.map((r: any) => r.title);
      const res = await aiService.getMedicationAdvice(medications, userMessage);
      setChatHistory(prev => [...prev, { role: 'bot', content: res.answer }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'bot', content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const res = await aiService.analyzeHealth(metrics, user);
      setAnalysis(res.analysis);
    } catch (error) {
      setAnalysis("Failed to generate health analysis. Please ensure your health metrics are logged.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bot size={32} />
                </div>
                <h1 className="text-3xl font-bold">ElderEase AI Care</h1>
              </div>
              <p className="text-primary-100 max-w-md">
                Your personal health assistant powered by Google Gemini. Ask about your medications, symptoms, or get a full health analysis.
              </p>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-3 px-6 py-4 bg-white text-primary-700 font-bold rounded-2xl hover:bg-neutral-50 transition-all shadow-lg hover:shadow-primary-500/20 disabled:opacity-50 group"
            >
              {analyzing ? <RefreshCw className="animate-spin" /> : <Sparkles className="group-hover:animate-pulse" />}
              {analyzing ? 'Analyzing Health...' : 'Analyze My Health Data'}
            </button>
          </div>
          
          {/* Abstract BG Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Analysis Card */}
          <div className="lg:col-span-1">
            <Card title="AI Health Insights" variant="primary">
              <div className="space-y-4">
                {analysis ? (
                  <div className="bg-primary-50 border border-primary-100 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-primary-700 font-bold mb-3">
                      <Brain size={20} />
                      <span>Gemini Analysis</span>
                    </div>
                    <div className="prose prose-sm text-neutral-700 whitespace-pre-line text-sm leading-relaxed">
                      {analysis}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                      <Activity size={32} />
                    </div>
                    <p className="text-neutral-500 text-sm italic">
                      Click the button above to generate a smart summary of your heart rate, blood pressure, and activity logs.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-sm font-bold text-neutral-800 mb-3 flex items-center gap-2">
                    <Thermometer size={16} className="text-primary-500" />
                    Latest Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Metrics Logged</p>
                      <p className="text-xl font-bold text-neutral-900">{metrics.length}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Medications</p>
                      <p className="text-xl font-bold text-neutral-900">{reminders.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Chat Section */}
          <div className="lg:col-span-2 h-[600px] flex flex-col">
            <Card className="flex-1 flex flex-col p-0 overflow-hidden">
              <div className="p-5 border-b border-neutral-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">Health Assistant Chat</h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Always here for you
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat View */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {chatHistory.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200 m-4">
                    <Bot size={48} className="mx-auto text-neutral-300 mb-4" />
                    <p className="text-neutral-500 max-w-xs mx-auto text-sm">
                      "I have a headache," or "When should I take my heart medicine?"
                    </p>
                  </div>
                )}
                
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-white text-neutral-800 rounded-tl-none border border-neutral-100'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-neutral-100 flex gap-2">
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleAsk} className="p-4 bg-white border-t border-neutral-100">
                <div className="flex gap-2 p-2 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask ElderEase AI anything about your health..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3"
                  />
                  <button 
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all shadow-md"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div className="mt-2 text-center flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
                  <AlertCircle size={10} />
                  AI advice is for information only. Always consult your doctor.
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
