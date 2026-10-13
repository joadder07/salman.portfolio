import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Upload,
  Save,
  Sparkles,
  User,
  Globe,
  Music,
  Plus,
  Trash2,
  GripVertical,
  Images,
  ArrowRight,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCurrentUser, useUpdateProfile } from '@/api/auth.api';
import { useSiteSettings, useUpdateSettings, useUploadMedia } from '@/api/settings.api';
import toast from 'react-hot-toast';

// Default static circuit board fallback image (image_19.png)
export const DEFAULT_CIRCUIT_BOARD_HERO = '/images/circuit-board-hero.jpg';

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'hero';

  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const { data: settings } = useSiteSettings();
  const updateSettings = useUpdateSettings();
  const uploadMedia = useUploadMedia();

  // Profile Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');

  // Site Settings Form State
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [activeTheme, setActiveTheme] = useState('midnight');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');

  // Hero Section Background State
  const [heroBackgroundImage, setHeroBackgroundImage] = useState('');
  const [manualHeroBgUrl, setManualHeroBgUrl] = useState('');
  const [isUploadingHeroBg, setIsUploadingHeroBg] = useState(false);

  // Showcase Banner Section (above Contact section) State
  const [bannerImage, setBannerImage] = useState('');
  const [manualBannerUrl, setManualBannerUrl] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerQuote, setBannerQuote] = useState('Each shot is a reflection of my true self.');
  const [bannerQuoteSubtext, setBannerQuoteSubtext] = useState(
    'It’s been a way for me to express myself and show others how I see the world.'
  );

  // Music Playlist State
  const [playlist, setPlaylist] = useState<{ title: string; artist: string; src: string }[]>([]);
  const [isUploadingTrack, setIsUploadingTrack] = useState(false);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setProfilePic(user.profilePic || '');
    }
  }, [user]);

  useEffect(() => {
    if (settings) {
      setSiteName(settings.siteName || '');
      setTagline(settings.tagline || '');
      setHeroTitle(settings.heroTitle || '');
      setHeroSubtitle(settings.heroSubtitle || '');
      setAboutText(settings.aboutText || '');
      setActiveTheme(settings.activeTheme || 'midnight');
      setHeroBackgroundImage(settings.heroBackgroundImage || '');
      setManualHeroBgUrl(settings.heroBackgroundImage || '');
      setBannerImage(settings.bannerImage || '');
      setManualBannerUrl(settings.bannerImage || '');
      setBannerQuote(settings.bannerQuote || 'Each shot is a reflection of my true self.');
      setBannerQuoteSubtext(
        settings.bannerQuoteSubtext ||
          'It’s been a way for me to express myself and show others how I see the world.'
      );
      if (settings.socialLinks) {
        setFacebook(settings.socialLinks.facebook || settings.facebookUrl || '');
        setLinkedin(settings.socialLinks.linkedin || '');
        setInstagram(settings.socialLinks.instagram || settings.instagramUrl || '');
      } else {
        if (settings.facebookUrl) setFacebook(settings.facebookUrl);
        if (settings.instagramUrl) setInstagram(settings.instagramUrl);
      }
      if (settings.musicPlaylist) {
        setPlaylist(
          settings.musicPlaylist.map((t: any) => ({
            title: t.title || '',
            artist: t.artist || '',
            src: t.src || '',
          }))
        );
      }
    }
  }, [settings]);

  // Handle Profile Pic Upload to Cloudinary & Save to DB immediately
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPic(true);
    try {
      toast.loading('Uploading profile picture to Cloudinary...', { id: 'upload-pic' });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/profile' });
      setProfilePic(res.secureUrl);

      toast.loading('Saving profile picture to database...', { id: 'upload-pic' });
      await updateProfile.mutateAsync({
        name: name || user?.name || '',
        bio: bio || user?.bio || '',
        profilePic: res.secureUrl,
      });

      toast.success('Profile picture updated and saved!', { id: 'upload-pic' });
    } catch (err) {
      console.error('Failed to upload/save profile image:', err);
      toast.error('Failed to upload or save image', { id: 'upload-pic' });
    } finally {
      setIsUploadingPic(false);
      e.target.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name, bio, profilePic });
      toast.success('Admin profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        siteName,
        tagline,
        heroTitle,
        heroSubtitle,
        aboutText,
        activeTheme,
        socialLinks: { facebook, linkedin, instagram },
        facebookUrl: facebook,
        instagramUrl: instagram,
        musicPlaylist: playlist,
        heroBackgroundImage,
        bannerImage,
        bannerQuote,
        bannerQuoteSubtext,
      });
      toast.success('Site settings saved!');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  // Handle Hero Background Image Upload
  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroBg(true);
    try {
      toast.loading('Uploading hero background to Cloudinary...', { id: 'hero-bg-upload' });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/hero' });
      const newUrl = res.secureUrl;
      setHeroBackgroundImage(newUrl);
      setManualHeroBgUrl(newUrl);

      toast.loading('Saving hero background setting...', { id: 'hero-bg-upload' });
      await updateSettings.mutateAsync({ heroBackgroundImage: newUrl });
      toast.success('Hero background image updated and saved!', { id: 'hero-bg-upload' });
    } catch (err) {
      console.error('Failed to upload/save hero background:', err);
      toast.error('Failed to upload hero background. Try entering a direct image URL.', {
        id: 'hero-bg-upload',
      });
    } finally {
      setIsUploadingHeroBg(false);
      e.target.value = '';
    }
  };

  const handleApplyManualHeroBgUrl = async () => {
    const url = manualHeroBgUrl.trim();
    if (!url) {
      toast.error('Please enter a valid image URL');
      return;
    }
    try {
      toast.loading('Applying hero background URL...', { id: 'hero-bg-url' });
      setHeroBackgroundImage(url);
      await updateSettings.mutateAsync({ heroBackgroundImage: url });
      toast.success('Hero background updated!', { id: 'hero-bg-url' });
    } catch {
      toast.error('Failed to apply image URL', { id: 'hero-bg-url' });
    }
  };

  const handleResetToDefaultHeroBg = async () => {
    try {
      toast.loading('Reverting to default circuit board image...', { id: 'hero-bg-reset' });
      setHeroBackgroundImage('');
      setManualHeroBgUrl('');
      await updateSettings.mutateAsync({ heroBackgroundImage: '' });
      toast.success('Reverted to default circuit board background!', { id: 'hero-bg-reset' });
    } catch {
      toast.error('Failed to reset hero background', { id: 'hero-bg-reset' });
    }
  };

  // Handle Showcase Banner (Above Contact Section) Image Upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      toast.loading('Uploading showcase banner image to Cloudinary...', { id: 'banner-upload' });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/showcase' });
      const newUrl = res.secureUrl;
      setBannerImage(newUrl);
      setManualBannerUrl(newUrl);

      toast.loading('Saving showcase banner setting...', { id: 'banner-upload' });
      await updateSettings.mutateAsync({ bannerImage: newUrl });
      toast.success('Showcase banner updated and saved!', { id: 'banner-upload' });
    } catch (err) {
      console.error('Failed to upload showcase banner:', err);
      toast.error('Failed to upload banner image. Try entering a direct image URL.', {
        id: 'banner-upload',
      });
    } finally {
      setIsUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleApplyManualBannerUrl = async () => {
    const url = manualBannerUrl.trim();
    if (!url) {
      toast.error('Please enter a valid image URL');
      return;
    }
    try {
      toast.loading('Applying showcase banner URL...', { id: 'banner-url' });
      setBannerImage(url);
      await updateSettings.mutateAsync({ bannerImage: url });
      toast.success('Showcase banner updated!', { id: 'banner-url' });
    } catch {
      toast.error('Failed to apply image URL', { id: 'banner-url' });
    }
  };

  const handleResetBanner = async () => {
    try {
      toast.loading('Reverting to default showcase image...', { id: 'banner-reset' });
      setBannerImage('');
      setManualBannerUrl('');
      await updateSettings.mutateAsync({ bannerImage: '' });
      toast.success('Reverted to default showcase banner!', { id: 'banner-reset' });
    } catch {
      toast.error('Failed to reset showcase banner', { id: 'banner-reset' });
    }
  };

  // Music Playlist Handlers
  const handleTrackUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingTrack(true);
    try {
      toast.loading('Uploading audio to Cloudinary...', { id: 'track-upload' });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/music' });
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setPlaylist((prev) => [...prev, { title: nameWithoutExt, artist: '', src: res.secureUrl }]);
      toast.success('Track uploaded!', { id: 'track-upload' });
    } catch {
      toast.error('Track upload failed. Max 50 MB, MP3/WAV/OGG/FLAC allowed.', {
        id: 'track-upload',
      });
    } finally {
      setIsUploadingTrack(false);
      e.target.value = '';
    }
  };

  const handleTrackChange = (index: number, field: 'title' | 'artist', value: string) => {
    setPlaylist((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const handleRemoveTrack = (index: number) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
  };

  // Preview Sources
  const previewHeroBg = heroBackgroundImage || DEFAULT_CIRCUIT_BOARD_HERO;
  const isHeroUsingDefault = !heroBackgroundImage;

  const previewBanner = bannerImage || DEFAULT_CIRCUIT_BOARD_HERO;
  const isBannerUsingDefault = !bannerImage;

  // Tabs definition
  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'banner', label: 'Showcase Banner', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'general', label: 'General Settings', icon: <Globe className="w-4 h-4" /> },
    { id: 'profile', label: 'Admin Profile', icon: <User className="w-4 h-4" /> },
    { id: 'music', label: 'Music Playlist', icon: <Music className="w-4 h-4" /> },
  ];

  // Reusable Hero Background Section
  const renderHeroBackgroundManager = () => (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-white">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              Hero Background Image
              {isHeroUsingDefault ? (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20">
                  Default Fallback Active
                </span>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Custom Image Active
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Top-most fullscreen background image with the brush signature name.
            </p>
          </div>
        </div>

        {heroBackgroundImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefaultHeroBg}
            disabled={isUploadingHeroBg}
            className="text-xs text-muted-foreground hover:text-white border-white/20 hover:bg-white/10 gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Live Visual Preview Container */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Live Website Preview
            </label>
            <span className="text-[11px] text-muted-foreground">
              {isHeroUsingDefault
                ? 'Showing: Default Circuit Board (image_19.png)'
                : 'Showing: Custom Uploaded Background'}
            </span>
          </div>

          <div className="relative aspect-[21/9] sm:aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black select-none shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
              style={{ backgroundImage: `url(${previewHeroBg})` }}
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center items-start pointer-events-none">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 mb-1 font-semibold">
                Hero Section Overlay
              </span>
              <h1
                className="font-brush text-xl sm:text-3xl md:text-4xl text-white tracking-normal uppercase leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                style={{
                  fontFamily: "'Rock Salt', 'Permanent Marker', 'Caveat Brush', cursive",
                }}
              >
                SALMAN SAJID
              </h1>
            </div>

            {isUploadingHeroBg && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white z-20">
                <div className="w-9 h-9 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Uploading to Cloudinary & Saving...
                </span>
              </div>
            )}

            <div className="absolute top-3 right-3 z-10">
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase tracking-wider">
                {isHeroUsingDefault ? 'Default Circuit Board' : 'Custom Image'}
              </span>
            </div>
          </div>
        </div>

        {/* Upload & URL Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-primary" /> Option 1: Upload from Computer
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Upload a high-resolution horizontal photograph (JPG, PNG, WEBP).
              </p>
            </div>

            <div>
              <label
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold transition-all shadow-md ${
                  isUploadingHeroBg
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-white/90 active:scale-[0.99]'
                }`}
              >
                <Upload className={`w-4 h-4 ${isUploadingHeroBg ? 'animate-pulse' : ''}`} />
                {isUploadingHeroBg ? 'Uploading Image...' : 'Choose File & Upload'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingHeroBg}
                  onChange={handleHeroBgUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-primary" /> Option 2: Image URL
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Alternatively, paste an external high-resolution CDN or Unsplash image link.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={manualHeroBgUrl}
                onChange={(e) => setManualHeroBgUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-white"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleApplyManualHeroBgUrl}
                disabled={isUploadingHeroBg}
                className="text-xs shrink-0 border-white/20 text-white hover:bg-white/10"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Dedicated Showcase Banner Manager (Section Directly Above Contact Section)
  const renderShowcaseBannerManager = () => (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-white">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              Showcase Banner Image (Pre-Contact Section)
              {isBannerUsingDefault ? (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20">
                  Default Circuit Board Active
                </span>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Custom Image Active
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              The full-width cinematic showcase banner positioned directly above the &ldquo;Send a Message&rdquo; contact section.
            </p>
          </div>
        </div>

        {bannerImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetBanner}
            disabled={isUploadingBanner}
            className="text-xs text-muted-foreground hover:text-white border-white/20 hover:bg-white/10 gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Live Visual Preview Container */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Clean Showcase Live Preview
            </label>
            <span className="text-[11px] text-muted-foreground">
              {isBannerUsingDefault
                ? 'Showing: Default Circuit Board Showcase'
                : 'Showing: Custom Uploaded Banner'}
            </span>
          </div>

          <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full rounded-2xl overflow-hidden border border-white/15 bg-black select-none shadow-2xl">
            {/* Background image preview without artificial gradient shadows */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
              style={{ backgroundImage: `url(${previewBanner})` }}
            />

            {/* Stylized Quote Overlay in Sky Area matching image_16.png */}
            <div className="absolute top-3 sm:top-5 right-3 sm:right-6 z-10 max-w-[220px] sm:max-w-xs text-left pointer-events-none">
              <svg
                viewBox="0 0 100 80"
                className="w-7 h-5 sm:w-9 sm:h-7 fill-black text-black mb-1 sm:mb-1.5 select-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
                aria-hidden="true"
              >
                <path d="M0,48 C0,22 14,0 42,0 L44,12 C28,14 18,25 18,36 C21,34 25,32 30,32 C40,32 48,40 48,52 C48,65 38,76 24,76 C11,76 0,64 0,48 Z M52,48 C52,22 66,0 94,0 L96,12 C80,14 70,25 70,36 C73,34 77,32 82,32 C92,32 100,40 100,52 C100,65 90,76 76,76 C63,76 52,64 52,48 Z" />
              </svg>
              <h4
                className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-tight text-black leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
                style={{ fontFamily: "'Oswald', 'Bebas Neue', sans-serif" }}
              >
                <span className="bg-black/10 backdrop-blur-[1px] px-1 py-0.2 box-decoration-clone inline">
                  {bannerQuote}
                </span>
              </h4>
              {bannerQuoteSubtext && (
                <p
                  className="mt-1 text-[8px] sm:text-[10px] font-bold uppercase leading-snug text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
                  style={{ fontFamily: "'Oswald', 'Bebas Neue', sans-serif" }}
                >
                  {bannerQuoteSubtext}
                </p>
              )}
            </div>

            {/* Loading spinner overlay */}
            {isUploadingBanner && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white z-20">
                <div className="w-9 h-9 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Uploading to Cloudinary & Saving...
                </span>
              </div>
            )}

            {/* Corner Badge */}
            <div className="absolute bottom-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase tracking-wider">
                {isBannerUsingDefault ? 'Default Circuit Board' : 'Custom Image'}
              </span>
            </div>
          </div>
        </div>

        {/* Quote Text Customization Editor */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>❝</span> Stylized Quote Overlay Text
            </h3>
            <span className="text-[11px] text-muted-foreground">Oswald / Bebas Neue Bold</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Input
              label="Primary Quote Line"
              value={bannerQuote}
              onChange={(e) => setBannerQuote(e.target.value)}
              placeholder="Each shot is a reflection of my true self."
            />
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Quote Subtext (Second Paragraph)
              </label>
              <textarea
                rows={2}
                value={bannerQuoteSubtext}
                onChange={(e) => setBannerQuoteSubtext(e.target.value)}
                placeholder="It’s been a way for me to express myself and show others how I see the world."
                className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          <Button
            size="sm"
            onClick={async () => {
              try {
                toast.loading('Saving quote text...', { id: 'save-banner-quote' });
                await updateSettings.mutateAsync({
                  bannerQuote,
                  bannerQuoteSubtext,
                });
                toast.success('Showcase quote text saved!', { id: 'save-banner-quote' });
              } catch {
                toast.error('Failed to save quote text', { id: 'save-banner-quote' });
              }
            }}
            disabled={updateSettings.isPending}
            className="gap-2 text-xs bg-white text-black hover:bg-white/90"
          >
            <Save className="w-3.5 h-3.5" /> Save Quote Text
          </Button>
        </div>

        {/* Upload & URL Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Method 1: File Upload */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-primary" /> Option 1: Upload from Computer
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Upload a cinematic wide-angle photograph (JPG, PNG, WEBP). Saves automatically and updates the frontend instantly.
              </p>
            </div>

            <div>
              <label
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold transition-all shadow-md ${
                  isUploadingBanner
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-white/90 active:scale-[0.99]'
                }`}
              >
                <Upload className={`w-4 h-4 ${isUploadingBanner ? 'animate-pulse' : ''}`} />
                {isUploadingBanner ? 'Uploading Banner...' : 'Choose File & Upload'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingBanner}
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Method 2: Manual URL */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-primary" /> Option 2: Image URL
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Alternatively, paste an external high-resolution CDN or Unsplash image link.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={manualBannerUrl}
                onChange={(e) => setManualBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-white"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleApplyManualBannerUrl}
                disabled={isUploadingBanner}
                className="text-xs shrink-0 border-white/20 text-white hover:bg-white/10"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Fallback Guarantee Note */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 text-xs text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-white/90 font-medium">Framing & Organic Gradient Preservation</p>
            <p className="text-[11px] leading-relaxed">
              Whichever image you upload, the section automatically retains its full-bleed edge-to-edge aspect ratio, dark contrast overlay, and smooth top/bottom organic scrim fades blending seamlessly into the contact section below.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" /> Settings & Configuration
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your hero background, pre-contact showcase banner, site metadata, admin profile details, and ambient music playlist.
        </p>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'hero' && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                    isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {isHeroUsingDefault ? 'Default' : 'Custom'}
                </span>
              )}
              {tab.id === 'banner' && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                    isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {isBannerUsingDefault ? 'Default' : 'Custom'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content: HERO SECTION */}
      {currentTab === 'hero' && (
        <div className="space-y-8">
          {renderHeroBackgroundManager()}

          {/* Hero Carousel Gallery Shortcut */}
          <Card className="border border-white/10 bg-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Images className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Hero Viewfinder Carousel (8 Photo Slots)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Auto-scrolling photographic gallery displayed below the main hero title.
                  </p>
                </div>
              </div>
              <Link to="/admin/hero-gallery">
                <Button size="sm" className="gap-2 text-xs shrink-0 bg-white text-black hover:bg-white/90">
                  Manage 8 Image Slots <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              In addition to the fullscreen hero background, your portfolio features an 8-slot interactive camera viewfinder carousel with technical corner brackets and custom captions. Click above to modify the individual photos in the gallery.
            </p>
          </Card>
        </div>
      )}

      {/* Tab Content: SHOWCASE BANNER */}
      {currentTab === 'banner' && (
        <div className="space-y-8">
          {renderShowcaseBannerManager()}
        </div>
      )}

      {/* Tab Content: GENERAL SETTINGS */}
      {currentTab === 'general' && (
        <div className="space-y-8">
          {/* Include both image managers here for convenience */}
          {renderHeroBackgroundManager()}
          {renderShowcaseBannerManager()}

          {/* Site Metadata & Social Links */}
          <Card className="border border-white/10 bg-black/40">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Site Metadata & Themes</h2>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Site Name / Brand"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                />
                <Input
                  label="Site Tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Hero Section Title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                />
                <Input
                  label="Hero Subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  About Section Narrative
                </label>
                <textarea
                  rows={4}
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t border-white/10 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Social Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="FACEBOOK URL"
                    placeholder="https://facebook.com/username"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                  />
                  <Input
                    label="LINKEDIN URL"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                  <Input
                    label="INSTAGRAM URL"
                    placeholder="https://instagram.com/username"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="gap-2 shadow-lg shadow-white/10 bg-white text-black hover:bg-white/90"
                disabled={updateSettings.isPending}
              >
                <Save className="w-4 h-4" />
                {updateSettings.isPending ? 'Saving...' : 'Save Site Settings'}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Tab Content: ADMIN PROFILE */}
      {currentTab === 'profile' && (
        <Card className="border border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Admin Profile Details</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/10 bg-muted shrink-0">
                {isUploadingPic ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-white gap-1">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-[9px] text-white font-medium">Saving...</span>
                  </div>
                ) : profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Pic
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <label
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold transition-all ${
                    isUploadingPic
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-white/20'
                  }`}
                >
                  <Upload className={`w-4 h-4 ${isUploadingPic ? 'animate-pulse' : ''}`} />
                  {isUploadingPic ? 'Uploading & Saving to DB...' : 'Upload New Avatar Image'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingPic}
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Supports JPG, PNG, WEBP. Uploads directly to Cloudinary and saves to your profile.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Admin Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                className="opacity-70 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Bio Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              className="gap-2 shadow-lg shadow-white/10 bg-white text-black hover:bg-white/90"
              disabled={updateProfile.isPending}
            >
              <Save className="w-4 h-4" />
              {updateProfile.isPending ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
        </Card>
      )}

      {/* Tab Content: MUSIC PLAYLIST */}
      {currentTab === 'music' && (
        <Card className="border border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
            <Music className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Music Playlist</h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Upload audio tracks (MP3, WAV, OGG, FLAC) from your computer. They will be stored on
              Cloudinary and played in the site's ambient music player.
            </p>

            {/* Upload new track */}
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold cursor-pointer hover:bg-white/20 transition-all">
              {isUploadingTrack ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {isUploadingTrack ? 'Uploading…' : 'Upload Audio File'}
              <input
                type="file"
                accept="audio/*"
                onChange={handleTrackUpload}
                disabled={isUploadingTrack}
                className="hidden"
              />
            </label>

            {/* Track list */}
            {playlist.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 italic py-2">
                No tracks yet. Upload your first audio file above.
              </p>
            ) : (
              <div className="space-y-3">
                {playlist.map((track, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-background/40"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 mt-2.5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Track Title"
                          value={track.title}
                          onChange={(e) => handleTrackChange(i, 'title', e.target.value)}
                          placeholder="e.g. Midnight Drift"
                        />
                        <Input
                          label="Artist"
                          value={track.artist}
                          onChange={(e) => handleTrackChange(i, 'artist', e.target.value)}
                          placeholder="e.g. Lo-fi Collective"
                        />
                      </div>
                      <audio controls src={track.src} className="w-full h-9 rounded-lg" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrack(i)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mt-1.5"
                      title="Remove track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="gap-2 mt-2 bg-white text-black hover:bg-white/90"
              onClick={async () => {
                try {
                  await updateSettings.mutateAsync({ musicPlaylist: playlist });
                  toast.success('Playlist saved!');
                } catch {
                  toast.error('Failed to save playlist');
                }
              }}
              disabled={updateSettings.isPending}
            >
              <Save className="w-4 h-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Playlist'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
