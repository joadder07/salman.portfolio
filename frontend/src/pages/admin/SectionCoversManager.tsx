import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  Video,
  Palette,
  PawPrint,
  Check,
  Sparkles,
  Save,
  ArrowLeft,
  ArrowRight,
  Trash2,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useSiteSettings, useUpdateSettings, SectionCoversConfig } from '@/api/settings.api';
import { photographyApi, videoApi, artApi, hobbyApi, petApi } from '@/api/content.api';
import { getYouTubeThumbnail } from '@/utils/youtube';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';
import toast from 'react-hot-toast';

type SectionKey = 'photography' | 'videos' | 'art' | 'hobbies';

interface MediaItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  subtitle?: string;
}

export const SectionCoversManager: React.FC = () => {
  const { data: settings, isLoading: isLoadingSettings } = useSiteSettings();
  const updateSettings = useUpdateSettings();

  const [activeSection, setActiveSection] = useState<SectionKey>('photography');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [coversConfig, setCoversConfig] = useState<SectionCoversConfig>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Queries for all sections' data
  const { data: photos = [], isLoading: isLoadingPhotos } = photographyApi.useGetAll();
  const { data: videos = [], isLoading: isLoadingVideos } = videoApi.useGetAll();
  const { data: artworks = [], isLoading: isLoadingArt } = artApi.useGetAll();
  const { data: hobbies = [], isLoading: isLoadingHobbies } = hobbyApi.useGetAll();
  const { data: pets = [], isLoading: isLoadingPets } = petApi.useGetAll();

  // Initialize state from settings
  useEffect(() => {
    if (settings?.sectionCovers) {
      setCoversConfig(settings.sectionCovers);
    } else {
      setCoversConfig({});
    }
    setIsDirty(false);
  }, [settings]);

  // Transform section items into unified MediaItem format
  const sectionItems: MediaItem[] = useMemo(() => {
    switch (activeSection) {
      case 'photography':
        return photos
          .filter((p) => Boolean(p.imageUrl && p.imageUrl.trim()))
          .map((p) => ({
            id: p.id,
            title: p.title || 'Untitled Photo',
            imageUrl: p.imageUrl,
            category: p.category || 'Photography',
            subtitle: p.description || '',
          }));

      case 'videos':
        return videos
          .map((v) => {
            const thumb = v.thumbnailUrl?.trim() || getYouTubeThumbnail(v.videoUrl);
            return {
              id: v.id,
              title: v.title || 'Untitled Video',
              imageUrl: thumb,
              category: v.category || 'Video',
              subtitle: v.description || '',
            };
          })
          .filter((v) => Boolean(v.imageUrl));

      case 'art':
        return artworks
          .filter((a) => Boolean(a.imageUrl && a.imageUrl.trim()))
          .map((a) => ({
            id: a.id,
            title: a.title || 'Untitled Artwork',
            imageUrl: a.imageUrl,
            category: a.medium || 'Mixed Media',
            subtitle: a.year ? `Year ${a.year}` : '',
          }));

      case 'hobbies': {
        const hItems: MediaItem[] = hobbies
          .filter((h) => Boolean(h.imageUrl && h.imageUrl.trim()))
          .map((h) => ({
            id: `hobby-${h.id}`,
            title: h.name || 'Hobby Item',
            imageUrl: h.imageUrl!,
            category: 'Hobby',
            subtitle: h.description || '',
          }));

        const pItems: MediaItem[] = pets
          .filter((p) => Boolean(p.imageUrl && p.imageUrl.trim()))
          .map((p) => ({
            id: `pet-${p.id}`,
            title: p.name || 'Pet Companion',
            imageUrl: p.imageUrl!,
            category: 'Pet',
            subtitle: p.species ? `${p.species}${p.breed ? ` • ${p.breed}` : ''}` : '',
          }));

        return [...hItems, ...pItems];
      }

      default:
        return [];
    }
  }, [activeSection, photos, videos, artworks, hobbies, pets]);

  // Selected IDs for active section (capped to 7)
  const currentSelectedIds = useMemo(() => {
    return coversConfig[activeSection] || [];
  }, [coversConfig, activeSection]);

  // Filtered available items based on search query
  const filteredAvailableItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sectionItems;
    return sectionItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [sectionItems, searchQuery]);

  // Selected media items resolved in order
  const selectedMediaItems = useMemo(() => {
    return currentSelectedIds
      .map((id) => sectionItems.find((item) => item.id === id))
      .filter(Boolean) as MediaItem[];
  }, [currentSelectedIds, sectionItems]);

  // Handle toggling an item in/out of the cover selection
  const handleToggleItem = (id: string) => {
    const isSelected = currentSelectedIds.includes(id);

    if (isSelected) {
      // Remove
      const nextIds = currentSelectedIds.filter((item) => item !== id);
      setCoversConfig((prev) => ({
        ...prev,
        [activeSection]: nextIds,
      }));
      setIsDirty(true);
    } else {
      // Check limit of 7
      if (currentSelectedIds.length >= 7) {
        toast.error('Maximum limit reached: exactly 6 or 7 cover photos can be selected per section.', {
          icon: '⚠️',
        });
        return;
      }

      const nextIds = [...currentSelectedIds, id];
      setCoversConfig((prev) => ({
        ...prev,
        [activeSection]: nextIds,
      }));
      setIsDirty(true);

      if (nextIds.length === 6 || nextIds.length === 7) {
        toast.success(`Great! ${nextIds.length} cover photos selected for ${sectionLabels[activeSection]}.`);
      }
    }
  };

  // Reorder selected items (move left/up)
  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const next = [...currentSelectedIds];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setCoversConfig((prev) => ({
      ...prev,
      [activeSection]: next,
    }));
    setIsDirty(true);
  };

  // Reorder selected items (move right/down)
  const handleMoveRight = (index: number) => {
    if (index >= currentSelectedIds.length - 1) return;
    const next = [...currentSelectedIds];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setCoversConfig((prev) => ({
      ...prev,
      [activeSection]: next,
    }));
    setIsDirty(true);
  };

  // Quick action: Select top 7 items
  const handleAutoSelectTop7 = () => {
    const top7 = sectionItems.slice(0, 7).map((item) => item.id);
    if (top7.length === 0) {
      toast.error('No uploaded pictures available in this section yet.');
      return;
    }
    setCoversConfig((prev) => ({
      ...prev,
      [activeSection]: top7,
    }));
    setIsDirty(true);
    toast.success(`Selected first ${top7.length} pictures as cover photos!`);
  };

  // Quick action: Clear selection for section
  const handleClearSection = () => {
    setCoversConfig((prev) => ({
      ...prev,
      [activeSection]: [],
    }));
    setIsDirty(true);
    toast.success('Cleared cover photo selection.');
  };

  // Save changes to backend
  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        sectionCovers: coversConfig,
      });
      setIsDirty(false);
      toast.success('🎉 Section cover photos saved successfully! Main website updated.');
    } catch (err) {
      console.error('Failed to save section covers:', err);
      toast.error('Failed to save cover photos. Please try again.');
    }
  };

  const sectionLabels: Record<SectionKey, string> = {
    photography: 'Photography',
    videos: 'Videos',
    art: 'Art & Paintings',
    hobbies: 'Hobbies & Pets',
  };

  const sectionIcons: Record<SectionKey, React.ReactNode> = {
    photography: <Camera className="w-4 h-4" />,
    videos: <Video className="w-4 h-4" />,
    art: <Palette className="w-4 h-4" />,
    hobbies: <PawPrint className="w-4 h-4" />,
  };

  const selectedCount = currentSelectedIds.length;
  const isOptimalCount = selectedCount >= 6 && selectedCount <= 7;

  return (
    <div className="space-y-7 pb-16">
      {/* ============================================================== */}
      {/* TOP HEADER & ACTIONS                                           */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 glass border border-white/10 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Section Cover Photos
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-primary/15 text-primary border border-primary/30 font-semibold tracking-wider">
                6-7 Photos System
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Choose exactly 6 or 7 specific pictures to be displayed as cover photos on each website section.
            </p>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center gap-2.5">
          <a
            href={`/#${activeSection}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 text-xs font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Website</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isDirty
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary/40'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{updateSettings.isPending ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION TABS                                                   */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-background/60 rounded-2xl border border-white/10">
        {(['photography', 'videos', 'art', 'hobbies'] as SectionKey[]).map((key) => {
          const count = (coversConfig[key] || []).length;
          const isActive = activeSection === key;
          const isComplete = count >= 6 && count <= 7;

          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveSection(key);
                setSearchQuery('');
              }}
              className={`flex-1 min-w-[140px] flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {sectionIcons[key]}
                <span className="truncate">{sectionLabels[key]}</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : isComplete
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-neutral-400'
                }`}
              >
                {count}/7
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* ACTIVE SECTION STATUS BAR & CONTROLS                           */}
      {/* ============================================================== */}
      <div className="p-5 glass border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              {sectionIcons[activeSection]}
              <span>{sectionLabels[activeSection]} Covers</span>
            </h2>

            {/* Status indicator */}
            {isOptimalCount ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Optimal ({selectedCount} Selected)</span>
              </span>
            ) : selectedCount === 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Default First 7 Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{selectedCount} Selected (Goal: 6-7)</span>
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-400">
            {isOptimalCount
              ? `Currently displaying these ${selectedCount} selected cover photos on the main ${sectionLabels[activeSection]} section.`
              : selectedCount === 0
              ? `No custom cover set yet. The website defaults to the first 7 uploaded items. Select 6 or 7 to customize.`
              : `Select ${6 - selectedCount > 0 ? 6 - selectedCount : 1} more picture(s) to reach the recommended 6-7 cover photo set.`}
          </p>
        </div>

        {/* Quick bulk actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAutoSelectTop7}
            disabled={sectionItems.length === 0}
            className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Auto-Pick Top 7
          </button>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={handleClearSection}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. CURRENTLY SELECTED COVER PHOTOS STRIP (ORDERED)             */}
      {/* ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <span>Selected Cover Photos</span>
              <span className="font-mono text-primary font-bold">({selectedCount}/7)</span>
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">
            Use arrows to reorder slide sequence
          </span>
        </div>

        {selectedMediaItems.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {selectedMediaItems.map((item, idx) => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden border-2 border-primary bg-neutral-900 shadow-md flex flex-col"
              >
                {/* Image display */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                  <img
                    src={getOptimizedImageUrl(item.imageUrl, { width: 320, height: 240, crop: 'fill' })}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Slide number badge */}
                  <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground font-mono font-bold text-xs flex items-center justify-center shadow-lg">
                    #{idx + 1}
                  </span>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 hover:bg-red-500 text-white text-xs flex items-center justify-center transition-colors cursor-pointer shadow-lg"
                    title="Remove from covers"
                  >
                    ×
                  </button>
                </div>

                {/* Title & Order controls */}
                <div className="p-2 flex flex-col justify-between flex-1 bg-neutral-950/90 gap-1.5">
                  <p className="text-[11px] font-bold text-white truncate" title={item.title}>
                    {item.title}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleMoveLeft(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Move left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-mono text-neutral-400">Slot {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleMoveRight(idx)}
                      disabled={idx === selectedMediaItems.length - 1}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Move right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty placeholder slots up to 7 */}
            {Array.from({ length: Math.max(0, 7 - selectedMediaItems.length) }).map((_, slotIdx) => (
              <div
                key={`empty-${slotIdx}`}
                className="rounded-xl border border-dashed border-white/15 p-4 flex flex-col items-center justify-center text-center aspect-[4/3] bg-white/[0.02]"
              >
                <span className="text-xs font-mono text-neutral-400">
                  Slot #{selectedMediaItems.length + slotIdx + 1}
                </span>
                <span className="text-[10px] text-neutral-400 mt-1">Available</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] text-center">
            <p className="text-sm text-neutral-300 font-medium">No custom cover photos selected yet.</p>
            <p className="text-xs text-neutral-400 mt-1">
              Click any picture in the library below to select it as a cover photo (choose 6 or 7).
            </p>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. MEDIA LIBRARY PICKER GRID                                   */}
      {/* ============================================================== */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{sectionLabels[activeSection]} Library</span>
              <span className="text-xs font-mono text-neutral-400 font-normal">
                ({sectionItems.length} uploaded)
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Click any picture to add or remove it from your 6-7 cover selection.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredAvailableItems.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3.5">
            {filteredAvailableItems.map((item) => {
              const selectedIndex = currentSelectedIds.indexOf(item.id);
              const isSelected = selectedIndex !== -1;

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border flex flex-col ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/40 bg-neutral-900 shadow-lg scale-[1.02]'
                      : 'border-white/10 hover:border-white/30 bg-neutral-950 hover:bg-neutral-900'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={getOptimizedImageUrl(item.imageUrl, { width: 360, height: 270, crop: 'fill' })}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Selected badge overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold flex items-center gap-1 shadow-xl">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Cover #{selectedIndex + 1}</span>
                        </div>
                      </div>
                    )}

                    {/* Category tag */}
                    {item.category && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 text-[9px] font-mono uppercase bg-black/75 backdrop-blur-md text-white border border-white/10 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Info footer */}
                  <div className="p-2.5 flex flex-col justify-between flex-1">
                    <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-neutral-400">
                        {isSelected ? 'Click to deselect' : '+ Add as cover'}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-white/30 group-hover:border-white'
                        }`}
                      >
                        {isSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '+'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.01]">
            <p className="text-neutral-400 text-sm">
              {searchQuery ? `No items found matching "${searchQuery}".` : 'No uploaded pictures in this section yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Save Bar when dirty */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3.5 bg-neutral-900/95 border border-primary/40 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-semibold text-white">Unsaved Cover Photo Changes</span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer shadow-md"
          >
            {updateSettings.isPending ? 'Saving...' : 'Save Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionCoversManager;
