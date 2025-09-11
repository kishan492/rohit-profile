import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageFooter: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Footer</h1>
          <p className="text-muted-foreground">Edit footer content and social media links</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input id="brand-name" defaultValue="Portfolio" />
          </div>
          <div>
            <Label htmlFor="brand-description">Brand Description</Label>
            <Textarea 
              id="brand-description" 
              defaultValue="Building digital experiences that bridge innovation and accessibility. Let's create something amazing together."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" defaultValue="https://linkedin.com/in/yourprofile" />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter/X URL</Label>
              <Input id="twitter" defaultValue="https://twitter.com/yourhandle" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" defaultValue="https://instagram.com/yourhandle" />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" defaultValue="https://facebook.com/yourpage" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input id="youtube" defaultValue="https://youtube.com/@yourchannel" />
            </div>
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" defaultValue="https://github.com/yourusername" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="footer-email">Email Address</Label>
              <Input id="footer-email" defaultValue="hello@portfolio.com" />
            </div>
            <div>
              <Label htmlFor="footer-phone">Phone Number</Label>
              <Input id="footer-phone" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>
          <div>
            <Label htmlFor="footer-address">Address</Label>
            <Input id="footer-address" defaultValue="San Francisco, CA" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Copyright</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="copyright-year">Copyright Year</Label>
            <Input id="copyright-year" defaultValue="2024" />
          </div>
          <div>
            <Label htmlFor="copyright-text">Copyright Text</Label>
            <Input id="copyright-text" defaultValue="Portfolio. Made with ❤️ All rights reserved." />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full md:w-auto">
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </motion.div>
  );
};

export default ManageFooter;