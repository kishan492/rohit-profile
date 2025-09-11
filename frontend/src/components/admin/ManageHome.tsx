import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Save, Upload, X, Undo } from 'lucide-react';
import { homeService, HomeData } from '@/services/homeService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageHome: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState<HomeData[]>([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  useEffect(() => {
    if (homeData?.profileImage) {
      setProfileImage(homeData.profileImage);
    }
  }, [homeData]);

  const loadHomeData = async () => {
    try {
      const data = await homeService.getHome();
      setHomeData(data);
      // Save to history when loading
      if (data) {
        setHistory(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 versions
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          console.log('Upload result:', result);
          setProfileImage(result.url);
          alert('Image uploaded! Click Save to apply changes.');
        } else {
          alert('Failed to upload image');
        }
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        alert('Error uploading image');
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/image`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);
    } catch (error) {
      alert('Error uploading image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        name: formData.get('name') as string || homeData.name,
        title: formData.get('title') as string || homeData.title,
        headline: formData.get('headline') as string || homeData.headline,
        subtitle: formData.get('subtitle') as string || homeData.subtitle,
        profileImage: profileImage || homeData.profileImage || null,
        stats: {
          projects: formData.get('projects') as string || homeData.stats.projects,
          views: formData.get('views') as string || homeData.stats.views,
          clients: formData.get('clients') as string || homeData.stats.clients,
          experience: formData.get('experience') as string || homeData.stats.experience,
        }
      };
      
      console.log('Saving data:', updatedData);
      // Save current state to history before updating
      if (homeData) {
        setHistory(prev => [homeData, ...prev.slice(0, 4)]);
      }
      
      const updated = await homeService.updateHome(updatedData);
      console.log('Updated data:', updated);
      setHomeData(updated);
      
      // Trigger event to refresh public site
      console.log('Dispatching home data update event');
      window.dispatchEvent(new CustomEvent('homeDataUpdated'));
      
      alert('Home section updated successfully! Check the public website.');
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to update home section: ${error.message || error}`);
    } finally {
      setSaving(false);
    }
  };



  const handleRollback = async () => {
    if (history.length === 0) {
      alert('No previous version available');
      return;
    }
    
    if (!confirm('Rollback to previous version?')) return;
    
    try {
      const previousVersion = history[0];
      const updated = await homeService.updateHome(previousVersion);
      setHomeData(updated);
      setProfileImage(updated.profileImage || null);
      setHistory(prev => prev.slice(1)); // Remove the version we just restored
      
      // Trigger event to refresh public site
      console.log('Dispatching home data update event (rollback)');
      window.dispatchEvent(new CustomEvent('homeDataUpdated'));
      
      // Force form refresh by reloading component state
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      alert('Rolled back to previous version!');
    } catch (error) {
      alert('Failed to rollback');
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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!homeData) {
    return <div>Failed to load home data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Home className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Home Section</h1>
          <p className="text-muted-foreground">Edit hero section content and settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label>Profile Image</Label>
              <div className="mt-2">
                {profileImage || homeData.profileImage ? (
                  <div className="relative inline-block">
                    <img 
                      src={profileImage || homeData.profileImage} 
                      alt="Profile" 
                      className="w-32 h-32 object-cover rounded-full border-4 border-primary/20" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileImage('');
                        // Also update the database to remove image
                        homeService.updateHome({ profileImage: '' });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 relative">
                    {isUploading ? (
                      <>
                        <div className="text-sm font-medium text-primary">{uploadProgress}%</div>
                        <div className="w-16 h-1 bg-gray-200 rounded-full mt-2">
                          <div 
                            className="h-1 bg-primary rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500 mt-2">Upload Photo</span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={homeData.name === 'John Doe' ? '' : homeData.name}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={homeData.title === 'Entrepreneur & Developer' ? '' : homeData.title}
                  placeholder="Enter your professional title"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="headline">Main Headline</Label>
              <Input 
                id="headline" 
                name="headline" 
                defaultValue={homeData.headline === 'Innovating the Future One Project at a Time' ? '' : homeData.headline}
                placeholder="Enter your main headline"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea 
                id="subtitle" 
                name="subtitle"
                defaultValue={homeData.subtitle === 'Entrepreneur, Content Creator & Developer building digital experiences that matter.' ? '' : homeData.subtitle}
                placeholder="Enter your subtitle description"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="projects">Projects Completed</Label>
                <Input 
                  id="projects" 
                  name="projects" 
                  defaultValue={homeData.stats.projects === '50+' ? '' : homeData.stats.projects}
                  placeholder="e.g., 50+"
                />
              </div>
              <div>
                <Label htmlFor="views">YouTube Views</Label>
                <Input 
                  id="views" 
                  name="views" 
                  defaultValue={homeData.stats.views === '100K+' ? '' : homeData.stats.views}
                  placeholder="e.g., 100K+"
                />
              </div>
              <div>
                <Label htmlFor="clients">Happy Clients</Label>
                <Input 
                  id="clients" 
                  name="clients" 
                  defaultValue={homeData.stats.clients === '25+' ? '' : homeData.stats.clients}
                  placeholder="e.g., 25+"
                />
              </div>
              <div>
                <Label htmlFor="experience">Years Experience</Label>
                <Input 
                  id="experience" 
                  name="experience" 
                  defaultValue={homeData.stats.experience === '5+' ? '' : homeData.stats.experience}
                  placeholder="e.g., 5+"
                />
              </div>
            </div>


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

export default ManageHome;