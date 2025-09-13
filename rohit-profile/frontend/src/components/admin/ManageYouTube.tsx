import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Plus, Upload, X, Edit, Trash2, Undo } from 'lucide-react';
import { youtubeService, YoutubeData, Video } from '@/services/youtubeService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const VideoCard: React.FC<{ video: Video; index: number; onUpdate: (index: number, video: Video) => void; onDelete: (index: number) => void }> = ({ video, index, onUpdate, onDelete }) => {
  const [editedVideo, setEditedVideo] = useState<Video>(video);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    setEditedVideo(video);
  }, [video]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = { ...editedVideo, thumbnail: dataUrl };
      setEditedVideo(updated);
      onUpdate(index, updated);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Video {index + 1}: {video.title}</h4>
        <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Video Title</Label>
            <Input 
              value={editedVideo.title}
              onChange={(e) => {
                const updated = {...editedVideo, title: e.target.value};
                setEditedVideo(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter video title" 
            />
          </div>
          <div>
            <Label>Video ID</Label>
            <Input 
              value={editedVideo.videoId}
              onChange={(e) => {
                const updated = {...editedVideo, videoId: e.target.value};
                setEditedVideo(updated);
                onUpdate(index, updated);
              }}
              placeholder="YouTube video ID" 
            />
          </div>
        </div>
        
        <div>
          <Label>Description</Label>
          <Textarea 
            value={editedVideo.description}
            onChange={(e) => {
              const updated = {...editedVideo, description: e.target.value};
              setEditedVideo(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter video description..."
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Duration</Label>
            <Input 
              value={editedVideo.duration || ''}
              onChange={(e) => {
                const updated = {...editedVideo, duration: e.target.value};
                setEditedVideo(updated);
                onUpdate(index, updated);
              }}
              placeholder="e.g., 12:34" 
            />
          </div>
          <div>
            <Label>Views Count</Label>
            <Input 
              value={editedVideo.views}
              onChange={(e) => {
                const updated = {...editedVideo, views: e.target.value};
                setEditedVideo(updated);
                onUpdate(index, updated);
              }}
              placeholder="e.g., 1.2M" 
            />
          </div>
          <div>
            <Label>Published Date</Label>
            <Input 
              value={editedVideo.publishedAt}
              onChange={(e) => {
                const updated = {...editedVideo, publishedAt: e.target.value};
                setEditedVideo(updated);
                onUpdate(index, updated);
              }}
              placeholder="e.g., December 15, 2023" 
            />
          </div>
        </div>

        <div>
          <Label>Thumbnail Image</Label>
          <div className="space-y-2">
            {editedVideo.thumbnail && (
              <img src={editedVideo.thumbnail} alt="Thumbnail" className="w-32 h-20 object-cover rounded" />
            )}
            <div className="flex gap-2">
              <Input 
                value={editedVideo.thumbnail}
                onChange={(e) => {
                  const updated = {...editedVideo, thumbnail: e.target.value};
                  setEditedVideo(updated);
                  onUpdate(index, updated);
                }}
                placeholder="Enter thumbnail URL or upload image" 
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button type="button" variant="outline" disabled={uploading}>
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageYouTube: React.FC = () => {
  const [youtubeData, setYoutubeData] = useState<YoutubeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<YoutubeData[]>([]);

  useEffect(() => {
    loadYoutubeData();
  }, []);

  const defaultVideos = [
    {
      title: 'Building a Modern React Portfolio',
      description: 'Learn how to create a stunning portfolio website using React and modern design principles.',
      videoId: 'dQw4w9WgXcQ',
      views: '45K',
      publishedAt: 'December 15, 2023',
      duration: '15:42',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop'
    },
    {
      title: 'Real Estate Investment Strategies',
      description: 'Essential strategies for successful real estate investing in today\'s market.',
      videoId: 'dQw4w9WgXcQ',
      views: '32K',
      publishedAt: 'December 10, 2023',
      duration: '22:18',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop'
    },
    {
      title: 'Full Stack Development Guide',
      description: 'Complete guide to becoming a full-stack developer with practical examples.',
      videoId: 'dQw4w9WgXcQ',
      views: '67K',
      publishedAt: 'December 5, 2023',
      duration: '28:55',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop'
    }
  ];

  const loadYoutubeData = async () => {
    const savedVideos = localStorage.getItem('youtubeVideos');
    const videos = savedVideos ? JSON.parse(savedVideos) : defaultVideos;
    
    try {
      const data = await youtubeService.getYoutube();
      setYoutubeData({
        sectionTitle: data.sectionTitle || 'YouTube Channel',
        sectionDescription: data.sectionDescription || 'Educational content, tutorials, and insights to help you grow in technology and business',
        channelName: data.channelName || 'My Channel',
        channelUrl: data.channelUrl || 'https://youtube.com/@mychannel',
        subscriberCount: data.subscriberCount || '125K+',
        totalViews: data.totalViews || '2.5M+',
        videos: videos
      });
    } catch (error) {
      console.error('Failed to load youtube data:', error);
      setYoutubeData({
        sectionTitle: 'YouTube Channel',
        sectionDescription: 'Educational content, tutorials, and insights to help you grow in technology and business',
        channelName: 'My Channel',
        channelUrl: 'https://youtube.com/@mychannel',
        subscriberCount: '125K+',
        totalViews: '2.5M+',
        videos: videos
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        sectionTitle: formData.get('sectionTitle') as string || youtubeData.sectionTitle,
        sectionDescription: formData.get('sectionDescription') as string || youtubeData.sectionDescription,
        channelName: formData.get('channelName') as string || youtubeData.channelName,
        channelUrl: formData.get('channelUrl') as string || youtubeData.channelUrl,
        subscriberCount: formData.get('subscriberCount') as string || youtubeData.subscriberCount,
        totalViews: formData.get('totalViews') as string || youtubeData.totalViews,
        videos: youtubeData.videos,
      };
      
      if (youtubeData) {
        setHistory(prev => [youtubeData, ...prev.slice(0, 4)]);
      }
      
      const updated = await youtubeService.updateYoutube(updatedData);
      setYoutubeData({
        ...updated,
        videos: youtubeData.videos
      });
      
      window.dispatchEvent(new CustomEvent('youtubeDataUpdated'));
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addVideo = () => {
    if (!youtubeData) return;
    const newVideo: Video = {
      title: '',
      description: '',
      videoId: '',
      views: '0',
      publishedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      duration: '0:00',
      thumbnail: ''
    };
    const updatedVideos = [...youtubeData.videos, newVideo];
    localStorage.setItem('youtubeVideos', JSON.stringify(updatedVideos));
    setYoutubeData({
      ...youtubeData,
      videos: updatedVideos
    });
  };

  const updateVideo = (index: number, video: Video) => {
    if (!youtubeData) return;
    const updatedVideos = [...youtubeData.videos];
    updatedVideos[index] = video;
    localStorage.setItem('youtubeVideos', JSON.stringify(updatedVideos));
    setYoutubeData({
      ...youtubeData,
      videos: updatedVideos
    });
  };

  const deleteVideo = (index: number) => {
    if (!youtubeData) return;
    const updatedVideos = youtubeData.videos.filter((_, i) => i !== index);
    localStorage.setItem('youtubeVideos', JSON.stringify(updatedVideos));
    setYoutubeData({
      ...youtubeData,
      videos: updatedVideos
    });
  };

  const handleRollback = async () => {
    if (history.length === 0) return;
    if (!confirm('Rollback to previous version?')) return;
    
    try {
      const previousVersion = history[0];
      const updated = await youtubeService.updateYoutube(previousVersion);
      setYoutubeData({
        ...updated,
        videos: defaultVideos
      });
      setHistory(prev => prev.slice(1));
      window.dispatchEvent(new CustomEvent('youtubeDataUpdated'));
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

  if (!youtubeData) {
    return <div>Failed to load YouTube data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Play className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage YouTube Section</h1>
          <p className="text-muted-foreground">Edit YouTube content and featured videos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input 
                id="sectionTitle" 
                name="sectionTitle"
                defaultValue={youtubeData.sectionTitle}
                placeholder="Enter section title" 
              />
            </div>

            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={youtubeData.sectionDescription}
                placeholder="Enter section description..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="channelName">Channel Name</Label>
                <Input 
                  id="channelName" 
                  name="channelName"
                  defaultValue={youtubeData.channelName}
                  placeholder="Enter your channel name" 
                />
              </div>
              <div>
                <Label htmlFor="channelUrl">Channel URL</Label>
                <Input 
                  id="channelUrl" 
                  name="channelUrl"
                  defaultValue={youtubeData.channelUrl}
                  placeholder="https://youtube.com/@yourchannel" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subscriberCount">Subscriber Count</Label>
                <Input 
                  id="subscriberCount" 
                  name="subscriberCount"
                  defaultValue={youtubeData.subscriberCount}
                  placeholder="e.g., 100K+" 
                />
              </div>
              <div>
                <Label htmlFor="totalViews">Total Views</Label>
                <Input 
                  id="totalViews" 
                  name="totalViews"
                  defaultValue={youtubeData.totalViews}
                  placeholder="e.g., 1M+" 
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Featured Videos</CardTitle>
                  <Button type="button" size="sm" onClick={addVideo}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Video
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {youtubeData.videos.map((video, index) => (
                  <VideoCard 
                    key={index} 
                    video={video} 
                    index={index}
                    onUpdate={updateVideo}
                    onDelete={deleteVideo}
                  />
                ))}
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

export default ManageYouTube;