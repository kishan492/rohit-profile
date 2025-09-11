import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, Plus, Edit, Trash2, Upload, X, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const BlogPostCard: React.FC<{ postNumber: number }> = ({ postNumber }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const posts = [
    { 
      title: 'The Future of Web Development: Trends to Watch in 2024',
      author: 'John Doe',
      category: 'Technology',
      readTime: '8 min read'
    },
    { 
      title: 'Real Estate Investment: A Beginner\'s Guide to Success',
      author: 'David Kim',
      category: 'Real Estate',
      readTime: '12 min read'
    },
    { 
      title: 'Building a Personal Brand Through Content Creation',
      author: 'Emily Rodriguez',
      category: 'Marketing',
      readTime: '6 min read'
    },
  ];

  const post = posts[postNumber - 1] || posts[0];

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnail(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Blog Post {postNumber}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor={`post-title-${postNumber}`}>Post Title</Label>
            <Input id={`post-title-${postNumber}`} defaultValue={post.title} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`post-author-${postNumber}`}>Author</Label>
              <Input id={`post-author-${postNumber}`} defaultValue={post.author} />
            </div>
            <div>
              <Label htmlFor={`post-category-${postNumber}`}>Category</Label>
              <Input id={`post-category-${postNumber}`} defaultValue={post.category} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`post-date-${postNumber}`}>Publish Date</Label>
              <Input id={`post-date-${postNumber}`} type="date" />
            </div>
            <div>
              <Label htmlFor={`post-readtime-${postNumber}`}>Read Time</Label>
              <Input id={`post-readtime-${postNumber}`} defaultValue={post.readTime} />
            </div>
          </div>

          <div>
            <Label>Featured Image</Label>
            <div className="mt-2">
              {thumbnail ? (
                <div className="relative inline-block">
                  <img src={thumbnail} alt="Thumbnail" className="w-40 h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => setThumbnail(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-40 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload Image</span>
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
            <Label htmlFor={`post-excerpt-${postNumber}`}>Excerpt</Label>
            <Textarea 
              id={`post-excerpt-${postNumber}`} 
              defaultValue="Explore the latest trends shaping the web development landscape, from AI integration to serverless architecture and beyond."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor={`post-tags-${postNumber}`}>Tags (comma separated)</Label>
            <Input id={`post-tags-${postNumber}`} defaultValue="React, AI, Trends" />
          </div>

          <div>
            <Label htmlFor={`post-content-${postNumber}`}>Full Content</Label>
            <Textarea 
              id={`post-content-${postNumber}`} 
              defaultValue="Write your full blog post content here..."
              rows={8}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Published</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p><strong>Title:</strong> {post.title}</p>
          <p><strong>Author:</strong> {post.author}</p>
          <p><strong>Category:</strong> {post.category}</p>
          <p><strong>Read Time:</strong> {post.readTime}</p>
        </div>
      )}
    </div>
  );
};

const ManageBlog: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Blog</h1>
          <p className="text-muted-foreground">Edit blog section and manage articles</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section-title">Section Title</Label>
            <Input id="section-title" defaultValue="Latest Articles" />
          </div>
          <div>
            <Label htmlFor="section-description">Section Description</Label>
            <Textarea 
              id="section-description" 
              defaultValue="Insights, tutorials, and thoughts on technology, business, and digital innovation"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="categories">Blog Categories (comma separated)</Label>
            <Input id="categories" defaultValue="All, Technology, Real Estate, Marketing, Design, UX, Business" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blog Posts</CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New Post
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((post) => (
            <BlogPostCard key={post} postNumber={post} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Signup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newsletter-title">Newsletter Title</Label>
            <Input id="newsletter-title" defaultValue="Stay Updated" />
          </div>
          <div>
            <Label htmlFor="newsletter-description">Newsletter Description</Label>
            <Textarea 
              id="newsletter-description" 
              defaultValue="Subscribe to our newsletter and get the latest articles, tutorials, and insights delivered directly to your inbox."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="newsletter-button">Button Text</Label>
            <Input id="newsletter-button" defaultValue="Subscribe" />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full md:w-auto">
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </motion.div>
  );
};

export default ManageBlog;