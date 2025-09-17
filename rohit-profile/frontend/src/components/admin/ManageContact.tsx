import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Save, Undo } from 'lucide-react';
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
  const [history, setHistory] = useState<ContactData[]>([]);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      const data = await contactService.getContact();
      setContactData({
        sectionTitle: data.sectionTitle || 'Get In Touch',
        sectionDescription: data.sectionDescription || "Ready to start your project? Have a question? We'd love to hear from you. Let's create something amazing together.",
        email: data.email || 'hello@portfolio.com',
        phone: data.phone || '+1 (555) 123-4567',
        whatsapp: data.whatsapp || '+1 (555) 123-4567',
        location: data.location || 'San Francisco, CA',
        weekdays: data.weekdays || '8:00 AM - 6:00 PM',
        saturday: data.saturday || '9:00 AM - 4:00 PM',
        sunday: data.sunday || 'Closed',
        isVisible: data.isVisible ?? true
      });
    } catch (error) {
      console.error('Failed to load contact data:', error);
      setContactData({
        sectionTitle: 'Get In Touch',
        sectionDescription: "Ready to start your project? Have a question? We'd love to hear from you. Let's create something amazing together.",
        email: 'hello@portfolio.com',
        phone: '+1 (555) 123-4567',
        whatsapp: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        weekdays: '8:00 AM - 6:00 PM',
        saturday: '9:00 AM - 4:00 PM',
        sunday: 'Closed',
        isVisible: true
      });
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
        sectionTitle: formData.get('sectionTitle') as string || contactData.sectionTitle,
        sectionDescription: formData.get('sectionDescription') as string || contactData.sectionDescription,
        email: formData.get('email') as string || contactData.email,
        phone: formData.get('phone') as string || contactData.phone,
        whatsapp: formData.get('whatsapp') as string || contactData.whatsapp,
        location: formData.get('location') as string || contactData.location,
        weekdays: formData.get('weekdays') as string || contactData.weekdays,
        saturday: formData.get('saturday') as string || contactData.saturday,
        sunday: formData.get('sunday') as string || contactData.sunday,
      };
      
      if (contactData) {
        setHistory(prev => [contactData, ...prev.slice(0, 4)]);
      }
      
      const updated = await contactService.updateContact(updatedData);
      setContactData(updated);
      
      window.dispatchEvent(new CustomEvent('contactDataUpdated'));
      
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async () => {
    if (history.length === 0) return;
    if (!confirm('Rollback to previous version?')) return;
    
    try {
      const previousVersion = history[0];
      const updated = await contactService.updateContact(previousVersion);
      setContactData(updated);
      setHistory(prev => prev.slice(1));
      window.dispatchEvent(new CustomEvent('contactDataUpdated'));
    } catch (error) {
      console.error('Rollback error:', error);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div><div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" /><div className="h-4 w-48 bg-gray-200 rounded animate-pulse" /></div>
        </div>
        <Card><CardHeader><div className="h-6 w-48 bg-gray-200 rounded animate-pulse" /></CardHeader><CardContent className="space-y-6"><div className="h-10 bg-gray-200 rounded animate-pulse" /></CardContent></Card>
      </motion.div>
    );
  }

  if (!contactData) return <div>Failed to load contact data</div>;

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
                defaultValue={contactData.sectionTitle}
                placeholder="Enter section title" 
              />
            </div>

            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={contactData.sectionDescription}
                placeholder="Enter section description..."
                rows={3}
              />
            </div>

      <Card>
        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                defaultValue={contactData.email}
                placeholder="Enter your email address" 
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                defaultValue={contactData.phone}
                placeholder="Enter your phone number" 
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input 
                id="whatsapp" 
                name="whatsapp"
                defaultValue={contactData.whatsapp}
                placeholder="Enter your WhatsApp number" 
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location"
                defaultValue={contactData.location}
                placeholder="Enter your location" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Business Hours</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weekdays">Monday - Friday</Label>
              <Input 
                id="weekdays" 
                name="weekdays"
                defaultValue={contactData.weekdays}
                placeholder="Enter weekday hours" 
              />
            </div>
            <div>
              <Label htmlFor="saturday">Saturday</Label>
              <Input 
                id="saturday" 
                name="saturday"
                defaultValue={contactData.saturday}
                placeholder="Enter Saturday hours" 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="sunday">Sunday</Label>
            <Input 
              id="sunday" 
              name="sunday"
              defaultValue={contactData.sunday}
              placeholder="Enter Sunday hours" 
            />
          </div>
        </CardContent>
      </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="flex-1 md:flex-none">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleRollback} disabled={history.length === 0}>
                <Undo className="mr-2 h-4 w-4" />
                Rollback ({history.length})
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageContact;