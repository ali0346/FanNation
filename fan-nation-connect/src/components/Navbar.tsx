import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Home, Search, Trophy, User, PieChart, ChevronDown, Menu, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, FormEvent } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=threads`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-background border-b shadow-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="flex items-center mr-6">
          <span className="text-xl font-bold text-primary">
            Fan<span className="text-blue-600">Nation</span>
          </span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col gap-4 py-4">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link to="/discover" className="flex items-center gap-2 text-lg font-semibold">
                <User className="h-5 w-5" />
                Discover Sports
              </Link>
              <Link to="/threads" className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5" />
                All Threads
              </Link>
              <Link to="/leaderboard" className="flex items-center gap-2 text-lg font-semibold">
                <Trophy className="h-5 w-5" />
                Leaderboard
              </Link>
              <Link to="/polls" className="flex items-center gap-2 text-lg font-semibold">
                <PieChart className="h-5 w-5" />
                Polls
              </Link>
              {isAuthenticated && user?.role === "admin" && (
                <Link to="/admin" className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated && (user?.role === "moderator" || user?.role === "admin") && (
                <Link to="/moderator" className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5" />
                  Moderator Dashboard
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 flex-1">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
            <Home className="w-5 h-5 mr-1" />
            <span>Home</span>
          </Link>
          
          <Link to="/discover" className="flex items-center text-muted-foreground hover:text-foreground">
            <User className="w-5 h-5 mr-1" />
            <span>Discover</span>
          </Link>
          
          <Link to="/threads" className="flex items-center text-muted-foreground hover:text-foreground">
            <MessageSquare className="w-5 h-5 mr-1" />
            <span>Threads</span>
          </Link>
          
          <Link to="/leaderboard" className="flex items-center text-muted-foreground hover:text-foreground">
            <Trophy className="w-5 h-5 mr-1" />
            <span>Leaderboard</span>
          </Link>
          
          <Link to="/polls" className="flex items-center text-muted-foreground hover:text-foreground">
            <PieChart className="w-5 h-5 mr-1" />
            <span>Polls</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild className={isAuthenticated && (user?.role === "admin" || user?.role === "moderator") ? "flex" : "hidden"}>
              <Button variant="ghost" className="flex items-center gap-1 px-2">
                Dashboard
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {user?.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link to="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              {(user?.role === "moderator" || user?.role === "admin") && (
                <DropdownMenuItem asChild>
                  <Link to="/moderator">Moderator Dashboard</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className={`transition-all duration-300 ease-in-out ${showSearch ? 'w-full md:w-80' : 'w-0'} overflow-hidden absolute md:static top-16 left-0 right-0 md:ml-auto md:mr-4 px-4 md:px-0 bg-background`}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search discussions..."
              className="w-full pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right side of navbar */}
        <div className="flex items-center ml-auto space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => navigate('/search')}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link to="/notifications" aria-label="Notifications">
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      3
                    </span>
                  </div>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture} alt={user?.username} />
                      <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === "moderator" && (
                    <DropdownMenuItem asChild>
                      <Link to="/moderator">Moderator Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;