import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  const formData = new FormData(e.target as HTMLFormElement);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Check backend health first
  const checkBackendHealth = async (apiUrl: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const healthResponse = await fetch(`${apiUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return healthResponse.ok;
    } catch {
      return false;
    }
  };

  // Retry logic for cold start issues
  const maxRetries = 3;
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Login attempt ${attempt}/${maxRetries} with:`, { email, password });
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('Using API URL:', apiUrl);
      
      // Check backend health first
      if (attempt === 1) {
        console.log('Checking backend health...');
        const isHealthy = await checkBackendHealth(apiUrl);
        if (!isHealthy) {
          console.log('Backend not ready, will retry...');
          lastError = new Error('Backend not ready');
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        console.log('Backend is healthy, proceeding with login...');
      }
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', response.status);

      // Safely handle non-JSON responses
      let data: any = {};
      try {
        data = await response.json();
      } catch {
        console.warn('No JSON response received');
      }
      
      console.log('Response data:', data);
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('loginTime', Date.now().toString());
        console.log('Login successful, reloading page...');
        window.location.reload();
        return; // Success, exit retry loop
      } else {
        // Don't retry on authentication errors (400, 401)
        if (response.status === 400 || response.status === 401) {
          alert(data.message || `Login failed (status: ${response.status})`);
          return;
        }
        // Handle 404 specifically (might be cold start issue)
        if (response.status === 404) {
          lastError = new Error(`Endpoint not found (404) - possible cold start issue`);
          console.log('404 error - likely cold start, will retry...');
        } else {
          // Retry on other server errors (500, 502, 503, 504)
          lastError = new Error(`Server error: ${response.status}`);
        }
      }
    } catch (error: any) {
      console.error(`Login attempt ${attempt} error:`, error);
      lastError = error;
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries failed
  console.error('All login attempts failed:', lastError);
  alert(`Network error: Could not connect to backend after ${maxRetries} attempts. Please try again.`);
  setIsLoading(false);
};


  return (
    <Card className="shadow-custom-lg border-border/50">
      <CardHeader className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto flex items-center justify-center"
        >
          <span className="text-white font-bold text-2xl">P</span>
        </motion.div>
        
        <div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your admin dashboard
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="rounded border-border" />
              <span>Remember me</span>
            </label>
            <Button variant="link" className="text-sm">
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>


      </CardContent>
    </Card>
  );
};

export default AdminLogin;