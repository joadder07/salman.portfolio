import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Search,
  Sparkles,
  Music,
  Film,
  LayoutGrid,
  List,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUploadMedia } from '@/api/settings.api';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';
import toast from 'react-hot-toast';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'image' | 'audio' | 'video' | 'boolean';
  placeholder?: string;
  required?: boolean;
}

interface EntityManagerProps<T extends { id: string }> {
  title: string;
  singularTitle: string;
  description: string;
  icon: React.ReactNode;
  fields: FieldConfig[];
  useGetAll: () => { data?: T[]; isLoading: boolean };
  useCreate: () => { mutateAsync: (payload: any) => Promise<any>; isPending: boolean };
  useUpdate: () => { mutateAsync: (payload: { id: string; data: any }) => Promise<any>; isPending: boolean };
  useDelete: () => { mutateAsync: (id: string) => Promise<any>; isPending: boolean };
  headerBanner?: React.ReactNode;
  renderListItem?: (item: T) => React.ReactNode;
}

export function EntityManager<T extends { id: string }>({
  title,
  singularTitle,
  description,
  icon,
  fields,
  useGetAll,
  useCreate,
  useUpdate,
  useDelete,
  headerBanner,
}: EntityManagerProps<T>) {
  const { data: items = [], isLoading } = useGetAll();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();
  const uploadMedia = useUploadMedia();

  const hasMedia = fields.some((f) => f.type === 'image' || f.type === 'video');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(hasMedia ? 'grid' : 'list');

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Unlimited by default! No rigid 20-slot cap
  const [pageSize, setPageSize] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({});
    setModalOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleFileUpload = async (
    fieldKey: string,
    e: React.ChangeEvent<HTMLInputElement>,
    folder = 'portfolio'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/');
    const label = isAudio ? 'audio' : isVideo ? 'video' : 'image';

    setIsUploading(true);
    try {
      toast.loading(`Uploading ${label} to Cloudinary...`, { id: 'media-upload' });
      const res = await uploadMedia.mutateAsync({ file, folder });
      setFormData((prev) => ({ ...prev, [fieldKey]: res.secureUrl }));
      toast.success(`${label.charAt(0).toUpperCase() + label.slice(1)} uploaded!`, { id: 'media-upload' });
    } catch {
      toast.error('Upload failed. Check file type & size (max 50 MB).', { id: 'media-upload' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
        toast.success(`${singularTitle} updated!`);
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(`${singularTitle} created!`);
      }
      setModalOpen(false);
    } catch {
      toast.error('Operation failed. Please check inputs.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete this ${singularTitle.toLowerCase()}?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`${singularTitle} deleted!`);
    } catch {
      toast.error('Delete failed');
    }
  };

  // Search filter
  const filteredItems = items.filter((item: any) => {
    const titleVal =
      item.title ||
      item.name ||
      item.degree ||
      item.institution ||
      item.category ||
      item.species ||
      '';
    return String(titleVal).toLowerCase().includes(search.toLowerCase());
  });

  const totalPages =
    pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const displayedItems =
    pageSize === 'all'
      ? filteredItems
      : filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 glass border border-white/10 rounded-3xl shadow-xl bg-card/60 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5 flex-wrap">
            {icon} {title}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono font-medium">
              {filteredItems.length} total
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono uppercase tracking-wider font-semibold">
              Unlimited Uploads
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* View mode toggle (Grid / List) */}
          <div className="flex items-center p-1 bg-background/60 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
              title="Grid View (Unlimited Gallery Cards)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9.5 pl-9 pr-3 rounded-xl border border-border/80 bg-background/50 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Add New button */}
          <Button onClick={handleOpenCreate} className="gap-2 shadow-lg shadow-primary/20 shrink-0 text-xs font-semibold">
            <Plus className="w-4 h-4" /> Add {singularTitle}
          </Button>
        </div>
      </div>

      {/* Optional Custom Header Banner / Description Box */}
      {headerBanner && <div>{headerBanner}</div>}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-20 px-6 border-dashed border-2 border-white/15 rounded-3xl bg-card/40">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-muted-foreground shadow-inner">
            {icon || <Layers className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-bold text-foreground">No {title.toLowerCase()} recorded yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Click &ldquo;Add {singularTitle}&rdquo; to upload and publish your first item with unlimited storage.
          </p>
          <div className="mt-5">
            <Button onClick={handleOpenCreate} className="gap-2 text-xs font-semibold">
              <Plus className="w-4 h-4" /> Add First {singularTitle}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* GRID VIEW: Responsive, dynamic cards with image previews */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayedItems.map((item: any, idx: number) => {
                const mediaUrl =
                  item.imageUrl || item.thumbnailUrl || item.coverUrl || item.logoUrl || item.videoUrl;
                const itemTitle = item.title || item.name || item.degree || 'Untitled';
                const itemSubtitle =
                  item.category || item.species || item.medium || item.institution || item.author || '';

                return (
                  <Card
                    key={item.id}
                    className="p-4 border border-white/10 hover:border-primary/40 bg-card/70 hover:bg-card/90 transition-all duration-300 rounded-2xl flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div>
                      {/* Media Thumbnail Container */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3 shadow-inner">
                        {mediaUrl ? (
                          <img
                            src={getOptimizedImageUrl(mediaUrl, {
                              width: 500,
                              height: 320,
                              crop: 'fill',
                              quality: 'auto',
                              format: 'auto',
                            })}
                            alt={itemTitle}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 gap-1">
                            <ImageIcon className="w-6 h-6 stroke-1" />
                            <span className="text-[10px]">No image</span>
                          </div>
                        )}

                        {/* Slide / Item Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white font-semibold">
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </div>

                        {/* Category Pill */}
                        {itemSubtitle && (
                          <div className="absolute bottom-2 left-2 max-w-[85%] truncate px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-semibold shadow-md">
                            {itemSubtitle}
                          </div>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {itemTitle}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.year || item.tags ? (item.year || String(item.tags).slice(0, 15)) : 'Active'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="p-1.5 h-7 w-7 rounded-lg"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-1.5 h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* LIST VIEW: Compact row list */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {displayedItems.map((item: any, idx: number) => {
                const mediaUrl =
                  item.imageUrl || item.thumbnailUrl || item.coverUrl || item.logoUrl || item.videoUrl;
                const itemTitle = item.title || item.name || item.degree || 'Untitled';
                const itemSubtitle =
                  item.institution || item.author || item.category || item.species || item.medium || item.description || '';

                return (
                  <Card
                    key={item.id}
                    className="flex items-center justify-between p-3.5 sm:p-4 hover:border-primary/40 rounded-2xl transition-all bg-card/60"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="font-mono text-xs text-muted-foreground/60 w-6 shrink-0">
                        #{idx + 1}
                      </span>
                      {mediaUrl && (
                        <img
                          src={getOptimizedImageUrl(mediaUrl, {
                            width: 120,
                            height: 120,
                            crop: 'thumb',
                            quality: 'auto',
                            format: 'auto',
                          })}
                          alt="Preview"
                          loading="lazy"
                          decoding="async"
                          className="w-12 h-12 rounded-xl object-cover bg-muted shrink-0 border border-white/10"
                        />
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {itemTitle}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {itemSubtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-8 w-8 rounded-lg"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-2 h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination & Display Controls */}
          {filteredItems.length > 24 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Showing {pageSize === 'all' ? 1 : (currentPage - 1) * (pageSize as number) + 1}–
                  {pageSize === 'all'
                    ? filteredItems.length
                    : Math.min(currentPage * (pageSize as number), filteredItems.length)}{' '}
                  of {filteredItems.length}
                </span>
                <span className="text-muted-foreground/40">&bull;</span>
                <div className="flex items-center gap-1 font-mono">
                  <span>Display:</span>
                  {[24, 48, 96, 'all'].map((size) => (
                    <button
                      key={String(size)}
                      type="button"
                      onClick={() => {
                        setPageSize(size as any);
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                        pageSize === size
                          ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                          : 'bg-muted/60 hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {size === 'all' ? 'All (Unlimited)' : size}
                    </button>
                  ))}
                </div>
              </div>

              {pageSize !== 'all' && totalPages > 1 && (
                <div className="flex items-center gap-1.5 font-mono">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="px-2 text-xs">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col border border-white/20 shadow-2xl p-6 bg-card">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {editingItem ? `Edit ${singularTitle}` : `New ${singularTitle}`}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              {fields.map((field) => (
                <div key={field.key} className="space-y-1.5 text-left">
                  {field.type === 'text' && (
                    <Input
                      label={field.label}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      required={field.required}
                    />
                  )}

                  {field.type === 'number' && (
                    <Input
                      label={field.label}
                      type="number"
                      placeholder={field.placeholder}
                      value={formData[field.key] ?? ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.key]: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      required={field.required}
                    />
                  )}

                  {field.type === 'date' && (
                    <Input
                      label={field.label}
                      type="date"
                      value={
                        formData[field.key]
                          ? new Date(formData[field.key]).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.key]: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : undefined,
                        }))
                      }
                      required={field.required}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <textarea
                        rows={3}
                        value={formData[field.key] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                        required={field.required}
                      />
                    </div>
                  )}

                  {field.type === 'image' && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <div className="flex items-center gap-3">
                        {formData[field.key] ? (
                          <div className="relative group/img w-16 h-16 rounded-xl overflow-hidden border border-white/15 bg-black shrink-0">
                            <img
                              src={formData[field.key]}
                              alt="Upload preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, [field.key]: '' }))}
                              className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-destructive"
                              title="Clear image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center text-muted-foreground shrink-0">
                            <ImageIcon className="w-6 h-6 stroke-1" />
                          </div>
                        )}

                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold cursor-pointer hover:bg-primary/20 transition-all">
                            <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                            <span>{isUploading ? 'Uploading...' : 'Upload Image to Cloudinary'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={(e) => handleFileUpload(field.key, e, 'portfolio/images')}
                              className="hidden"
                            />
                          </label>
                          <Input
                            placeholder="Or paste direct image URL..."
                            value={formData[field.key] || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {field.type === 'audio' && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <div className="flex items-center gap-3 mb-2">
                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold cursor-pointer hover:bg-violet-500/20 transition-all">
                          <Music className="w-3.5 h-3.5" />
                          Upload Audio File
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileUpload(field.key, e, 'portfolio/music')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {formData[field.key] && (
                        <audio
                          controls
                          src={formData[field.key]}
                          className="w-full h-10 rounded-xl mt-1"
                        />
                      )}
                      <Input
                        placeholder="Or paste direct audio URL (MP3, WAV, OGG)..."
                        value={formData[field.key] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="mt-2 text-xs"
                      />
                    </div>
                  )}

                  {field.type === 'video' && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold cursor-pointer hover:bg-blue-500/20 transition-all">
                          <Film className="w-3.5 h-3.5" />
                          <span>Upload Video File (MP4/WEBM)</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(field.key, e, 'portfolio/videos')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <Input
                        placeholder="Or paste a YouTube / Vimeo / MP4 URL..."
                        value={formData[field.key] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                >
                  {editingItem ? 'Save Changes' : 'Create Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
