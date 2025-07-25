import { Shield, Mic, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  // Voice demo handler
  const handleVoiceDemo = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // or "sw-KE" for Swahili
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      alert("Listening... Please speak now.");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      alert(`You said: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      alert("Error occurred in recognition: " + event.error);
    };

    recognition.start();
  };

  return (
    <section
      className="py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg1.jpg')" }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm">
              Trusted by women worldwide
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Your Voice,
            <br />
            <span className="bg-gradient-to-r from-[#309898] via-[#FF9F00] to-[#F4631E] bg-clip-text text-transparent">
              Your Safety
            </span>
          </h1>
          <p
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Emergency help activated by your voice in English or Swahili.
            Instant alerts, live location sharing, and nearby safe spaces.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              variant="safe"
              size="xl"
              onClick={onGetStarted}
              className="shadow-glow bg-gradient-to-r from-[#309898] via-[#FF9F00] to-[#F4631E] text-black font-bold"
            >
              <Shield className="w-6 h-6 mr-2" />
              Get Protected Now
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={handleVoiceDemo} // <-- Make the button functional
            >
              <Mic className="w-6 h-6 mr-2" />
              Try Voice Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
