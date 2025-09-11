import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Save, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { teamService, TeamData, TeamMember } from '@/services/teamService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const TeamMemberCard: React.FC<{ memberNumber: number }> = ({ memberNumber }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const members = [
    { name: 'John Doe', role: 'Founder & CEO', location: 'San Francisco, CA', initials: 'JD' },
    { name: 'Sarah Johnson', role: 'Lead Developer', location: 'Seattle, WA', initials: 'SJ' },
    { name: 'Michael Chen', role: 'UI/UX Designer', location: 'New York, NY', initials: 'MC' },
  ];

  const member = members[memberNumber - 1] || members[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Team Member {memberNumber}</h4>
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`member-name-${memberNumber}`}>Full Name</Label>
              <Input id={`member-name-${memberNumber}`} defaultValue={member.name} />
            </div>
            <div>
              <Label htmlFor={`member-role-${memberNumber}`}>Role/Position</Label>
              <Input id={`member-role-${memberNumber}`} defaultValue={member.role} />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`member-location-${memberNumber}`}>Location</Label>
              <Input id={`member-location-${memberNumber}`} defaultValue={member.location} />
            </div>
            <div>
              <Label htmlFor={`member-initials-${memberNumber}`}>Initials</Label>
              <Input id={`member-initials-${memberNumber}`} defaultValue={member.initials} />
            </div>
          </div>

          <div>
            <Label>Profile Photo</Label>
            <div className="mt-2">
              {photo ? (
                <div className="relative inline-block">
                  <img src={photo} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
                  <button
                    onClick={() => setPhoto(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor={`member-bio-${memberNumber}`}>Bio</Label>
            <Textarea 
              id={`member-bio-${memberNumber}`} 
              defaultValue="Visionary leader with 10+ years in tech and business development. Passionate about building digital solutions that make a difference."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor={`member-skills-${memberNumber}`}>Skills (comma separated)</Label>
            <Input id={`member-skills-${memberNumber}`} defaultValue="Strategy, Leadership, Product Vision" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`member-linkedin-${memberNumber}`}>LinkedIn URL</Label>
              <Input id={`member-linkedin-${memberNumber}`} defaultValue="#" />
            </div>
            <div>
              <Label htmlFor={`member-twitter-${memberNumber}`}>Twitter URL</Label>
              <Input id={`member-twitter-${memberNumber}`} defaultValue="#" />
            </div>
            <div>
              <Label htmlFor={`member-github-${memberNumber}`}>GitHub URL</Label>
              <Input id={`member-github-${memberNumber}`} defaultValue="#" />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p><strong>Name:</strong> {member.name}</p>
          <p><strong>Role:</strong> {member.role}</p>
          <p><strong>Location:</strong> {member.location}</p>
          <p><strong>Initials:</strong> {member.initials}</p>
        </div>
      )}
    </div>
  );
};

const ManageTeam: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const data = await teamService.getTeam();
      setTeamData(data);
    } catch (error) {
      console.error('Failed to load team data:', error);
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
        sectionTitle: formData.get('sectionTitle') as string,
        sectionDescription: formData.get('sectionDescription') as string,
        members: teamData.members,
      };
      
      const updated = await teamService.updateTeam(updatedData);
      setTeamData(updated);
      alert('Team section updated successfully!');
    } catch (error) {
      alert('Failed to update team section');
    } finally {
      setSaving(false);
    }
  };

  const addMember = () => {
    if (!teamData) return;
    const newMember: TeamMember = {
      name: '',
      role: '',
      bio: '',
      social: { linkedin: '', twitter: '', github: '', email: '' }
    };
    setTeamData({
      ...teamData,
      members: [...teamData.members, newMember]
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
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
                defaultValue={teamData.sectionTitle === 'Meet Our Team' ? '' : teamData.sectionTitle}
                placeholder="Enter section title (e.g., Meet Our Team)" 
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Section Description</Label>
              <Textarea 
                id="sectionDescription" 
                name="sectionDescription"
                defaultValue={teamData.sectionDescription === 'The talented individuals behind our success. Each team member brings unique expertise and passion to every project.' ? '' : teamData.sectionDescription}
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
          <p className="text-sm text-muted-foreground">Team member management coming soon...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Join Team CTA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cta-title">CTA Title</Label>
            <Input id="cta-title" defaultValue="Want to Join Our Team?" />
          </div>
          <div>
            <Label htmlFor="cta-description">CTA Description</Label>
            <Textarea 
              id="cta-description" 
              defaultValue="We're always looking for talented individuals who share our passion for innovation and excellence. Let's build something amazing together."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="cta-button">Button Text</Label>
            <Input id="cta-button" defaultValue="View Open Positions" />
          </div>
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

export default ManageTeam;