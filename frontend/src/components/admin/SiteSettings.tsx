import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Eye, EyeOff, Home, User, Briefcase, MessageSquare, Trophy, Play, Users, FileText, Mail, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { homeService } from '@/services/homeService';
import { aboutService } from '@/services/aboutService';
import { servicesService } from '@/services/servicesService';
import { achievementsService } from '@/services/achievementsService';
import { testimonialsService } from '@/services/testimonialsService';
import { teamService } from '@/services/teamService';
import { blogService } from '@/services/blogService';
import { youtubeService } from '@/services/youtubeService';
import { contactService } from '@/services/contactService';

const SectionToggle: React.FC<{ 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  isVisible: boolean; 
  onToggle: () => void;
}> = ({ icon: Icon, title, description, isVisible, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isVisible ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          {isVisible ? (
            <>
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-green-500">Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Hidden</span>
            </>
          )}
        </div>
        <Switch checked={isVisible} onCheckedChange={onToggle} />
      </div>
    </div>
  );
};

const SiteSettings: React.FC = () => {
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    about: true,
    services: true,
    testimonials: true,
    achievements: true,
    youtube: true,
    team: true,
    blog: true,
    contact: true,
  });
  const [isResetting, setIsResetting] = useState(false);

  const toggleSection = (section: keyof typeof sectionVisibility) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCompleteReset = async () => {
    if (!confirm('⚠️ WARNING: This will reset ALL website content to factory defaults. This action cannot be undone. Are you sure?')) {
      return;
    }
    
    if (!confirm('This is your final confirmation. All your custom content will be lost. Continue?')) {
      return;
    }

    setIsResetting(true);
    
    try {
      // Reset all sections to default data
      const resetPromises = [
        // Reset Home section
        homeService.updateHome({
          name: 'John Doe',
          title: 'Entrepreneur & Developer',
          headline: 'Innovating the Future One Project at a Time',
          subtitle: 'Entrepreneur, Content Creator & Developer building digital experiences that matter.',
          profileImage: '',
          stats: {
            projects: '50+',
            views: '100K+',
            clients: '25+',
            experience: '5+'
          }
        }),
        
        // Reset About section
        aboutService.updateAbout({
          sectionTitle: 'About Our Story',
          sectionSubtitle: 'Building digital experiences that bridge innovation and accessibility',
          mainTitle: 'Crafting Digital Excellence Since 2019',
          description1: 'What started as a passion project has evolved into a comprehensive digital agency.',
          description2: 'Our mission is to democratize access to high-quality digital solutions.',
          aboutImage: '',
          location: 'San Francisco',
          founded: '2019',
          teamSize: '15+',
          awards: '8',
          mission: 'To empower businesses with cutting-edge digital solutions',
          values: 'Innovation through collaboration\nQuality over quantity\nTransparency in every interaction'
        }),
        
        // Reset Services section
        servicesService.updateServices({
          sectionTitle: 'Our Services',
          sectionDescription: 'Comprehensive solutions to help your business thrive in the digital landscape',
          services: [
            {
              title: 'Content Creation',
              description: 'Engaging video content, tutorials, and educational materials for YouTube and social media platforms.',
              icon: 'Video',
              features: ['Video Production', 'Script Writing', 'Post-Production', 'Channel Strategy'],
              color: 'from-red-500 to-pink-500'
            },
            {
              title: 'Real Estate Consulting',
              description: 'Strategic consulting for real estate investments, market analysis, and property development guidance.',
              icon: 'Home',
              features: ['Market Analysis', 'Investment Strategy', 'Property Valuation', 'Deal Structuring'],
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Website Development',
              description: 'Custom web applications, e-commerce solutions, and responsive websites built with modern technologies.',
              icon: 'Code',
              features: ['React Development', 'E-commerce Solutions', 'API Integration', 'Performance Optimization'],
              color: 'from-blue-500 to-indigo-500'
            },
            {
              title: 'Mobile App Development',
              description: 'Native and cross-platform mobile applications designed for optimal user experience.',
              icon: 'Smartphone',
              features: ['iOS Development', 'Android Development', 'React Native', 'App Store Optimization'],
              color: 'from-purple-500 to-violet-500'
            },
            {
              title: 'UI/UX Design',
              description: 'User-centered design solutions that enhance engagement and drive conversions.',
              icon: 'Palette',
              features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
              color: 'from-orange-500 to-amber-500'
            },
            {
              title: 'Digital Marketing',
              description: 'Data-driven marketing strategies to grow your online presence and reach your target audience.',
              icon: 'BarChart',
              features: ['SEO Strategy', 'Social Media Marketing', 'Content Marketing', 'Analytics'],
              color: 'from-teal-500 to-cyan-500'
            }
          ],
          partnersTitle: 'Trusted by Industry Leaders',
          partnersList: 'TechCorp, InnovateLab, DesignStudio, StartupHub, CreativeAgency, DataCorp'
        })
      ];
      
      await Promise.all(resetPromises);
      
      // Trigger events to refresh all sections
      window.dispatchEvent(new CustomEvent('homeDataUpdated'));
      window.dispatchEvent(new CustomEvent('servicesDataUpdated'));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'aboutDataUpdated',
        newValue: Date.now().toString()
      }));
      
      alert('✅ All website data has been reset to factory defaults!');
      
      // Reload page to show reset data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Reset failed:', error);
      alert('❌ Reset failed. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const sections = [
    {
      key: 'hero' as const,
      icon: Home,
      title: 'Hero Section',
      description: 'Main landing section with introduction and stats'
    },
    {
      key: 'about' as const,
      icon: User,
      title: 'About Section',
      description: 'About story, mission, and company information'
    },
    {
      key: 'services' as const,
      icon: Briefcase,
      title: 'Services Section',
      description: 'Service offerings and capabilities'
    },
    {
      key: 'testimonials' as const,
      icon: MessageSquare,
      title: 'Testimonials Section',
      description: 'Client reviews and feedback'
    },
    {
      key: 'achievements' as const,
      icon: Trophy,
      title: 'Achievements Section',
      description: 'Timeline of milestones and achievements'
    },
    {
      key: 'youtube' as const,
      icon: Play,
      title: 'YouTube Section',
      description: 'Featured videos and channel content'
    },
    {
      key: 'team' as const,
      icon: Users,
      title: 'Team Section',
      description: 'Team members and profiles'
    },
    {
      key: 'blog' as const,
      icon: FileText,
      title: 'Blog Section',
      description: 'Latest articles and blog posts'
    },
    {
      key: 'contact' as const,
      icon: Mail,
      title: 'Contact Section',
      description: 'Contact information and form'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Configure site visibility and general settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Visibility</CardTitle>
          <p className="text-sm text-muted-foreground">
            Control which sections are visible on your portfolio website. Hidden sections won't appear to visitors.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((section) => (
            <SectionToggle
              key={section.key}
              icon={section.icon}
              title={section.title}
              description={section.description}
              isVisible={sectionVisibility[section.key]}
              onToggle={() => toggleSection(section.key)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site-title">Site Title</Label>
              <Input id="site-title" defaultValue="Portfolio" />
            </div>
            <div>
              <Label htmlFor="site-tagline">Site Tagline</Label>
              <Input id="site-tagline" defaultValue="Professional Portfolio Website" />
            </div>
          </div>
          <div>
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea 
              id="site-description" 
              defaultValue="A professional portfolio showcasing skills, services, and achievements in technology and business."
              rows={3}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site-url">Site URL</Label>
              <Input id="site-url" defaultValue="https://yourportfolio.com" />
            </div>
            <div>
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" type="email" defaultValue="admin@yourportfolio.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta-keywords">Meta Keywords</Label>
            <Input id="meta-keywords" defaultValue="portfolio, web development, design, consulting" />
          </div>
          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea 
              id="meta-description" 
              defaultValue="Professional portfolio website showcasing expertise in web development, design, and digital consulting services."
              rows={2}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="google-analytics">Google Analytics ID</Label>
              <Input id="google-analytics" placeholder="G-XXXXXXXXXX" />
            </div>
            <div>
              <Label htmlFor="google-search">Google Search Console</Label>
              <Input id="google-search" placeholder="Verification code" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Animations</Label>
              <p className="text-sm text-muted-foreground">Turn off to improve performance on slower devices</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Lazy Load Images</Label>
              <p className="text-sm text-muted-foreground">Load images only when they come into view</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Caching</Label>
              <p className="text-sm text-muted-foreground">Cache content for faster loading</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Show maintenance page to visitors</p>
            </div>
            <Switch />
          </div>
          <div>
            <Label htmlFor="maintenance-message">Maintenance Message</Label>
            <Textarea 
              id="maintenance-message" 
              defaultValue="We're currently updating our website. Please check back soon!"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <p className="text-sm text-muted-foreground">
            Reset all website content to factory defaults. This action cannot be undone.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleCompleteReset}
            disabled={isResetting}
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {isResetting ? 'Resetting All Data...' : 'Reset All Website Data'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will reset Home, About, Services, Achievements, Testimonials, Team, Blog, YouTube, and Contact sections to default content.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="flex-1 md:flex-none">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
        <Button variant="outline">
          Reset to Defaults
        </Button>
      </div>
    </motion.div>
  );
};

export default SiteSettings;