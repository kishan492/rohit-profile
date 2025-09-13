import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Save, Plus, Trash2, Undo } from 'lucide-react';
import { teamService, TeamData, TeamMember } from '@/services/teamService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const TeamMemberCard: React.FC<{ member: TeamMember; index: number; onUpdate: (index: number, member: TeamMember) => void; onDelete: (index: number) => void }> = ({ member, index, onUpdate, onDelete }) => {
  const [editedMember, setEditedMember] = useState<TeamMember>(member);

  // Update local state when member prop changes
  React.useEffect(() => {
    setEditedMember(member);
  }, [member]);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Team Member {index + 1}: {member.name}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input 
              value={editedMember.name}
              onChange={(e) => {
                const updated = {...editedMember, name: e.target.value};
                setEditedMember(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter full name" 
            />
          </div>
          <div>
            <Label>Role/Position</Label>
            <Input 
              value={editedMember.role}
              onChange={(e) => {
                const updated = {...editedMember, role: e.target.value};
                setEditedMember(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter role/position" 
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Location</Label>
            <Input 
              value={editedMember.location}
              onChange={(e) => {
                const updated = {...editedMember, location: e.target.value};
                setEditedMember(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter location" 
            />
          </div>
          <div>
            <Label>Initials</Label>
            <Input 
              value={editedMember.initials}
              onChange={(e) => {
                const updated = {...editedMember, initials: e.target.value};
                setEditedMember(updated);
                onUpdate(index, updated);
              }}
              placeholder="Enter initials" 
            />
          </div>
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea 
            value={editedMember.bio}
            onChange={(e) => {
              const updated = {...editedMember, bio: e.target.value};
              setEditedMember(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter bio..."
            rows={3}
          />
        </div>
        <div>
          <Label>Skills (comma separated)</Label>
          <Input 
            value={editedMember.skills?.join(', ') || ''}
            onChange={(e) => {
              const updated = {...editedMember, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)};
              setEditedMember(updated);
              onUpdate(index, updated);
            }}
            placeholder="Enter skills separated by commas" 
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>LinkedIn URL</Label>
            <Input 
              value={editedMember.social?.linkedin || ''}
              onChange={(e) => {
                const updated = {...editedMember, social: {...editedMember.social, linkedin: e.target.value}};
                setEditedMember(updated);
                onUpdate(index, updated);
              }}
              placeholder="LinkedIn URL" 
            />
          </div>
          <div>
            <Label>Twitter URL</Label>
            <Input 
              value={editedMember.social?.twitter || ''}
              onChange={(e) => {
                const updated = {...editedMember, social: {...editedMember.social, twitter: e.target.value}};
                setEditedMember(updated);
                onUpdate(index, updated);
              }}
              placeholder="Twitter URL" 
            />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <Input 
              value={editedMember.social?.github || ''}
              onChange={(e) => {
                const updated = {...editedMember, social: {...editedMember.social, github: e.target.value}};
                setEditedMember(updated);
                onUpdate(index, updated);
              }}
              placeholder="GitHub URL" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageTeam: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<TeamData[]>([]);

  useEffect(() => {
    loadTeamData();
  }, []);

  const defaultMembers = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      location: 'San Francisco, CA',
      bio: 'Visionary leader with 10+ years in tech and business development. Passionate about building digital solutions that make a difference.',
      initials: 'JD',
      skills: ['Strategy', 'Leadership', 'Product Vision'],
      social: { linkedin: '#', twitter: '#', github: '#', email: '' }
    },
    {
      name: 'Sarah Johnson',
      role: 'Lead Developer',
      location: 'Seattle, WA',
      bio: 'Full-stack developer specializing in React, Node.js, and cloud architecture. Loves creating scalable and performant applications.',
      initials: 'SJ',
      skills: ['React', 'Node.js', 'AWS'],
      social: { linkedin: '#', twitter: '#', github: '#', email: '' }
    },
    {
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      location: 'New York, NY',
      bio: 'Creative designer focused on user experience and modern interfaces. Believes great design should be both beautiful and functional.',
      initials: 'MC',
      skills: ['Design', 'Figma', 'Prototyping'],
      social: { linkedin: '#', twitter: '#', github: '#', email: '' }
    },
    {
      name: 'Emily Rodriguez',
      role: 'Content Creator',
      location: 'Austin, TX',
      bio: 'Content strategist and video producer. Specializes in educational content and brand storytelling across digital platforms.',
      initials: 'ER',
      skills: ['Video', 'Writing', 'Strategy'],
      social: { linkedin: '#', twitter: '#', github: '#', email: '' }
    },
    {
      name: 'David Kim',
      role: 'Real Estate Consultant',
      location: 'Los Angeles, CA',
      bio: 'Real estate expert with deep market knowledge and investment strategies. Helps clients make informed property decisions.',
      initials: 'DK',
      skills: ['Real Estate', 'Investment', 'Analysis'],
      social: { linkedin: '#', twitter: '#', github: '#', email: '' }
    },
    {
      name: 'Lisa Thompson',
      role: 'Marketing Director',
      location: 'Chicago, IL',
      bio: 'Digital marketing specialist driving growth through data-driven strategies and creative campaigns across multiple channels.',
      initials: 'LT',
      skills: ['Marketing', 'Analytics', 'Growth'],
      social: { linkedin: '#', twitter: '#', github: '#', email: '' }
    }
  ];

  const loadTeamData = async () => {
    try {
      const data = await teamService.getTeam();
      setTeamData({
        sectionTitle: data.sectionTitle || 'Meet Our Team',
        sectionDescription: data.sectionDescription || 'Talented individuals from diverse backgrounds working together to create exceptional digital experiences',
        members: defaultMembers, // Always use default members for now
        ctaTitle: data.ctaTitle || 'Want to Join Our Team?',
        ctaDescription: data.ctaDescription || "We're always looking for talented individuals who share our passion for innovation and excellence. Let's build something amazing together.",
        ctaButtonText: data.ctaButtonText || 'View Open Positions'
      });
    } catch (error) {
      console.error('Failed to load team data:', error);
      // On error, create default data structure
      setTeamData({
        sectionTitle: 'Meet Our Team',
        sectionDescription: 'Talented individuals from diverse backgrounds working together to create exceptional digital experiences',
        members: defaultMembers,
        ctaTitle: 'Want to Join Our Team?',
        ctaDescription: "We're always looking for talented individuals who share our passion for innovation and excellence. Let's build something amazing together.",
        ctaButtonText: 'View Open Positions'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamData) return;
    
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedData = {
        sectionTitle: formData.get('sectionTitle') as string || teamData.sectionTitle,
        sectionDescription: formData.get('sectionDescription') as string || teamData.sectionDescription,
        members: teamData.members,
        ctaTitle: formData.get('ctaTitle') as string || teamData.ctaTitle,
        ctaDescription: formData.get('ctaDescription') as string || teamData.ctaDescription,
        ctaButtonText: formData.get('ctaButtonText') as string || teamData.ctaButtonText,
      };
      
      // Save current state to history before updating
      if (teamData) {
        setHistory(prev => [teamData, ...prev.slice(0, 4)]);
      }
      
      const updated = await teamService.updateTeam(updatedData);
      setTeamData(updated);
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('teamDataUpdated'));
      
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addMember = () => {
    if (!teamData) return;
    const newMember: TeamMember = {
      name: '',
      role: '',
      location: '',
      bio: '',
      initials: '',
      skills: [],
      social: { linkedin: '', twitter: '', github: '', email: '' }
    };
    setTeamData({
      ...teamData,
      members: [...teamData.members, newMember]
    });
  };

  const updateMember = (index: number, member: TeamMember) => {
    if (!teamData) return;
    const updatedMembers = [...teamData.members];
    updatedMembers[index] = member;
    setTeamData({
      ...teamData,
      members: updatedMembers
    });
  };

  const deleteMember = (index: number) => {
    if (!teamData) return;
    const updatedMembers = teamData.members.filter((_, i) => i !== index);
    setTeamData({
      ...teamData,
      members: updatedMembers
    });
  };

  const handleRollback = async () => {
    if (history.length === 0) return;
    if (!confirm('Rollback to previous version?')) return;
    
    try {
      const previousVersion = history[0];
      const updated = await teamService.updateTeam(previousVersion);
      setTeamData({
        ...updated,
        members: defaultMembers // Keep default members for editing
      });
      setHistory(prev => prev.slice(1));
      
      // Trigger event to refresh public site
      window.dispatchEvent(new CustomEvent('teamDataUpdated'));
      
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

  if (!teamData) {
    return <div>Failed to load team data</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Team</h1>
          <p className="text-muted-foreground">Edit team section and member profiles</p>
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
                defaultValue={teamData.sectionTitle}
                placeholder="Enter section title" 
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={teamData.sectionDescription}
                placeholder="Enter section description..."
                rows={2}
              />
            </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Button type="button" size="sm" onClick={addMember}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamData.members.map((member, index) => (
            <TeamMemberCard 
              key={index} 
              member={member} 
              index={index}
              onUpdate={updateMember}
              onDelete={deleteMember}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Join Team CTA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ctaTitle">CTA Title</Label>
            <Input 
              id="ctaTitle" 
              name="ctaTitle"
              defaultValue={teamData.ctaTitle}
              placeholder="Enter CTA title" 
            />
          </div>
          <div>
            <Label htmlFor="ctaDescription">CTA Description</Label>
            <Textarea 
              id="ctaDescription" 
              name="ctaDescription"
              defaultValue={teamData.ctaDescription}
              placeholder="Enter CTA description..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="ctaButtonText">Button Text</Label>
            <Input 
              id="ctaButtonText" 
              name="ctaButtonText"
              defaultValue={teamData.ctaButtonText}
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

export default ManageTeam;