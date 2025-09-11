import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Save, Plus, Edit, Trash2, Undo } from 'lucide-react';
import { servicesService, ServicesData, Service } from '@/services/servicesService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ServiceCard: React.FC<{ service: Service; index: number; onUpdate: (index: number, service: Service) => void; onDelete: (index: number) => void }> = ({ service, index, onUpdate, onDelete }) => {
  const [editedService, setEditedService] = useState<Service>(service);

  // Update local state when service prop changes
  React.useEffect(() => {
    setEditedService(service);
  }, [service]);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Service {index + 1}: {service.title}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Service Title</Label>
            <Input 
              value={editedService.title}
              onChange={(e) => {
                const updated = {...editedService, title: e.target.value};
                setEditedService(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter service title" 
            />
          </div>
          <div>
            <Label>Icon Name</Label>
            <Input 
              value={editedService.icon}
              onChange={(e) => {
                const updated = {...editedService, icon: e.target.value};
                setEditedService(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter icon name (e.g., Video, Home, Code)" 
            />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea 
            value={editedService.description}
            onChange={(e) => {
              const updated = {...editedService, description: e.target.value};
              setEditedService(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter service description..."
            rows={3}
          />
        </div>
        <div>
          <Label>Features (one per line)</Label>
          <Textarea 
            value={editedService.features.join('\n')}
            onChange={(e) => {
              const updated = {...editedService, features: e.target.value.split('\n').filter(f => f.trim())};
              setEditedService(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter service features, one per line..."
            rows={4}
          />
        </div>
        <div>
          <Label>Gradient Color</Label>
          <Input 
            value={editedService.color}
            onChange={(e) => {
              const updated = {...editedService, color: e.target.value};
              setEditedService(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter gradient color (e.g., from-blue-500 to-indigo-500)" 
          />
        </div>
      </div>
    </div>
  );
};

const ManageServices: React.FC = () => {
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<ServicesData[]>([]);

  useEffect(() => {
    loadServicesData();
  }, []);

  const defaultServices = [
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
  ];

  const loadServicesData = async () => {
    try {
      const data = await servicesService.getServices();
      setServicesData({
        sectionTitle: data.sectionTitle || 'Our Services',
        sectionDescription: data.sectionDescription || 'Comprehensive solutions to help your business thrive in the digital landscape',
        services: defaultServices, // Always use default services for now
        partnersTitle: data.partnersTitle || 'Trusted by Industry Leaders',
        partnersList: data.partnersList || 'TechCorp, InnovateLab, DesignStudio, StartupHub, CreativeAgency, DataCorp'
      });
    } catch (error) {
      console.error('Failed to load services data:', error);
      // On error, create default data structure
      setServicesData({
        sectionTitle: 'Our Services',
        sectionDescription: 'Comprehensive solutions to help your business thrive in the digital landscape',
        services: defaultServices,
        partnersTitle: 'Trusted by Industry Leaders',
        partnersList: 'TechCorp, InnovateLab, DesignStudio, StartupHub, CreativeAgency, DataCorp'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicesData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        sectionTitle: formData.get('sectionTitle') as string || servicesData.sectionTitle,
        sectionDescription: formData.get('sectionDescription') as string || servicesData.sectionDescription,
        services: servicesData.services,
        partnersTitle: formData.get('partnersTitle') as string || servicesData.partnersTitle,
        partnersList: formData.get('partnersList') as string || servicesData.partnersList,
      };
      
      // Save current state to history before updating
      if (servicesData) {
        setHistory(prev => [servicesData, ...prev.slice(0, 4)]);
      }
      
      const updated = await servicesService.updateServices(updatedData);
      setServicesData(updated);
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('servicesDataUpdated'));
      
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (!servicesData) return;
    const newService: Service = {
      title: '',
      description: '',
      icon: 'Code',
      features: [],
      color: 'from-blue-500 to-indigo-500'
    };
    setServicesData({
      ...servicesData,
      services: [...servicesData.services, newService]
    });
  };

  const updateService = (index: number, service: Service) => {
    if (!servicesData) return;
    const updatedServices = [...servicesData.services];
    updatedServices[index] = service;
    setServicesData({
      ...servicesData,
      services: updatedServices
    });
  };

  const deleteService = (index: number) => {
    if (!servicesData) return;
    const updatedServices = servicesData.services.filter((_, i) => i !== index);
    setServicesData({
      ...servicesData,
      services: updatedServices
    });
  };

  const handleRollback = async () => {
    if (history.length === 0) return;
    if (!confirm('Rollback to previous version?')) return;
    
    try {
      const previousVersion = history[0];
      const updated = await servicesService.updateServices(previousVersion);
      setServicesData({
        ...updated,
        services: defaultServices // Keep default services for editing
      });
      setHistory(prev => prev.slice(1));
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('servicesDataUpdated'));
      
    } catch (error) {
      console.error('Rollback error:', error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!servicesData) {
    return <div>Failed to load services data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <p className="text-muted-foreground">Edit services section and individual service offerings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input 
                id="sectionTitle" 
                name="sectionTitle"
                defaultValue={servicesData.sectionTitle}
                placeholder="Enter section title" 
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={servicesData.sectionDescription}
                placeholder="Enter section description..."
                rows={2}
              />
            </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Services List</CardTitle>
            <Button type="button" size="sm" onClick={addService}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {servicesData.services.map((service, index) => (
            <ServiceCard 
              key={index} 
              service={service} 
              index={index}
              onUpdate={updateService}
              onDelete={deleteService}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partners Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="partnersTitle">Partners Title</Label>
            <Input 
              id="partnersTitle" 
              name="partnersTitle"
              defaultValue={servicesData.partnersTitle}
              placeholder="Enter partners title" 
            />
          </div>
          <div>
            <Label htmlFor="partnersList">Partner Names (comma separated)</Label>
            <Input 
              id="partnersList" 
              name="partnersList"
              defaultValue={servicesData.partnersList}
              placeholder="Enter partner names separated by commas" 
            />
          </div>
        </CardContent>
      </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="flex-1 md:flex-none">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleRollback}
                disabled={history.length === 0}
              >
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

export default ManageServices;