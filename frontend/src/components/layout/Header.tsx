import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Lock, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentUser } from '@/api/auth.api';
import { useSiteSettings } from '@/api/settings.api';

export const Header: React.FC = () => {
  const { data: user } = useCurrentUser();
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobilePortfolioOpen, setIsMobilePortfolioOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);

  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const portfolioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic social URLs from database / settings
  const facebookUrl = settings?.socialLinks?.facebook || settings?.facebookUrl || '#';
  const instagramUrl = settings?.socialLinks?.instagram || settings?.instagramUrl || '#';
  const linkedinUrl = settings?.socialLinks?.linkedin || '#';
  const youtubeUrl = settings?.socialLinks?.youtube || '#';

  const isScrolledRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const updateScrolled = () => {
      const scrolled = window.scrollY > 30;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrolled);
      }
    };

    updateScrolled();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns and mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobilePortfolioOpen(false);
    setIsMobileContactOpen(false);
    setIsPortfolioOpen(false);
    setIsContactOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile navigation menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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

  // Portfolio dropdown hover handlers
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
    }, 300);
  };

  const handlePortfolioToggle = () => {
    if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
    setIsPortfolioOpen((prev) => !prev);
  };

  // Contact dropdown hover handlers
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
    }, 300);
  };

  const handleContactToggle = () => {
    if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    setIsContactOpen((prev) => !prev);
  };

  // Helper to scroll smoothly to target with fixed header offset
  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const headerOffset = 85;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      return true;
    }
    return false;
  };

  // Navigate to section on homepage
  const handleNavigateToSection = (targetId: string) => {
    if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
    if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    setIsPortfolioOpen(false);
    setIsContactOpen(false);
    setIsMobileMenuOpen(false);

    if (location.pathname === '/') {
      scrollToTarget(targetId);
    } else {
      navigate('/', { state: { scrollTo: targetId } });
    }
  };

  // Portfolio dropdown item click handler: navigates to section AND opens archive modal
  const handlePortfolioItemClick = (targetId: string) => {
    if (portfolioTimeoutRef.current) clearTimeout(portfolioTimeoutRef.current);
    if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    setIsPortfolioOpen(false);
    setIsContactOpen(false);
    setIsMobileMenuOpen(false);

    if (location.pathname === '/') {
      scrollToTarget(targetId);
      // Open respective archive modal
      window.dispatchEvent(new CustomEvent('open-archive', { detail: { type: targetId } }));
    } else {
      navigate('/', { state: { scrollTo: targetId, openArchive: true } });
    }
  };

  const portfolioItems = [
    { label: 'Photography', id: 'photography' },
    { label: 'Videos', id: 'videos' },
    { label: 'Art', id: 'art' },
    { label: 'Hobbies & Pets', id: 'hobbies' },
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

        {/* Right Area: Navigation Links or Close Button on /about */}
        <div className="flex items-center shrink-0">
          {isAboutPage ? (
            /* On 'About Salman' page: Only 'X' cross symbol inside clean rectangular outline box */
            <Link
              to="/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-none border border-white/80 hover:border-white bg-transparent hover:bg-white text-white hover:text-black transition-all duration-200 cursor-pointer flex items-center justify-center select-none"
              title="Close & Return to Home"
              aria-label="Close & Return to Home"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75]" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-8 md:gap-10">
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
                  className="nav-entrance-2 relative group z-[60]"
                  onMouseEnter={handlePortfolioMouseEnter}
                  onMouseLeave={handlePortfolioMouseLeave}
                >
                  <button
                    type="button"
                    onClick={handlePortfolioToggle}
                    className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors duration-200 py-1 cursor-pointer focus:outline-none pointer-events-auto"
                    aria-haspopup="true"
                    aria-expanded={isPortfolioOpen}
                  >
                    <span>PORTFOLIO</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-200 text-white pointer-events-none ${
                        isPortfolioOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isPortfolioOpen && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56 z-[70] pointer-events-auto select-none animate-in fade-in slide-in-from-top-1 duration-150"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="bg-black/98 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80 py-2 divide-y divide-white/5 pointer-events-auto">
                        {portfolioItems.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handlePortfolioItemClick(item.id);
                            }}
                            className="block w-full text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85 hover:text-white hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer pointer-events-auto select-none"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Contact Dropdown */}
                <div
                  ref={contactDropdownRef}
                  className="nav-entrance-3 relative group z-[60]"
                  onMouseEnter={handleContactMouseEnter}
                  onMouseLeave={handleContactMouseLeave}
                >
                  <button
                    type="button"
                    onClick={handleContactToggle}
                    className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors duration-200 py-1 cursor-pointer focus:outline-none pointer-events-auto"
                    aria-haspopup="true"
                    aria-expanded={isContactOpen}
                  >
                    <span>CONTACT</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-200 text-white pointer-events-none ${
                        isContactOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Contact Dropdown Menu */}
                  {isContactOpen && (
                    <div
                      className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full pt-2 w-52 z-[70] pointer-events-auto animate-in fade-in slide-in-from-top-1 duration-150"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="bg-black/98 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80 py-2 pointer-events-auto">
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

                        {/* YouTube Link */}
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsContactOpen(false)}
                          className="flex items-center justify-between px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <span>YouTube</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                        </a>

                        {/* Divider */}
                        <div className="my-1 border-t border-white/10" />

                        {/* Direct / Send a Message */}
                        <button
                          type="button"
                          onClick={() => handleNavigateToSection('contact')}
                          className="block w-full text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          Send a Message
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. About Salman */}
                <div className="nav-entrance-4 pl-4 md:pl-5 border-l border-white/20">
                  <Link
                    to="/about"
                    className="text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors duration-200 py-1 relative group/nav whitespace-nowrap block"
                  >
                    <span>ABOUT SALMAN</span>
                    <span className="absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-200 w-0 group-hover/nav:w-full" />
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
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="w-10 h-10 flex items-center justify-center text-white hover:text-white/80 active:scale-95 transition-all focus:outline-none cursor-pointer"
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open mobile menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 stroke-[2] text-white" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <span className="w-6 h-0.5 bg-white transition-all" />
                      <span className="w-6 h-0.5 bg-white transition-all" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Menu (Rendered via Portal to escape header backdrop-filter containing block) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-dark-grunge text-white flex flex-col h-full min-h-screen min-h-[100dvh] overflow-y-auto overscroll-contain select-none md:hidden"
                style={{
                  backgroundColor: '#000000',
                  backgroundImage: "url('/images/dark-grunge-texture.png?v=2')",
                  backgroundRepeat: 'repeat',
                  backgroundSize: '400px auto',
                }}
              >
                {/* Top Bar: Logo on left, clean borderless 'X' close button on right */}
                <div className="flex items-center justify-between px-6 xs:px-8 py-5 sm:py-6 shrink-0">
                  <Link
                    to="/"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-brush text-sm xs:text-base sm:text-lg text-white uppercase hover:opacity-85 transition-opacity tracking-normal"
                    style={{ fontFamily: "'Rock Salt', cursive" }}
                  >
                    SALMAN SAJID JOADDER
                  </Link>

                  {/* Clean Close Button ('X') precisely matching reference */}
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-white hover:opacity-70 transition-opacity cursor-pointer focus:outline-none"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-7 h-7 xs:w-8 xs:h-8 stroke-[1.5]" />
                  </button>
                </div>

                {/* Menu Items: Minimalist, clean Anton typography with chevron indicators */}
                <div className="flex-1 flex flex-col justify-start px-6 xs:px-8 pt-10 sm:pt-14 pb-12">
                  <nav className="flex flex-col space-y-6 xs:space-y-7">
                    {/* 1. ABOUT SALMAN > */}
                    <div>
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group inline-flex items-center text-2xl min-[360px]:text-[28px] xs:text-[34px] font-black uppercase text-white font-heading tracking-tight hover:text-neutral-300 transition-colors w-fit"
                      >
                        <span>ABOUT SALMAN</span>
                        <span className="text-xl min-[360px]:text-2xl xs:text-[28px] font-light text-white/50 ml-2.5 group-hover:translate-x-1.5 transition-transform">
                          ›
                        </span>
                      </Link>
                    </div>

                    {/* 2. PORTFOLIO > */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsMobilePortfolioOpen(!isMobilePortfolioOpen)}
                        className="group inline-flex items-center text-2xl min-[360px]:text-[28px] xs:text-[34px] font-black uppercase text-white font-heading tracking-tight hover:text-neutral-300 transition-colors w-fit cursor-pointer text-left"
                      >
                        <span>PORTFOLIO</span>
                        <span
                          className={`text-xl min-[360px]:text-2xl xs:text-[28px] font-light text-white/50 ml-2.5 transition-transform duration-200 inline-block ${
                            isMobilePortfolioOpen ? 'rotate-90 text-white' : 'group-hover:translate-x-1.5'
                          }`}
                        >
                          ›
                        </span>
                      </button>

                      {/* Portfolio Sub-categories Accordion */}
                      {isMobilePortfolioOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col space-y-3 pt-4 pl-4 border-l-2 border-white/20 mt-3"
                        >
                          {portfolioItems.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                handlePortfolioItemClick(item.id);
                              }}
                              className="text-base xs:text-lg font-bold uppercase tracking-wider text-neutral-300 hover:text-white text-left font-heading transition-colors cursor-pointer"
                            >
                              {item.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* 3. CONTACT > */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsMobileContactOpen(!isMobileContactOpen)}
                        className="group inline-flex items-center text-2xl min-[360px]:text-[28px] xs:text-[34px] font-black uppercase text-white font-heading tracking-tight hover:text-neutral-300 transition-colors w-fit cursor-pointer text-left"
                      >
                        <span>CONTACT</span>
                        <span
                          className={`text-xl min-[360px]:text-2xl xs:text-[28px] font-light text-white/50 ml-2.5 transition-transform duration-200 inline-block ${
                            isMobileContactOpen ? 'rotate-90 text-white' : 'group-hover:translate-x-1.5'
                          }`}
                        >
                          ›
                        </span>
                      </button>

                      {/* Contact Links Accordion */}
                      {isMobileContactOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col space-y-3.5 pt-4 pl-4 border-l-2 border-white/20 mt-3"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleNavigateToSection('contact');
                            }}
                            className="text-base xs:text-lg font-bold uppercase tracking-wider text-white hover:text-neutral-300 text-left font-heading transition-colors cursor-pointer"
                          >
                            Send a Message →
                          </button>
                          <div className="flex flex-wrap items-center gap-4 pt-1">
                            <a
                              href={facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white"
                            >
                              Facebook ↗
                            </a>
                            <a
                              href={instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white"
                            >
                              Instagram ↗
                            </a>
                            <a
                              href={linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white"
                            >
                              LinkedIn ↗
                            </a>
                            <a
                              href={youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white"
                            >
                              YouTube ↗
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* 4. DASHBOARD > */}
                    <div>
                      <Link
                        to={user ? '/admin' : '/admin/login'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group inline-flex items-center text-2xl min-[360px]:text-[28px] xs:text-[34px] font-black uppercase text-white font-heading tracking-tight hover:text-neutral-300 transition-colors w-fit"
                      >
                        <span>DASHBOARD</span>
                        <span className="text-xl min-[360px]:text-2xl xs:text-[28px] font-light text-white/50 ml-2.5 group-hover:translate-x-1.5 transition-transform">
                          ›
                        </span>
                      </Link>
                    </div>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
};


