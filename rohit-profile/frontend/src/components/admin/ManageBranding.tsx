import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, Upload, X } from 'lucide-react';
import { brandingService, BrandingData } from '@/services/brandingService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageBranding: React.FC = () => {
  const [brandingData, setBrandingData] = useState<BrandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadBrandingData();
  }, []);

  const loadBrandingData = async () => {
    try {
      const data = await brandingService.getBranding();
      setBrandingData(data);
      setLogoImage(data.logoImage || null);
      setFavicon(data.favicon || null);
      // Set browser tab title instantly
      if (data.browserTitle) {
        document.title = data.browserTitle;
      }
      // Set favicon instantly
      if (data.favicon) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = data.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
      } else {
        const link = document.querySelector("link[rel*='icon']");
        if (link) {
          link.parentNode?.removeChild(link);
        }
      }
    } catch (error) {
      console.error('Failed to load branding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
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
          if (type === 'logo') {
            setLogoImage(result.url);
          } else {
            setFavicon(result.url);
          }
          alert(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded! Click Save to apply changes.`);
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
    if (!brandingData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        siteName: formData.get('siteName') as string,
        logoText: formData.get('logoText') as string,
        
        logoImage: logoImage === null ? null : (logoImage || brandingData.logoImage),
        favicon: favicon === null ? null : (favicon || brandingData.favicon),
        browserTitle: formData.get('browserTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
      };
      
      const updated = await brandingService.updateBranding(updatedData);
      setBrandingData(updated);
      
      // Update document title immediately
      document.title = updated.browserTitle;
      
      // Update favicon if changed
      if (updated.favicon) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = updated.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
        } else {
          // Remove favicon if set to null
          const link = document.querySelector("link[rel*='icon']");
          if (link) {
            link.parentNode?.removeChild(link);
          }
      }
      
      alert('Site branding updated successfully!');
    } catch (error) {
      alert('Failed to update site branding');
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

  if (!brandingData) {
    return <div>Failed to load branding data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Site Branding</h1>
          <p className="text-muted-foreground">Manage your site logo, title, and branding</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Identity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  name="siteName" 
                  defaultValue={brandingData.siteName === 'Portfolio' ? '' : brandingData.siteName}
                  placeholder="Enter your site name"
                />
              </div>
              <div>
                <Label htmlFor="logoText">Logo Text</Label>
                <Input 
                  id="logoText" 
                  name="logoText" 
                  defaultValue={brandingData.logoText === 'Portfolio' ? '' : brandingData.logoText}
                  placeholder="Enter logo text (appears in navigation)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="browserTitle">Browser Title</Label>
              <Input 
                id="browserTitle" 
                name="browserTitle" 
                defaultValue={brandingData.browserTitle === 'Portfolio - Professional Website' ? '' : brandingData.browserTitle}
                placeholder="Enter browser tab title"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea 
                id="metaDescription" 
                name="metaDescription"
                defaultValue={brandingData.metaDescription === 'Professional portfolio website showcasing projects and services' ? '' : brandingData.metaDescription}
                placeholder="Enter site description for search engines"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Logo Image</Label>
                <div className="mt-2">
                  {logoImage || brandingData.logoImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={logoImage || brandingData.logoImage} 
                        alt="Logo" 
                        className="w-32 h-16 object-contain border-2 border-gray-200 rounded" 
                      />
                      <button
                        type="button"
                        onClick={() => setLogoImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-16 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                      {isUploading ? (
                        <>
                          <div className="text-xs font-medium text-primary">{uploadProgress}%</div>
                          <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-1 bg-primary rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label>Favicon (Browser Icon)</Label>
                <div className="mt-2">
                  {favicon || brandingData.favicon ? (
                    <div className="relative inline-block">
                      <img 
                        src={favicon || brandingData.favicon} 
                        alt="Favicon" 
                        className="w-16 h-16 object-contain border-2 border-gray-200 rounded" 
                      />
                      <button
                        type="button"
                        onClick={() => setFavicon(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                      {isUploading ? (
                        <>
                          <div className="text-xs font-medium text-primary">{uploadProgress}%</div>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Favicon</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'favicon')}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Branding'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageBranding;