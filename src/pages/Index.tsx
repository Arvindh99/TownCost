import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  PieChart,
  Users,
  Shield,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function Index() {
  const { authUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Logged in user without user data → setup
  if (authUser && !userData) {
    return <ProfileSetupForm />;
  }

  // Logged in user with user data → redirect to dashboard
  if (authUser && userData) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → show landing page
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium backdrop-blur animate-fade-in">
              <TrendingUp className="h-4 w-4" />
              Smart expense tracking with community insights
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-slide-up">
              Know what you spend.
              <br />
              <span className="text-primary-foreground/80">
                See how you compare.
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: '100ms' }}
            >
              Track your living expenses, visualize spending patterns, and
              discover how your costs compare with others in your neighborhood.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <Link to="/auth">
                <Button size="lg" className="gap-2 px-8">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-primary-foreground/60">
                No credit card required
              </p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 100L60 91.7C120 83 240 67 360 58.3C480 50 600 50 720 58.3C840 67 960 83 1080 83.3C1200 83 1320 67 1380 58.3L1440 50V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Everything you need to manage costs
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Simple tools to track, analyze, and optimize your living expenses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow mb-6">
                <PieChart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Personal Dashboard
              </h3>
              <p className="text-muted-foreground">
                Visualize your spending with beautiful charts. Track monthly
                totals, category breakdowns, and trends over time.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow mb-6">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Community Insights
              </h3>
              <p className="text-muted-foreground">
                Compare your expenses with anonymized data from your city,
                state, and country. See where you stand.
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow mb-6">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Privacy First
              </h3>
              <p className="text-muted-foreground">
                Your data is encrypted and never shared individually. Community
                insights use only anonymized, aggregated data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Ready to take control of your expenses?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of users already tracking their cost of living
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2 px-8">
                Start Tracking Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">
                TownCost
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 TownCost. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
