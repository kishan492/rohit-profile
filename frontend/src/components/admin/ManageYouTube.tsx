import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Plus, Upload, X, Edit, Trash2 } from 'lucide-react';
import { youtubeService, YoutubeData, Video } from '@/services/youtubeService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const VideoCard: React.FC<{ video: Video; index: number; onUpdate: (index: number, video: Video) => void; onDelete: (index: number) => void }> = ({ video, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVideo, setEditedVideo] = useState<Video>(video);
  const [thumbnail, setThumbnail] = useState<string | null>(video.thumbnail || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setThumbnail(result.url);
          setEditedVideo({...editedVideo, thumbnail: result.url});
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

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Video {index + 1}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Video Title</Label>
              <Input 
                value={editedVideo.title}
                onChange={(e) => setEditedVideo({...editedVideo, title: e.target.value})}
                placeholder="Enter video title" 
              />
            </div>
            <div>
              <Label>Video ID</Label>
              <Input 
                value={editedVideo.videoId}
                onChange={(e) => setEditedVideo({...editedVideo, videoId: e.target.value})}
                placeholder="YouTube video ID" 
              />
            </div>
          </div>
      
      <div>
        <Label>Thumbnail Image</Label>
        <div className="mt-2">
          {thumbnail ? (
            <div className="relative inline-block">
              <img src={thumbnail} alt="Thumbnail" className="w-32 h-20 object-cover rounded-lg" />
              <button
                onClick={() => setThumbnail(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Upload</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleThumbnailUpload}
              />
            </label>
          )}
        </div>
      </div>

          <div>
            <Label>Description</Label>
            <Textarea 
              value={editedVideo.description}
              onChange={(e) => setEditedVideo({...editedVideo, description: e.target.value})}
              placeholder="Enter video description..."
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => {
              onUpdate(index, editedVideo);
              setIsEditing(false);
            }}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => {
              setEditedVideo(video);
              setThumbnail(video.thumbnail || null);
              setIsEditing(false);
            }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p><strong>Title:</strong> {video.title || 'Not set'}</p>
          <p><strong>Video ID:</strong> {video.videoId || 'Not set'}</p>
          <p><strong>Views:</strong> {video.views || '0'}</p>
        </div>
      )}
    </div>
  );
};

const ManageYouTube: React.FC = () => {
  const [youtubeData, setYoutubeData] = useState<YoutubeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadYoutubeData();
  }, []);

  const loadYoutubeData = async () => {
    try {
      const data = await youtubeService.getYoutube();
      setYoutubeData(data);
    } catch (error) {
      console.error('Failed to load youtube data:', error);
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
        sectionTitle: formData.get('sectionTitle') as string,
        sectionDescription: formData.get('sectionDescription') as string,
        channelName: formData.get('channelName') as string,
        channelUrl: formData.get('channelUrl') as string,
        subscriberCount: formData.get('subscriberCount') as string,
        totalViews: formData.get('totalViews') as string,
        videos: youtubeData.videos,
      };
      
      const updated = await youtubeService.updateYoutube(updatedData);
      setYoutubeData(updated);
      alert('YouTube section updated successfully!');
    } catch (error) {
      alert('Failed to update YouTube section');
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
      publishedAt: ''
    };
    setYoutubeData({
      ...youtubeData,
      videos: [...youtubeData.videos, newVideo]
    });
  };

  const updateVideo = (index: number, video: Video) => {
    if (!youtubeData) return;
    const updatedVideos = [...youtubeData.videos];
    updatedVideos[index] = video;
    setYoutubeData({
      ...youtubeData,
      videos: updatedVideos
    });
  };

  const deleteVideo = (index: number) => {
    if (!youtubeData) return;
    const updatedVideos = youtubeData.videos.filter((_, i) => i !== index);
    setYoutubeData({
      ...youtubeData,
      videos: updatedVideos
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
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
                defaultValue={youtubeData.sectionTitle === 'Latest YouTube Videos' ? '' : youtubeData.sectionTitle}
                placeholder="Enter section title (e.g., Latest YouTube Videos)" 
              />
            </div>

            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={youtubeData.sectionDescription === 'Check out our latest content covering tech tutorials, industry insights, and behind-the-scenes content.' ? '' : youtubeData.sectionDescription}
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
                  defaultValue={youtubeData.channelName === 'My Channel' ? '' : youtubeData.channelName}
                  placeholder="Enter your channel name" 
                />
              </div>
              <div>
                <Label htmlFor="channelUrl">Channel URL</Label>
                <Input 
                  id="channelUrl" 
                  name="channelUrl"
                  defaultValue={youtubeData.channelUrl === 'https://youtube.com/@mychannel' ? '' : youtubeData.channelUrl}
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
                  defaultValue={youtubeData.subscriberCount === '100K+' ? '' : youtubeData.subscriberCount}
                  placeholder="e.g., 100K+" 
                />
              </div>
              <div>
                <Label htmlFor="totalViews">Total Views</Label>
                <Input 
                  id="totalViews" 
                  name="totalViews"
                  defaultValue={youtubeData.totalViews === '1M+' ? '' : youtubeData.totalViews}
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

export default ManageYouTube;