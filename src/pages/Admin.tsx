import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/ca3df51e-8d09-4790-a55a-30b62a3b8673";

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
      </div>
    </div>
  );
}
