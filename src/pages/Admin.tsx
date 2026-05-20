import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/ca3df51e-8d09-4790-a55a-30b62a3b8673";
const GALLERY_API = "https://functions.poehali.dev/cfb9901b-c0cd-4479-93bc-4eab8e858ae6";

interface GalleryCategory { id: number; name: string; slug: string; photo_count: number; }
interface GalleryPhoto { id: number; url: string; caption: string; created_at: string; }

function GalleryPanel({ adminToken }: { adminToken: string }) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [activeCat, setActiveCat] = useState<GalleryCategory | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(GALLERY_API).then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    if (!activeCat) return;
    setPhotos([]);
    fetch(`${GALLERY_API}?category_id=${activeCat.id}`).then(r => r.json()).then(d => setPhotos(d.photos || []));
  }, [activeCat]);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError("Максимум 10 МБ"); return; }
    const reader = new FileReader();
    reader.onload = e => { const r = e.target?.result as string; setPreview(r); setImageData(r); setError(""); };
    reader.readAsDataURL(file);
  };

  const upload = async () => {
    if (!imageData || !activeCat) return;
    setUploading(true); setError("");
    try {
      const res = await fetch(GALLERY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": adminToken },
        body: JSON.stringify({ image: imageData, category_id: activeCat.id, caption }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setPhotos(prev => [{ id: data.id, url: data.url, caption, created_at: new Date().toISOString() }, ...prev]);
        setCategories(prev => prev.map(c => c.id === activeCat.id ? { ...c, photo_count: c.photo_count + 1 } : c));
        setActiveCat(prev => prev ? { ...prev, photo_count: prev.photo_count + 1 } : prev);
        setPreview(null); setImageData(null); setCaption("");
      } else {
        setError(data.error || "Ошибка загрузки");
      }
    } catch { setError("Ошибка соединения"); }
    finally { setUploading(false); }
  };

  return (
    <div className="flex gap-6 mt-2">
      {/* Категории */}
      <div className="w-52 shrink-0">
        <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2">Категория</p>
        <div className="space-y-1">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => { setActiveCat(cat); setPreview(null); setImageData(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between transition-colors ${
                activeCat?.id === cat.id ? "bg-khaki text-parchment font-bold" : "hover:bg-sand/60 text-foreground"
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {cat.photo_count > 0 && <span className="text-xs opacity-60 ml-1">{cat.photo_count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Область загрузки и фото */}
      <div className="flex-1 min-w-0">
        {!activeCat ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon name="FolderOpen" size={40} className="text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Выберите категорию слева</p>
          </div>
        ) : (
          <>
            <h3 className="font-display font-bold text-lg mb-4">{activeCat.name}</h3>

            {/* Загрузка */}
            {!preview ? (
              <div
                className="border-2 border-dashed border-khaki/30 rounded-lg p-6 text-center cursor-pointer hover:border-khaki/60 hover:bg-khaki/5 transition-colors mb-4"
                onClick={() => fileRef.current?.click()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onDragOver={e => e.preventDefault()}
              >
                <Icon name="Upload" size={28} className="text-khaki/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Перетащите или нажмите для выбора</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">JPG, PNG, WEBP — до 10 МБ</p>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-sand/20 mb-4">
                <div className="flex gap-4 items-start">
                  <img src={preview} alt="" className="w-28 h-28 object-cover rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
                      placeholder="Подпись к фото (необязательно)" maxLength={200}
                      className="w-full border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold/40" />
                    {error && <p className="text-brick text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <button onClick={upload} disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-khaki text-parchment text-sm font-bold rounded hover:bg-khaki-light transition-colors disabled:opacity-50">
                        {uploading ? <><Icon name="Loader2" size={13} className="animate-spin" />Загружаю...</> : <><Icon name="Upload" size={13} />Загрузить</>}
                      </button>
                      <button onClick={() => { setPreview(null); setImageData(null); setCaption(""); }}
                        className="px-4 py-2 border border-border text-sm rounded hover:bg-muted transition-colors">Отмена</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Фото категории */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {photos.map(p => (
                  <div key={p.id} className="relative aspect-square rounded overflow-hidden bg-sand group">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                    {p.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-coal/70 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-parchment text-xs line-clamp-1">{p.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground/50 text-sm py-8">В этой категории ещё нет фото</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface Member {
  id: number;
  full_name: string;
  rank: string | null;
  birth_year: number | null;
  hometown: string | null;
  email: string | null;
  phone: string | null;
  years_from: number | null;
  years_to: number | null;
  battalion: string | null;
  company: string | null;
  role: string | null;
  tanks: string[];
  awards: string | null;
  bio: string | null;
  photo_url: string | null;
  status: string;
  created_at: string;
}

type Filter = "pending" | "approved" | "rejected" | "all";

type AdminTab = "members" | "gallery";

export default function Admin() {
  const navigate = useNavigate();
  const [password, setPassword]   = useState("");
  const [authed, setAuthed]       = useState(false);
  const [authError, setAuthError] = useState("");
  const [members, setMembers]     = useState<Member[]>([]);
  const [loading, setLoading]     = useState(false);
  const [filter, setFilter]       = useState<Filter>("pending");
  const [actionId, setActionId]   = useState<number | null>(null);
  const [expanded, setExpanded]   = useState<number | null>(null);
  const [toast, setToast]         = useState("");
  const [tab, setTab]             = useState<AdminTab>("members");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchMembers = async (pwd: string, f: Filter) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}?admin=1&status=${f}`, {
        headers: { "X-Admin-Password": pwd },
      });
      if (res.status === 403) {
        setAuthError("Неверный пароль");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setMembers(data.members || []);
    } catch {
      setAuthError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password.trim()) { setAuthError("Введите пароль"); return; }
    setAuthError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}?admin=1&status=pending`, {
        headers: { "X-Admin-Password": password },
      });
      if (res.status === 403) { setAuthError("Неверный пароль"); setLoading(false); return; }
      const data = await res.json();
      setMembers(data.members || []);
      setAuthed(true);
    } catch {
      setAuthError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  const moderate = async (id: number, action: "approve" | "reject") => {
    setActionId(id);
    try {
      const res = await fetch(API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        setMembers(prev => prev.filter(m => m.id !== id));
        showToast(action === "approve" ? `✅ ${data.name} — одобрен` : `❌ ${data.name} — отклонён`);
        setExpanded(null);
      }
    } catch {
      showToast("Ошибка при обработке заявки");
    } finally {
      setActionId(null);
    }
  };

  useEffect(() => {
    if (authed) fetchMembers(password, filter);
  }, [filter]);

  const FILTERS: { id: Filter; label: string; color: string }[] = [
    { id: "pending",  label: "Ожидают",   color: "text-gold" },
    { id: "approved", label: "Одобрены",  color: "text-khaki" },
    { id: "rejected", label: "Отклонены", color: "text-brick" },
    { id: "all",      label: "Все",       color: "text-foreground" },
  ];

  const statusBadge = (s: string) => {
    if (s === "approved") return <span className="px-2 py-0.5 bg-khaki/15 text-khaki font-body font-bold text-xs rounded-sm">Одобрен</span>;
    if (s === "rejected") return <span className="px-2 py-0.5 bg-brick/10 text-brick font-body font-bold text-xs rounded-sm">Отклонён</span>;
    return <span className="px-2 py-0.5 bg-gold/10 text-gold font-body font-bold text-xs rounded-sm">Ожидает</span>;
  };

  /* ── Экран входа ── */
  if (!authed) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-khaki/10 border-2 border-khaki/20 flex items-center justify-center mx-auto mb-4 text-2xl">🛡</div>
          <h1 className="font-display font-black text-2xl">Панель модератора</h1>
          <p className="font-body text-muted-foreground text-sm mt-1">101 ОУТП · Управление заявками</p>
        </div>

        <div className="bg-card border border-border p-6">
          <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Пароль модератора</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Введите пароль"
            className="input-field rounded-sm mb-3"
            autoFocus
          />
          {authError && <p className="font-body text-brick text-xs mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 bg-khaki text-parchment font-body font-bold rounded-sm hover:bg-khaki-light transition-colors disabled:opacity-50"
          >
            {loading ? <><Icon name="Loader2" size={16} className="animate-spin" />Вход...</> : <><Icon name="LogIn" size={16} />Войти</>}
          </button>
        </div>

        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 mx-auto mt-5 text-muted-foreground hover:text-foreground font-body text-sm transition-colors">
          <Icon name="ArrowLeft" size={14} />
          На главную
        </button>
      </div>
    </div>
  );

  /* ── Панель модератора ── */
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border shadow-lg px-4 py-3 font-body text-sm max-w-xs">
          {toast}
        </div>
      )}

      {/* Navbar */}
      <div className="nav-hero border-b border-parchment/10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-parchment/70 hover:text-parchment transition-colors">
              <Icon name="ArrowLeft" size={18} />
            </button>
            <span className="font-display font-bold text-parchment text-sm">Модератор · 101 ОУТП</span>
            <div className="flex gap-1 ml-4">
              <button onClick={() => setTab("members")}
                className={`px-3 py-1 text-xs font-body font-bold rounded transition-colors ${tab === "members" ? "bg-gold text-coal" : "text-parchment/60 hover:text-parchment"}`}>
                Заявки
              </button>
              <button onClick={() => setTab("gallery")}
                className={`px-3 py-1 text-xs font-body font-bold rounded transition-colors ${tab === "gallery" ? "bg-gold text-coal" : "text-parchment/60 hover:text-parchment"}`}>
                Галерея
              </button>
            </div>
          </div>
          <button
            onClick={() => { setAuthed(false); setPassword(""); setMembers([]); }}
            className="flex items-center gap-1.5 text-parchment/60 hover:text-parchment font-body text-xs transition-colors"
          >
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Вкладка галереи */}
        {tab === "gallery" && (
          <GalleryPanel adminToken={password} />
        )}

        {tab === "members" && <>
        {/* Фильтры */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-4 py-2 font-body font-bold text-sm border-2 rounded-sm transition-colors ${
                filter === f.id
                  ? "border-khaki bg-khaki text-parchment"
                  : "border-border text-muted-foreground hover:border-khaki/40 hover:text-khaki"
              }`}
            >
              {f.label}
            </button>
          ))}
          <button onClick={() => fetchMembers(password, filter)}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground hover:text-khaki hover:border-khaki/40 font-body text-xs rounded-sm transition-colors">
            <Icon name="RefreshCw" size={13} />
            Обновить
          </button>
        </div>

        {/* Счётчик */}
        <p className="font-body text-sm text-muted-foreground mb-4">
          {loading ? "Загрузка..." : `Найдено: ${members.length} заявок`}
        </p>

        {/* Список */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" size={32} className="text-khaki/40 animate-spin" />
          </div>
        )}

        {!loading && members.length === 0 && (
          <div className="text-center py-16 bg-card border border-border rounded-sm">
            <Icon name="CheckCircle" size={36} className="mx-auto mb-3 text-khaki/25" />
            <p className="font-body text-muted-foreground">Заявок нет</p>
          </div>
        )}

        <div className="space-y-3">
          {members.map(m => (
            <div key={m.id} className="bg-card border border-border overflow-hidden">

              {/* Строка-заголовок */}
              <div
                className="p-4 flex items-start gap-4 cursor-pointer hover:bg-sand/30 transition-colors"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                {/* Фото */}
                <div className="w-14 h-14 shrink-0 bg-sand border border-border overflow-hidden flex items-center justify-center">
                  {m.photo_url
                    ? <img src={m.photo_url} alt={m.full_name} className="w-full h-full object-cover" />
                    : <Icon name="User" size={22} className="text-khaki/30" />
                  }
                </div>

                {/* Инфо */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-display font-bold text-base leading-tight">{m.full_name}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                        {m.rank && <span className="badge-bn">{m.rank}</span>}
                        {m.battalion && <span className="badge-bn">{m.battalion}</span>}
                        {m.tanks?.length > 0 && <span className="badge-gold-sm">{m.tanks.join(", ")}</span>}
                        {(m.years_from || m.years_to) && (
                          <span className="font-body text-muted-foreground text-xs">
                            {m.years_from}–{m.years_to}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {statusBadge(m.status)}
                      <Icon name={expanded === m.id ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                  <div className="font-body text-xs text-muted-foreground mt-1.5">
                    #{m.id} · {new Date(m.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    {m.hometown && ` · ${m.hometown}`}
                  </div>
                </div>
              </div>

              {/* Развёрнутые детали */}
              {expanded === m.id && (
                <div className="border-t border-border bg-sand/20 p-5">
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-5 text-sm font-body">
                    {m.email && (
                      <div><span className="text-muted-foreground">Email: </span><span className="font-bold">{m.email}</span></div>
                    )}
                    {m.phone && (
                      <div><span className="text-muted-foreground">Телефон: </span><span className="font-bold">{m.phone}</span></div>
                    )}
                    {m.birth_year && (
                      <div><span className="text-muted-foreground">Год рождения: </span><span className="font-bold">{m.birth_year}</span></div>
                    )}
                    {m.role && (
                      <div><span className="text-muted-foreground">Должность: </span><span className="font-bold">{m.role}</span></div>
                    )}
                    {m.company && (
                      <div><span className="text-muted-foreground">Рота/взвод: </span><span className="font-bold">{m.company}</span></div>
                    )}
                    {m.awards && (
                      <div className="sm:col-span-2"><span className="text-muted-foreground">Награды: </span><span className="font-bold">{m.awards}</span></div>
                    )}
                  </div>

                  {m.bio && (
                    <div className="bg-card border border-border p-4 mb-5">
                      <div className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-1.5">О себе</div>
                      <p className="font-body text-sm leading-relaxed">{m.bio}</p>
                    </div>
                  )}

                  {/* Кнопки действий — только для pending */}
                  {m.status === "pending" && (
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => moderate(m.id, "approve")}
                        disabled={actionId === m.id}
                        className="flex items-center gap-2 px-6 py-2.5 bg-khaki text-parchment font-body font-bold text-sm rounded-sm hover:bg-khaki-light transition-colors disabled:opacity-50"
                      >
                        {actionId === m.id
                          ? <><Icon name="Loader2" size={15} className="animate-spin" />Обработка...</>
                          : <><Icon name="CheckCircle" size={15} />Одобрить</>}
                      </button>
                      <button
                        onClick={() => moderate(m.id, "reject")}
                        disabled={actionId === m.id}
                        className="flex items-center gap-2 px-6 py-2.5 border-2 border-brick/40 text-brick font-body font-bold text-sm rounded-sm hover:bg-brick hover:text-parchment transition-colors disabled:opacity-50"
                      >
                        <Icon name="XCircle" size={15} />
                        Отклонить
                      </button>
                    </div>
                  )}

                  {m.status !== "pending" && (
                    <p className="font-body text-xs text-muted-foreground">
                      Заявка уже обработана. Чтобы изменить статус, обратитесь к базе данных напрямую.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        </>}
      </div>
    </div>
  );
}