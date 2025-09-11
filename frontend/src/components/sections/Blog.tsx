import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Blog: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        delayChildren: 0.1,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    },
  };

  const blogPosts = [
    {
      title: 'The Future of Web Development: Trends to Watch in 2024',
      excerpt: 'Explore the latest trends shaping the web development landscape, from AI integration to serverless architecture and beyond.',
      author: 'John Doe',
      date: 'December 15, 2023',
      readTime: '8 min read',
      category: 'Technology',
      thumbnail: 'Web',
      tags: ['React', 'AI', 'Trends'],
    },
    {
      title: 'Real Estate Investment: A Beginner\'s Guide to Success',
      excerpt: 'Learn the fundamentals of real estate investing, from market analysis to financing options and risk management strategies.',
      author: 'David Kim',
      date: 'December 10, 2023',
      readTime: '12 min read',
      category: 'Real Estate',
      thumbnail: 'Real',
      tags: ['Investment', 'Strategy', 'Finance'],
    },
    {
      title: 'Building a Personal Brand Through Content Creation',
      excerpt: 'Discover how to leverage content creation to build a strong personal brand and grow your professional network.',
      author: 'Emily Rodriguez',
      date: 'December 5, 2023',
      readTime: '6 min read',
      category: 'Marketing',
      thumbnail: 'Brand',
      tags: ['Branding', 'Content', 'Growth'],
    },
    {
      title: 'Design Systems: Creating Consistency at Scale',
      excerpt: 'Learn how to build and maintain design systems that ensure consistency across large-scale applications and teams.',
      author: 'Michael Chen',
      date: 'November 28, 2023',
      readTime: '10 min read',
      category: 'Design',
      thumbnail: 'Design',
      tags: ['Design', 'Systems', 'UI/UX'],
    },
    {
      title: 'The Psychology of User Experience: Understanding User Behavior',
      excerpt: 'Dive deep into user psychology and learn how to create experiences that truly resonate with your target audience.',
      author: 'Sarah Johnson',
      date: 'November 20, 2023',
      readTime: '9 min read',
      category: 'UX',
      thumbnail: 'UX',
      tags: ['Psychology', 'UX', 'Research'],
    },
    {
      title: 'Scaling Your Business: From Startup to Success',
      excerpt: 'Practical strategies and insights for scaling your business effectively while maintaining quality and culture.',
      author: 'Lisa Thompson',
      date: 'November 15, 2023',
      readTime: '11 min read',
      category: 'Business',
      thumbnail: 'Biz',
      tags: ['Business', 'Growth', 'Strategy'],
    },
  ];

  const categories = ['All', 'Technology', 'Real Estate', 'Marketing', 'Design', 'UX', 'Business'];

  return (
    <section id="blog" className="py-20 bg-muted/30 min-h-screen flex items-center">
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
              Latest <span className="text-gradient">Articles</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on technology, business, and digital innovation
            </p>
          </motion.div>

          {/* Categories Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Featured Post */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="bg-card rounded-3xl overflow-hidden shadow-custom-lg border border-border/50">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="aspect-video lg:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-6xl font-bold text-primary/50">
                    Featured
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 lg:py-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                      Featured
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {blogPosts[0].category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                    {blogPosts[0].title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {blogPosts[0].date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  
                  <Button className="group">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Blog Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group bg-card rounded-3xl overflow-hidden shadow-custom hover:shadow-custom-lg transition-all duration-300 border border-border/50 hover:border-primary/20"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                  <div className="text-4xl font-bold text-primary/50">
                    {post.thumbnail}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm text-primary text-sm rounded-full">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-muted text-xs rounded"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    Read More
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
              <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest articles, tutorials, and insights 
                delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="px-8">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;