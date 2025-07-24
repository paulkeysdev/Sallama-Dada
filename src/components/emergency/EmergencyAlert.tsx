import { useState, useEffect } from "react";
import { AlertTriangle, X, MapPin, Phone, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmergencyAlertProps {
  isActive: boolean;
  onDeactivate: () => void;
}

const EmergencyAlert = ({ isActive, onDeactivate }: EmergencyAlertProps) => {
  const [countdown, setCountdown] = useState(10);
  const [alertsSent, setAlertsSent] = useState({
    sms: false,
    email: false,
    location: false
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsConfirmed(true);
          // Simulate sending alerts
          setTimeout(() => setAlertsSent(prev => ({ ...prev, location: true })), 500);
          setTimeout(() => setAlertsSent(prev => ({ ...prev, sms: true })), 1000);
          setTimeout(() => setAlertsSent(prev => ({ ...prev, email: true })), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const cancelEmergency = () => {
    setCountdown(10);
    setAlertsSent({ sms: false, email: false, location: false });
    setIsConfirmed(false);
    onDeactivate();
  };

  const confirmEmergency = () => {
    setCountdown(0);
    setIsConfirmed(true);
    // Simulate sending alerts immediately
    setTimeout(() => setAlertsSent(prev => ({ ...prev, location: true })), 100);
    setTimeout(() => setAlertsSent(prev => ({ ...prev, sms: true })), 300);
    setTimeout(() => setAlertsSent(prev => ({ ...prev, email: true })), 500);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-emergency/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-emergency animate-pulse-emergency">
        <CardContent className="p-6">
          {!isConfirmed ? (
            // Countdown Phase
            <div className="text-center">
              <div className="w-20 h-20 bg-emergency rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-emergency mb-2">
                Emergency Alert Activated
              </h2>
              
              <div className="text-6xl font-bold text-emergency mb-4 animate-pulse">
                {countdown}
              </div>
              
              <p className="text-muted-foreground mb-6">
                Emergency alerts will be sent in {countdown} seconds
              </p>
              
              <Progress value={(10 - countdown) * 10} className="mb-6" />
              
              <div className="flex gap-3">
                <Button
                  variant="emergency"
                  onClick={confirmEmergency}
                  className="flex-1"
                >
                  Send Now
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEmergency}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Alert Sending Phase
            <div className="text-center">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-success mb-4">
                Emergency Alerts Sent
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location shared</span>
                  </div>
                  {alertsSent.location ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-muted rounded-full animate-spin" />
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">SMS alerts (3 contacts)</span>
                  </div>
                  {alertsSent.sms ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-muted rounded-full animate-spin" />
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Email notifications</span>
                  </div>
                  {alertsSent.email ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-muted rounded-full animate-spin" />
                  )}
                </div>
              </div>
              
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-success font-medium">
                  ✅ All emergency contacts have been notified
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your location and emergency details have been shared
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="default"
                  onClick={cancelEmergency}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('tel:911')}
                  className="flex-1"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          )}
          
          {/* False Alarm Note */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              💡 False alarm? Contact your emergency contacts to let them know you're safe.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyAlert;