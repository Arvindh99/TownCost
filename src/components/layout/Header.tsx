import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut, User, Search } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useLocationById } from '@/hooks/useLocations';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import logo from '@/assets/logo_without_bg.png';

export function Header() {
  const { authUser, profile, userData, signOut } = useAuth();
  const { data: location } = useLocationById(userData?.location_id);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (authUser?.user_metadata?.full_name) {
      return authUser.user_metadata.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return authUser?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const displayName =
    profile?.name || authUser?.user_metadata?.full_name || 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="TownCost" className="h-9 w-9" />
          <span className="font-display text-xl font-semibold">TownCost</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {authUser && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/expenses">Expenses</NavLink>
              <NavLink to="/insights">Community Insights</NavLink>
              <NavLink to="/about">About</NavLink>
            </>
          )}

          {authUser ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="h-9 w-9 rounded-full"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={authUser.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-md">
                  <div className="px-3 py-2 text-sm">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {authUser.email}
                    </p>
                    {location && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        {location.city}, {location.state}
                      </p>
                    )}
                  </div>

                  <div className="border-t" />

                  <DropdownLink to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownLink>

                  <button
                    onClick={signOut}
                    className="flex w-full items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72">
              <div className="mt-6 flex flex-col gap-4">
                {authUser && (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{displayName}</p>
                        {location && (
                          <p className="text-xs text-muted-foreground">
                            {location.city}, {location.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t my-2" />

                    <MobileLink to="/dashboard">Dashboard</MobileLink>
                    <MobileLink to="/expenses">Expenses</MobileLink>
                    <MobileLink to="/insights">Community Insights</MobileLink>
                    <MobileLink to="/about">About</MobileLink>
                    <MobileLink to="/profile">Profile</MobileLink>

                    <div className="border-t my-2" />

                    <button
                      onClick={signOut}
                      className="flex items-center gap-2 text-sm text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                )}

                {!authUser && <MobileLink to="/auth">Get Started</MobileLink>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to}>
      <Button variant="ghost" size="sm">
        {children}
      </Button>
    </Link>
  );
}

function DropdownLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 text-sm hover:bg-accent"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link to={to} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
      {children}
    </Link>
  );
}
