import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Activity,
  Star,
  Globe
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardHome: React.FC = () => {
  const stats = [
    {
      title: 'Total Views',
      value: '12,543',
      change: '+12.3%',
      icon: Eye,
      color: 'text-blue-500',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8.1%',
      icon: Users,
      color: 'text-green-500',
      trend: 'up'
    },
    {
      title: 'Messages',
      value: '56',
      change: '+23.4%',
      icon: MessageSquare,
      color: 'text-purple-500',
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+1.2%',
      icon: TrendingUp,
      color: 'text-orange-500',
      trend: 'up'
    },
  ];

  const recentActivities = [
    {
      action: 'New blog post published',
      time: '2 hours ago',
      icon: Calendar,
    },
    {
      action: 'Service updated: Web Development',
      time: '4 hours ago',
      icon: Activity,
    },
    {
      action: 'New testimonial received',
      time: '6 hours ago',
      icon: Star,
    },
    {
      action: 'Team member added',
      time: '1 day ago',
      icon: Users,
    },
    {
      action: 'Site settings updated',
      time: '2 days ago',
      icon: Globe,
    },
  ];

  const quickActions = [
    { title: 'Add New Post', description: 'Create a new blog post', action: 'Create' },
    { title: 'Update Services', description: 'Modify service offerings', action: 'Update' },
    { title: 'Review Messages', description: 'Check contact form submissions', action: 'Review' },
    { title: 'Site Settings', description: 'Configure site preferences', action: 'Configure' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your portfolio.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="shadow-custom hover:shadow-custom-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.color} flex items-center gap-1`}>
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="shadow-custom">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-custom">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-border hover:border-primary/20 transition-all duration-200"
                >
                  <h4 className="font-medium mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    {action.action}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Preview Button */}
      <motion.div variants={itemVariants} className="text-center">
        <Card className="shadow-custom bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-2">Preview Your Portfolio</h3>
            <p className="text-muted-foreground mb-6">
              See how your changes look on the live site before publishing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Preview Changes
              </Button>
              <Button variant="outline" size="lg">
                Restore Previous Version
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHome;