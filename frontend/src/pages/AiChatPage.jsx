import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/api';
import { speakText, stopSpeaking, startListening, stopListening } from '../services/voiceAssistantService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { LoadingState } from '../components/FeedbackStates';

export const AiChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const presetQueries = [
    'What fertilizer for Zone B flowering stage?',
    'Should I pause irrigation ahead of Sunday’s expected rainfall?',
    'Assess Early Blight risk in Zone C Polyhouse',
    'Calculate optimal potassium top-dressing for Rice tillers',
  ];

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await aiService.getHistory();
      setMessages(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSendMessage = async (promptToSend) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim()) return;

    setInputPrompt('');
    setSending(true);

    // Optimistically add user message
    const tempUserMsg = {
      id: Date.now(),
      sender: 'USER',
      message: query,
      groundingSources: 'Direct User Query',
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const aiResponse = await aiService.sendMessage(query);
      setMessages((prev) => [...prev, aiResponse]);

      // Automatically speak out response if user dictated via voice
      if (isRecording && aiResponse?.message) {
        setSpeakingMessageId(aiResponse.id);
        speakText(aiResponse.message, {
          onEnd: () => setSpeakingMessageId(null),
          onError: () => setSpeakingMessageId(null),
        });
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'AGRONOMIST_AI',
        message: 'Telemetry communication error: ' + err.message,
        groundingSources: 'System Diagnostic',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
      setIsRecording(false);
    }
  };

  const handleToggleVoiceDictation = () => {
    if (isRecording) {
      stopListening();
      setIsRecording(false);
      return;
    }

    stopSpeaking();
    setIsRecording(true);

    startListening({
      onInterim: (text) => setInputPrompt(text),
      onResult: (text) => {
        setInputPrompt(text);
        setIsRecording(false);
        // Automatically send after clear speech
        handleSendMessage(text);
      },
      onEnd: () => setIsRecording(false),
      onError: () => setIsRecording(false),
    });
  };

  const handleToggleSpeakMessage = (msg) => {
    if (speakingMessageId === msg.id) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      stopSpeaking();
      setSpeakingMessageId(msg.id);
      speakText(msg.message, {
        onEnd: () => setSpeakingMessageId(null),
        onError: () => setSpeakingMessageId(null),
      });
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all conversation history with AgriPulse AI?')) return;
    try {
      await aiService.clearHistory();
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto h-[calc(100vh-8rem)]">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-header shrink-0">
        <div>
          <span className="font-label-caps text-[#6E6E73]">Domain-Grounded Intelligence</span>
          <h1 className="text-3xl font-normal text-[#1D1D1F] tracking-tight mt-1 flex items-center gap-2">
            AgriPulse AI Agronomist
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#E8F3EC] text-[#125238] border border-[#2F6B4F]/20">
              ⚡ Groq LPU Voice
            </span>
          </h1>
          <p className="text-xs text-[#6E6E73] mt-1">
            Synthesizes soil chemistry, sensor telemetry, and microclimate models into conversational field actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge variant="eco" icon="auto_awesome">
            Grounded on Live Field Data
          </StatusBadge>
          <Button variant="ghost" size="sm" onClick={handleClearHistory}>
            Reset Chat
          </Button>
        </div>
      </section>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {presetQueries.map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#E8F3EC] text-xs font-medium text-[#1D1D1F] hover:text-[#2F6B4F] border border-black/[0.04] shadow-xs shrink-0 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-[28px] p-6 shadow-sm border border-black/[0.04] overflow-y-auto space-y-4">
        {loading ? (
          <LoadingState message="Loading conversational agronomy context..." />
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-full bg-[#E8F3EC] flex items-center justify-center text-[#2F6B4F] mb-3">
              <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
            </div>
            <h3 className="text-base font-medium text-[#1D1D1F] mb-1">Ask AgriPulse AI anything about your farm</h3>
            <p className="text-xs text-[#6E6E73] max-w-md">
              Inquire about crop nutrition, irrigation scheduling ahead of rain, or pest treatments. You can type or tap the microphone to talk!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-[22px] p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === 'USER'
                    ? 'bg-[#2F6B4F] text-white rounded-br-xs'
                    : 'bg-[#F6F3F5] text-[#1B1B1D] rounded-bl-xs'
                }`}
              >
                {msg.message}

                {/* Speak message aloud button for AI messages */}
                {msg.sender !== 'USER' && (
                  <button
                    onClick={() => handleToggleSpeakMessage(msg)}
                    className="absolute -right-9 top-3 p-1.5 rounded-full bg-white shadow-xs border border-black/[0.06] text-[#6E6E73] hover:text-[#125238] transition-colors cursor-pointer"
                    title={speakingMessageId === msg.id ? 'Stop Speaking' : 'Read aloud with Voice'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {speakingMessageId === msg.id ? 'volume_off' : 'volume_up'}
                    </span>
                  </button>
                )}
              </div>

              {msg.groundingSources && msg.sender !== 'USER' && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#6E6E73]">
                  <span className="material-symbols-outlined text-[12px] text-[#2F6B4F]">verified</span>
                  <span>Grounded on: {msg.groundingSources}</span>
                </div>
              )}
            </div>
          ))
        )}

        {sending && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#F6F3F5] text-xs text-[#6E6E73] w-max">
            <span className="w-2 h-2 rounded-full bg-[#2F6B4F] animate-bounce" />
            <span>Consulting Groq agronomic models & live sensor telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box with Voice Mic Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-3 shrink-0"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to your voice... Speak now.'
                : 'Ask an agronomic question (e.g. fertilizer dose, irrigation adjustments, disease remedy)...'
            }
            className={`w-full h-12 pl-5 pr-12 rounded-full bg-white border text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 shadow-xs transition-colors ${
              isRecording
                ? 'border-[#BA1A1A] ring-2 ring-[#BA1A1A]/20 bg-red-50/20'
                : 'border-black/[0.06] focus:ring-[#2F6B4F]/20'
            }`}
          />

          {/* Inline Microphone Dictate Button */}
          <button
            type="button"
            onClick={handleToggleVoiceDictation}
            className={`absolute right-3 p-2 rounded-full transition-all cursor-pointer ${
              isRecording
                ? 'bg-[#BA1A1A] text-white animate-pulse'
                : 'text-[#6E6E73] hover:text-[#125238] hover:bg-black/5'
            }`}
            title={isRecording ? 'Listening (Click to stop)' : 'Click to Speak via Microphone'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRecording ? 'mic' : 'mic_none'}
            </span>
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon="send"
          disabled={!inputPrompt.trim() || sending}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default AiChatPage;
