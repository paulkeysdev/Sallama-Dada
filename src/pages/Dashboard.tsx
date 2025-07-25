import { useState, useEffect } from "react";
import { Shield, Phone, MapPin, Mic, Users, Settings, AlertTriangle, Plus, Edit, Trash2, MicIcon, LogOut, Image as ImageIcon, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VoiceRecognition from "@/components/emergency/VoiceRecognition";
import EmergencyContacts from "@/components/emergency/EmergencyContacts";
import SafeMap from "@/components/emergency/SafeMap";
import EmergencyAlert from "@/components/emergency/EmergencyAlert";
import { useNavigate } from "react-router-dom";

// Add Swahili translations for dashboard text
const translations = {
  en: {
    dashboard: "Dashboard",
    quickStats: "Quick Stats",
    emergencyContacts: "Emergency Contacts",
    nearbySafePlaces: "Nearby Safe Places",
    voiceRecognition: "Voice Recognition",
    active: "Active",
    inactive: "Inactive",
    overview: "Overview",
    contacts: "Emergency Contacts",
    map: "Safe Locations",
    voice: "Voice Settings",
    settings: "Settings",
    welcome: "Welcome to Your Safety Dashboard",
    welcomeDesc: 'Your voice-activated emergency system is ready. Say "help", "emergency", or "nisaidieni" to activate.',
    testVoice: "Test Voice Recognition",
    viewTutorial: "View Tutorial",
    voiceStatus: "Voice Recognition Status",
    nearbyLocations: "Nearby Safe Locations",
    policeStations: "🚓 Police Stations",
    hospitals: "🏥 Hospitals",
    safeSpaces: "🛡️ Safe Spaces",
    viewFullMap: "View Full Map",
    voiceSettings: "Voice Recognition Settings",
    voiceSettingsDesc: "Configure your voice triggers and test the recognition system.",
    accountSettings: "Account Settings",
    languagePreferences: "Language Preferences",
    english: "English",
    kiswahili: "Kiswahili",
    privacySettings: "Privacy Settings",
    privacyDesc: "Your location and emergency contacts are only shared during active emergencies.",
    addPhoto: "Add Photo",
    changePassword: "Change Password",
    logout: "Logout",
    uploadPhoto: "Upload Photo",
    save: "Save",
    cancel: "Cancel",
    newPassword: "New Password",
    confirmPassword: "Confirm Password"
  },
  sw: {
    dashboard: "Dashibodi",
    quickStats: "Takwimu za Haraka",
    emergencyContacts: "Wasiliana na Dharura",
    nearbySafePlaces: "Maeneo Salama Karibu",
    voiceRecognition: "Utambuzi wa Sauti",
    active: "Inafanya kazi",
    inactive: "Haifanyi kazi",
    overview: "Muhtasari",
    contacts: "Wasiliana na Dharura",
    map: "Maeneo Salama",
    voice: "Mipangilio ya Sauti",
    settings: "Mipangilio",
    welcome: "Karibu kwenye Dashibodi Yako ya Usalama",
    welcomeDesc: 'Mfumo wako wa dharura unaotumia sauti uko tayari. Sema "msaada", "dharura", au "nisaidieni" kuamsha.',
    testVoice: "Jaribu Utambuzi wa Sauti",
    viewTutorial: "Tazama Mafunzo",
    voiceStatus: "Hali ya Utambuzi wa Sauti",
    nearbyLocations: "Maeneo Salama Karibu",
    policeStations: "🚓 Vituo vya Polisi",
    hospitals: "🏥 Hospitali",
    safeSpaces: "🛡️ Maeneo Salama",
    viewFullMap: "Tazama Ramani Kamili",
    voiceSettings: "Mipangilio ya Utambuzi wa Sauti",
    voiceSettingsDesc: "Sanidi vichocheo vya sauti yako na ujaribu mfumo wa utambuzi.",
    accountSettings: "Mipangilio ya Akaunti",
    languagePreferences: "Mapendeleo ya Lugha",
    english: "Kiingereza",
    kiswahili: "Kiswahili",
    privacySettings: "Mipangilio ya Faragha",
    privacyDesc: "Eneo lako na mawasiliano ya dharura hushirikiwa tu wakati wa dharura.",
    addPhoto: "Ongeza Picha",
    changePassword: "Badilisha Nenosiri",
    logout: "Toka",
    uploadPhoto: "Pakia Picha",
    save: "Hifadhi",
    cancel: "Ghairi",
    newPassword: "Nenosiri Jipya",
    confirmPassword: "Thibitisha Nenosiri"
  }
};

const Dashboard = () => {
  const [isListening, setIsListening] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Add this line

  const t = translations[language];

  const emergencyStats = {
    contactsCount: 3,
    nearbyPlaces: 12,
    voiceEnabled: true,
    lastActivity: "2 days ago"
  };

  const tabs = [
    { id: "overview", label: t.overview, icon: Shield },
    { id: "contacts", label: t.contacts, icon: Phone },
    { id: "map", label: t.map, icon: MapPin },
    { id: "voice", label: t.voice, icon: Mic },
    { id: "settings", label: t.settings, icon: Settings }
  ];

  // Handlers for modals
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePasswordChange = () => {
    // Add your password change logic here
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    alert(language === "en" ? "Password changed!" : "Nenosiri limebadilishwa!");
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    localStorage.removeItem("authToken"); // Example: remove auth token
    // Optionally clear more user data if needed

    // Redirect to landing page
    navigate("/", { replace: true }); // <-- Change "/login" to "/"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Salama Dada
                </h1>
                <p className="text-sm text-muted-foreground">{t.welcomeDesc}</p>
              </div>
            </div>
            {/* Emergency Button */}
            <Button
              variant="emergency"
              size="emergency"
              className="pulse-on-active"
              onClick={() => setEmergencyActive(true)}
            >
              <AlertTriangle className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.dashboard}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">{t.quickStats}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.emergencyContacts}</span>
                  <Badge variant="secondary">{emergencyStats.contactsCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.nearbySafePlaces}</span>
                  <Badge variant="secondary">{emergencyStats.nearbyPlaces}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.voiceRecognition}</span>
                  <Badge variant={emergencyStats.voiceEnabled ? "default" : "destructive"}>
                    {emergencyStats.voiceEnabled ? t.active : t.inactive}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <Card className="bg-gradient-hero text-white">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{t.welcome}</h2>
                    <p className="text-white/90 mb-4">
                      {t.welcomeDesc}
                    </p>
                    <div className="flex gap-4">
                      <Button variant="safe" onClick={() => setActiveTab("voice")}>
                        <MicIcon className="w-4 h-4 mr-2" />
                        {t.testVoice}
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => window.open("https://www.youtube.com/watch?v=r0nphXRP50c", "_blank")}
                      >
                        {t.viewTutorial}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mic className="w-5 h-5" />
                        {t.voiceStatus}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <VoiceRecognition 
                        isListening={isListening}
                        onListeningChange={setIsListening}
                        onEmergencyTrigger={() => setEmergencyActive(true)}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {t.nearbyLocations}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.policeStations}</span>
                          <Badge>3 {language === "en" ? "nearby" : "karibu"}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.hospitals}</span>
                          <Badge>5 {language === "en" ? "nearby" : "karibu"}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{t.safeSpaces}</span>
                          <Badge>4 {language === "en" ? "nearby" : "karibu"}</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setActiveTab("map")}>
                          {t.viewFullMap}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "contacts" && <EmergencyContacts />}
            {activeTab === "map" && <SafeMap />}
            
            {activeTab === "voice" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.voiceSettings}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t.voiceSettingsDesc}
                  </p>
                </CardHeader>
                <CardContent>
                  <VoiceRecognition 
                    isListening={isListening}
                    onListeningChange={setIsListening}
                    onEmergencyTrigger={() => setEmergencyActive(true)}
                    showSettings
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.accountSettings}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Language Preferences */}
                    <div>
                      <h3 className="font-medium mb-2">{t.languagePreferences}</h3>
                      <div className="space-y-2">
                        <Button
                          variant={language === "en" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setLanguage("en")}
                        >
                          {t.english}
                        </Button>
                        <Button
                          variant={language === "sw" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setLanguage("sw")}
                        >
                          {t.kiswahili}
                        </Button>
                      </div>
                    </div>
                    {/* Photo Upload */}
                    <div>
                      <h3 className="font-medium mb-2">{t.addPhoto}</h3>
                      <div className="flex items-center gap-4">
                        {photo ? (
                          <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <Button variant="outline" onClick={() => setShowPhotoModal(true)}>
                          {t.uploadPhoto}
                        </Button>
                      </div>
                    </div>
                    {/* Change Password */}
                    <div>
                      <h3 className="font-medium mb-2">{t.changePassword}</h3>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setShowPasswordModal(true)}>
                        <KeyRound className="w-4 h-4 mr-2" />
                        {t.changePassword}
                      </Button>
                    </div>
                    {/* Logout */}
                    <div>
                      <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        {t.logout}
                      </Button>
                    </div>
                    {/* Privacy */}
                    <div>
                      <h3 className="font-medium mb-2">{t.privacySettings}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.privacyDesc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">{t.uploadPhoto}</h2>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setShowPhotoModal(false)}>{t.cancel}</Button>
              <Button onClick={() => setShowPhotoModal(false)}>{t.save}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">{t.changePassword}</h2>
            <input
              type="password"
              placeholder={t.newPassword}
              className="border rounded px-3 py-2 w-full mb-2"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t.confirmPassword}
              className="border rounded px-3 py-2 w-full mb-4"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={() => setShowPasswordModal(false)}>{t.cancel}</Button>
              <Button
                onClick={handlePasswordChange}
                disabled={!newPassword || newPassword !== confirmPassword}
              >
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Alert Modal */}
      {emergencyActive && (
        <EmergencyAlert 
          isActive={emergencyActive}
          onDeactivate={() => setEmergencyActive(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
