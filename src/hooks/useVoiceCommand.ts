import { useState, useCallback, useEffect, useRef } from 'react';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  description: string;
  example: string;
}

// Predefined voice commands for the elderly care app
const VOICE_COMMANDS: VoiceCommand[] = [
  {
    id: '1',
    command: 'add medication',
    action: 'add_medication',
    description: 'Add a new medication reminder',
    example: '"Add medication" or "I need to take medicine"',
  },
  {
    id: '2',
    command: 'log health',
    action: 'log_health',
    description: 'Log a health metric',
    example: '"Log health" or "Record my blood pressure"',
  },
  {
    id: '3',
    command: 'call emergency',
    action: 'emergency',
    description: 'Call emergency contact',
    example: '"Call emergency" or "Help me"',
  },
  {
    id: '4',
    command: 'show dashboard',
    action: 'dashboard',
    description: 'Go to dashboard',
    example: '"Show dashboard" or "Go home"',
  },
  {
    id: '5',
    command: 'add water',
    action: 'hydration',
    description: 'Log water intake',
    example: '"Add water" or "I drank water"',
  },
  {
    id: '6',
    command: 'show medications',
    action: 'show_medications',
    description: 'View medications',
    example: '"Show my medications" or "What meds do I have"',
  },
  {
    id: '7',
    command: 'show health',
    action: 'show_health',
    description: 'View health records',
    example: '"Show health" or "View my health"',
  },
  {
    id: '8',
    command: 'add contact',
    action: 'add_contact',
    description: 'Add a family contact',
    example: '"Add contact" or "Add family member"',
  },
];

interface UseVoiceCommandReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  recognizedCommand: VoiceCommand | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceCommand = (): UseVoiceCommandReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognizedCommand, setRecognizedCommand] = useState<VoiceCommand | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        const transcript = results.map((result) => result[0].transcript).join('');
        setTranscript(transcript);

        // Check for matching commands
        const lowerTranscript = transcript.toLowerCase();
        const matchedCommand = VOICE_COMMANDS.find((cmd) => 
          lowerTranscript.includes(cmd.command.toLowerCase()) ||
          lowerTranscript.includes(cmd.action.replace('_', ' '))
        );

        if (matchedCommand) {
          setRecognizedCommand(matchedCommand);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && isSupported) {
      setError(null);
      setTranscript('');
      setRecognizedCommand(null);
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      setError('Speech recognition is not supported in your browser');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setRecognizedCommand(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    recognizedCommand,
    startListening,
    stopListening,
    resetTranscript,
  };
};
