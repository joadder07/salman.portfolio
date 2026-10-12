import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Lock } from 'lucide-react';
import { useCurrentUser } from '@/api/auth.api';

export const Header: React.FC = () => {
  const { data: user } = useCurrentUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsPortfolioOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPortfolioOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsPortfolioOpen(false);
    }, 150);
  };

  const handleToggle = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPortfolioOpen((prev) => !prev);
  };

  const handleItemClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPortfolioOpen(false);
  };

  const portfolioItems = [
    { label: 'Photography', href: '/#photography' },
    { label: 'Videos', href: '/#videos' },
    { label: 'Art', href: '/#art' },
    { label: 'Pets', href: '/#pets' },
    { label: 'Hobbies', href: '/#hobbies' },
    { label: 'Books', href: '/#books' },
    { label: 'Achievements', href: '/#achievements' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'opacity-100 pointer-events-auto translate-y-0 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5 sm:py-4'
          : 'opacity-0 pointer-events-none -translate-y-3 bg-transparent border-transparent py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Far Left: 'Salman Sajid Joadder' in clean modern sans-serif */}
        <div className="flex-1 flex justify-start items-center">
          <a
            href="/#"
            className="font-sans font-light tracking-wide text-xs sm:text-sm text-white/90 hover:text-white transition-colors uppercase whitespace-nowrap"
          >
            Salman Sajid Joadder
          </a>
        </div>

        {/* Center: Exactly Two Links ('About Salman' and 'Portfolio' Dropdown) */}
        <nav className="flex items-center gap-8 sm:gap-12 text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white/80">
          {/* About Salman link */}
          <a
            href="/#about"
            className="hover:text-white transition-colors duration-200 py-1 relative group/about"
          >
            <span>About Salman</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white transition-all duration-200 group-hover/about:w-full" />
          </a>

          {/* Portfolio Dropdown */}
          <div
            ref={dropdownRef}
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={handleToggle}
              className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 py-1 cursor-pointer focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isPortfolioOpen}
            >
              <span>PORTFOLIO</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 text-white/60 ${
                  isPortfolioOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isPortfolioOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-48 z-50">
                <div className="bg-neutral-950/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2">
                  {portfolioItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={handleItemClick}
                      className="block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Far Right: Subtle Dashboard / ADMIN link */}
        <div className="flex-1 flex justify-end items-center">
          <Link
            to={user ? '/admin' : '/admin/login'}
            className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1.5 py-1"
            title="Admin Dashboard"
          >
            <Lock className="w-3 h-3 text-white/40" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
