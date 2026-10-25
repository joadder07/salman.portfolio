import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Lock, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCurrentUser } from '@/api/auth.api';
import { useSiteSettings } from '@/api/settings.api';

export const Header: React.FC = () => {
  const { data: user } = useCurrentUser();
  const { data: settings } = useSiteSettings();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const portfolioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic social URLs from database / settings
  const facebookUrl = settings?.socialLinks?.facebook || settings?.facebookUrl || '#';
  const instagramUrl = settings?.socialLinks?.instagram || settings?.instagramUrl || '#';
  const linkedinUrl = settings?.socialLinks?.linkedin || '#';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns and mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsPortfolioOpen(false);
    setIsContactOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (portfolioDropdownRef.current && !portfolioDropdownRef.current.contains(target)) {
        if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
        setIsPortfolioOpen(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(target)) {
        if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
        setIsContactOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
      if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsPortfolioOpen(false);
        setIsContactOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Portfolio dropdown handlers
  const handlePortfolioMouseEnter = () => {
    if (portfolioTimeoutRef.current) {
      clearTimeout(portfolioTimeoutRef.current);
      portfolioTimeoutRef.current = null;
    }
    setIsPortfolioOpen(true);
  };

  const handlePortfolioMouseLeave = () => {
    portfolioTimeoutRef.current = setTimeout(() => {
      setIsPortfolioOpen(false);
    }, 150);
  };

  const handlePortfolioToggle = () => {
    if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
    setIsPortfolioOpen((prev) => !prev);
  };

  // Contact dropdown handlers
  const handleContactMouseEnter = () => {
    if (contactTimeoutRef.current) {
      clearTimeout(contactTimeoutRef.current);
      contactTimeoutRef.current = null;
    }
    setIsContactOpen(true);
  };

  const handleContactMouseLeave = () => {
    contactTimeoutRef.current = setTimeout(() => {
      setIsContactOpen(false);
    }, 150);
  };

  const handleContactToggle = () => {
    if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    setIsContactOpen((prev) => !prev);
  };

  const handleItemClick = (href: string) => {
    if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
    if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    setIsPortfolioOpen(false);
    setIsContactOpen(false);
    setIsMobileMenuOpen(false);

    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    }
  };

  const portfolioItems = [
    { label: 'Photography', href: '/#photography' },
    { label: 'Videos', href: '/#videos' },
    { label: 'Art', href: '/#art' },
    { label: 'Hobbies & Pets', href: '/#hobbies' },
  ];

  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/about';
  const hasTransparentHeroAtTop = isHomePage || isAboutPage;

  // Solid dark transparent background on scroll, or on pages without a hero banner at top
  const isScrolledDark = isScrolled || !hasTransparentHeroAtTop;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-3.5 xs:py-4 sm:py-7 border-none ${
        isScrolledDark
          ? 'bg-black/65 backdrop-blur-md shadow-lg shadow-black/25'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Signature Brand/Logo in Hero Brush Font - Hidden at top of home, always visible on /about and subpages */}
        <div
          className={`flex items-center transition-all duration-300 ease-in-out min-w-0 flex-1 overflow-visible py-1 ${
            isScrolled || !isHomePage
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-brush text-[11px] min-[375px]:text-xs xs:text-[13px] sm:text-2xl md:text-3xl text-white tracking-normal sm:tracking-wide uppercase hover:opacity-85 transition-opacity whitespace-nowrap select-none py-1 sm:py-2 leading-normal sm:leading-relaxed overflow-visible inline-block outline-none focus:outline-none focus-visible:outline-none ring-0 border-none"
            style={{
              fontFamily: "'Rock Salt', cursive",
              textShadow: 'none',
              filter: 'none',
            }}
          >
            SALMAN SAJID JOADDER
          </Link>
        </div>

        {/* Right Area: Navigation Links */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-8 md:gap-10 shrink-0">
          {/* Desktop Navigation Links: DASHBOARD -> PORTFOLIO -> CONTACT -> ABOUT SALMAN */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white">
            {/* 1. Dashboard (with lock icon) */}
            <Link
              to={user ? '/admin' : '/admin/login'}
              className="nav-entrance-1 text-xs sm:text-[13px] tracking-[0.2em] uppercase font-semibold text-white hover:text-white/80 transition-colors flex items-center gap-1.5 py-1"
              title="Admin Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-white stroke-[2]" />
              <span>DASHBOARD</span>
            </Link>

            {/* 2. Portfolio Dropdown */}
            <div
              ref={portfolioDropdownRef}
              className="nav-entrance-2 relative group"
              onMouseEnter={handlePortfolioMouseEnter}
              onMouseLeave={handlePortfolioMouseLeave}
            >
              <button
                type="button"
                onClick={handlePortfolioToggle}
                className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors duration-200 py-1 cursor-pointer focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isPortfolioOpen}
              >
                <span>PORTFOLIO</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-200 text-white ${
                    isPortfolioOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isPortfolioOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-52 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2">
                    {portfolioItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemClick(item.href);
                        }}
                        className="block px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Contact Dropdown */}
            <div
              ref={contactDropdownRef}
              className="nav-entrance-3 relative group"
              onMouseEnter={handleContactMouseEnter}
              onMouseLeave={handleContactMouseLeave}
            >
              <button
                type="button"
                onClick={handleContactToggle}
                className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors duration-200 py-1 cursor-pointer focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isContactOpen}
              >
                <span>CONTACT</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-200 text-white ${
                    isContactOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Contact Dropdown Menu */}
              {isContactOpen && (
                <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full pt-3 w-52 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2">
                    {/* Facebook Link */}
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsContactOpen(false)}
                      className="flex items-center justify-between px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span>Facebook</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                    </a>

                    {/* Instagram Link */}
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsContactOpen(false)}
                      className="flex items-center justify-between px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span>Instagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                    </a>

                    {/* LinkedIn Link */}
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsContactOpen(false)}
                      className="flex items-center justify-between px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                    </a>

                    {/* Divider */}
                    <div className="my-1 border-t border-white/10" />

                    {/* Direct / Send a Message */}
                    <a
                      href="/#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        handleItemClick('/#contact');
                      }}
                      className="block px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Send a Message
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 4. About Salman (on the far right end, direct Link to /about) */}
            <div className="nav-entrance-4 pl-4 md:pl-5 border-l border-white/20">
              <Link
                to="/about"
                className={`text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors duration-200 py-1 relative group/nav whitespace-nowrap block ${
                  location.pathname === '/about' ? 'text-white' : ''
                }`}
              >
                <span>ABOUT SALMAN</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-200 ${
                    location.pathname === '/about' ? 'w-full' : 'w-0 group-hover/nav:w-full'
                  }`}
                />
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Hamburger Button */}
          <div className="nav-entrance-mobile flex md:hidden items-center gap-1.5 shrink-0">
            <Link
              to={user ? '/admin' : '/admin/login'}
              className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition-all rounded-lg"
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <Lock className="w-4 h-4 text-white/70" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center text-white hover:text-white/80 active:scale-95 transition-all rounded-lg focus:outline-none cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop Overlay - closes menu on tap outside */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden relative z-50 mt-3 mx-3 xs:mx-4 bg-black/95 backdrop-blur-2xl border border-white/10 p-5 xs:p-6 shadow-2xl flex flex-col gap-4 xs:gap-5 rounded-2xl max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to={user ? '/admin' : '/admin/login'}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white flex items-center gap-2 py-1"
          >
            <Lock className="w-3.5 h-3.5 text-white/70" />
            <span>Dashboard</span>
          </Link>

          <div>
            <div className="text-sm font-bold uppercase tracking-[0.22em] text-white mb-2.5">
              PORTFOLIO
            </div>
            <div className="grid grid-cols-2 gap-2 pl-3 border-l border-white/15">
              {portfolioItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.href);
                  }}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white py-1.5 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-[0.22em] text-white mb-2.5">
              CONTACT
            </div>
            <div className="flex flex-col gap-1.5 pl-3 border-l border-white/15">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white py-1.5 transition-colors flex items-center justify-between"
              >
                <span>Facebook</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white py-1.5 transition-colors flex items-center justify-between"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white py-1.5 transition-colors flex items-center justify-between"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
              </a>
              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick('/#contact');
                }}
                className="text-xs font-bold uppercase tracking-[0.18em] text-white hover:text-white py-2 pt-2.5 border-t border-white/10 transition-colors"
              >
                Send a Message
              </a>
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/15">
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-[0.22em] text-white hover:text-white/70 transition-colors block py-1"
            >
              ABOUT SALMAN
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};


