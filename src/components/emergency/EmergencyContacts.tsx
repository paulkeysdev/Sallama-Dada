import { useState, useEffect } from "react";
import { Phone, Mail, Plus, Edit, Trash2, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: ""
  });

  // Auto-open add form if no contacts
  useEffect(() => {
    if (contacts.length === 0) setIsAdding(true);
  }, [contacts.length]);

  // Optional: Persist contacts in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emergencyContacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing contact
      setContacts(contacts.map(contact => 
        contact.id === editingId 
          ? { ...contact, ...formData }
          : contact
      ));
      setEditingId(null);
    } else {
      // Add new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData
      };
      setContacts([...contacts, newContact]);
    }
    
    setFormData({ name: "", phone: "", email: "", relationship: "" });
    setIsAdding(false);
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      relationship: contact.relationship
    });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const sendTestAlert = (contact: Contact) => {
    // This would integrate with SMS/Email service
    console.log("Sending test alert to:", contact);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Emergency Contacts</CardTitle>
              <p className="text-sm text-muted-foreground">
                These contacts will be notified during emergencies
              </p>
            </div>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add/Edit Form */}
          {isAdding && (
            <Card className="mb-6 border-primary/20">
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        value={formData.relationship}
                        onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                        placeholder="e.g., Sister, Friend, Doctor"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" variant="default">
                      {editingId ? "Update Contact" : "Add Contact"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAdding(false);
                        setEditingId(null);
                        setFormData({ name: "", phone: "", email: "", relationship: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Contacts List */}
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No emergency contacts added yet.</p>
                <p className="text-sm">Add contacts who should be notified during emergencies.</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <Card key={contact.id} className="transition-all hover:shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {contact.relationship}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </div>
                            {contact.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendTestAlert(contact)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(contact)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contact.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Protocol Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">📱 How Emergency Alerts Work</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• SMS alerts sent immediately to all contacts</p>
            <p>• Email notifications include your location and timestamp</p>
            <p>• Contacts receive: "EMERGENCY: [Your Name] needs help at [Location] - [Time]"</p>
            <p>• Use "Test" button to verify contact information</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyContacts;