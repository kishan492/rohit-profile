import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Save, Plus, Edit, Trash2, Undo } from 'lucide-react';
import { achievementsService, AchievementsData, Achievement } from '@/services/achievementsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AchievementCard: React.FC<{ achievement: Achievement; index: number; onUpdate: (index: number, achievement: Achievement) => void; onDelete: (index: number) => void }> = ({ achievement, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAchievement, setEditedAchievement] = useState<Achievement>(achievement);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Achievement {index + 1}</h4>
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
              <Label>Year</Label>
              <Input 
                value={editedAchievement.year}
                onChange={(e) => setEditedAchievement({...editedAchievement, year: e.target.value})}
                placeholder="Enter year (e.g., 2024)" 
              />
            </div>
            <div>
              <Label>Icon Name</Label>
              <Input 
                value={editedAchievement.icon}
                onChange={(e) => setEditedAchievement({...editedAchievement, icon: e.target.value})}
                placeholder="Enter icon name (e.g., Award, Target, Users)" 
              />
            </div>
          </div>
          <div>
            <Label>Title</Label>
            <Input 
              value={editedAchievement.title}
              onChange={(e) => setEditedAchievement({...editedAchievement, title: e.target.value})}
              placeholder="Enter achievement title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea 
              value={editedAchievement.description}
              onChange={(e) => setEditedAchievement({...editedAchievement, description: e.target.value})}
              placeholder="Enter achievement description..."
              rows={3}
            />
          </div>
          <div>
            <Label>Color Gradient</Label>
            <Input 
              value={editedAchievement.color}
              onChange={(e) => setEditedAchievement({...editedAchievement, color: e.target.value})}
              placeholder="Enter gradient color (e.g., from-blue-500 to-indigo-500)" 
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => {
              onUpdate(index, editedAchievement);
              setIsEditing(false);
            }}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => {
              setEditedAchievement(achievement);
              setIsEditing(false);
            }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p><strong>Year:</strong> {achievement.year || 'Not set'}</p>
          <p><strong>Title:</strong> {achievement.title || 'Untitled'}</p>
          <p><strong>Icon:</strong> {achievement.icon || 'Award'}</p>
        </div>
      )}
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

  const loadAchievementsData = async () => {
    try {
      const data = await achievementsService.getAchievements();
      setAchievementsData(data);
      // Save to history when loading
      if (data) {
        setHistory(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 versions
      }
    } catch (error) {
      console.error('Failed to load achievements data:', error);
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
        sectionTitle: formData.get('sectionTitle') as string,
        sectionDescription: formData.get('sectionDescription') as string,
        achievements: achievementsData.achievements,
        ctaTitle: formData.get('ctaTitle') as string,
        ctaDescription: formData.get('ctaDescription') as string,
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
      year: '',
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
      setAchievementsData(updated);
      setHistory(prev => prev.slice(1));
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('achievementsDataUpdated'));
      
      // Force form refresh
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
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
                defaultValue={achievementsData.sectionTitle === 'Our Journey' ? '' : achievementsData.sectionTitle}
                placeholder="Enter section title (e.g., Our Journey)" 
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={achievementsData.sectionDescription === 'Milestones and achievements that mark our path of continuous growth and innovation' ? '' : achievementsData.sectionDescription}
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
                    defaultValue={achievementsData.ctaTitle === 'Be Part of Our Next Chapter' ? '' : achievementsData.ctaTitle}
                    placeholder="Enter CTA title (e.g., Be Part of Our Next Chapter)" 
                  />
                </div>
                <div>
                  <Label htmlFor="ctaDescription">CTA Description</Label>
                  <Textarea 
                    id="ctaDescription" 
                    name="ctaDescription"
                    defaultValue={achievementsData.ctaDescription === "Every milestone represents the trust our clients place in us. Let's create the next success story together." ? '' : achievementsData.ctaDescription}
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