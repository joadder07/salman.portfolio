import React, { useState, useEffect } from 'react';
import { Upload, Save, Sparkles, Trash2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSiteSettings, useUpdateSettings, useUploadMedia, HeroImageSlot } from '@/api/settings.api';
import toast from 'react-hot-toast';

const initialEmptySlots: HeroImageSlot[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  url: '',
  title: '',
}));

export const HeroGalleryManager: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const updateSettings = useUpdateSettings();
  const uploadMedia = useUploadMedia();

  // Exactly 8 slots state - starts completely empty
  const [slots, setSlots] = useState<HeroImageSlot[]>(initialEmptySlots);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  useEffect(() => {
    if (settings?.heroImages && settings.heroImages.length > 0) {
      const merged: HeroImageSlot[] = Array.from({ length: 8 }, (_, i) => {
        const item = settings.heroImages?.[i];
        if (item && item.url && item.url.trim() !== '') {
          return { id: i + 1, url: item.url, title: item.title || '' };
        }
        return { id: i + 1, url: '', title: '' };
      });
      setSlots(merged);
    } else {
      setSlots(initialEmptySlots);
    }
  }, [settings]);

  const handleUrlChange = (index: number, newUrl: string) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], url: newUrl };
    setSlots(updated);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], title: newTitle };
    setSlots(updated);
  };

  const handleClearSlot = (index: number) => {
    const updated = [...slots];
    updated[index] = { id: index + 1, url: '', title: '' };
    setSlots(updated);
    toast.success(`Slot 0${index + 1} cleared`);
  };

  const handleClearAll = () => {
    setSlots(initialEmptySlots);
    toast.success('All 8 slots cleared');
  };

  // Direct Cloudinary upload for any slot
  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlot(index);
    try {
      toast.loading(`Uploading Slot 0${index + 1} image to Cloudinary...`, { id: `upload-${index}` });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/hero' });

      const updated = [...slots];
      updated[index] = {
        ...updated[index],
        url: res.secureUrl,
      };
      setSlots(updated);

      toast.success(`Slot 0${index + 1} uploaded to Cloudinary! Click 'Save Gallery' to publish.`, {
        id: `upload-${index}`,
      });
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload image to Cloudinary', { id: `upload-${index}` });
    } finally {
      setUploadingSlot(null);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      toast.loading('Saving 8 Hero Gallery slots...', { id: 'save-hero-gallery' });
      // Keep only filled slots with valid URLs
      const filledSlots = slots
        .filter((s) => s.url && s.url.trim() !== '')
        .map((s, idx) => ({
          id: idx + 1,
          url: s.url.trim(),
          title: s.title || `Slide #0${idx + 1}`,
        }));

      await updateSettings.mutateAsync({
        heroImages: filledSlots,
      });
      toast.success('🎉 Hero Gallery updated successfully! Live on homepage.', { id: 'save-hero-gallery' });
    } catch (err) {
      console.error('Failed to save hero gallery:', err);
      toast.error('Failed to save Hero Gallery', { id: 'save-hero-gallery' });
    }
  };

  const activeCount = slots.filter((s) => s.url && s.url.trim() !== '').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass border border-white/10 rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Hero Slider</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Hero Gallery Manager (8 Slots)
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Upload up to 8 images for the auto-scrolling carousel on your Hero section. Currently active:{' '}
            <span className="text-primary font-bold">{activeCount} / 8 slots filled</span>.
            {activeCount === 0 && ' (When 0 slots are filled, the slider is hidden on the homepage).'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="gap-2 text-xs text-destructive hover:text-destructive"
              title="Clear all 8 slots"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="gap-2 shadow-lg shadow-primary/25 text-xs font-semibold"
          >
            <Save className="w-4 h-4" /> Save Gallery
          </Button>
        </div>
      </div>

      {/* Grid of 8 Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {slots.map((slot, index) => {
          const isFilled = Boolean(slot.url && slot.url.trim() !== '');
          return (
            <Card
              key={index}
              className={`p-4 border transition-all duration-300 relative group flex flex-col justify-between ${
                isFilled
                  ? 'border-primary/40 bg-background/80 shadow-lg shadow-primary/5 ring-1 ring-primary/20'
                  : 'border-white/10 bg-background/40 hover:border-white/20'
              }`}
            >
              <div>
                {/* Slot Badge & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-mono font-bold border border-primary/30">
                    Slot 0{index + 1}
                  </span>
                  {isFilled ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Empty Slot
                    </span>
                  )}
                </div>

                {/* Preview Thumbnail */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-muted/20 mb-4 shadow-inner flex items-center justify-center">
                  {isFilled ? (
                    <img
                      src={slot.url}
                      alt={slot.title || `Slot ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center p-3 text-muted-foreground/60 flex flex-col items-center justify-center gap-1">
                      <ImageIcon className="w-6 h-6 stroke-1" />
                      <span className="text-[10px]">No image uploaded</span>
                    </div>
                  )}

                  {uploadingSlot === index && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                    </div>
                  )}
                </div>

                {/* Slot Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Title / Caption
                    </label>
                    <Input
                      value={slot.title || ''}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      placeholder={`e.g. Highlight #0${index + 1}`}
                      className="text-xs h-8"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Image URL
                    </label>
                    <Input
                      value={slot.url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://... or upload"
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Upload & Actions */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(index, e)}
                    disabled={uploadingSlot === index}
                  />
                  <div className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-medium transition-all hover:scale-[1.02]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Cloudinary</span>
                  </div>
                </label>

                {isFilled && (
                  <button
                    onClick={() => handleClearSlot(index)}
                    className="p-1.5 rounded-lg border border-white/10 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                    title="Clear this slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 z-20 flex items-center justify-between p-4 glass border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>{activeCount} of 8 slots filled</span>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          size="lg"
          className="gap-2 shadow-xl shadow-primary/30"
        >
          <Save className="w-4 h-4" /> Save Gallery
        </Button>
      </div>
    </div>
  );
};
