import React, { useState, useEffect } from 'react';
import {
  Upload,
  Save,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  ArrowLeft,
  ArrowRight,
  Copy,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSiteSettings, useUpdateSettings, useUploadMedia, HeroImageSlot } from '@/api/settings.api';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';
import toast from 'react-hot-toast';

export const HeroGalleryManager: React.FC = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSettings();
  const uploadMedia = useUploadMedia();

  // Dynamic unlimited slots state
  const [slots, setSlots] = useState<HeroImageSlot[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isBatchUploading, setIsBatchUploading] = useState<boolean>(false);

  // Sync settings when loaded
  useEffect(() => {
    if (settings?.heroImages && Array.isArray(settings.heroImages)) {
      setSlots(
        settings.heroImages.map((s, idx) => ({
          id: s.id || `slide-${idx + 1}-${Date.now()}`,
          url: s.url || '',
          title: s.title || '',
        }))
      );
    } else {
      setSlots([]);
    }
  }, [settings]);

  // Add a single new empty slide
  const handleAddSlide = () => {
    const newSlot: HeroImageSlot = {
      id: `slide-${Date.now()}`,
      url: '',
      title: `Slide #${slots.length + 1}`,
    };
    setSlots((prev) => [...prev, newSlot]);
    toast.success('Added new slide card. Upload or paste an image URL!');
  };

  // Batch upload multiple images from file picker
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBatchUploading(true);
    const fileList = Array.from(files);
    toast.loading(`Uploading ${fileList.length} image(s) to Cloudinary...`, { id: 'batch-upload' });

    try {
      const uploadedSlots: HeroImageSlot[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/hero' });
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        uploadedSlots.push({
          id: `slide-${Date.now()}-${i}`,
          url: res.secureUrl,
          title: cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : `Capture #${slots.length + i + 1}`,
        });
      }

      setSlots((prev) => [...prev, ...uploadedSlots]);
      toast.success(`🎉 Successfully uploaded ${uploadedSlots.length} image(s)! Click 'Save Gallery' to publish.`, {
        id: 'batch-upload',
      });
    } catch (err) {
      console.error('Batch upload error:', err);
      toast.error('Failed to upload some images. Please retry.', { id: 'batch-upload' });
    } finally {
      setIsBatchUploading(false);
      e.target.value = '';
    }
  };

  // Modify URL
  const handleUrlChange = (index: number, newUrl: string) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], url: newUrl };
      return updated;
    });
  };

  // Modify Title
  const handleTitleChange = (index: number, newTitle: string) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title: newTitle };
      return updated;
    });
  };

  // Single file upload for specific slot
  const handleSingleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      toast.loading(`Uploading image for Slide #${index + 1}...`, { id: `upload-${index}` });
      const res = await uploadMedia.mutateAsync({ file, folder: 'portfolio/hero' });

      setSlots((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          url: res.secureUrl,
          title: updated[index].title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        };
        return updated;
      });

      toast.success(`Slide #${index + 1} uploaded to Cloudinary!`, { id: `upload-${index}` });
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed. Please check file type and size.', { id: `upload-${index}` });
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  // Delete a slot completely
  const handleDeleteSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, idx) => idx !== index));
    toast.success(`Slide #${index + 1} removed`);
  };

  // Duplicate a slot
  const handleDuplicateSlot = (index: number) => {
    const target = slots[index];
    if (!target) return;
    const duplicated: HeroImageSlot = {
      id: `slide-${Date.now()}`,
      url: target.url,
      title: target.title ? `${target.title} (Copy)` : '',
    };
    setSlots((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, duplicated);
      return copy;
    });
    toast.success(`Duplicated slide #${index + 1}`);
  };

  // Move slide left/up
  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    setSlots((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  // Move slide right/down
  const handleMoveRight = (index: number) => {
    if (index >= slots.length - 1) return;
    setSlots((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  // Clear all
  const handleClearAll = () => {
    if (slots.length === 0) return;
    if (window.confirm('Are you sure you want to clear all images from the Hero Gallery?')) {
      setSlots([]);
      toast.success('All slides removed. Click Save Gallery to publish.');
    }
  };

  // Save to backend
  const handleSave = async () => {
    try {
      toast.loading('Saving Hero Gallery...', { id: 'save-hero-gallery' });
      // Keep only filled slots with valid URLs
      const filledSlots = slots
        .filter((s) => s.url && s.url.trim() !== '')
        .map((s, idx) => ({
          id: idx + 1,
          url: s.url.trim(),
          title: s.title?.trim() || `Slide #${idx + 1}`,
        }));

      await updateSettings.mutateAsync({
        heroImages: filledSlots,
      });

      toast.success(`🎉 Saved ${filledSlots.length} Hero Gallery images! Live on homepage.`, {
        id: 'save-hero-gallery',
      });
    } catch (err) {
      console.error('Failed to save hero gallery:', err);
      toast.error('Failed to save Hero Gallery', { id: 'save-hero-gallery' });
    }
  };

  const activeCount = slots.filter((s) => s.url && s.url.trim() !== '').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 glass border border-white/10 rounded-3xl shadow-2xl bg-card/60 backdrop-blur-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Viewfinder Carousel</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            Hero Gallery Manager
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold uppercase tracking-wider">
              Unlimited Uploads
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Upload and organize as many hero images as needed for your homepage carousel.
            Currently active:{' '}
            <span className="text-primary font-bold">{activeCount} slide{activeCount !== 1 ? 's' : ''} with media</span>{' '}
            ({slots.length} total card{slots.length !== 1 ? 's' : ''}).
            {activeCount === 0 && ' When empty, the carousel uses high-definition default visual presets.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Multi-file batch upload */}
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isBatchUploading}
              onChange={handleBatchUpload}
              className="hidden"
            />
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-foreground border border-white/20 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-sm">
              <Upload className={`w-4 h-4 ${isBatchUploading ? 'animate-bounce text-primary' : ''}`} />
              <span>{isBatchUploading ? 'Uploading...' : 'Batch Upload Images'}</span>
            </div>
          </label>

          {/* Add blank slide card */}
          <Button
            onClick={handleAddSlide}
            variant="outline"
            className="gap-2 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Slide Card
          </Button>

          {/* Clear all */}
          {slots.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
              title="Clear all slides"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </Button>
          )}

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="gap-2 shadow-lg shadow-primary/25 text-xs font-bold"
          >
            <Save className="w-4 h-4" /> Save Gallery
          </Button>
        </div>
      </div>

      {/* Info Tip */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-muted-foreground">
        <HelpCircle className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong className="text-foreground">Pro-tip:</strong> You can upload multiple high-res photos at once via <em>Batch Upload Images</em>, or add individual slides with custom titles. Use arrow buttons to rearrange slide order. Click <em>Save Gallery</em> to deploy changes live.
        </span>
      </div>

      {/* Empty State */}
      {slots.length === 0 && !isLoading && (
        <Card className="text-center py-20 px-6 border-dashed border-2 border-white/20 bg-background/30 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary shadow-inner">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No slides in Hero Gallery yet</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Your gallery has no custom slides uploaded. The public homepage is currently displaying curated fallback captures. Click below to add your first images!
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchUpload}
                className="hidden"
              />
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs transition-all hover:scale-105 shadow-lg shadow-primary/25 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Upload Images from Device</span>
              </div>
            </label>
            <Button onClick={handleAddSlide} variant="outline" className="text-xs gap-2">
              <Plus className="w-4 h-4" /> Add Blank Card
            </Button>
          </div>
        </Card>
      )}

      {/* Dynamic Scrollable Grid of Unlimited Slides */}
      {slots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {slots.map((slot, index) => {
            const isFilled = Boolean(slot.url && slot.url.trim() !== '');

            return (
              <Card
                key={slot.id || index}
                className={`p-4 border rounded-2xl transition-all duration-300 relative group flex flex-col justify-between ${
                  isFilled
                    ? 'border-primary/40 bg-card/80 shadow-lg shadow-primary/5 ring-1 ring-primary/20'
                    : 'border-white/10 bg-card/40 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Slot Badge & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-mono font-bold border border-primary/30">
                      Slide #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                    {isFilled ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Awaiting Image
                      </span>
                    )}
                  </div>

                  {/* Preview Thumbnail */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-muted/20 mb-4 shadow-inner flex items-center justify-center">
                    {isFilled ? (
                      <img
                        src={getOptimizedImageUrl(slot.url, {
                          width: 480,
                          height: 300,
                          crop: 'fill',
                          quality: 'auto',
                          format: 'auto',
                        })}
                        alt={slot.title || `Slide ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center p-3 text-muted-foreground/60 flex flex-col items-center justify-center gap-1">
                        <ImageIcon className="w-7 h-7 stroke-1" />
                        <span className="text-[11px]">No image uploaded</span>
                      </div>
                    )}

                    {uploadingIndex === index && (
                      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                        <span className="text-[10px] text-muted-foreground font-mono">Uploading...</span>
                      </div>
                    )}
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Caption / Title
                      </label>
                      <Input
                        value={slot.title || ''}
                        onChange={(e) => handleTitleChange(index, e.target.value)}
                        placeholder={`e.g. Capture #${index + 1}`}
                        className="text-xs h-8.5 rounded-lg"
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
                        className="text-xs h-8.5 font-mono rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload & Reorder Actions */}
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSingleFileUpload(index, e)}
                        disabled={uploadingIndex === index}
                      />
                      <div className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Cloudinary Upload</span>
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDuplicateSlot(index)}
                      className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                      title="Duplicate slide"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(index)}
                      className="p-1.5 rounded-lg border border-white/10 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ordering arrows */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                    <span className="font-mono">Order:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveLeft(index)}
                        disabled={index === 0}
                        className="p-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        title="Move Left / Earlier"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <span className="font-mono px-1">#{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleMoveRight(index)}
                        disabled={index === slots.length - 1}
                        className="p-1 rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        title="Move Right / Later"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Save & Summary Bar */}
      {slots.length > 0 && (
        <div className="sticky bottom-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl bg-card/90">
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-foreground">
              {activeCount} of {slots.length} slides ready
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-emerald-400">Unlimited System Active</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleAddSlide}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slide
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending}
              size="sm"
              className="gap-2 shadow-xl shadow-primary/30 font-bold"
            >
              <Save className="w-4 h-4" /> Save Gallery
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
