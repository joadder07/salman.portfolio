import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, X, Search, Sparkles, Music, Film } from 'lucide-react';
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
  _renderListItem,
}: EntityManagerProps<T>) {
  const { data: items = [], isLoading } = useGetAll();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();
  const uploadMedia = useUploadMedia();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

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

    try {
      toast.loading(`Uploading ${label} to Cloudinary...`, { id: 'media-upload' });
      const res = await uploadMedia.mutateAsync({ file, folder });
      setFormData((prev) => ({ ...prev, [fieldKey]: res.secureUrl }));
      toast.success(`${label.charAt(0).toUpperCase() + label.slice(1)} uploaded!`, { id: 'media-upload' });
    } catch {
      toast.error('Upload failed. Check file type & size (max 50 MB).', { id: 'media-upload' });
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
    const titleVal = item.title || item.name || item.degree || item.institution || '';
    return String(titleVal).toLowerCase().includes(search.toLowerCase());
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(20);

  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const displayedItems = pageSize === 'all'
    ? filteredItems
    : filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {icon} {title}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono font-medium">
              {filteredItems.length} total
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 pl-9 pr-4 rounded-xl border border-border/80 bg-background/50 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <Button onClick={handleOpenCreate} className="gap-2 shadow-lg shadow-primary/20 shrink-0">
            <Plus className="w-4 h-4" /> Add {singularTitle}
          </Button>
        </div>
      </div>

      {/* Item List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-foreground">No {title.toLowerCase()} recorded</h3>
          <p className="text-xs text-muted-foreground mt-1">Click "Add {singularTitle}" to create one.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {displayedItems.map((item: any) => (
              <Card key={item.id} className="flex items-center justify-between p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  {(item.imageUrl || item.thumbnailUrl || item.coverUrl || item.logoUrl) && (
                    <img
                      src={getOptimizedImageUrl(
                        item.imageUrl || item.thumbnailUrl || item.coverUrl || item.logoUrl,
                        { width: 120, height: 120, crop: 'thumb', quality: 'auto', format: 'auto' }
                      )}
                      alt="Preview"
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-xl object-cover bg-muted shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">
                      {item.title || item.name || item.degree || 'Untitled'}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.institution || item.author || item.category || item.species || item.description || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Admin Pagination Controls */}
          {filteredItems.length > 20 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>
                  Showing {pageSize === 'all' ? 1 : (currentPage - 1) * (pageSize as number) + 1}–
                  {pageSize === 'all' ? filteredItems.length : Math.min(currentPage * (pageSize as number), filteredItems.length)} of {filteredItems.length}
                </span>
                <span className="text-muted-foreground/40">&bull;</span>
                <div className="flex items-center gap-1 font-mono">
                  <span>Per page:</span>
                  {[20, 50, 'all'].map((size) => (
                    <button
                      key={String(size)}
                      type="button"
                      onClick={() => {
                        setPageSize(size as any);
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-0.5 rounded-md text-[11px] ${
                        pageSize === size
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'bg-muted/60 hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {size === 'all' ? 'All' : size}
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

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col border border-white/20 shadow-2xl p-6 bg-card">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {editingItem ? `Edit ${singularTitle}` : `New ${singularTitle}`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground"
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
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <div className="flex items-center gap-3 mb-2">
                        {formData[field.key] && (
                          <img
                            src={formData[field.key]}
                            alt="Upload preview"
                            className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          />
                        )}
                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold cursor-pointer hover:bg-primary/20 transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(field.key, e, 'portfolio/images')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <Input
                        placeholder="Or paste a direct image URL..."
                        value={formData[field.key] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="text-xs"
                      />
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
                        placeholder="Or paste a direct audio URL (MP3, WAV, OGG)..."
                        value={formData[field.key] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="mt-2 text-xs"
                      />
                    </div>
                  )}

                  {field.type === 'video' && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <div className="flex items-center gap-3 mb-2">
                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold cursor-pointer hover:bg-blue-500/20 transition-all">
                          <Film className="w-3.5 h-3.5" />
                          Upload Video File
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(field.key, e, 'portfolio/videos')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <Input
                        placeholder="Or paste a YouTube / direct video URL..."
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
                  disabled={createMutation.isPending || updateMutation.isPending}
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
