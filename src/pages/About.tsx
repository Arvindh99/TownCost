import { Layout } from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, FileText, Coffee, ExternalLink, Heart } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-2xl">
            About TownCost
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Empowering you to make informed financial decisions with global cost
            of living insights and personal expense tracking.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Github className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Open Source</CardTitle>
              <CardDescription>Explore the code</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check out the source code, contribute, or report issues on our
                GitHub repository.
              </p>
              <Button asChild className="w-full" variant="outline">
                <a
                  href="https://github.com/yourusername/TownCost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Guides & APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Read the detailed documentation to learn how to maximize your
                use of TownCost.
              </p>
              <Button asChild className="w-full" variant="outline">
                <a href="https://github.com/Arvindh99/TownCost/blob/main/documentation.pdf" target="_blank" rel="noopener noreferrer">
                  Read Docs <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Coffee className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Support Us</CardTitle>
              <CardDescription>Fuel the development</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you find TownCost helpful, consider buying us a coffee to
                support future updates.
              </p>
              <Button asChild className="w-full" variant="default">
                <a
                  href="https://buymeacoffee.com/arvindh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy me a Coffee <Heart className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
