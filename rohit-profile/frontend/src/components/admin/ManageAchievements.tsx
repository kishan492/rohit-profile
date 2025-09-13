import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Save, Plus, Trash2, Undo } from 'lucide-react';
import { achievementsService, AchievementsData, Achievement } from '@/services/achievementsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AchievementCard: React.FC<{ achievement: Achievement; index: number; onUpdate: (index: number, achievement: Achievement) => void; onDelete: (index: number) => void }> = ({ achievement, index, onUpdate, onDelete }) => {
  const [editedAchievement, setEditedAchievement] = useState<Achievement>(achievement);

  // Update local state when achievement prop changes
  React.useEffect(() => {
    setEditedAchievement(achievement);
  }, [achievement]);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Achievement {index + 1}: {achievement.title}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Year</Label>
            <Input 
              value={editedAchievement.year}
              onChange={(e) => {
                const updated = {...editedAchievement, year: e.target.value};
                setEditedAchievement(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter year (e.g., 2024)" 
            />
          </div>
          <div>
            <Label>Icon Name</Label>
            <Input 
              value={editedAchievement.icon}
              onChange={(e) => {
                const updated = {...editedAchievement, icon: e.target.value};
                setEditedAchievement(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter icon name (e.g., Award, Target, Users)" 
            />
          </div>
        </div>
        <div>
          <Label>Title</Label>
          <Input 
            value={editedAchievement.title}
            onChange={(e) => {
              const updated = {...editedAchievement, title: e.target.value};
              setEditedAchievement(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter achievement title"
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea 
            value={editedAchievement.description}
            onChange={(e) => {
              const updated = {...editedAchievement, description: e.target.value};
              setEditedAchievement(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter achievement description..."
            rows={3}
          />
        </div>
        <div>
          <Label>Color Gradient</Label>
          <Input 
            value={editedAchievement.color}
            onChange={(e) => {
              const updated = {...editedAchievement, color: e.target.value};
              setEditedAchievement(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter gradient color (e.g., from-blue-500 to-indigo-500)" 
          />
        </div>
      </div>
    </div>
  );
};

const ManageAchievements: React.FC = () => {
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<AchievementsData[]>([]);

  useEffect(() => {
    loadAchievementsData();
  }, []);

  const defaultAchievements = [
    {
      year: '2024',
      title: 'Platform Expansion',
      description: 'Launched multi-platform content strategy reaching 500K+ users across YouTube, LinkedIn, and Instagram.',
      icon: 'Target',
      color: 'from-purple-500 to-violet-500'
    },
    {
      year: '2023',
      title: 'Award Recognition',
      description: 'Received "Digital Innovation Award" for outstanding contributions to the tech and content creation space.',
      icon: 'Award',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      year: '2023',
      title: 'Team Growth',
      description: 'Expanded team to 15+ talented individuals across development, design, and marketing disciplines.',
      icon: 'Users',
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '2022',
      title: 'Major Milestone',
      description: 'Reached 100K YouTube subscribers and completed 50+ successful client projects.',
      icon: 'Zap',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2021',
      title: 'Business Launch',
      description: 'Officially launched consulting services, combining real estate expertise with digital solutions.',
      icon: 'MapPin',
      color: 'from-red-500 to-pink-500'
    },
    {
      year: '2019',
      title: 'Foundation',
      description: 'Started the journey with a vision to democratize access to high-quality digital solutions.',
      icon: 'Calendar',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const loadAchievementsData = async () => {
    try {
      const data = await achievementsService.getAchievements();
      setAchievementsData({
        sectionTitle: data.sectionTitle || 'Our Journey',
        sectionDescription: data.sectionDescription || 'Milestones and achievements that mark our path of continuous growth and innovation',
        achievements: defaultAchievements, // Always use default achievements for now
        ctaTitle: data.ctaTitle || 'Be Part of Our Next Chapter',
        ctaDescription: data.ctaDescription || "Every milestone represents the trust our clients place in us. Let's create the next success story together."
      });
    } catch (error) {
      console.error('Failed to load achievements data:', error);
      // On error, create default data structure
      setAchievementsData({
        sectionTitle: 'Our Journey',
        sectionDescription: 'Milestones and achievements that mark our path of continuous growth and innovation',
        achievements: defaultAchievements,
        ctaTitle: 'Be Part of Our Next Chapter',
        ctaDescription: "Every milestone represents the trust our clients place in us. Let's create the next success story together."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementsData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        sectionTitle: formData.get('sectionTitle') as string || achievementsData.sectionTitle,
        sectionDescription: formData.get('sectionDescription') as string || achievementsData.sectionDescription,
        achievements: achievementsData.achievements,
        ctaTitle: formData.get('ctaTitle') as string || achievementsData.ctaTitle,
        ctaDescription: formData.get('ctaDescription') as string || achievementsData.ctaDescription,
      };
      
      // Save current state to history before updating
      if (achievementsData) {
        setHistory(prev => [achievementsData, ...prev.slice(0, 4)]);
      }
      
      const updated = await achievementsService.updateAchievements(updatedData);
      setAchievementsData(updated);
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('achievementsDataUpdated'));
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addAchievement = () => {
    if (!achievementsData) return;
    const newAchievement: Achievement = {
      year: new Date().getFullYear().toString(),
      title: '',
      description: '',
      icon: 'Award',
      color: 'from-blue-500 to-indigo-500'
    };
    setAchievementsData({
      ...achievementsData,
      achievements: [...achievementsData.achievements, newAchievement]
    });
  };

  const updateAchievement = (index: number, achievement: Achievement) => {
    if (!achievementsData) return;
    const updatedAchievements = [...achievementsData.achievements];
    updatedAchievements[index] = achievement;
    setAchievementsData({
      ...achievementsData,
      achievements: updatedAchievements
    });
  };

  const deleteAchievement = (index: number) => {
    if (!achievementsData) return;
    const updatedAchievements = achievementsData.achievements.filter((_, i) => i !== index);
    setAchievementsData({
      ...achievementsData,
      achievements: updatedAchievements
    });
  };

  const handleRollback = async () => {
    if (history.length === 0) return;
    if (!confirm('Rollback to previous version?')) return;
    
    try {
      const previousVersion = history[0];
      const updated = await achievementsService.updateAchievements(previousVersion);
      setAchievementsData({
        ...updated,
        achievements: defaultAchievements // Keep default achievements for editing
      });
      setHistory(prev => prev.slice(1));
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('achievementsDataUpdated'));
      
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

  if (!achievementsData) {
    return <div>Failed to load achievements data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Achievements</h1>
          <p className="text-muted-foreground">Edit achievements timeline and milestones</p>
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
                defaultValue={achievementsData.sectionTitle}
                placeholder="Enter section title" 
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={achievementsData.sectionDescription}
                placeholder="Enter section description..."
                rows={2}
              />
            </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Achievements Timeline</CardTitle>
            <Button type="button" size="sm" onClick={addAchievement}>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievementsData.achievements.map((achievement, index) => (
            <AchievementCard 
              key={index} 
              achievement={achievement} 
              index={index}
              onUpdate={updateAchievement}
              onDelete={deleteAchievement}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ctaTitle">CTA Title</Label>
            <Input 
              id="ctaTitle" 
              name="ctaTitle"
              defaultValue={achievementsData.ctaTitle}
              placeholder="Enter CTA title" 
            />
          </div>
          <div>
            <Label htmlFor="ctaDescription">CTA Description</Label>
            <Textarea 
              id="ctaDescription" 
              name="ctaDescription"
              defaultValue={achievementsData.ctaDescription}
              placeholder="Enter CTA description..."
              rows={3}
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

export default ManageAchievements;