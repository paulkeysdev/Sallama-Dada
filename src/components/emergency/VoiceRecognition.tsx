import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceRecognitionProps {
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
  onEmergencyTrigger: () => void;
  showSettings?: boolean;
}

const VoiceRecognition = ({ 
  isListening, 
  onListeningChange, 
  onEmergencyTrigger,
  showSettings = false 
}: VoiceRecognitionProps) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [lastTranscript, setLastTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  const triggerWords = {
    english: ["help", "emergency", "no", "stop", "danger", "please","assist", "rescue", "urgent","alert", "panic"],
    swahili: ["nisaidieni", "msaada", "hapana","woooi", "hatari", "tusaidie", "okoa", "haraka", "tahadhari", "hofu"]
  };

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.toLowerCase().trim();
        setLastTranscript(transcript);

        // Check for trigger words
        const allTriggerWords = [...triggerWords.english, ...triggerWords.swahili];
        if (allTriggerWords.some(word => transcript.includes(word))) {
          onEmergencyTrigger();
          setLastTranscript(`🚨 EMERGENCY TRIGGERED: "${transcript}"`);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    }
  }, [onEmergencyTrigger]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      onListeningChange(false);
    } else {
      recognition.start();
      onListeningChange(true);
    }
  };

  const testTriggerWord = (word: string) => {
    setLastTranscript(`Testing: "${word}"`);
    setTimeout(() => {
      onEmergencyTrigger();
      setLastTranscript(`🚨 EMERGENCY TRIGGERED: "${word}"`);
    }, 1000);
  };

  if (!isSupported) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-4">
          <div className="text-center text-destructive">
            <MicOff className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Speech Recognition Not Supported</p>
            <p className="text-sm">Your browser doesn't support voice recognition. Please use Chrome or Edge.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Control */}
      <div className="text-center">
        <Button
          variant={isListening ? "emergency" : "default"}
          size="lg"
          onClick={toggleListening}
          className={`w-full ${isListening ? "animate-pulse-emergency" : ""}`}
        >
          {isListening ? (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Listening for Emergency...
            </>
          ) : (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Start Voice Recognition
            </>
          )}
        </Button>
        
        {isListening && (
          <div className="mt-2">
            <Badge variant="destructive" className="animate-pulse">
              🔴 LIVE
            </Badge>
          </div>
        )}
      </div>

      {/* Status */}
      {lastTranscript && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Last heard: {lastTranscript}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Trigger Words</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">English</h4>
                <div className="space-y-2">
                  {triggerWords.english.map((word) => (
                    <div key={word} className="flex items-center justify-between">
                      <Badge variant="outline">"{word}"</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testTriggerWord(word)}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Kiswahili</h4>
                <div className="space-y-2">
                  {triggerWords.swahili.map((word) => (
                    <div key={word} className="flex items-center justify-between">
                      <Badge variant="outline">"{word}"</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testTriggerWord(word)}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Speak clearly and in a normal voice. The system works best in quiet environments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecognition;