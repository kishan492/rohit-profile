import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLogin from '@/components/admin/AdminLogin';
import { useAuth } from '@/hooks/useAuth';

// Lazy load admin components
const DashboardHome = lazy(() => import('@/components/admin/DashboardHome'));
const ManageHome = lazy(() => import('@/components/admin/ManageHome'));
const ManageAbout = lazy(() => import('@/components/admin/ManageAbout'));
const ManageServices = lazy(() => import('@/components/admin/ManageServices'));
const ManageTestimonials = lazy(() => import('@/components/admin/ManageTestimonials'));
const ManageAchievements = lazy(() => import('@/components/admin/ManageAchievements'));
const ManageYouTube = lazy(() => import('@/components/admin/ManageYouTube'));
const ManageTeam = lazy(() => import('@/components/admin/ManageTeam'));
const ManageBlog = lazy(() => import('@/components/admin/ManageBlog'));
const ManageContact = lazy(() => import('@/components/admin/ManageContact'));
const ManageFooter = lazy(() => import('@/components/admin/ManageFooter'));
const SiteSettings = lazy(() => import('@/components/admin/SiteSettings'));
const ManageBranding = lazy(() => import('@/components/admin/ManageBranding'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

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
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </AdminLayout>
  );
};

export default AdminDashboard;