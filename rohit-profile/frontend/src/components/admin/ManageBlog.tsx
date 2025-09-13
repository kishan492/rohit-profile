import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, Plus, Trash2, Undo } from 'lucide-react';
import { blogService, BlogData, BlogPost } from '@/services/blogService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const BlogPostCard: React.FC<{ post: BlogPost; index: number; onUpdate: (index: number, post: BlogPost) => void; onDelete: (index: number) => void }> = ({ post, index, onUpdate, onDelete }) => {
  const [editedPost, setEditedPost] = useState<BlogPost>(post);

  // Update local state when post prop changes
  React.useEffect(() => {
    setEditedPost(post);
  }, [post]);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Blog Post {index + 1}: {post.title}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Post Title</Label>
          <Input 
            value={editedPost.title}
            onChange={(e) => {
              const updated = {...editedPost, title: e.target.value};
              setEditedPost(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter post title" 
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Author</Label>
            <Input 
              value={editedPost.author}
              onChange={(e) => {
                const updated = {...editedPost, author: e.target.value};
                setEditedPost(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter author name" 
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input 
              value={editedPost.category}
              onChange={(e) => {
                const updated = {...editedPost, category: e.target.value};
                setEditedPost(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter category" 
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Publish Date</Label>
            <Input 
              value={editedPost.publishedAt}
              onChange={(e) => {
                const updated = {...editedPost, publishedAt: e.target.value};
                setEditedPost(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter publish date" 
            />
          </div>
          <div>
            <Label>Read Time</Label>
            <Input 
              value={editedPost.readTime}
              onChange={(e) => {
                const updated = {...editedPost, readTime: e.target.value};
                setEditedPost(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter read time" 
            />
          </div>
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea 
            value={editedPost.excerpt}
            onChange={(e) => {
              const updated = {...editedPost, excerpt: e.target.value};
              setEditedPost(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter post excerpt..."
            rows={3}
          />
        </div>
        <div>
          <Label>Tags (comma separated)</Label>
          <Input 
            value={editedPost.tags?.join(', ') || ''}
            onChange={(e) => {
              const updated = {...editedPost, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)};
              setEditedPost(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter tags separated by commas" 
          />
        </div>
        <div>
          <Label>Thumbnail Text</Label>
          <Input 
            value={editedPost.thumbnail}
            onChange={(e) => {
              const updated = {...editedPost, thumbnail: e.target.value};
              setEditedPost(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter thumbnail text" 
          />
        </div>
      </div>
    </div>
  );
};

const ManageBlog: React.FC = () => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<BlogData[]>([]);

  useEffect(() => {
    loadBlogData();
  }, []);

  const defaultPosts = [
    {
      title: 'The Future of Web Development: Trends to Watch in 2024',
      excerpt: 'Explore the latest trends shaping the web development landscape, from AI integration to serverless architecture and beyond.',
      author: 'John Doe',
      publishedAt: 'December 15, 2023',
      readTime: '8 min read',
      category: 'Technology',
      thumbnail: 'Web',
      tags: ['React', 'AI', 'Trends'],
      slug: 'future-web-development-2024'
    },
    {
      title: 'Real Estate Investment: A Beginner\'s Guide to Success',
      excerpt: 'Learn the fundamentals of real estate investing, from market analysis to financing options and risk management strategies.',
      author: 'David Kim',
      publishedAt: 'December 10, 2023',
      readTime: '12 min read',
      category: 'Real Estate',
      thumbnail: 'Real',
      tags: ['Investment', 'Strategy', 'Finance'],
      slug: 'real-estate-investment-guide'
    },
    {
      title: 'Building a Personal Brand Through Content Creation',
      excerpt: 'Discover how to leverage content creation to build a strong personal brand and grow your professional network.',
      author: 'Emily Rodriguez',
      publishedAt: 'December 5, 2023',
      readTime: '6 min read',
      category: 'Marketing',
      thumbnail: 'Brand',
      tags: ['Branding', 'Content', 'Growth'],
      slug: 'personal-brand-content-creation'
    },
    {
      title: 'Design Systems: Creating Consistency at Scale',
      excerpt: 'Learn how to build and maintain design systems that ensure consistency across large-scale applications and teams.',
      author: 'Michael Chen',
      publishedAt: 'November 28, 2023',
      readTime: '10 min read',
      category: 'Design',
      thumbnail: 'Design',
      tags: ['Design', 'Systems', 'UI/UX'],
      slug: 'design-systems-consistency-scale'
    },
    {
      title: 'The Psychology of User Experience: Understanding User Behavior',
      excerpt: 'Dive deep into user psychology and learn how to create experiences that truly resonate with your target audience.',
      author: 'Sarah Johnson',
      publishedAt: 'November 20, 2023',
      readTime: '9 min read',
      category: 'UX',
      thumbnail: 'UX',
      tags: ['Psychology', 'UX', 'Research'],
      slug: 'psychology-user-experience'
    },
    {
      title: 'Scaling Your Business: From Startup to Success',
      excerpt: 'Practical strategies and insights for scaling your business effectively while maintaining quality and culture.',
      author: 'Lisa Thompson',
      publishedAt: 'November 15, 2023',
      readTime: '11 min read',
      category: 'Business',
      thumbnail: 'Biz',
      tags: ['Business', 'Growth', 'Strategy'],
      slug: 'scaling-business-startup-success'
    }
  ];

  const loadBlogData = async () => {
    try {
      const data = await blogService.getBlog();
      setBlogData({
        sectionTitle: data.sectionTitle || 'Latest Articles',
        sectionDescription: data.sectionDescription || 'Insights, tutorials, and thoughts on technology, business, and digital innovation',
        posts: defaultPosts, // Always use default posts for now
        categories: data.categories || ['All', 'Technology', 'Real Estate', 'Marketing', 'Design', 'UX', 'Business'],
        newsletterTitle: data.newsletterTitle || 'Stay Updated',
        newsletterDescription: data.newsletterDescription || 'Subscribe to our newsletter and get the latest articles, tutorials, and insights delivered directly to your inbox.',
        newsletterButtonText: data.newsletterButtonText || 'Subscribe'
      });
    } catch (error) {
      console.error('Failed to load blog data:', error);
      // On error, create default data structure
      setBlogData({
        sectionTitle: 'Latest Articles',
        sectionDescription: 'Insights, tutorials, and thoughts on technology, business, and digital innovation',
        posts: defaultPosts,
        categories: ['All', 'Technology', 'Real Estate', 'Marketing', 'Design', 'UX', 'Business'],
        newsletterTitle: 'Stay Updated',
        newsletterDescription: 'Subscribe to our newsletter and get the latest articles, tutorials, and insights delivered directly to your inbox.',
        newsletterButtonText: 'Subscribe'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        sectionTitle: formData.get('sectionTitle') as string || blogData.sectionTitle,
        sectionDescription: formData.get('sectionDescription') as string || blogData.sectionDescription,
        posts: blogData.posts,
        categories: formData.get('categories') as string || blogData.categories?.join(', '),
        newsletterTitle: formData.get('newsletterTitle') as string || blogData.newsletterTitle,
        newsletterDescription: formData.get('newsletterDescription') as string || blogData.newsletterDescription,
        newsletterButtonText: formData.get('newsletterButtonText') as string || blogData.newsletterButtonText,
      };
      
      // Save current state to history before updating
      if (blogData) {
        setHistory(prev => [blogData, ...prev.slice(0, 4)]);
      }
      
      const updated = await blogService.updateBlog(updatedData);
      setBlogData({
        ...updated,
        posts: blogData.posts // Keep current posts for editing
      });
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('blogDataUpdated'));
      
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addPost = () => {
    if (!blogData) return;
    const newPost: BlogPost = {
      title: '',
      excerpt: '',
      author: '',
      publishedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: '5 min read',
      category: 'Technology',
      thumbnail: 'New',
      tags: [],
      slug: ''
    };
    setBlogData({
      ...blogData,
      posts: [...blogData.posts, newPost]
    });
  };

  const updatePost = (index: number, post: BlogPost) => {
    if (!blogData) return;
    const updatedPosts = [...blogData.posts];
    updatedPosts[index] = post;
    setBlogData({
      ...blogData,
      posts: updatedPosts
    });
  };

  const deletePost = (index: number) => {
    if (!blogData) return;
    const updatedPosts = blogData.posts.filter((_, i) => i !== index);
    setBlogData({
      ...blogData,
      posts: updatedPosts
    });
  };

  const handleRollback = async () => {
    if (history.length === 0) return;
    if (!confirm('Rollback to previous version?')) return;
    
    try {
      const previousVersion = history[0];
      const updated = await blogService.updateBlog(previousVersion);
      setBlogData({
        ...updated,
        posts: defaultPosts // Keep default posts for editing
      });
      setHistory(prev => prev.slice(1));
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('blogDataUpdated'));
      
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

  if (!blogData) {
    return <div>Failed to load blog data</div>;
  }

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
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input 
                id="sectionTitle" 
                name="sectionTitle"
                defaultValue={blogData.sectionTitle}
                placeholder="Enter section title" 
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={blogData.sectionDescription}
                placeholder="Enter section description..."
                rows={2}
              />
            </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="categories">Blog Categories (comma separated)</Label>
            <Input 
              id="categories" 
              name="categories"
              defaultValue={blogData.categories?.join(', ')}
              placeholder="Enter categories separated by commas" 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blog Posts</CardTitle>
            <Button type="button" size="sm" onClick={addPost}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Post
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {blogData.posts.map((post, index) => (
            <BlogPostCard 
              key={index} 
              post={post} 
              index={index}
              onUpdate={updatePost}
              onDelete={deletePost}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Signup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newsletterTitle">Newsletter Title</Label>
            <Input 
              id="newsletterTitle" 
              name="newsletterTitle"
              defaultValue={blogData.newsletterTitle}
              placeholder="Enter newsletter title" 
            />
          </div>
          <div>
            <Label htmlFor="newsletterDescription">Newsletter Description</Label>
            <Textarea 
              id="newsletterDescription" 
              name="newsletterDescription"
              defaultValue={blogData.newsletterDescription}
              placeholder="Enter newsletter description..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="newsletterButtonText">Button Text</Label>
            <Input 
              id="newsletterButtonText" 
              name="newsletterButtonText"
              defaultValue={blogData.newsletterButtonText}
              placeholder="Enter button text" 
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

export default ManageBlog;