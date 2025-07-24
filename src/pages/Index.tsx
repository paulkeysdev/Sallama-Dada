import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/landing/navbar";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="heading-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Salama Dada
            </span>
          </div>
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            <li>
              <a href="#home" className="hover:text-primary transition-colors">Home</a>
            </li>
            <li>
              <a href="#protection" className="hover:text-primary transition-colors">Protection</a>
            </li>
            <li>
              <a href="#emergency" className="hover:text-primary transition-colors">Emergency</a>
            </li>
          </ul>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => handleAuth("login")}>
              Login
            </Button>
            <Button variant="safe" onClick={() => handleAuth("signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Home Section */}
        <section id="home">
          <Hero onGetStarted={() => handleAuth("signup")} />
        </section>
        {/* Protection Section */}
        <section id="protection">
          <Features />
        </section>
        {/* Emergency Section */}
        <section id="emergency" className="section bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="card">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-accent">Emergency Response</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-accent mb-2">2</div>
              <div className="text-primary">Language Support</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-highlight mb-2">100%</div>
              <div className="text-accent">Privacy Protected</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-gradient-to-r from-primary via-accent to-highlight text-center">
          <h2 className="heading-xl text-black mb-6">
            Your Safety is Our Priority
          </h2>
          <p className="text-xl text-black/90 mb-8 max-w-2xl mx-auto">
            Join thousands of women who trust Sister in Safety for their emergency needs.
          </p>
          <Button
            variant="safe"
            size="xl"
            onClick={() => handleAuth("signup")}
            className="font-bold"
          >
            <Shield className="w-6 h-6 mr-2" />
            Start Your Safety Journey
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/80 py-8">
        <div className="container mx-auto px-4 text-center text-accent">
          <p>
            &copy; 2025 Sister in Safety. Empowering women through technology.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
