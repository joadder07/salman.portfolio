import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Camera,
  Video,
  PawPrint,
  Award,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Palette,
  Images,
} from 'lucide-react';
import { useCurrentUser, useLogout } from '@/api/auth.api';
import { usePendingCommentsCount, useUnreadMessagesCount } from '@/api/interactions.api';
import toast from 'react-hot-toast';

export const AdminLayout: React.FC = () => {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const { data: pendingComments = 0 } = usePendingCommentsCount();
  const { data: unreadMessages = 0 } = useUnreadMessagesCount();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch {
      toast.error('Logout error');
    }
  };

  const navLinks = [
    { label: 'Overview', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Hero Gallery', to: '/admin/hero-gallery', icon: <Images className="w-4 h-4" /> },
    { label: 'Education', to: '/admin/education', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Photography', to: '/admin/photography', icon: <Camera className="w-4 h-4" /> },
    { label: 'Videos', to: '/admin/videos', icon: <Video className="w-4 h-4" /> },
    { label: 'Art & Hobbies', to: '/admin/art-and-hobbies', icon: <Palette className="w-4 h-4" /> },
    { label: 'Pets', to: '/admin/pets', icon: <PawPrint className="w-4 h-4" /> },
    { label: 'Achievements', to: '/admin/achievements', icon: <Award className="w-4 h-4" /> },
    {
      label: 'Comments',
      to: '/admin/comments',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: pendingComments > 0 ? pendingComments : undefined,
      badgeColor: 'bg-white text-black font-semibold',
    },
    {
      label: 'Messages',
      to: '/admin/messages',
      icon: <Mail className="w-4 h-4" />,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
      badgeColor: 'bg-white text-black font-semibold',
    },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 glass border-r border-white/10 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header - Links back to public homepage */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 group transition-all duration-200 hover:opacity-80 cursor-pointer"
              title="Return to Public Website"
            >
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md transition-transform duration-200 group-hover:scale-105">
                P
              </div>
              <div>
                <span className="text-sm font-bold block text-foreground group-hover:text-primary transition-colors">
                  Control Center
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Portfolio Admin</span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/admin'}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] text-white font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary" /> Live Portfolio
            </span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-foreground truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-white/5"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 glass-nav px-4 sm:px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold text-foreground">Management Console</h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
