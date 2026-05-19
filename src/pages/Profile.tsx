import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const IMG_KRAKOW  = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/2d8618e5-9c64-4e0c-86c2-f38a1c1076e0.jpg";
const IMG_DRESDEN = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/aa483e23-240e-47fe-a9e4-bba8b4e20b28.jpg";
const IMG_REUNION = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/b3cbf8e6-fc7a-4c99-b319-e489c9713b57.jpg";

const PROFILE = {
  name: "Сергей Александрович Петров",
  rank: "Старший сержант",
  years: "1973–1975",
  battalion: "2-й учебный батальон",
  tank: "Т-55",
  role: "Механик-водитель",
  location: "Дрезден, ГДР",
  hometown: "г. Воронеж",
  joined: "Январь 2025",
};

const MEDALS = [
  { name: "Медаль «За службу в ГСВГ»",       icon: "⭐", color: "text-gold" },
  { name: "Отличник боевой подготовки",        icon: "🏅", color: "text-gold" },
  { name: "Ветеран воинской службы",           icon: "🎖", color: "text-gold" },
  { name: "Участник встречи ветеранов 2023",   icon: "🤝", color: "text-muted-foreground" },
];

const MEMORIES = [
  {
    title: "Первый выезд на полигон Кракау",
    date: "Июнь 1973",
    place: "Полигон Кракау, ГДР",
    text: "Помню, как нас впервые привезли на полигон. Командир объяснял особенности Т-55 — машина тяжёлая, но послушная. После третьего заезда уже чувствовал её как родную...",
  },
  {
    title: "Учения в составе 2-го батальона",
    date: "Октябрь 1974",
    place: "Дрезден, ГДР",
    text: "Совместные учения с другими подразделениями. Командовал капитан Волков. Мороз, раннее утро, но настроение у всех было боевое. Ребята из взвода до сих пор вспоминают...",
  },
  {
    title: "Последний день службы",
    date: "Февраль 1975",
    place: "Дрезден, ГДР",
    text: "День, который помнишь всю жизнь. Построение на плацу, прощание с командиром, дорога домой через всю Европу. Молодой был — не понимал ещё, как это важно...",
  },
];

const COMRADES = [
  { name: "Владимир Козлов",   years: "1973–1975", bn: "2-й учебный", tank: "Т-62" },
  { name: "Михаил Сидоров",    years: "1974–1976", bn: "2-й учебный", tank: "Т-55" },
  { name: "Андрей Лебедев",    years: "1972–1974", bn: "4-й Кракау",  tank: "Т-55" },
  { name: "Николай Громов",    years: "1973–1975", bn: "2-й учебный", tank: "Т-55" },
];

const PHOTOS = [
  { src: IMG_KRAKOW,  caption: "Полигон Кракау, 1974 г." },
  { src: IMG_DRESDEN, caption: "Дрезден, площадь полка, 1973 г." },
  { src: IMG_REUNION, caption: "Встреча ветеранов 2023 г." },
  { src: IMG_KRAKOW,  caption: "Занятия по вождению, лето 1974 г." },
  { src: IMG_DRESDEN, caption: "Торжественное построение, 1974 г." },
  { src: IMG_REUNION, caption: "Однополчане, Москва 2019 г." },
];

type Tab = "memories" | "photos" | "comrades" | "medals";

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("memories");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "memories", label: "Воспоминания", icon: "BookOpen" },
    { id: "photos",   label: "Фотоархив",    icon: "Camera" },
    { id: "comrades", label: "Сослуживцы",   icon: "Users" },
    { id: "medals",   label: "Награды",      icon: "Award" },
  ];

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${highContrast ? "high-contrast" : ""}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Top bar */}
      <div className="nav-hero fixed top-0 inset-x-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-parchment/80 hover:text-parchment transition-colors font-body text-sm"
          >
            <Icon name="ArrowLeft" size={16} />
            101 ОУТП
          </button>
          <div className="flex items-center gap-3">
            {/* Font size */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize(f => Math.max(14, f - 2))}
                className="w-7 h-7 border border-parchment/25 text-parchment/70 hover:text-parchment hover:border-parchment/50 transition-colors text-xs font-bold flex items-center justify-center"
              >A−</button>
              <button
                onClick={() => setFontSize(f => Math.min(22, f + 2))}
                className="w-7 h-7 border border-parchment/25 text-parchment/70 hover:text-parchment hover:border-parchment/50 transition-colors text-sm font-bold flex items-center justify-center"
              >A+</button>
            </div>
            {/* High contrast */}
            <button
              onClick={() => setHighContrast(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1 border text-xs font-body transition-colors ${
                highContrast
                  ? "border-gold text-gold bg-gold/10"
                  : "border-parchment/25 text-parchment/70 hover:border-parchment/50"
              }`}
            >
              <Icon name="Contrast" size={12} />
              Контраст
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1 bg-gold text-coal text-xs font-body font-bold hover:bg-gold-light transition-colors">
              <Icon name="FileDown" size={12} />
              Скачать PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">

        {/* ── Profile header ── */}
        <div className="bg-card border border-border mb-6 overflow-hidden">
          {/* Cover */}
          <div className="relative h-40 lg:h-52 overflow-hidden">
            <img src={IMG_DRESDEN} alt="Дрезден" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 hero-img-overlay" />
            <div className="absolute bottom-4 right-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-coal/60 border border-parchment/25 text-parchment text-xs font-body hover:bg-coal/80 transition-colors">
                <Icon name="Camera" size={12} />
                Сменить обложку
              </button>
            </div>
          </div>

          {/* Info row */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start -mt-10 sm:-mt-12">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-sand border-4 border-card flex items-center justify-center shrink-0 relative">
                <Icon name="User" size={36} className="text-khaki/40" />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-khaki flex items-center justify-center">
                  <Icon name="Camera" size={11} className="text-parchment" />
                </button>
              </div>

              {/* Name + meta */}
              <div className="flex-1 pt-2 sm:pt-14">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground leading-tight">
                      {PROFILE.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="badge-bn">{PROFILE.rank}</span>
                      <span className="badge-gold-sm">{PROFILE.tank}</span>
                      <span className="font-body text-muted-foreground text-sm">{PROFILE.years}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors">
                      <Icon name="MessageSquare" size={14} />
                      Написать
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 border-2 border-khaki/40 text-khaki font-body font-bold text-sm hover:bg-khaki hover:text-parchment transition-colors">
                      <Icon name="UserPlus" size={14} />
                      Друзья
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="divider-khaki mt-4 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "Shield",   label: "Батальон",    val: PROFILE.battalion },
                { icon: "MapPin",   label: "Дислокация",  val: PROFILE.location },
                { icon: "Home",     label: "Родной город",val: PROFILE.hometown },
                { icon: "Calendar", label: "В сообществе",val: `с ${PROFILE.joined}` },
              ].map(d => (
                <div key={d.label} className="flex items-start gap-2.5">
                  <Icon name={d.icon as "Shield" | "MapPin" | "Home" | "Calendar"} size={14} className="text-khaki/50 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-body text-[10px] text-muted-foreground uppercase tracking-wide">{d.label}</div>
                    <div className="font-body text-sm font-bold text-foreground leading-tight">{d.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-card border border-border border-b-0 flex overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 font-body font-bold text-sm whitespace-nowrap border-b-2 transition-colors flex-1 justify-center ${
                tab === t.id
                  ? "border-khaki text-khaki bg-sand/40"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-sand/20"
              }`}
            >
              <Icon name={t.icon as "BookOpen" | "Camera" | "Users" | "Award"} size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="bg-card border border-border p-6 min-h-80">

          {/* ВОСПОМИНАНИЯ */}
          {tab === "memories" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl">Воспоминания</h2>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors">
                  <Icon name="Plus" size={14} />
                  Добавить
                </button>
              </div>
              <div className="space-y-4">
                {MEMORIES.map((m, i) => (
                  <div key={i} className="border border-border p-5 hover:border-khaki/30 hover:bg-sand/30 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-bold text-base group-hover:text-khaki transition-colors">{m.title}</h3>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground shrink-0 mt-0.5 group-hover:text-khaki group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="Calendar" size={11} />{m.date}</span>
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={11} />{m.place}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">{m.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 border border-dashed border-khaki/25 text-center">
                <p className="font-body text-muted-foreground text-sm mb-2">Поделитесь историей о службе — она останется в архиве навсегда</p>
                <button className="font-body text-sm font-bold text-khaki hover:text-gold transition-colors flex items-center gap-1.5 mx-auto">
                  <Icon name="PenLine" size={14} />
                  Написать воспоминание
                </button>
              </div>
            </div>
          )}

          {/* ФОТОАРХИВ */}
          {tab === "photos" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl">Фотоархив</h2>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors">
                  <Icon name="Upload" size={14} />
                  Загрузить фото
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PHOTOS.map((p, i) => (
                  <div key={i} className="group cursor-pointer overflow-hidden border border-border hover:border-khaki/40 transition-colors">
                    <div className="relative overflow-hidden">
                      <img src={p.src} alt={p.caption}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-coal/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="ZoomIn" size={20} className="text-parchment" />
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-sand/40">
                      <p className="font-body text-xs text-muted-foreground line-clamp-1">{p.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="font-body text-sm text-muted-foreground">6 фотографий · <span className="text-khaki cursor-pointer hover:underline">Показать все</span></p>
              </div>
            </div>
          )}

          {/* СОСЛУЖИВЦЫ */}
          {tab === "comrades" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-xl">Сослуживцы</h2>
                  <p className="font-body text-muted-foreground text-sm mt-0.5">Автоподбор по 2-му учебному батальону и годам 1973–1975</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 border-2 border-khaki/40 text-khaki font-body font-bold text-sm hover:bg-khaki hover:text-parchment transition-colors">
                  <Icon name="Search" size={14} />
                  Найти ещё
                </button>
              </div>
              <div className="space-y-2">
                {COMRADES.map((c, i) => (
                  <div key={i} className="member-card bg-background border border-border p-4 flex items-center justify-between gap-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sand border border-border flex items-center justify-center shrink-0">
                        <Icon name="User" size={16} className="text-khaki/40" />
                      </div>
                      <div>
                        <div className="font-body font-bold text-sm text-foreground">{c.name}</div>
                        <div className="flex gap-1.5 mt-0.5 flex-wrap">
                          <span className="badge-bn">{c.bn}</span>
                          <span className="badge-gold-sm">{c.tank}</span>
                          <span className="font-body text-muted-foreground text-xs">{c.years}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="flex items-center gap-1 px-3 py-1.5 border border-khaki/30 text-khaki text-xs font-body font-bold hover:bg-khaki hover:text-parchment transition-colors">
                        <Icon name="MessageSquare" size={11} />
                        Написать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-sand/40 border border-border text-sm font-body text-muted-foreground text-center">
                Найдено 4 сослуживца из 2-го учебного батальона ·
                <span className="text-khaki cursor-pointer hover:underline ml-1">Расширенный поиск</span>
              </div>
            </div>
          )}

          {/* НАГРАДЫ */}
          {tab === "medals" && (
            <div>
              <h2 className="font-display font-bold text-xl mb-5">Награды и достижения</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {MEDALS.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 border border-border p-4 hover:border-gold/30 hover:bg-sand/30 transition-all">
                    <div className="w-12 h-12 bg-sand border border-border flex items-center justify-center text-2xl shrink-0">
                      {m.icon}
                    </div>
                    <div>
                      <div className={`font-body font-bold text-sm ${m.color}`}>{m.name}</div>
                      <div className="font-body text-xs text-muted-foreground mt-0.5">101 ОУТП · ГСВГ</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider-khaki mb-6" />
              <h3 className="font-display font-bold text-base mb-3">Виртуальные знаки отличия</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {[
                  { icon: "🎖", label: "Ветеран",   earned: true },
                  { icon: "🏅", label: "Отличник",  earned: true },
                  { icon: "📸", label: "Архивист",  earned: true },
                  { icon: "✍️", label: "Летописец", earned: false },
                  { icon: "🤝", label: "Друг",      earned: false },
                  { icon: "⭐", label: "Активист",  earned: false },
                ].map((b, i) => (
                  <div key={i} className={`text-center p-3 border ${b.earned ? "border-gold/30 bg-gold/5" : "border-border opacity-40"}`}>
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <div className={`font-body text-[10px] font-bold ${b.earned ? "text-gold" : "text-muted-foreground"}`}>{b.label}</div>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-3">Серые значки — ещё не получены. Добавляйте материалы и участвуйте в жизни сообщества.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
