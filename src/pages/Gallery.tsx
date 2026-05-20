import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const GALLERY_URL = "https://functions.poehali.dev/cfb9901b-c0cd-4479-93bc-4eab8e858ae6";

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
      if (e.key === "Escape") setLightbox(null);
      if (!lightbox) return;
      const idx = photos.findIndex(p => p.id === lightbox.id);
      if (e.key === "ArrowRight" && idx < photos.length - 1) setLightbox(photos[idx + 1]);
      if (e.key === "ArrowLeft" && idx > 0) setLightbox(photos[idx - 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, photos]);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Шапка */}
      <header className="bg-coal text-parchment py-4 px-6 flex items-center gap-4 border-b border-gold/30">
        <Link to="/" className="text-gold hover:text-gold-light transition-colors">
          <Icon name="ChevronLeft" size={20} />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-gold tracking-wide">Фотогалерея</h1>
          <p className="text-xs text-parchment/60">101-й отдельный учебный танковый полк</p>
        </div>
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
              <div className="mb-5">
                <h2 className="font-display text-2xl font-bold text-coal">{activeCategory.name}</h2>
                {activeCategory.description && (
                  <p className="text-coal/60 text-sm mt-1">{activeCategory.description}</p>
                )}
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
                  <p className="text-coal/30 text-sm mt-1">Администратор добавит их в ближайшее время</p>
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

          {/* Стрелки */}
          {photos.findIndex(p => p.id === lightbox.id) > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/60 hover:text-gold transition-colors"
              onClick={() => {
                const idx = photos.findIndex(p => p.id === lightbox.id);
                setLightbox(photos[idx - 1]);
              }}
            >
              <Icon name="ChevronLeft" size={40} />
            </button>
          )}
          {photos.findIndex(p => p.id === lightbox.id) < photos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment/60 hover:text-gold transition-colors"
              onClick={() => {
                const idx = photos.findIndex(p => p.id === lightbox.id);
                setLightbox(photos[idx + 1]);
              }}
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
