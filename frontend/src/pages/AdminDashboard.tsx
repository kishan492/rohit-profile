import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLogin from '@/components/admin/AdminLogin';
import { useAuth } from '@/hooks/useAuth';
import DashboardHome from '@/components/admin/DashboardHome';
import ManageHome from '@/components/admin/ManageHome';
import ManageAbout from '@/components/admin/ManageAbout';
import ManageServices from '@/components/admin/ManageServices';
import ManageTestimonials from '@/components/admin/ManageTestimonials';
import ManageAchievements from '@/components/admin/ManageAchievements';
import ManageYouTube from '@/components/admin/ManageYouTube';
import ManageTeam from '@/components/admin/ManageTeam';
import ManageBlog from '@/components/admin/ManageBlog';
import ManageContact from '@/components/admin/ManageContact';
import ManageFooter from '@/components/admin/ManageFooter';
import SiteSettings from '@/components/admin/SiteSettings';
import ManageBranding from '@/components/admin/ManageBranding';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <AdminLogin />
        </motion.div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="home" element={<ManageHome />} />
        <Route path="about" element={<ManageAbout />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="testimonials" element={<ManageTestimonials />} />
        <Route path="achievements" element={<ManageAchievements />} />
        <Route path="youtube" element={<ManageYouTube />} />
        <Route path="team" element={<ManageTeam />} />
        <Route path="blog" element={<ManageBlog />} />
        <Route path="contact" element={<ManageContact />} />
        <Route path="footer" element={<ManageFooter />} />
        <Route path="branding" element={<ManageBranding />} />
        <Route path="settings" element={<SiteSettings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;