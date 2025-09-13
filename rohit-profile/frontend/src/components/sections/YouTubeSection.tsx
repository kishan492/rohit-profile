import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Play, ExternalLink, Clock, Eye, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { youtubeService, YoutubeData } from '@/services/youtubeService';
import { useNavigate } from 'react-router-dom';

const YouTubeSection: React.FC = () => {
  const [youtubeData, setYoutubeData] = useState<YoutubeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadYoutubeData();
    
    const handleCustomUpdate = () => {
      console.log('YouTube data update event received');
      loadYoutubeData();
    };
    
    window.addEventListener('youtubeDataUpdated', handleCustomUpdate);
    const interval = setInterval(loadYoutubeData, 30000);
    
    return () => {
      window.removeEventListener('youtubeDataUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);
  
  const loadYoutubeData = async () => {
    try {
      const data = await youtubeService.getYoutube();
      setYoutubeData(data);
    } catch (error) {
      console.error('Failed to load youtube data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = (videoId?: string) => {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    } else {
      const channelUrl = import.meta.env.VITE_YOUTUBE_CHANNEL_URL || 'https://youtube.com/@mychannel';
      window.open(channelUrl, '_blank');
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

  const featuredVideos = [
    {
      title: 'Building a Modern React Portfolio',
      views: '45K',
      duration: '12:34',
      thumbnail: 'React',
      description: 'Learn how to create a stunning portfolio website using React and modern design principles.',
    },
    {
      title: 'Real Estate Investment Strategies',
      views: '32K',
      duration: '18:45',
      thumbnail: 'Real',
      description: 'Essential strategies for successful real estate investing in today\'s market.',
    },
    {
      title: 'Full Stack Development Guide',
      views: '67K',
      duration: '25:12',
      thumbnail: 'Full',
      description: 'Complete guide to becoming a full-stack developer with practical examples.',
    },
  ];

  const stats = [
    { label: 'Subscribers', value: isLoading ? '' : (youtubeData?.subscriberCount || '125K+'), icon: Youtube },
    { label: 'Total Views', value: isLoading ? '' : (youtubeData?.totalViews || '2.5M+'), icon: Eye },
    { label: 'Videos', value: '150+', icon: Play },
    { label: 'Likes', value: '89K+', icon: ThumbsUp },
  ];

  return (
    <section id="youtube" className="py-20 bg-muted/30 min-h-screen flex items-center">
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                <Youtube className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                {isLoading ? '' : (youtubeData?.sectionTitle || 'YouTube Channel')}
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoading ? '' : (youtubeData?.sectionDescription || 'Educational content, tutorials, and insights to help you grow in technology and business')}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-2xl p-6 text-center shadow-custom hover:shadow-custom-md transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Videos */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Featured Videos</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {(youtubeData?.videos && youtubeData.videos.length > 0 ? youtubeData.videos : featuredVideos).map((video, index) => (
                <motion.div
                  key={video.title}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group bg-card rounded-3xl overflow-hidden shadow-custom hover:shadow-custom-lg transition-all duration-300 border border-border/50 hover:border-red-500/20"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                    <div className="text-4xl font-bold text-red-500/50">
                      {video.thumbnail}
                    </div>
                    
                    {/* Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handleVideoClick(video.videoId)}
                    >
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </motion.div>

                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.duration || '10:00'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="font-bold text-foreground mb-2 group-hover:text-red-500 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {video.views} views
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="group-hover:border-red-500 group-hover:text-red-500"
                        onClick={() => handleVideoClick(video.videoId)}
                      >
                        Watch
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Subscribe CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl p-8 border border-red-500/20">
              <Youtube className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Subscribe for More Content</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join our growing community of learners and get notified when we publish new tutorials, 
                insights, and educational content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white px-8"
                  onClick={() => handleVideoClick()}
                >
                  <Youtube className="mr-2 h-5 w-5" />
                  Subscribe Now
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8"
                  onClick={() => handleVideoClick()}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View All Videos
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeSection;