import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { EmailAuthForm } from '@/components/auth/EmailAuthForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp, Shield, Users, PieChart } from 'lucide-react';

export default function Auth() {
  const { authUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser && !loading) {
      navigate('/');
    }
  }, [authUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="flex-1 gradient-hero p-8 lg:p-12 flex flex-col justify-between text-primary-foreground">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-semibold">TownCost</span>
        </div>

        <div className="max-w-md space-y-8 py-12">
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
            Track expenses,
            <br />
            discover insights
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Join thousands of users tracking their living costs and comparing
            with their community.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                <PieChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Personal Dashboard</h3>
                <p className="text-sm text-primary-foreground/70">
                  Track and visualize your monthly expenses
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Community Insights</h3>
                <p className="text-sm text-primary-foreground/70">
                  Compare with others in your city
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Privacy First</h3>
                <p className="text-sm text-primary-foreground/70">
                  Your data is always anonymized and secure
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © 2026 TownCost. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md animate-scale-in shadow-card border-0 bg-card">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-display text-2xl">
              Welcome to TownCost
            </CardTitle>
            <CardDescription>
              Sign in with your Email account to start tracking your expenses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <EmailAuthForm />

            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy
              Policy. Your data is encrypted and never shared without your
              consent.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
