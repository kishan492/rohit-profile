import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Upload, X, Undo } from 'lucide-react';
import { aboutService, AboutData } from '@/services/aboutService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageAbout: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutImage, setAboutImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState<AboutData[]>([]);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await aboutService.getAbout();
      setAboutData(data);
      setAboutImage(data.aboutImage || null);
      // Save to history when loading
      if (data) {
        setHistory(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 versions
      }
    } catch (error) {
      console.error('Failed to load about data:', error);
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
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          setAboutImage(result.url);
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
    if (!aboutData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        sectionTitle: formData.get('sectionTitle') as string,
        sectionSubtitle: formData.get('sectionSubtitle') as string,
        mainTitle: formData.get('mainTitle') as string,
        description1: formData.get('description1') as string,
        description2: formData.get('description2') as string,
        aboutImage: aboutImage || aboutData.aboutImage,
        location: formData.get('location') as string,
        founded: formData.get('founded') as string,
        teamSize: formData.get('teamSize') as string,
        awards: formData.get('awards') as string,
        mission: formData.get('mission') as string,
        values: formData.get('values') as string,
      };
      
      // Save current state to history before updating
      if (aboutData) {
        setHistory(prev => [aboutData, ...prev.slice(0, 4)]);
      }
      
      const updated = await aboutService.updateAbout(updatedData);
      setAboutData(updated);
      
      // Trigger storage event to refresh public site
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'aboutDataUpdated',
        newValue: Date.now().toString()
      }));
      
      alert('About section updated successfully!');
    } catch (error) {
      alert('Failed to update about section');
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
      const updated = await aboutService.updateAbout(previousVersion);
      setAboutData(updated);
      setAboutImage(updated.aboutImage || null);
      setHistory(prev => prev.slice(1)); // Remove the version we just restored
      
      // Trigger storage event to refresh public site
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'aboutDataUpdated',
        newValue: Date.now().toString()
      }));
      
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
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!aboutData) {
    return <div>Failed to load about data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage About Section</h1>
          <p className="text-muted-foreground">Edit about section content and information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sectionTitle">Section Title</Label>
                <Input 
                  id="sectionTitle" 
                  name="sectionTitle"
                  defaultValue={aboutData.sectionTitle === 'About Our Story' ? '' : aboutData.sectionTitle}
                  placeholder="Enter section title (e.g., About Our Story)" 
                />
              </div>
              <div>
                <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
                <Input 
                  id="sectionSubtitle" 
                  name="sectionSubtitle"
                  defaultValue={aboutData.sectionSubtitle === 'Building digital experiences that bridge innovation and accessibility' ? '' : aboutData.sectionSubtitle}
                  placeholder="Enter section subtitle" 
                />
              </div>
            </div>

      <Card>
        <CardHeader>
          <CardTitle>About Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Section Image</Label>
            <div className="mt-2">
              {aboutImage || aboutData.aboutImage ? (
                <div className="relative inline-block">
                  <img 
                    src={aboutImage || aboutData.aboutImage} 
                    alt="About section" 
                    className="w-64 h-40 object-cover rounded-lg" 
                  />
                  <button
                    type="button"
                    onClick={() => setAboutImage('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  {isUploading ? (
                    <>
                      <div className="text-sm font-medium text-primary">{uploadProgress}%</div>
                      <div className="w-32 h-1 bg-gray-200 rounded-full mt-2">
                        <div 
                          className="h-1 bg-primary rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">Upload About Image</span>
                      <span className="text-xs text-gray-400">Recommended: 800x500px</span>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Main Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mainTitle">Main Title</Label>
              <Input 
                id="mainTitle" 
                name="mainTitle"
                defaultValue={aboutData.mainTitle === 'Crafting Digital Excellence Since 2019' ? '' : aboutData.mainTitle}
                placeholder="Enter main title (e.g., Crafting Digital Excellence Since 2019)" 
              />
            </div>
            <div>
              <Label htmlFor="description1">First Paragraph</Label>
              <Textarea 
                id="description1" 
                name="description1"
                defaultValue={aboutData.description1 === 'What started as a passion project has evolved into a comprehensive digital agency.' ? '' : aboutData.description1}
                placeholder="Enter your first paragraph about your story and mission..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="description2">Second Paragraph</Label>
              <Textarea 
                id="description2" 
                name="description2"
                defaultValue={aboutData.description2 === 'Our mission is to democratize access to high-quality digital solutions.' ? '' : aboutData.description2}
                placeholder="Enter your second paragraph about your goals and approach..."
                rows={4}
              />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Based in</Label>
                <Input 
                  id="location" 
                  name="location"
                  defaultValue={aboutData.location === 'San Francisco' ? '' : aboutData.location}
                  placeholder="Enter your location (e.g., San Francisco)" 
                />
              </div>
              <div>
                <Label htmlFor="founded">Founded</Label>
                <Input 
                  id="founded" 
                  name="founded"
                  defaultValue={aboutData.founded === '2019' ? '' : aboutData.founded}
                  placeholder="Enter founding year (e.g., 2019)" 
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input 
                  id="teamSize" 
                  name="teamSize"
                  defaultValue={aboutData.teamSize === '15+' ? '' : aboutData.teamSize}
                  placeholder="Enter team size (e.g., 15+)" 
                />
              </div>
              <div>
                <Label htmlFor="awards">Awards</Label>
                <Input 
                  id="awards" 
                  name="awards"
                  defaultValue={aboutData.awards === '8' ? '' : aboutData.awards}
                  placeholder="Enter number of awards (e.g., 8)" 
                />
              </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mission & Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mission">Our Mission</Label>
              <Textarea 
                id="mission" 
                name="mission"
                defaultValue={aboutData.mission === 'To empower businesses with cutting-edge digital solutions' ? '' : aboutData.mission}
                placeholder="Enter your company mission statement..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="values">Our Values (one per line)</Label>
              <Textarea 
                id="values" 
                name="values"
                defaultValue={aboutData.values === 'Innovation through collaboration\nQuality over quantity\nTransparency in every interaction' ? '' : aboutData.values}
                placeholder="Enter your company values, one per line...&#10;e.g., Innovation through collaboration&#10;Quality over quantity&#10;Transparency in every interaction"
                rows={4}
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

export default ManageAbout;