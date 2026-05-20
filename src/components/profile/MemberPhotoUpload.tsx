import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const PHOTOS_URL = "https://functions.poehali.dev/2b72957f-278a-4d08-9291-76a368427d5a";

interface Photo {
  id: number;
  url: string;
  caption: string;
}

interface Props {
  memberId: number;
}

export default function MemberPhotoUpload({ memberId }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("Файл слишком большой. Максимум 10 МБ");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreview(result);
      setImageData(result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const upload = async () => {
    if (!imageData) return;
    setUploading(true);
    setError("");
    try {
      const res = await fetch(PHOTOS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, member_id: memberId, caption }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setPhotos(prev => [{ id: data.id, url: data.url, caption }, ...prev]);
        setPreview(null);
        setImageData(null);
        setCaption("");
      } else {
        setError(data.error || "Ошибка загрузки");
      }
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="ImagePlus" size={20} className="text-gold" />
        Мои фотографии
      </h2>

      {/* Зона загрузки */}
      {!preview ? (
        <div
          className="border-2 border-dashed border-khaki/30 rounded-lg p-8 text-center cursor-pointer hover:border-khaki/60 hover:bg-khaki/5 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <Icon name="Upload" size={36} className="text-khaki/40 mx-auto mb-3" />
          <p className="text-foreground/60 text-sm">Перетащите фото сюда или нажмите для выбора</p>
          <p className="text-foreground/40 text-xs mt-1">JPG, PNG, WEBP — до 10 МБ</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-sand/20">
          <div className="flex gap-4 items-start">
            <img src={preview} alt="Предпросмотр" className="w-32 h-32 object-cover rounded-md shrink-0" />
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Подпись к фото (необязательно)"
                className="w-full border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold/40"
                maxLength={200}
              />
              <div className="flex gap-2">
                <button
                  onClick={upload}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-khaki text-parchment text-sm font-bold rounded hover:bg-khaki-light transition-colors disabled:opacity-50"
                >
                  {uploading ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Upload" size={14} />}
                  {uploading ? "Загружаю..." : "Загрузить"}
                </button>
                <button
                  onClick={() => { setPreview(null); setImageData(null); setCaption(""); setError(""); }}
                  className="px-4 py-2 border border-border text-sm rounded hover:bg-muted transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {/* Загруженные фото */}
      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map(photo => (
            <button
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="group relative aspect-square rounded overflow-hidden bg-sand hover:ring-2 hover:ring-gold transition-all"
            >
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </button>
          ))}
        </div>
      )}

      {photos.length === 0 && !preview && (
        <p className="text-center text-foreground/40 text-xs mt-4">Вы ещё не добавили ни одного фото</p>
      )}

      {/* Лайтбокс */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-coal/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-parchment/60 hover:text-parchment">
            <Icon name="X" size={28} />
          </button>
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="max-h-[80vh] w-full object-contain rounded-lg" />
            {lightbox.caption && <p className="text-parchment/70 text-center mt-3 text-sm">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
