import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header stays on top */}
      <Header />
      {/* Main content relative z-index to allow dropdown portal above header */}
      <main className="relative z-0">{children}</main>
    </div>
  );
}
