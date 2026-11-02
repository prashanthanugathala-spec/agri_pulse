import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  initSpeechRecognition,
  startListening,
  stopListening,
  speakText,
  stopSpeaking,
  askVoiceAssistant,
} from '../services/voiceAssistantService';

export const VoiceAssistantWidget = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [assistantState, setAssistantState] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking'
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [audioWaves, setAudioWaves] = useState([20, 45, 70, 35, 80, 50, 25]);
  const [history, setHistory] = useState([]);

  const waveIntervalRef = useRef(null);

  // Quick preset voice prompts
  const samplePrompts = [
    { label: '🌱 Soil Health', query: 'How is the soil moisture and NPK in Zone B?' },
    { label: '🌧️ Rain Forecast', query: 'Should I pause irrigation ahead of Sunday’s rain?' },
    { label: '🐛 Pest Scan', query: 'Check pest risk in the polyhouse' },
    { label: '💧 Irrigation', query: 'What is the status of my irrigation zones?' },
    { label: '🗺️ Farm Map', query: 'Take me to my farm map boundaries' },
  ];

  // Animate audio waveform when listening or speaking
  useEffect(() => {
    if (assistantState === 'listening' || assistantState === 'speaking') {
      waveIntervalRef.current = setInterval(() => {
        setAudioWaves([
          Math.floor(Math.random() * 60 + 20),
          Math.floor(Math.random() * 80 + 30),
          Math.floor(Math.random() * 95 + 40),
          Math.floor(Math.random() * 100 + 40),
          Math.floor(Math.random() * 85 + 30),
          Math.floor(Math.random() * 70 + 20),
          Math.floor(Math.random() * 50 + 15),
        ]);
      }, 120);
    } else {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      setAudioWaves([20, 30, 25, 35, 25, 30, 20]);
    }
    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [assistantState]);

  // Global hotkey 'V' (unless user is typing in an input/textarea)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) {
            // Auto start listening on hotkey
            setTimeout(() => handleToggleListening(), 200);
          } else {
            handleClose();
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [assistantState, isMuted, location.pathname]);

  // Handle Speech Recognition Result
  const handleVoiceInput = async (spokenText) => {
    if (!spokenText.trim()) {
      setAssistantState('idle');
      return;
    }

    setTranscript(spokenText);
    setAssistantState('processing');

    try {
      const result = await askVoiceAssistant(spokenText, location.pathname);
      setResponse(result);
      setHistory((prev) => [
        { query: spokenText, reply: result.spokenText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.slice(0, 4),
      ]);

      if (!isMuted && result.spokenText) {
        setAssistantState('speaking');
        speakText(result.spokenText, {
          onStart: () => setAssistantState('speaking'),
          onEnd: () => setAssistantState('idle'),
          onError: () => setAssistantState('idle'),
        });
      } else {
        setAssistantState('idle');
      }

      // Auto-trigger navigation if user explicitly asked to navigate
      const lower = spokenText.toLowerCase();
      if (
        result.action === 'NAVIGATE' &&
        result.actionPayload &&
        (lower.includes('go to') || lower.includes('open') || lower.includes('take me to') || lower.includes('navigate'))
      ) {
        setTimeout(() => {
          navigate(result.actionPayload);
        }, 1500);
      }
    } catch (err) {
      console.error('Voice Assistant Error:', err);
      setResponse({
        spokenText: 'Sorry, I encountered an issue processing your field telemetry. Please try again.',
        displayText: 'Telemetry connection timeout. Please retry.',
        action: 'NONE',
        grounding: 'System Diagnostic',
      });
      setAssistantState('idle');
    }
  };

  const handleToggleListening = () => {
    if (assistantState === 'listening') {
      stopListening();
      setAssistantState('idle');
      return;
    }

    stopSpeaking();
    setTranscript('');
    setAssistantState('listening');

    const started = startListening({
      onInterim: (text) => setTranscript(text),
      onResult: (text) => handleVoiceInput(text),
      onEnd: () => {
        if (assistantState === 'listening') {
          setAssistantState('idle');
        }
      },
      onError: (err) => {
        console.warn('Speech error:', err);
        setAssistantState('idle');
        if (err === 'not-allowed') {
          setMicSupported(false);
        }
      },
    });

    if (!started) {
      setMicSupported(false);
      setAssistantState('idle');
    }
  };

  const handleClose = () => {
    stopListening();
    stopSpeaking();
    setAssistantState('idle');
    setIsOpen(false);
  };

  const handleReplayVoice = () => {
    if (response?.spokenText) {
      stopSpeaking();
      setAssistantState('speaking');
      speakText(response.spokenText, {
        onStart: () => setAssistantState('speaking'),
        onEnd: () => setAssistantState('idle'),
        onError: () => setAssistantState('idle'),
      });
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Subtle helper pill when closed */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-xs text-[#1D1D1F] cursor-pointer hover:bg-[#F6F3F5] transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-[#125238] animate-ping" />
            <span className="font-medium text-[#125238]">AgriVoice</span>
            <span className="text-[10px] text-[#6E6E73] group-hover:text-[#1D1D1F]">Press V</span>
          </div>
        )}

        {/* Main Floating Voice Orb Button */}
        <button
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              setTimeout(() => handleToggleListening(), 200);
            } else {
              handleClose();
            }
          }}
          aria-label="Open AgriPulse Voice Assistant"
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgba(18,82,56,0.3)] cursor-pointer group ${
            isOpen
              ? 'bg-[#1D1D1F] text-white rotate-90 scale-100'
              : 'bg-gradient-to-tr from-[#125238] via-[#2F6B4F] to-[#4ECB71] text-white hover:scale-105 active:scale-95'
          }`}
        >
          {/* Animated Glowing Ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#125238] to-[#4ECB71] opacity-40 blur-md group-hover:opacity-75 transition duration-500 animate-pulse" />
          )}

          {isOpen ? (
            <span className="material-symbols-outlined text-[24px]">close</span>
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">mic</span>
              {/* Voice ripple indicator */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#4ECB71] border-2 border-white" />
            </div>
          )}
        </button>
      </div>

      {/* Voice Assistant HUD Modal / Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-black/[0.08] overflow-hidden flex flex-col p-6 sm:p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F3EC] flex items-center justify-center text-[#125238]">
                  <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-1.5">
                    AgriVoice Assistant
                    <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r from-[#125238] to-[#2F6B4F] text-white">
                      Groq LPU
                    </span>
                  </h2>
                  <p className="text-[11px] text-[#6E6E73]">
                    Instant agronomy intelligence • Powered by GPT-OSS 120B
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Mute / Unmute Toggle */}
                <button
                  onClick={() => {
                    if (!isMuted) stopSpeaking();
                    setIsMuted(!isMuted);
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isMuted ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-[#F6F3F5] text-[#404943] hover:bg-[#EAE7EA]'
                  }`}
                  title={isMuted ? 'Voice Muted (Unmute)' : 'Voice Audio Active (Mute)'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isMuted ? 'volume_off' : 'volume_up'}
                  </span>
                </button>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-[#F6F3F5] text-[#404943] hover:bg-[#EAE7EA] transition-colors cursor-pointer"
                  title="Close Assistant"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Central Animated Voice Orb & Soundwaves */}
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="relative flex items-center justify-center">
                {/* Outer Ambient Glow Ring */}
                <div
                  className={`absolute w-36 h-36 rounded-full transition-all duration-700 blur-2xl ${
                    assistantState === 'listening'
                      ? 'bg-[#4ECB71]/40 scale-125 animate-pulse'
                      : assistantState === 'speaking'
                      ? 'bg-[#2F6B4F]/40 scale-110'
                      : assistantState === 'processing'
                      ? 'bg-amber-400/30 scale-110 animate-spin'
                      : 'bg-[#125238]/15 scale-90'
                  }`}
                />

                {/* Interactive Center Orb Button */}
                <button
                  onClick={handleToggleListening}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                    assistantState === 'listening'
                      ? 'bg-gradient-to-tr from-[#BA1A1A] to-[#E2534C] text-white scale-110 shadow-[0_0_40px_rgba(226,83,76,0.5)]'
                      : assistantState === 'speaking'
                      ? 'bg-gradient-to-tr from-[#125238] via-[#2F6B4F] to-[#4ECB71] text-white shadow-[0_0_35px_rgba(78,203,113,0.4)]'
                      : assistantState === 'processing'
                      ? 'bg-[#1D1D1F] text-amber-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]'
                      : 'bg-gradient-to-tr from-[#125238] to-[#2F6B4F] text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[36px]">
                    {assistantState === 'listening'
                      ? 'mic'
                      : assistantState === 'processing'
                      ? 'hourglass_top'
                      : assistantState === 'speaking'
                      ? 'volume_up'
                      : 'mic'}
                  </span>
                </button>
              </div>

              {/* Dynamic Sound Waveform Bars */}
              <div className="flex items-center gap-1.5 h-10 mt-5">
                {audioWaves.map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      assistantState === 'listening'
                        ? 'bg-[#BA1A1A]'
                        : assistantState === 'speaking'
                        ? 'bg-[#2F6B4F]'
                        : assistantState === 'processing'
                        ? 'bg-amber-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Status Text */}
              <div className="mt-3">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6E6E73]">
                  {assistantState === 'listening' && (
                    <span className="text-[#BA1A1A] font-semibold flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-ping" />
                      Listening to your voice... (Click orb to finish)
                    </span>
                  )}
                  {assistantState === 'processing' && (
                    <span className="text-amber-700 font-semibold flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Consulting Groq LPU & IoT Sensors...
                    </span>
                  )}
                  {assistantState === 'speaking' && (
                    <span className="text-[#2F6B4F] font-semibold flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">volume_up</span>
                      Speaking Agronomic Guidance
                    </span>
                  )}
                  {assistantState === 'idle' && 'Tap the microphone or press V to speak'}
                </span>
              </div>
            </div>

            {/* Live Transcript / Speech Preview */}
            {transcript && (
              <div className="mb-4 p-3 rounded-2xl bg-[#F6F3F5] text-xs text-[#1D1D1F] border border-black/[0.04]">
                <span className="text-[10px] font-semibold text-[#6E6E73] block mb-0.5">YOU SAID:</span>
                <span className="font-normal italic">"{transcript}"</span>
              </div>
            )}

            {/* AI Spoken Response Card */}
            {response && (
              <div className="mb-4 p-4 rounded-2xl bg-[#E8F3EC]/50 border border-[#2F6B4F]/20 text-[#1B1B1D] space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-[#2F6B4F] font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    {response.grounding}
                  </span>
                  <button
                    onClick={handleReplayVoice}
                    className="flex items-center gap-1 text-[11px] hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">replay</span>
                    Replay Voice
                  </button>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-[#1D1D1F] font-normal">
                  {response.displayText || response.spokenText}
                </p>

                {/* Action Chip Trigger (e.g., Navigate to /soil or /weather) */}
                {response.action === 'NAVIGATE' && response.actionPayload && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigate(response.actionPayload);
                        handleClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#125238] hover:bg-[#2F6B4F] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{response.actionLabel || 'Go to Section'}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                    <span className="text-[10px] text-[#6E6E73]">
                      Target: {response.actionPayload}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Sample Prompts Carousel / Pills */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-semibold text-[#6E6E73] tracking-wider block mb-2">
                Suggested Voice Prompts
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {samplePrompts.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleVoiceInput(p.query)}
                    className="px-3 py-1.5 rounded-full bg-[#F6F3F5] hover:bg-[#E8F3EC] text-[#1D1D1F] hover:text-[#2F6B4F] text-xs font-medium border border-black/[0.04] shrink-0 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Microphone permission alert if needed */}
            {!micSupported && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">mic_off</span>
                <span>
                  Microphone access blocked or unsupported. You can still tap any suggested prompt above to interact with AgriVoice!
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistantWidget;
