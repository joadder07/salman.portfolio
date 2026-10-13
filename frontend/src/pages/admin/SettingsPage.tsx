import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Save, Sparkles, User, Globe, Music, Plus, Trash2, GripVertical, Images, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCurrentUser, useUpdateProfile } from '@/api/auth.api';
import { useSiteSettings, useUpdateSettings, useUploadMedia } from '@/api/settings.api';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
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
  const [heroBackgroundImage, setHeroBackgroundImage] = useState('');
  const [isUploadingHeroBg, setIsUploadingHeroBg] = useState(false);

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
      if (settings.socialLinks) {
        setFacebook(settings.socialLinks.facebook || settings.facebookUrl || '');
        setLinkedin(settings.socialLinks.linkedin || '');
        setInstagram(settings.socialLinks.instagram || settings.instagramUrl || '');
      } else {
        if (settings.facebookUrl) setFacebook(settings.facebookUrl);
        if (settings.instagramUrl) setInstagram(settings.instagramUrl);
      }
      if (settings.musicPlaylist) {
        setPlaylist(settings.musicPlaylist.map((t: any) => ({
          title: t.title || '',
          artist: t.artist || '',
          src: t.src || '',
        })));
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

      // Persist directly to database so it updates and saves to profile immediately
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
      });
      toast.success('Site settings saved!');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  // Handle Hero Background Image Upload to Cloudinary & Save to DB
  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroBg(true);
    try {
      toast.loading('Uploading hero background to Cloudinary...', { id: 'hero-bg-upload' });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/hero' });
      setHeroBackgroundImage(res.secureUrl);

      // Persist directly to database so it updates immediately
      toast.loading('Saving hero background setting...', { id: 'hero-bg-upload' });
      await updateSettings.mutateAsync({ heroBackgroundImage: res.secureUrl });
      toast.success('Hero background image updated and saved!', { id: 'hero-bg-upload' });
    } catch (err) {
      console.error('Failed to upload/save hero background:', err);
      toast.error('Failed to upload hero background', { id: 'hero-bg-upload' });
    } finally {
      setIsUploadingHeroBg(false);
      e.target.value = '';
    }
  };

  const handleRemoveHeroBg = async () => {
    try {
      setHeroBackgroundImage('');
      await updateSettings.mutateAsync({ heroBackgroundImage: '' });
      toast.success('Hero background image removed');
    } catch {
      toast.error('Failed to remove hero background');
    }
  };

  // Handle music track audio file upload
  const handleTrackUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingTrack(true);
    try {
      toast.loading('Uploading audio to Cloudinary...', { id: 'track-upload' });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/music' });
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setPlaylist((prev) => [
        ...prev,
        { title: nameWithoutExt, artist: '', src: res.secureUrl },
      ]);
      toast.success('Track uploaded!', { id: 'track-upload' });
    } catch {
      toast.error('Track upload failed. Max 50 MB, MP3/WAV/OGG/FLAC allowed.', { id: 'track-upload' });
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

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" /> Settings & Profile
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Customize personal admin credentials, profile picture, site metadata, and global themes.
        </p>
      </div>

      {/* Admin Profile Details */}
      <Card>
        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Admin Profile & Picture</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 bg-muted shrink-0">
              {isUploadingPic ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-primary gap-1">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold transition-all ${
                  isUploadingPic
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-primary/20'
                }`}
              >
                <Upload className={`w-4 h-4 ${isUploadingPic ? 'animate-pulse' : ''}`} />
                {isUploadingPic ? 'Uploading & Saving to DB...' : 'Upload New Image (Cloudinary)'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingPic}
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-muted-foreground">
                Supports JPG, PNG, WEBP. Uploads directly to Cloudinary and saves to database.
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
            className="gap-2 shadow-lg shadow-primary/20"
            disabled={updateProfile.isPending}
          >
            <Save className="w-4 h-4" />
            {updateProfile.isPending ? 'Saving...' : 'Update Profile'}
          </Button>
        </form>
      </Card>

      {/* Hero Fullscreen Background Image */}
      <Card>
        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
          <ImageIcon className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-base font-bold text-foreground">Hero Fullscreen Background Image</h2>
            <p className="text-xs text-muted-foreground">
              Upload a cinematic, high-resolution photograph to display as the full-screen background for the Hero section.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-video max-w-xl rounded-xl overflow-hidden border border-white/10 bg-black/40">
            {heroBackgroundImage ? (
              <img
                src={heroBackgroundImage}
                alt="Hero Background Preview"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-2">
                <ImageIcon className="w-10 h-10 opacity-30" />
                <p className="text-xs">No custom background uploaded yet. Using default fallback image.</p>
              </div>
            )}

            {isUploadingHeroBg && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 text-white">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Uploading to Cloudinary & saving...</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-black text-xs font-bold transition-all ${
                isUploadingHeroBg
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-primary/90'
              }`}
            >
              <Upload className={`w-4 h-4 ${isUploadingHeroBg ? 'animate-pulse' : ''}`} />
              {isUploadingHeroBg ? 'Uploading to Cloudinary...' : 'Upload Background Image (Cloudinary)'}
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingHeroBg}
                onChange={handleHeroBgUpload}
                className="hidden"
              />
            </label>

            {heroBackgroundImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveHeroBg}
                disabled={isUploadingHeroBg}
                className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove Image
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Recommended: High-resolution horizontal photo (e.g. 2560x1440 or 1920x1080). Supports JPG, PNG, WEBP.
          </p>
        </div>
      </Card>

      {/* Hero Carousel Gallery Section */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Images className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-bold text-foreground">Hero Carousel Gallery (8 Slots)</h2>
              <p className="text-xs text-muted-foreground">
                Auto-scrolling 8-slot slider displayed at the bottom of the Hero section.
              </p>
            </div>
          </div>
          <Link to="/admin/hero-gallery">
            <Button size="sm" className="gap-2 text-xs shrink-0">
              Manage 8 Image Slots <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The hero slider automatically cycles through 8 image slots towards the right every 1 second, showing 4 images at a time on desktop, 2 on tablet, and 1 on mobile. You can upload custom high-resolution photos via Cloudinary or adjust captions in the dedicated Hero Gallery manager.
        </p>
      </Card>

      {/* Global Site Settings */}
      <Card>
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
            className="gap-2 shadow-lg shadow-primary/20"
            disabled={updateSettings.isPending}
          >
            <Save className="w-4 h-4" />
            {updateSettings.isPending ? 'Saving...' : 'Save Site Settings'}
          </Button>
        </form>
      </Card>
      {/* Music Playlist Manager */}
      <Card>
        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
          <Music className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Music Playlist</h2>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Upload audio tracks (MP3, WAV, OGG, FLAC) from your computer. They will be stored on Cloudinary
            and played in the site's ambient music player.
          </p>

          {/* Upload new track */}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold cursor-pointer hover:bg-violet-500/20 transition-all">
            {isUploadingTrack ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
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
            <p className="text-xs text-muted-foreground/60 italic py-2">No tracks yet. Upload your first audio file above.</p>
          ) : (
            <div className="space-y-3">
              {playlist.map((track, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-background/40">
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
            className="gap-2 mt-2"
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
    </div>
  );
};
