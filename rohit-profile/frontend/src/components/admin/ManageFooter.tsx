import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, Undo } from 'lucide-react';
import { footerService, FooterData } from '@/services/footerService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageFooter: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<FooterData[]>([]);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const data = await footerService.getFooter();
      setFooterData({
        companyName: data.companyName || 'Portfolio',
        tagline: data.tagline || 'Building digital experiences that matter',
        description: data.description || 'Building digital experiences that bridge innovation and accessibility. Let\'s create something amazing together.',
        email: data.email || 'hello@portfolio.com',
        phone: data.phone || '+1 (555) 123-4567',
        address: data.address || 'San Francisco, CA',
        social: {
          linkedin: data.social?.linkedin || '#',
          twitter: data.social?.twitter || '#',
          instagram: data.social?.instagram || '#',
          facebook: data.social?.facebook || '#',
          youtube: data.social?.youtube || '#',
          github: data.social?.github || '#'
        },
        quickLinks: data.quickLinks || [
          { name: 'Home', url: '#home' },
          { name: 'About', url: '#about' },
          { name: 'Services', url: '#services' },
          { name: 'Contact', url: '#contact' }
        ],
        services: data.services || [],
        copyright: data.copyright || '© 2024 Portfolio. Made with ❤️ All rights reserved.'
      });
    } catch (error) {
      console.error('Failed to load footer data:', error);
      setFooterData({
        companyName: 'Portfolio',
        tagline: 'Building digital experiences that matter',
        description: 'Building digital experiences that bridge innovation and accessibility. Let\'s create something amazing together.',
        email: 'hello@portfolio.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#', youtube: '#', github: '#' },
        quickLinks: [{ name: 'Home', url: '#home' }, { name: 'About', url: '#about' }, { name: 'Services', url: '#services' }, { name: 'Contact', url: '#contact' }],
        services: [],
        copyright: '© 2024 Portfolio. Made with ❤️ All rights reserved.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        companyName: formData.get('companyName') as string || footerData.companyName,
        description: formData.get('description') as string || footerData.description,
        email: formData.get('email') as string || footerData.email,
        phone: formData.get('phone') as string || footerData.phone,
        address: formData.get('address') as string || footerData.address,
        social: {
          linkedin: formData.get('linkedin') as string || footerData.social.linkedin,
          twitter: formData.get('twitter') as string || footerData.social.twitter,
          instagram: formData.get('instagram') as string || footerData.social.instagram,
          facebook: formData.get('facebook') as string || footerData.social.facebook,
          youtube: formData.get('youtube') as string || footerData.social.youtube,
          github: formData.get('github') as string || footerData.social.github
        },
        copyright: formData.get('copyright') as string || footerData.copyright,
        quickLinks: footerData.quickLinks,
        services: footerData.services
      };
      
      if (footerData) {
        setHistory(prev => [footerData, ...prev.slice(0, 4)]);
      }
      
      const updated = await footerService.updateFooter(updatedData);
      setFooterData({
        ...updated,
        quickLinks: footerData.quickLinks,
        services: footerData.services
      });
      
      window.dispatchEvent(new CustomEvent('footerDataUpdated'));
      
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
      const updated = await footerService.updateFooter(previousVersion);
      setFooterData(updated);
      setHistory(prev => prev.slice(1));
      window.dispatchEvent(new CustomEvent('footerDataUpdated'));
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

  if (!footerData) return <div>Failed to load footer data</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-primary" />
        <div><h1 className="text-3xl font-bold">Manage Footer</h1><p className="text-muted-foreground">Edit footer content and social media links</p></div>
      </div>

      <Card>
        <CardHeader><CardTitle>Brand Section</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div><Label htmlFor="companyName">Brand Name</Label><Input id="companyName" name="companyName" defaultValue={footerData.companyName} placeholder="Enter brand name" /></div>
            <div><Label htmlFor="description">Brand Description</Label><Textarea id="description" name="description" defaultValue={footerData.description} placeholder="Enter description..." rows={3} /></div>

      <Card>
        <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="linkedin">LinkedIn URL</Label><Input id="linkedin" name="linkedin" defaultValue={footerData.social.linkedin} placeholder="LinkedIn URL" /></div>
            <div><Label htmlFor="twitter">Twitter/X URL</Label><Input id="twitter" name="twitter" defaultValue={footerData.social.twitter} placeholder="Twitter URL" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="instagram">Instagram URL</Label><Input id="instagram" name="instagram" defaultValue={footerData.social.instagram} placeholder="Instagram URL" /></div>
            <div><Label htmlFor="facebook">Facebook URL</Label><Input id="facebook" name="facebook" defaultValue={footerData.social.facebook} placeholder="Facebook URL" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="youtube">YouTube URL</Label><Input id="youtube" name="youtube" defaultValue={footerData.social.youtube} placeholder="YouTube URL" /></div>
            <div><Label htmlFor="github">GitHub URL</Label><Input id="github" name="github" defaultValue={footerData.social.github} placeholder="GitHub URL" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="email">Email Address</Label><Input id="email" name="email" defaultValue={footerData.email} placeholder="Email address" /></div>
            <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" defaultValue={footerData.phone} placeholder="Phone number" /></div>
          </div>
          <div><Label htmlFor="address">Address</Label><Input id="address" name="address" defaultValue={footerData.address} placeholder="Address" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Copyright</CardTitle></CardHeader>
        <CardContent>
          <div><Label htmlFor="copyright">Copyright Text</Label><Input id="copyright" name="copyright" defaultValue={footerData.copyright} placeholder="Copyright text" /></div>
        </CardContent>
      </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="flex-1 md:flex-none"><Save className="mr-2 h-4 w-4" />{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button type="button" variant="secondary" onClick={handleRollback} disabled={history.length === 0}><Undo className="mr-2 h-4 w-4" />Rollback ({history.length})</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageFooter;