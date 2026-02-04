import { useState, useRef, useEffect } from 'react'; // Import hooks
import { useAuth } from '@/contexts/AuthContext';
import { useLocationById } from '@/hooks/useLocations';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo_without_bg.png';

export function Header() {
  const { authUser, profile, userData, signOut } = useAuth();
  const { data: location } = useLocationById(userData?.location_id);

  // 1. Manual State for Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Logic to close dropdown when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (authUser?.user_metadata?.full_name) {
      return authUser.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return authUser?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const displayName =
    profile?.name || authUser?.user_metadata?.full_name || 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg">
            <img
              src={logo}
              alt="TownCost Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            TownCost
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {authUser && (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/expenses">
                <Button variant="ghost" size="sm">
                  Expenses
                </Button>
              </Link>
              <Link to="/insights">
                <Button variant="ghost" size="sm">
                  Community Insights
                </Button>
              </Link>

              <Link to="/about">
                <Button variant="ghost" size="sm">
                  About
                </Button>
              </Link>
            </>
          )}

          {authUser ? (
            /* 3. Replaced DropdownMenu with Relative Parent + Absolute Menu */
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={authUser.user_metadata?.avatar_url}
                    alt={authUser.email || ''}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {/* Manual Dropdown Content */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {displayName}
                      </p>
                      <p className="text-[11px] font-normal leading-none">
                        {authUser.email}
                      </p>
                      {location && (
                        <p className="text-[11px] font-normal leading-none mt-1">
                          {location.city}, {location.state}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="my-1 h-px bg-muted" /> {/* Separator */}
                  <Link
                    to="/profile"
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                  <div className="my-1 h-px bg-muted" /> {/* Separator */}
                  <div
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      signOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
