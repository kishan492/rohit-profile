import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Save, Phone, MapPin } from 'lucide-react';
import { contactService, ContactData } from '@/services/contactService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageContact: React.FC = () => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      const data = await contactService.getContact();
      setContactData(data);
    } catch (error) {
      console.error('Failed to load contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        sectionTitle: formData.get('sectionTitle') as string,
        sectionDescription: formData.get('sectionDescription') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        whatsapp: formData.get('whatsapp') as string,
        location: formData.get('location') as string,
        weekdays: formData.get('weekdays') as string,
        saturday: formData.get('saturday') as string,
        sunday: formData.get('sunday') as string,
      };
      
      const updated = await contactService.updateContact(updatedData);
      setContactData(updated);
      alert('Contact section updated successfully!');
    } catch (error) {
      alert('Failed to update contact section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contactData) {
    return <div>Failed to load contact data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Contact Section</h1>
          <p className="text-muted-foreground">Edit contact information and form settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input 
                id="sectionTitle" 
                name="sectionTitle"
                defaultValue={contactData.sectionTitle === 'Get In Touch' ? '' : contactData.sectionTitle}
                placeholder="Enter section title (e.g., Get In Touch)" 
              />
            </div>

            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={contactData.sectionDescription === "Ready to start your project? Have a question? We'd love to hear from you. Let's create something amazing together." ? '' : contactData.sectionDescription}
                placeholder="Enter section description..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  defaultValue={contactData.email === 'hello@portfolio.com' ? '' : contactData.email}
                  placeholder="Enter your email address" 
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  defaultValue={contactData.phone === '+1 (555) 123-4567' ? '' : contactData.phone}
                  placeholder="Enter your phone number" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input 
                  id="whatsapp" 
                  name="whatsapp"
                  defaultValue={contactData.whatsapp === '+1 (555) 123-4567' ? '' : contactData.whatsapp}
                  placeholder="Enter your WhatsApp number" 
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location"
                  defaultValue={contactData.location === 'San Francisco, CA' ? '' : contactData.location}
                  placeholder="Enter your location (e.g., San Francisco, CA)" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weekdays">Monday - Friday</Label>
                <Input 
                  id="weekdays" 
                  name="weekdays"
                  defaultValue={contactData.weekdays === '8:00 AM - 6:00 PM' ? '' : contactData.weekdays}
                  placeholder="Enter weekday hours (e.g., 8:00 AM - 6:00 PM)" 
                />
              </div>
              <div>
                <Label htmlFor="saturday">Saturday</Label>
                <Input 
                  id="saturday" 
                  name="saturday"
                  defaultValue={contactData.saturday === '9:00 AM - 4:00 PM' ? '' : contactData.saturday}
                  placeholder="Enter Saturday hours (e.g., 9:00 AM - 4:00 PM)" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sunday">Sunday</Label>
              <Input 
                id="sunday" 
                name="sunday"
                defaultValue={contactData.sunday === 'Closed' ? '' : contactData.sunday}
                placeholder="Enter Sunday hours (e.g., Closed)" 
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageContact;