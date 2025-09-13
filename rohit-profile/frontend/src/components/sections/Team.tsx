import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Code, Linkedin, Github, Twitter } from 'lucide-react';
import { teamService, TeamData } from '@/services/teamService';

const Team: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
    
    // Listen for team update events
    const handleCustomUpdate = () => {
      console.log('Team data update event received');
      loadTeamData();
    };
    
    window.addEventListener('teamDataUpdated', handleCustomUpdate);
    
    // Also refresh every 30 seconds to catch updates
    const interval = setInterval(loadTeamData, 30000);
    
    return () => {
      window.removeEventListener('teamDataUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);
  
  const loadTeamData = async () => {
    try {
      const data = await teamService.getTeam();
      setTeamData(data);
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      location: 'San Francisco, CA',
      bio: 'Visionary leader with 10+ years in tech and business development. Passionate about building digital solutions that make a difference.',
      initials: 'JD',
      skills: ['Strategy', 'Leadership', 'Product Vision'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      }
    },
    {
      name: 'Sarah Johnson',
      role: 'Lead Developer',
      location: 'Seattle, WA',
      bio: 'Full-stack developer specializing in React, Node.js, and cloud architecture. Loves creating scalable and performant applications.',
      initials: 'SJ',
      skills: ['React', 'Node.js', 'AWS'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      }
    },
    {
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      location: 'New York, NY',
      bio: 'Creative designer focused on user experience and modern interfaces. Believes great design should be both beautiful and functional.',
      initials: 'MC',
      skills: ['Design', 'Figma', 'Prototyping'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      }
    },
    {
      name: 'Emily Rodriguez',
      role: 'Content Creator',
      location: 'Austin, TX',
      bio: 'Content strategist and video producer. Specializes in educational content and brand storytelling across digital platforms.',
      initials: 'ER',
      skills: ['Video', 'Writing', 'Strategy'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      }
    },
    {
      name: 'David Kim',
      role: 'Real Estate Consultant',
      location: 'Los Angeles, CA',
      bio: 'Real estate expert with deep market knowledge and investment strategies. Helps clients make informed property decisions.',
      initials: 'DK',
      skills: ['Real Estate', 'Investment', 'Analysis'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      }
    },
    {
      name: 'Lisa Thompson',
      role: 'Marketing Director',
      location: 'Chicago, IL',
      bio: 'Digital marketing specialist driving growth through data-driven strategies and creative campaigns across multiple channels.',
      initials: 'LT',
      skills: ['Marketing', 'Analytics', 'Growth'],
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      }
    },
  ];

  return (
    <section id="team" className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {isLoading ? '' : (teamData?.sectionTitle || 'Meet Our Team')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoading ? '' : (teamData?.sectionDescription || 'Talented individuals from diverse backgrounds working together to create exceptional digital experiences')}
            </p>
          </motion.div>

          {/* Team Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {(teamData?.members && teamData.members.length > 0 ? teamData.members : teamMembers).map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group bg-card rounded-3xl p-8 shadow-custom hover:shadow-custom-lg transition-all duration-300 border border-border/50 hover:border-primary/20"
              >
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-custom-lg">
                    <span className="text-white font-bold text-2xl">
                      {member.initials}
                    </span>
                  </div>

                </div>

                {/* Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">
                    {member.role}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    {member.location}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <motion.a
                    href={member.social.linkedin}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </motion.a>
                  <motion.a
                    href={member.social.twitter}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </motion.a>
                  <motion.a
                    href={member.social.github}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Join Team CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                {isLoading ? '' : (teamData?.ctaTitle || 'Want to Join Our Team?')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {isLoading ? '' : (teamData?.ctaDescription || "We're always looking for talented individuals who share our passion for innovation and excellence. Let's build something amazing together.")}
              </p>
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors shadow-custom hover:shadow-custom-md">
                {isLoading ? '' : (teamData?.ctaButtonText || 'View Open Positions')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;