
import { LogOut, User, Search, Grid2x2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PATHS } from '@/routes/paths';

import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.HOME);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <Link 
              to={PATHS.HOME} 
              className="text-2xl font-bold bg-magic-gradient bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              MTG Deck Builder
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to={PATHS.HOME} className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Procurar Cartas</span>
                </Link>
              </Button>

              {user && (
                <Button variant="ghost" asChild>
                  <Link to={PATHS.DASHBOARD} className="flex items-center space-x-2">
                    <Grid2x2 className="w-4 h-4" />
                    <span>Meus Decks</span>
                  </Link>
                </Button>
              )}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuItem asChild>
                    <Link to={PATHS.DASHBOARD} className="flex items-center space-x-2">
                      <Grid2x2 className="w-4 h-4" />
                      <span>My Decks</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to={PATHS.LOGIN}>Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to={PATHS.REGISTER}>Criar Conta</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
