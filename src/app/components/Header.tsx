import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Heart, Menu, X, LogOut, User, Home, Search, Sparkles, TrendingUp, Target, MessageSquare } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Heart className="size-5 fill-gray-500 text-gray-500" />
            </div>
            <span className="text-xl font-semibold text-gray-900">GiveLocal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Home className="size-4" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Search className="size-4" />
              <span>Browse</span>
            </Link>
            <Link to="/quiz" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Sparkles className="size-4" />
              <span>Match</span>
            </Link>
            {user && (
              <>
                <Link to="/create" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Target className="size-4" />
                  <span>Start</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <TrendingUp className="size-4" />
                  <span>Impact</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
                  <User className="size-4 text-gray-500" />
                  <span>{user.user_metadata?.name}</span>
                </div>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-sm">
                  <LogOut className="size-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-sm">
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full gap-2"
            >
              <MessageSquare className="size-4" />
              <span>AI Helper</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="size-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <Search className="size-4" />
              <span>Browse</span>
            </Link>
            <Link
              to="/quiz"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <Sparkles className="size-4" />
              <span>Match</span>
            </Link>
            {user && (
              <>
                <Link
                  to="/create"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  <Target className="size-4" />
                  <span>Start</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  <TrendingUp className="size-4" />
                  <span>Impact</span>
                </Link>
              </>
            )}
            <div className="border-t pt-3 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-blue-50 rounded-lg flex items-center gap-2">
                    <User className="size-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{user.user_metadata?.name}</span>
                  </div>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    <LogOut className="size-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}