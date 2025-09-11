import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Save, Trash2, Star, Undo, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageTestimonials: React.FC = () => {
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const checkForNewReviews = () => {
      const saved = localStorage.getItem('adminTestimonials');
      if (saved) {
        setReviews(JSON.parse(saved));
      }
    };
    
    const interval = setInterval(checkForNewReviews, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const getInitialReviews = () => {
    const saved = localStorage.getItem('adminTestimonials');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: '1',
        name: 'Alex Thompson',
        role: 'Startup Founder, TechVenture',
        rating: 5,
        content: 'Outstanding service! The team delivered exactly what we needed and exceeded our expectations.',
        date: '2024-01-15',
        status: 'pending'
      },
      {
        id: '2',
        name: 'Maria Garcia',
        role: 'Marketing Manager, GrowthCorp',
        rating: 4,
        content: 'Great experience working with this team. Professional and responsive throughout the project.',
        date: '2024-01-10',
        status: 'approved'
      },
      {
        id: '3',
        name: 'James Wilson',
        role: 'CEO, InnovateNow',
        rating: 5,
        content: 'Highly recommend! They transformed our digital presence and helped us reach new customers.',
        date: '2024-01-08',
        status: 'pending'
      }
    ];
  };
  
  const [reviews, setReviews] = useState(getInitialReviews);

  const handleApprove = (id: string) => {
    setReviews(prev => {
      const updated = prev.map(review => 
        review.id === id ? { ...review, status: 'approved' } : review
      );
      localStorage.setItem('adminTestimonials', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('testimonialsDataUpdated'));
      return updated;
    });
  };

  const handleReject = (id: string) => {
    setReviews(prev => {
      const updated = prev.map(review => 
        review.id === id ? { ...review, status: 'rejected' } : review
      );
      localStorage.setItem('adminTestimonials', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('testimonialsDataUpdated'));
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this review permanently?')) {
      setReviews(prev => {
        const updated = prev.filter(review => review.id !== id);
        localStorage.setItem('adminTestimonials', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('testimonialsDataUpdated'));
        return updated;
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving reviews...', reviews);
      localStorage.setItem('adminTestimonials', JSON.stringify(reviews));
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Trigger real-time update for public website
      window.dispatchEvent(new CustomEvent('testimonialsDataUpdated'));
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Testimonials</h1>
          <p className="text-muted-foreground">Edit testimonials section and client reviews</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section-title">Section Title</Label>
            <Input id="section-title" defaultValue="What Our Clients Say" />
          </div>
          <div>
            <Label htmlFor="section-description">Section Description</Label>
            <Textarea 
              id="section-description" 
              defaultValue="Don't just take our word for it. Here's what our clients have to say about working with us."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>



      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{review.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.role}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`} />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">({review.rating}/5)</span>
                  </div>
                  <p className="text-sm mb-2">"{review.content}"</p>
                  <p className="text-xs text-muted-foreground">Submitted: {review.date}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {review.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(review.id)}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(review.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={saving} className="flex-1 md:flex-none">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
        <Button variant="secondary" disabled>
          <Undo className="mr-2 h-4 w-4" />
          Rollback (0)
        </Button>
      </div>
    </motion.div>
  );
};

export default ManageTestimonials;