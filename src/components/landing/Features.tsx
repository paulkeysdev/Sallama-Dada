import { Shield, Mic, MapPin, Phone, Users, Globe, Lock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Activate emergency protocol with trigger words in English or Swahili. Your voice is your power.",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: MapPin,
      title: "Live Location Sharing",
      description: "Real-time location tracking with nearby police stations, hospitals, and verified safe spaces.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Emergency Contacts",
      description: "Instant alerts to your trusted contacts via SMS and email with your location and timestamp.",
      gradient: "from-cyan-500 to-green-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with verified safe spaces and community resources in your area.",
      gradient: "from-green-500 to-yellow-500"
    },
    {
      icon: Globe,
      title: "Bilingual Support",
      description: "Full support for English and Swahili languages for maximum accessibility.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "Your data is encrypted and secure. We only share what you authorize during emergencies.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            How Sister in Safety Protects You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Advanced technology meets human compassion to create a comprehensive safety network.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Emergency Protocol Section */}
        <div className="mt-20 bg-gradient-to-r from-emergency/10 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emergency/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-emergency" />
              <span className="text-emergency font-medium">Emergency Protocol</span>
            </div>
            <h3 className="text-3xl font-bold mb-6">How It Works in an Emergency</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
                <h4 className="font-semibold mb-2">Voice Trigger</h4>
                <p className="text-sm text-muted-foreground">Say "help", "emergency", or "nisaidieni"</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
                <h4 className="font-semibold mb-2">Location Shared</h4>
                <p className="text-sm text-muted-foreground">GPS coordinates sent automatically</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
                <h4 className="font-semibold mb-2">Contacts Alerted</h4>
                <p className="text-sm text-muted-foreground">SMS & email sent to emergency contacts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emergency rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">4</div>
                <h4 className="font-semibold mb-2">Help Arrives</h4>
                <p className="text-sm text-muted-foreground">Nearest safe spaces highlighted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;