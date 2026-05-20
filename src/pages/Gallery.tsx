import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const GALLERY_URL = "https://functions.poehali.dev/cfb9901b-c0cd-4479-93bc-4eab8e858ae6";
const ADMIN_PWD_KEY = "101outp_admin_pwd";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  photo_count: number;
}

interface Photo {
  id: number;
  url: string;
  caption: string;
  created_at: string;
}

export default function Gallery() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Загрузка фото
  const [uploadOpen, setUploadOpen] = useState(false);
  const [adminPwd, setAdminPwd] = useState(() => localStorage.getItem(ADMIN_PWD_KEY) || "");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(GALLERY_URL)
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoadingPhotos(true);
    setPhotos([]);
    fetch(`${GALLERY_URL}?category_id=${activeCategory.id}`)
      .then(r => r.json())
      .then(d => setPhotos(d.photos || []))
      .finally(() => setLoadingPhotos(false));
  }, [activeCategory]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(null); setUploadOpen(false); }
      if (!lightbox) return;
      const idx = photos.findIndex(p => p.id === lightbox.id);
      if (e.key === "ArrowRight" && idx < photos.length - 1) setLightbox(photos[idx + 1]);
      if (e.key === "ArrowLeft" && idx > 0) setLightbox(photos[idx - 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, photos]);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setUploadError("Максимум 10 МБ"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const r = e.target?.result as string;
      setPreview(r); setImageData(r); setUploadError("");
    };
    reader.readAsDataURL(file);
  };

  const openUpload = () => {
    if (!activeCategory) return;
    setPreview(null); setImageData(null); setCaption("");
    setUploadError(""); setUploadSuccess(false);
    setUploadOpen(true);
  };

  const upload = async () => {
    if (!imageData || !activeCategory) return;
    setUploading(true); setUploadError("");
    try {
      const res = await fetch(GALLERY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": adminPwd },
        body: JSON.stringify({ image: imageData, category_id: activeCategory.id, caption }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        const newPhoto: Photo = { id: data.id, url: data.url, caption, created_at: new Date().toISOString() };
        setPhotos(prev => [newPhoto, ...prev]);
        setCategories(prev => prev.map(c =>
          c.id === activeCategory.id ? { ...c, photo_count: c.photo_count + 1 } : c
        ));
        setActiveCategory(prev => prev ? { ...prev, photo_count: prev.photo_count + 1 } : prev);
        localStorage.setItem(ADMIN_PWD_KEY, adminPwd);
        setUploadSuccess(true);
        setPreview(null); setImageData(null); setCaption("");
        setTimeout(() => { setUploadOpen(false); setUploadSuccess(false); }, 1500);
      } else if (res.status === 403) {
        setUploadError("Неверный пароль администратора");
      } else {
        setUploadError(data.error || "Ошибка загрузки");
      }
    } catch {
      setUploadError("Нет связи с сервером");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Шапка */}
      <header className="bg-coal text-parchment py-4 px-6 flex items-center gap-4 border-b border-gold/30">
        <Link to="/" className="text-gold hover:text-gold-light transition-colors">
          <Icon name="ChevronLeft" size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-gold tracking-wide">Фотогалерея</h1>
          <p className="text-xs text-parchment/60">101-й отдельный учебный танковый полк</p>
        </div>
        {activeCategory && (
          <button
            onClick={openUpload}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-coal text-sm font-bold rounded hover:bg-gold-light transition-colors"
          >
            <Icon name="ImagePlus" size={16} />
            Добавить фото
          </button>
        )}
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Сайдбар — категории */}
        <aside className="w-64 shrink-0 bg-coal/95 border-r border-gold/20 overflow-y-auto">
          <div className="p-3">
            <p className="text-parchment/40 text-xs uppercase tracking-widest px-2 py-2">Разделы</p>
            {loadingCats ? (
              <div className="space-y-2 px-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 bg-parchment/10 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <nav className="space-y-0.5">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between gap-2 transition-colors ${
                      activeCategory?.id === cat.id
                        ? "bg-gold text-coal font-semibold"
                        : "text-parchment/80 hover:bg-parchment/10"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {cat.photo_count > 0 && (
                      <span className={`text-xs shrink-0 px-1.5 py-0.5 rounded-full ${
                        activeCategory?.id === cat.id ? "bg-coal/20 text-coal" : "bg-gold/20 text-gold"
                      }`}>
                        {cat.photo_count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Основная область */}
        <main className="flex-1 overflow-y-auto bg-sand/20">
          {!activeCategory ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Icon name="Images" size={64} className="text-gold/40 mb-4" />
              <h2 className="font-display text-2xl text-coal/60 mb-2">Выберите раздел</h2>
              <p className="text-coal/40 text-sm max-w-xs">
                Нажмите на категорию слева, чтобы просмотреть фотографии
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-coal">{activeCategory.name}</h2>
                  {activeCategory.description && (
                    <p className="text-coal/60 text-sm mt-1">{activeCategory.description}</p>
                  )}
                </div>
              </div>

              {loadingPhotos ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-coal/10 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Icon name="ImageOff" size={48} className="text-coal/20 mb-3" />
                  <p className="text-coal/40">Фотографий пока нет</p>
                  <button
                    onClick={openUpload}
                    className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gold text-coal text-sm font-bold rounded hover:bg-gold-light transition-colors mx-auto"
                  >
                    <Icon name="ImagePlus" size={16} />
                    Добавить первое фото
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.map(photo => (
                    <button
                      key={photo.id}
                      onClick={() => setLightbox(photo)}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-coal/10 hover:ring-2 hover:ring-gold transition-all"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-coal/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-parchment text-xs line-clamp-2">{photo.caption}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Модальное окно загрузки фото */}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-coal/80 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setUploadOpen(false); }}
        >
          <div ref={uploadRef} className="bg-background rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-lg">Добавить фото</h3>
                <p className="text-muted-foreground text-sm">{activeCategory?.name}</p>
              </div>
              <button onClick={() => setUploadOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={22} />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Icon name="CheckCircle" size={48} className="text-khaki mb-3" />
                <p className="font-bold text-lg">Фото загружено!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Зона загрузки */}
                {!preview ? (
                  <div
                    className="border-2 border-dashed border-khaki/30 rounded-lg p-8 text-center cursor-pointer hover:border-khaki/60 hover:bg-khaki/5 transition-colors"
                    onClick={() => fileRef.current?.click()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onDragOver={e => e.preventDefault()}
                  >
                    <Icon name="Upload" size={32} className="text-khaki/40 mx-auto mb-2" />
                    <p className="text-sm text-foreground/60">Перетащите или нажмите для выбора</p>
                    <p className="text-xs text-foreground/40 mt-1">JPG, PNG, WEBP — до 10 МБ</p>
                    <input
                      ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img src={preview} alt="" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      onClick={() => { setPreview(null); setImageData(null); }}
                      className="absolute top-2 right-2 bg-coal/70 text-parchment rounded-full p-1 hover:bg-coal transition-colors"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                )}

                {/* Подпись */}
                <input
                  type="text" value={caption} onChange={e => setCaption(e.target.value)}
                  placeholder="Подпись к фото (необязательно)" maxLength={200}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold/40"
                />

                {/* Пароль */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1">Пароль администратора</label>
                  <input
                    type="password" value={adminPwd} onChange={e => setAdminPwd(e.target.value)}
                    placeholder="Введите пароль"
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </div>

                {uploadError && (
                  <p className="text-red-500 text-sm flex items-center gap-1.5">
                    <Icon name="AlertCircle" size={14} />
                    {uploadError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={upload}
                    disabled={!imageData || !adminPwd || uploading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-khaki text-parchment font-bold rounded-lg hover:bg-khaki-light transition-colors disabled:opacity-40"
                  >
                    {uploading ? <><Icon name="Loader2" size={15} className="animate-spin" />Загружаю...</> : <><Icon name="Upload" size={15} />Загрузить</>}
                  </button>
                  <button
                    onClick={() => setUploadOpen(false)}
                    className="px-5 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Лайтбокс */}
      {lightbox && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-coal/95 flex items-center justify-center p-4"
          onClick={e => { if (e.target === lightboxRef.current) setLightbox(null); }}
        >
          <button
            className="absolute top-4 right-4 text-parchment/60 hover:text-parchment transition-colors"
            onClick={() => setLightbox(null)}
          >
            <Icon name="X" size={28} />
          </button>

          {photos.findIndex(p => p.id === lightbox.id) > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/60 hover:text-gold transition-colors"
              onClick={() => { const idx = photos.findIndex(p => p.id === lightbox.id); setLightbox(photos[idx - 1]); }}
            >
              <Icon name="ChevronLeft" size={40} />
            </button>
          )}
          {photos.findIndex(p => p.id === lightbox.id) < photos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment/60 hover:text-gold transition-colors"
              onClick={() => { const idx = photos.findIndex(p => p.id === lightbox.id); setLightbox(photos[idx + 1]); }}
            >
              <Icon name="ChevronRight" size={40} />
            </button>
          )}

          <div className="max-w-4xl w-full">
            <img
              src={lightbox.url}
              alt={lightbox.caption || ""}
              className="max-h-[80vh] w-full object-contain rounded-lg"
            />
            {lightbox.caption && (
              <p className="text-parchment/70 text-center mt-3 text-sm">{lightbox.caption}</p>
            )}
            <p className="text-parchment/30 text-center text-xs mt-1">
              {photos.findIndex(p => p.id === lightbox.id) + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
