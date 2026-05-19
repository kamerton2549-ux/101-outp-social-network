import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const IMG_DRESDEN = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/aa483e23-240e-47fe-a9e4-bba8b4e20b28.jpg";
const IMG_KRAKOW  = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/2d8618e5-9c64-4e0c-86c2-f38a1c1076e0.jpg";
const IMG_REUNION = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/b3cbf8e6-fc7a-4c99-b319-e489c9713b57.jpg";

const NAV = [
  { id: "home",     label: "Главная" },
  { id: "about",    label: "О полку" },
  { id: "search",   label: "Найти сослуживца" },
  { id: "profiles", label: "Участники" },
  { id: "archive",  label: "Архив" },
  { id: "forum",    label: "Обсуждения" },
  { id: "events",   label: "Встречи" },
  { id: "contacts", label: "Контакты" },
];

const BATTALIONS = [
  { num: "1-й",  title: "Учебный батальон",  desc: "Подготовка механиков-водителей лёгких танков", icon: "Shield" },
  { num: "2-й",  title: "Учебный батальон",  desc: "Подготовка механиков-водителей средних танков", icon: "Shield" },
  { num: "3-й",  title: "Учебный батальон",  desc: "Подготовка механиков-водителей тяжёлых танков", icon: "Shield" },
  { num: "4-й",  title: "Батальон Кракау",   desc: "Батальон практического вождения. Полигон Кракау", icon: "MapPin" },
];

const TANKS = [
  { name: "Т-54",  role: "Средний танк" },
  { name: "Т-55",  role: "Средний танк" },
  { name: "Т-62",  role: "Средний танк" },
  { name: "Т-64",  role: "Основной боевой" },
  { name: "Т-10М", role: "Тяжёлый танк" },
  { name: "ПТ-76", role: "Лёгкий плавающий" },
];

const TIMELINE = [
  { year: "17 октября 1961",   text: "Формирование 101 ОУТП в Дрездене. Полк включён в 1-ю Гвардейскую Танковую Армию, ГСВГ" },
  { year: "1960-е — 1970-е",   text: "Активная подготовка механиков-водителей. Полк становится ведущим учебным центром бронетанковых войск" },
  { year: "1970-е — 1980-е",   text: "Освоение Т-64 и новых учебных программ. Расширение учебной базы батальона Кракау" },
  { year: "1988–1991",         text: "Вывод советских войск из ГДР. Расформирование полка в связи с объединением Германии" },
];

const MEMBERS = [
  { name: "Сергей Александрович Петров", years: "1973–1975", bn: "2-й учебный", tank: "Т-55",  role: "Механик-водитель" },
  { name: "Владимир Иванович Козлов",    years: "1978–1980", bn: "4-й Кракау",  tank: "Т-62",  role: "Инструктор вождения" },
  { name: "Михаил Степанович Орлов",     years: "1965–1967", bn: "1-й учебный", tank: "Т-54",  role: "Командир экипажа" },
  { name: "Анатолий Фёдорович Зайцев",   years: "1982–1984", bn: "3-й учебный", tank: "Т-10М", role: "Механик-водитель" },
];

const FORUM_TOPICS = [
  { title: "Батальон Кракау — вспоминаем полигон и своих командиров",   replies: 28, author: "В.И. Козлов",  date: "14 мая 2026",   tag: "Кракау" },
  { title: "Ищу однополчан по 2-му учебному батальону, призыв 1974 г.", replies: 11, author: "Родственник",  date: "10 мая 2026",   tag: "Поиск" },
  { title: "Фотоархив — добавляю снимки Дрездена 1969 года",            replies: 19, author: "С.А. Петров",  date: "8 мая 2026",    tag: "Архив" },
  { title: "Встреча ветеранов 101 ОУТП — организационные вопросы",      replies: 47, author: "Организатор",  date: "3 мая 2026",    tag: "Встречи" },
  { title: "Учебные машины Т-64 — кто проходил переобучение?",          replies: 14, author: "А.Ф. Зайцев",  date: "28 апр. 2026",  tag: "Техника" },
];

const EVENTS = [
  { day: "22", month: "Июня",    year: "2026", title: "День памяти и скорби",  desc: "Онлайн-собрание сообщества. Минута молчания" },
  { day: "17", month: "Октября", year: "2026", title: "65 лет полку",           desc: "Торжественная встреча ветеранов в Москве" },
  { day: "12", month: "Декабря", year: "2026", title: "Зимняя встреча",         desc: "Ежегодный сбор однополчан и их семей" },
];

export default function Index() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]     = useState("home");
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchVal, setSearchVal]     = useState("");
  const [filterBn, setFilterBn]       = useState("all");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goTo = (id: string) => {
    setActiveNav(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredMembers = MEMBERS.filter(m =>
    (filterBn === "all" || m.bn.includes(filterBn)) &&
    (searchVal === "" || m.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      m.tank.toLowerCase().includes(searchVal.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "nav-scrolled" : "nav-hero"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">

            <button onClick={() => goTo("home")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-parchment/15 border border-parchment/30 flex items-center justify-center text-parchment font-display font-bold text-sm group-hover:bg-parchment/25 transition-colors">
                ☆
              </div>
              <div className="hidden sm:block">
                <div className="text-parchment font-display font-bold text-sm leading-none">101 ОУТП</div>
                <div className="text-parchment/55 text-[10px] leading-none mt-0.5 font-body">Дрезден · ГСВГ · 1961–1991</div>
              </div>
            </button>

            <div className="hidden xl:flex items-center gap-0.5">
              {NAV.map(n => (
                <button key={n.id} onClick={() => goTo(n.id)}
                  className={`px-3 py-1.5 text-xs font-body transition-colors rounded-sm ${
                    activeNav === n.id
                      ? "bg-parchment/20 text-parchment font-bold"
                      : "text-parchment/65 hover:text-parchment hover:bg-parchment/10"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-gold text-coal text-xs font-body font-bold hover:bg-gold-light transition-colors rounded-sm">
                <Icon name="UserPlus" size={12} />
                Вступить
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden text-parchment/80 hover:text-parchment p-1">
                <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden bg-khaki border-t border-parchment/15 px-4 py-3 flex flex-col gap-0.5">
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)}
                className="text-left px-3 py-2.5 text-sm font-body text-parchment/75 hover:text-parchment hover:bg-parchment/10 rounded-sm transition-colors"
              >
                {n.label}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-parchment/15">
              <button className="w-full py-2.5 bg-gold text-coal font-body font-bold text-sm rounded-sm">
                Вступить в сообщество
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_DRESDEN} alt="101 ОУТП Дрезден" className="w-full h-full object-cover object-center" />
          <div className="hero-img-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 lg:py-40">
          <div className="op0 anim-fade d1">
            <span className="section-overline text-parchment/65">1-я Гвардейская Танковая Армия · ГСВГ · Дрезден</span>
          </div>

          <h1 className="op0 anim-up d2 font-display text-5xl sm:text-7xl lg:text-8xl font-black text-parchment leading-none mt-4 mb-2">
            101 ОУТП
          </h1>

          <div className="op0 anim-up d3">
            <div className="divider-gold max-w-sm mb-5" />
          </div>

          <p className="op0 anim-up d3 font-display text-lg sm:text-2xl text-gold/85 italic mb-5">
            101-й отдельный учебный танковый полк
          </p>

          <p className="op0 anim-up d4 font-body text-parchment/70 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
            Сообщество ветеранов, выпускников, командиров и их потомков.
            Сформирован <strong className="text-parchment/90">17 октября 1961 года</strong>.
            Дислокация — <strong className="text-parchment/90">Дрезден, ГДР</strong>.
          </p>

          <div className="op0 anim-up d5 flex flex-wrap gap-3">
            <button onClick={() => goTo("search")}
              className="flex items-center gap-2 px-7 py-3 bg-gold text-coal font-body font-bold text-base rounded-sm hover:bg-gold-light transition-colors"
            >
              <Icon name="Search" size={16} />
              Найти сослуживца
            </button>
            <button onClick={() => goTo("about")}
              className="flex items-center gap-2 px-7 py-3 border-2 border-parchment/45 text-parchment font-body font-bold text-base rounded-sm hover:bg-parchment/15 transition-colors"
            >
              История полка
            </button>
          </div>

          <div className="op0 anim-up d6 mt-16 pt-8 border-t border-parchment/20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg">
            {[
              { v: "1961",   l: "Год создания" },
              { v: "4",      l: "Батальона" },
              { v: "30 лет", l: "Служили Родине" },
              { v: "6",      l: "Типов техники" },
            ].map(s => (
              <div key={s.l}>
                <div className="font-display text-2xl sm:text-3xl font-black text-gold">{s.v}</div>
                <div className="font-body text-parchment/55 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-parchment/35 animate-bounce">
          <Icon name="ChevronDown" size={24} />
        </div>
      </section>

      {/* ═══ О ПОЛКУ ═══ */}
      <section id="about" className="py-20 lg:py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="section-overline">История</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black mt-2 mb-4">О полку</h2>
            <div className="divider-gold max-w-xs mb-5" />
            <p className="font-body text-muted-foreground text-base leading-relaxed">
              101-й отдельный учебный танковый полк создан <strong>17 октября 1961 года</strong> в Дрездене.
              Входил в состав <strong>1-й Гвардейской Танковой Армии</strong> в составе Группы Советских Войск в Германии.
              Готовил квалифицированных механиков-водителей лёгких, средних и тяжёлых танков.
            </p>
          </div>

          {/* Battalions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {BATTALIONS.map((bn, i) => (
              <div key={i} className="bg-card border border-border p-5 card-lift group cursor-default">
                <div className="w-10 h-10 bg-khaki/8 border border-khaki/18 flex items-center justify-center mb-4 group-hover:border-gold/40 transition-colors">
                  <Icon name={bn.icon as "Shield" | "MapPin"} size={18} className="text-khaki/65" />
                </div>
                <div className="badge-bn mb-2">{bn.num} батальон</div>
                <h3 className="font-display font-bold text-foreground text-base mb-2">{bn.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{bn.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Timeline */}
            <div>
              <h3 className="font-display font-bold text-xl mb-7 text-foreground">Хронология</h3>
              <div className="relative pl-10">
                <div className="timeline-line" />
                <div className="space-y-7">
                  {TIMELINE.map((t, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-10 mt-0.5 w-9 h-9 border-2 border-khaki/35 bg-background flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-khaki rounded-full" />
                      </div>
                      <div className="font-body font-bold text-sm text-gold mb-1">{t.year}</div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tanks + Photo */}
            <div>
              <h3 className="font-display font-bold text-xl mb-5 text-foreground">Парк учебных машин</h3>
              <div className="grid grid-cols-3 gap-2 mb-7">
                {TANKS.map(t => (
                  <div key={t.name} className="bg-sand/60 border border-border p-3 text-center">
                    <div className="font-display font-black text-xl text-khaki">{t.name}</div>
                    <div className="font-body text-[11px] text-muted-foreground mt-0.5">{t.role}</div>
                  </div>
                ))}
              </div>
              <div className="relative overflow-hidden">
                <img src={IMG_KRAKOW} alt="Полигон Кракау" className="w-full h-52 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-coal/65 via-transparent" />
                <div className="absolute bottom-0 p-4">
                  <div className="font-body text-parchment font-bold text-sm">Полигон Кракау</div>
                  <div className="font-body text-parchment/60 text-xs">4-й батальон практического вождения</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-khaki max-w-5xl mx-auto" />

      {/* ═══ ПОИСК ═══ */}
      <section id="search" className="py-20 lg:py-28 px-6 bg-sand/40">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-10">
            <span className="section-overline">Поиск</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black mt-2 mb-3">Найти сослуживца</h2>
            <div className="divider-gold max-w-xs mb-4" />
            <p className="font-body text-muted-foreground text-base">
              Введите фамилию, выберите батальон или тип техники. Мы ищем совпадения по всему сообществу.
            </p>
          </div>

          <div className="bg-card border border-border p-5 mb-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Поиск по имени / технике</label>
                <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Петров, Т-55..." className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Батальон</label>
                <select value={filterBn} onChange={e => setFilterBn(e.target.value)} className="input-field rounded-sm">
                  <option value="all">Все батальоны</option>
                  <option value="1-й">1-й учебный</option>
                  <option value="2-й">2-й учебный</option>
                  <option value="3-й">3-й учебный</option>
                  <option value="Кракау">4-й Кракау</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setSearchVal(""); setFilterBn("all"); }}
                  className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-khaki/45 text-khaki font-body font-bold text-sm rounded-sm hover:bg-khaki hover:text-parchment transition-colors w-full"
                >
                  <Icon name="RotateCcw" size={14} />
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {filteredMembers.length === 0 && (
              <div className="text-center py-14 text-muted-foreground font-body bg-card border border-border rounded-sm">
                <Icon name="UserX" size={32} className="mx-auto mb-3 opacity-25" />
                <p className="text-base">По запросу ничего не найдено</p>
                <p className="text-sm mt-1 text-muted-foreground/70">Попробуйте изменить фильтры или напишите нам</p>
              </div>
            )}
            {filteredMembers.map((m, i) => (
              <div key={i} className="member-card bg-card border border-border p-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sand border border-border flex items-center justify-center shrink-0">
                    <Icon name="User" size={20} className="text-khaki/45" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-foreground text-base mb-1.5">{m.name}</div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="badge-bn">{m.bn}</span>
                      <span className="badge-gold-sm">{m.tank}</span>
                      <span className="font-body text-muted-foreground text-xs">{m.years} · {m.role}</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-khaki/30 text-khaki text-xs font-body font-bold hover:bg-khaki hover:text-parchment transition-colors rounded-sm">
                      <Icon name="MessageSquare" size={12} />
                      Написать
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground text-xs font-body hover:border-khaki/30 hover:text-khaki transition-colors rounded-sm">
                      <Icon name="Eye" size={12} />
                      Профиль
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <p className="font-body text-sm text-muted-foreground">
              Показано {filteredMembers.length} из {MEMBERS.length} участников
            </p>
            <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-khaki/45 text-khaki font-body font-bold text-sm rounded-sm hover:bg-khaki hover:text-parchment transition-colors">
              Все участники
            </button>
          </div>
        </div>
      </section>

      <div className="divider-khaki max-w-5xl mx-auto" />

      {/* ═══ УЧАСТНИКИ ═══ */}
      <section id="profiles" className="py-20 lg:py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="section-overline">Сообщество</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black mt-2">Участники</h2>
              <div className="divider-gold max-w-xs mt-3" />
            </div>
            <button onClick={() => navigate("/profile")} className="flex items-center gap-2 px-5 py-2.5 bg-khaki text-parchment font-body font-bold text-sm rounded-sm hover:bg-khaki-light transition-colors">
              <Icon name="UserPlus" size={14} />
              Добавить профиль
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEMBERS.map((m, i) => (
              <div key={i} className="bg-card border border-border p-5 card-lift cursor-pointer group">
                <div className="w-14 h-14 bg-sand border border-border flex items-center justify-center mb-4 group-hover:border-khaki/25 transition-colors">
                  <Icon name="User" size={24} className="text-khaki/35" />
                </div>
                <h3 className="font-display font-bold text-foreground text-base leading-tight mb-1">{m.name}</h3>
                <div className="font-body text-muted-foreground text-xs mb-3">{m.years} · {m.role}</div>
                <div className="divider-gold mb-3" />
                <div className="flex flex-wrap gap-1.5">
                  <span className="badge-bn">{m.bn}</span>
                  <span className="badge-gold-sm">{m.tank}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-muted-foreground text-sm mb-4">Зарегистрировано более 340 участников</p>
            <button className="flex items-center gap-2 px-8 py-2.5 border-2 border-khaki/45 text-khaki font-body font-bold text-sm rounded-sm hover:bg-khaki hover:text-parchment transition-colors mx-auto">
              Все участники
            </button>
          </div>
        </div>
      </section>

      <div className="divider-khaki max-w-5xl mx-auto" />

      {/* ═══ АРХИВ ═══ */}
      <section id="archive" className="py-20 lg:py-28 px-6 bg-sand/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-overline">Документы и фото</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black mt-2 mb-4">Архив полка</h2>
              <div className="divider-gold max-w-xs mb-6" />

              <div className="quote-block rounded-sm mb-6">
                <p className="font-display text-base text-foreground/85 leading-relaxed">
                  «Каждая фотография из Дрездена, каждый документ — бесценная страница живой истории.
                  Вместе сохраним то, что помним.»
                </p>
              </div>

              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">
                Добавляйте фотографии, личные документы, сканы грамот и приказов,
                схемы полигонов и устные воспоминания. Все материалы проходят премодерацию.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: "Image",    label: "Фотографии",  count: "2 147" },
                  { icon: "FileText", label: "Документы",    count: "389" },
                  { icon: "Mic",      label: "Воспоминания", count: "74" },
                  { icon: "Video",    label: "Видеохроника", count: "31" },
                ].map(a => (
                  <div key={a.label} className="bg-card border border-border p-4 flex items-center gap-3 hover:border-khaki/25 transition-colors cursor-pointer">
                    <Icon name={a.icon as "Image" | "FileText" | "Mic" | "Video"} size={16} className="text-khaki/55 shrink-0" />
                    <div>
                      <div className="font-body font-bold text-sm text-foreground">{a.label}</div>
                      <div className="font-body text-muted-foreground text-xs">{a.count} материалов</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 px-6 py-2.5 bg-khaki text-parchment font-body font-bold text-sm rounded-sm hover:bg-khaki-light transition-colors">
                <Icon name="Upload" size={14} />
                Добавить материал
              </button>
            </div>

            <div>
              <div className="relative mb-3">
                <img src={IMG_REUNION} alt="Встреча ветеранов" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-coal/60 via-transparent" />
                <div className="absolute bottom-0 p-4">
                  <div className="font-body text-parchment font-bold text-sm">Встреча ветеранов 101 ОУТП</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[IMG_KRAKOW, IMG_DRESDEN, IMG_REUNION].map((src, i) => (
                  <div key={i} className="overflow-hidden cursor-pointer group">
                    <img src={src} alt="" className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-khaki max-w-5xl mx-auto" />

      {/* ═══ ФОРУМ ═══ */}
      <section id="forum" className="py-20 lg:py-28 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="section-overline">Общение</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black mt-2">Обсуждения</h2>
              <div className="divider-gold max-w-xs mt-3" />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-khaki text-parchment font-body font-bold text-sm rounded-sm hover:bg-khaki-light transition-colors">
              <Icon name="Plus" size={14} />
              Новая тема
            </button>
          </div>

          <div className="border border-border rounded-sm overflow-hidden">
            {FORUM_TOPICS.map((t, i) => (
              <div key={i} className="forum-row px-5 py-4 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-1.5">
                      <span className="badge-bn">{t.tag}</span>
                    </div>
                    <h3 className="font-body font-bold text-foreground text-base hover:text-khaki transition-colors leading-snug mb-1.5">{t.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="User" size={11} />{t.author}</span>
                      <span className="flex items-center gap-1"><Icon name="Calendar" size={11} />{t.date}</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className="font-display font-black text-2xl text-khaki">{t.replies}</div>
                    <div className="font-body text-muted-foreground text-[10px] uppercase tracking-wide">ответов</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="flex items-center gap-2 px-8 py-2.5 border-2 border-khaki/45 text-khaki font-body font-bold text-sm rounded-sm hover:bg-khaki hover:text-parchment transition-colors mx-auto">
              Все темы форума
            </button>
          </div>
        </div>
      </section>

      <div className="divider-khaki max-w-5xl mx-auto" />

      {/* ═══ СОБЫТИЯ ═══ */}
      <section id="events" className="py-20 lg:py-28 px-6 bg-sand/40">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="section-overline">Встречи и события</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black mt-2">Ближайшие встречи</h2>
            <div className="divider-gold max-w-xs mt-3" />
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {EVENTS.map((e, i) => (
              <div key={i} className="bg-card border border-border card-lift cursor-pointer group overflow-hidden">
                <div className="bg-khaki px-5 py-4 flex items-center gap-4">
                  <div className="text-center shrink-0">
                    <div className="font-display font-black text-4xl text-gold leading-none">{e.day}</div>
                    <div className="font-body text-parchment/65 text-xs uppercase tracking-wider mt-0.5">{e.month}</div>
                  </div>
                  <div className="w-px h-10 bg-parchment/20 shrink-0" />
                  <div>
                    <div className="font-body text-parchment/55 text-xs">{e.year}</div>
                    <div className="font-display font-bold text-parchment text-base leading-tight">{e.title}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">{e.desc}</p>
                  <button className="font-body text-xs font-bold text-khaki hover:text-gold transition-colors flex items-center gap-1">
                    Зарегистрироваться
                    <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-khaki/6 border border-khaki/18 p-6 rounded-sm">
            <div className="flex items-start gap-4">
              <Icon name="Star" size={22} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-xl mb-1.5">65-летие полка — 17 октября 2026</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-xl mb-4">
                  Юбилейная встреча ветеранов, выпускников и их семей в честь 65-летия формирования полка.
                  Если вы хотите участвовать в организации — напишите нам.
                </p>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-khaki text-parchment font-body font-bold text-sm rounded-sm hover:bg-khaki-light transition-colors">
                  <Icon name="Heart" size={13} />
                  Хочу помочь с организацией
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ВСТУПИТЬ ═══ */}
      <section className="py-20 lg:py-28 px-6 bg-khaki">
        <div className="max-w-5xl mx-auto text-center">
          <span className="section-overline text-parchment/55">Сообщество</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-parchment mt-3 mb-4">
            Вступайте в сообщество
          </h2>
          <div className="divider-gold max-w-xs mx-auto mb-6" />
          <p className="font-body text-parchment/65 text-base max-w-lg mx-auto leading-relaxed mb-10">
            Платформа для всех, кто проходил службу в 101 ОУТП, их родственников и исследователей
            истории 1-й Гвардейской Танковой Армии в ГСВГ.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            {[
              { icon: "Users",    text: "Ветераны и выпускники полка" },
              { icon: "Heart",    text: "Родственники личного состава" },
              { icon: "BookOpen", text: "Историки и исследователи" },
            ].map(item => (
              <div key={item.text} className="bg-parchment/8 border border-parchment/15 p-4 text-center rounded-sm">
                <Icon name={item.icon as "Users" | "Heart" | "BookOpen"} size={20} className="text-gold mx-auto mb-2" />
                <p className="font-body text-parchment/75 text-sm">{item.text}</p>
              </div>
            ))}
          </div>

          <button className="flex items-center gap-2 px-10 py-3.5 bg-gold text-coal font-body font-bold text-base rounded-sm hover:bg-gold-light transition-colors mx-auto">
            <Icon name="UserPlus" size={16} />
            Зарегистрироваться
          </button>
          <p className="font-body text-parchment/35 text-xs mt-4">
            Регистрация требует верификации — каждый профиль подтверждается модераторами
          </p>
        </div>
      </section>

      {/* ═══ КОНТАКТЫ ═══ */}
      <section id="contacts" className="py-20 lg:py-28 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14">
            <div>
              <span className="section-overline">Связь</span>
              <h2 className="font-display text-4xl font-black mt-2 mb-4">Контакты</h2>
              <div className="divider-gold max-w-xs mb-6" />
              <p className="font-body text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                Есть материалы для архива, хотите добавить профиль ветерана или предложить
                тему для обсуждения? Совет ветеранов отвечает в течение нескольких дней.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "Mail",          label: "Электронная почта", val: "sovet@101outp.ru" },
                  { icon: "MessageSquare", label: "Телеграм-канал",    val: "@outp101_gsov" },
                  { icon: "Phone",         label: "Совет ветеранов",   val: "По запросу на email" },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sand border border-border flex items-center justify-center shrink-0">
                      <Icon name={c.icon as "Mail" | "MessageSquare" | "Phone"} size={16} className="text-khaki" />
                    </div>
                    <div>
                      <div className="font-body text-xs text-muted-foreground">{c.label}</div>
                      <div className="font-body font-bold text-sm text-foreground">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-sand border border-border p-4 rounded-sm">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={16} className="text-khaki shrink-0 mt-0.5" />
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    Некоммерческий проект, созданный ветеранами и их потомками
                    для сохранения памяти о службе в 101 ОУТП (Дрезден, ГСВГ).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-sm">
              <h3 className="font-display font-bold text-2xl mb-6">Написать нам</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Ваше имя *</label>
                  <input type="text" placeholder="Иван Иванович Петров" className="input-field rounded-sm" />
                </div>
                <div>
                  <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Email *</label>
                  <input type="email" placeholder="email@example.ru" className="input-field rounded-sm" />
                </div>
                <div>
                  <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Тема</label>
                  <select className="input-field rounded-sm">
                    <option>Добавить профиль ветерана</option>
                    <option>Материалы для архива</option>
                    <option>Организация встречи</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Сообщение *</label>
                  <textarea rows={4} placeholder="Расскажите подробнее..." className="input-field rounded-sm resize-none" />
                </div>
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-khaki text-parchment font-body font-bold text-base rounded-sm hover:bg-khaki-light transition-colors">
                  <Icon name="Send" size={15} />
                  Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ БЫСТРЫЙ ДОСТУП (float panel) ═══ */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
        <div className="bg-card border border-border shadow-lg p-3 flex flex-col gap-2">
          <div className="font-body text-[10px] text-muted-foreground uppercase tracking-wide text-center mb-1">Разделы</div>
          {[
            { icon: "Rss",      label: "Лента",     path: "/feed" },
            { icon: "Map",      label: "Карта ГСВГ", path: "/map" },
            { icon: "User",     label: "Профиль",   path: "/profile" },
            { icon: "FileText", label: "Техзадание", path: "/spec" },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2 px-3 py-2 border border-border text-xs font-body text-muted-foreground hover:bg-sand hover:text-khaki hover:border-khaki/30 transition-colors text-left whitespace-nowrap"
            >
              <Icon name={item.icon as "Rss" | "Map" | "User" | "FileText"} size={13} className="text-khaki/60" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-khaki py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="divider-gold mb-10" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 border border-parchment/25 flex items-center justify-center text-parchment text-sm">☆</div>
                <div>
                  <div className="font-display font-black text-parchment text-sm">101 ОУТП</div>
                  <div className="font-body text-parchment/45 text-[10px]">Дрезден · ГСВГ · 1961–1991</div>
                </div>
              </div>
              <p className="font-body text-parchment/35 text-xs max-w-xs leading-relaxed">
                Некоммерческое сообщество ветеранов и выпускников<br />101-го отдельного учебного танкового полка.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {NAV.map(n => (
                <button key={n.id} onClick={() => goTo(n.id)}
                  className="font-body text-parchment/50 text-xs hover:text-parchment transition-colors"
                >
                  {n.label}
                </button>
              ))}
            </div>

            <div className="font-body text-parchment/35 text-xs text-right">
              <div>1-я Гвардейская Танковая Армия</div>
              <div className="mt-0.5">Группа Советских Войск в Германии</div>
              <div className="mt-3 text-parchment/25">© 2026 Сообщество 101 ОУТП</div>
            </div>
          </div>
          <div className="divider-gold mt-10" />
        </div>
      </footer>
    </div>
  );
}