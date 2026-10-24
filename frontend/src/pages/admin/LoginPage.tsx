import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/api/auth.api';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch {
      toast.error('Invalid credentials. Check email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Back to public site */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Portfolio
      </Link>

      <div className="w-full max-w-md">
        <Card className="p-8 shadow-2xl border border-white/10 relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Secure authentication via JWT & bcrypt
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@portfolio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 mt-4 shadow-xl shadow-primary/25"
              disabled={loginMutation.isPending}
            >
              <Lock className="w-4 h-4" />
              {loginMutation.isPending ? 'Verifying...' : 'Authenticate'}
            </Button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground mt-6 font-mono">
            Default: admin@portfolio.com / Admin@123456
          </p>
        </Card>
      </div>
    </div>
  );
};
