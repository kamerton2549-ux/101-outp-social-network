import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/03856cd2-7795-462b-8790-1dd7e15b36a0.jpg";
const VETERANS_IMG = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/72941f49-a3cc-4377-9e74-d2335b582dd8.jpg";
const ARCHIVE_IMG = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/2f581dcf-cfab-469b-aa4b-4b89a17350e8.jpg";

const navLinks = [
  { label: "Главная", id: "home" },
  { label: "История", id: "history" },
  { label: "Профили", id: "profiles" },
  { label: "Архив", id: "archive" },
  { label: "Форум", id: "forum" },
  { label: "События", id: "events" },
  { label: "Поиск", id: "search" },
  { label: "Контакты", id: "contacts" },
];

const profiles = [
  {
    name: "Иванов Николай Петрович",
    years: "1922 — 2001",
    rank: "Гвардии майор",
    awards: "Орден Красной Звезды, медаль «За отвагу»",
  },
  {
    name: "Соколов Виктор Андреевич",
    years: "1925 — 1995",
    rank: "Гвардии капитан",
    awards: "Орден Отечественной войны II степени",
  },
  {
    name: "Громов Алексей Семёнович",
    years: "1920 — 2003",
    rank: "Гвардии лейтенант",
    awards: "Медаль «За боевые заслуги», орден Славы",
  },
  {
    name: "Морозова Зинаида Ивановна",
    years: "1923 — 2010",
    rank: "Санитарный инструктор",
    awards: "Медаль «За победу над Германией»",
  },
];

const timeline = [
  { year: "1943", event: "Формирование 101-го ОУТП в составе 1-й Гвардейской Танковой Армии" },
  { year: "1943–44", event: "Участие в боях на Курской дуге и освобождении Украины" },
  { year: "1944", event: "Форсирование Днепра. Киевская наступательная операция" },
  { year: "1944–45", event: "Висло-Одерская операция. Освобождение Польши" },
  { year: "1945", event: "Берлинская наступательная операция. Победа" },
];

const forumTopics = [
  { title: "Воспоминания о командире полка — поделитесь историями", replies: 14, author: "Внук гвардейца", date: "15 мая 2026" },
  { title: "Ищу информацию о рядовом Степанове В.П., 1944 год", replies: 7, author: "Исследователь", date: "12 мая 2026" },
  { title: "Фотографии из семейного архива — добавляю в общую коллекцию", replies: 23, author: "Родственник ветерана", date: "8 мая 2026" },
  { title: "День Победы 2026 — организация совместного мероприятия", replies: 31, author: "Организатор", date: "5 мая 2026" },
];

const events = [
  { date: "9 Мая", month: "2026", title: "День Победы", desc: "Торжественное собрание памяти гвардейцев 101 ОУТП" },
  { date: "23 Июня", month: "2026", title: "День памяти", desc: "Возложение венков к мемориальным доскам" },
  { date: "12 Июля", month: "2026", title: "Курская битва", desc: "83-я годовщина. Встреча участников и исследователей" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground grain-overlay">

      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nav-scrolled" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => scrollTo("home")} className="flex items-center gap-3 group">
              <div className="w-8 h-8 border border-gold/60 flex items-center justify-center text-gold text-xs font-display font-bold group-hover:bg-gold/10 transition-colors">
                ★
              </div>
              <div className="hidden sm:block">
                <div className="text-gold font-display text-sm font-semibold leading-none">101 ОУТП</div>
                <div className="text-muted-foreground text-[10px] leading-none mt-0.5">1-я Гвардейская Танковая</div>
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`px-3 py-1.5 text-xs font-body transition-colors rounded-sm ${
                    activeSection === link.id
                      ? "text-gold bg-gold/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-1.5 border border-gold/50 text-gold text-xs font-body hover:bg-gold/10 transition-colors">
                <Icon name="UserPlus" size={12} />
                Вступить
              </button>
              <button className="lg:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
                <Icon name={menuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left px-3 py-2 text-sm text-muted-foreground hover:text-gold hover:bg-gold/5 rounded transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-border mt-1">
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-gold/50 text-gold text-sm hover:bg-gold/10 transition-colors">
                <Icon name="UserPlus" size={14} />
                Вступить в сообщество
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex items-center hero-bg overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div className="absolute left-[10%] top-20 bottom-20 gold-line-v opacity-20" />
        <div className="absolute right-[10%] top-20 bottom-20 gold-line-v opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          <div className="star-deco mb-6 animate-fade-in opacity-0-init">★ ★ ★ ★ ★</div>
          <div className="inline-flex items-center gap-3 border border-gold/30 px-5 py-2 mb-8 animate-fade-in delay-100 opacity-0-init">
            <span className="text-gold/70 text-xs font-body tracking-widest uppercase">1-я Гвардейская Танковая Армия</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold text-foreground leading-none mb-4 animate-fade-up delay-200 opacity-0-init">
            101-й ОУТП
          </h1>

          <div className="gold-line max-w-xs mx-auto mb-6 animate-fade-in delay-300 opacity-0-init" />

          <p className="font-display text-xl sm:text-2xl text-gold/80 italic mb-4 animate-fade-up delay-300 opacity-0-init">
            Отдельный Учебный Танковый Полк
          </p>

          <p className="font-body text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-12 animate-fade-up delay-400 opacity-0-init">
            Платформа памяти гвардейцев. Место, где встречаются ветераны, их родственники,
            исследователи истории и молодое поколение, чтобы сохранить живую память о подвиге.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-500 opacity-0-init">
            <button onClick={() => scrollTo("profiles")} className="px-8 py-3 bg-gold text-primary-foreground font-body font-semibold text-sm hover:bg-gold-light transition-colors">
              Профили гвардейцев
            </button>
            <button onClick={() => scrollTo("history")} className="px-8 py-3 border border-gold/50 text-gold font-body text-sm hover:bg-gold/10 transition-colors">
              История полка
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20 pt-12 border-t border-border animate-fade-up delay-600 opacity-0-init">
            {[
              { num: "847", label: "Профилей" },
              { num: "1943", label: "Год основания" },
              { num: "12", label: "Наград полка" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl text-gold font-semibold">{s.num}</div>
                <div className="text-muted-foreground text-xs font-body mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={20} className="text-gold/50" />
        </div>
      </section>

      {/* ── ИСТОРИЯ ── */}
      <section id="history" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="star-deco mb-4">★ ★ ★</div>
            <h2 className="font-display text-5xl sm:text-6xl font-semibold mb-2 section-title">История полка</h2>
            <p className="text-muted-foreground text-sm font-body mb-8">1943 — 1945</p>

            <div className="quote-historical p-5 mb-8 rounded-sm">
              <p className="font-display text-lg text-foreground/90 leading-relaxed">
                «Гвардейцы 101-го полка — живые легенды Великой Отечественной.
                Каждый экипаж, каждый боец — страница истории, написанная кровью и мужеством.»
              </p>
            </div>

            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">
              101-й отдельный учебный танковый полк был сформирован в 1943 году в составе
              1-й Гвардейской Танковой Армии под командованием генерала М.Е. Катукова.
              Полк прошёл боевой путь от Курской дуги до Берлина.
            </p>

            <button className="flex items-center gap-2 text-gold text-sm font-body hover:text-gold-light transition-colors group">
              Читать полную историю
              <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px timeline-line" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 border border-gold/60 bg-background flex items-center justify-center">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                  </div>
                  <div className="text-gold font-display text-xl font-semibold mb-1">{item.year}</div>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gold-line max-w-4xl mx-auto" />

      {/* ── ПРОФИЛИ ── */}
      <section id="profiles" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="star-deco mb-4">★ ★ ★</div>
          <h2 className="font-display text-5xl sm:text-6xl font-semibold mb-3 section-title inline-block">Профили гвардейцев</h2>
          <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto mt-4">
            Ветераны, исследователи и родственники. Каждый профиль — живая страница истории.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {profiles.map((p, i) => (
            <div key={i} className="profile-card bg-card border border-border p-5 cursor-pointer group">
              <div className="w-12 h-12 border border-gold/30 bg-gold/5 flex items-center justify-center mb-4 group-hover:border-gold/60 transition-colors">
                <Icon name="User" size={20} className="text-gold/60" />
              </div>
              <div className="text-xs text-gold font-body mb-1 uppercase tracking-wider">{p.rank}</div>
              <h3 className="font-display text-lg font-semibold text-foreground leading-tight mb-1">{p.name}</h3>
              <div className="text-muted-foreground text-xs font-body mb-3">{p.years}</div>
              <div className="gold-line mb-3" />
              <p className="text-muted-foreground text-xs font-body leading-relaxed">{p.awards}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-3 border border-border text-muted-foreground font-body text-sm hover:border-gold/50 hover:text-gold transition-colors">
            Показать все профили
          </button>
        </div>
      </section>

      <div className="gold-line max-w-4xl mx-auto" />

      {/* ── АРХИВ ── */}
      <section id="archive" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={ARCHIVE_IMG} alt="Архив" className="w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent" />
            <div className="absolute bottom-4 left-4 border border-gold/40 px-3 py-1.5">
              <span className="text-gold text-xs font-body">Фотоархив полка</span>
            </div>
          </div>
          <div>
            <div className="star-deco mb-4">★ ★ ★</div>
            <h2 className="font-display text-5xl sm:text-6xl font-semibold mb-3 section-title">Архив</h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
              Документы, фотографии, личные письма, боевые донесения и награды.
              Каждый материал — частица живой памяти о гвардейцах 101 ОУТП.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: "FileText", label: "Документы", count: "234" },
                { icon: "Image", label: "Фотографии", count: "1 842" },
                { icon: "Award", label: "Награды", count: "156" },
                { icon: "BookOpen", label: "Воспоминания", count: "89" },
              ].map((item) => (
                <div key={item.label} className="bg-card border border-border p-4 flex items-center gap-3 hover:border-gold/40 transition-colors cursor-pointer">
                  <Icon name={item.icon as "FileText" | "Image" | "Award" | "BookOpen"} size={16} className="text-gold/60" />
                  <div>
                    <div className="text-foreground text-sm font-body">{item.label}</div>
                    <div className="text-muted-foreground text-xs">{item.count}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gold/10 border border-gold/40 text-gold text-sm font-body hover:bg-gold/20 transition-colors">
              <Icon name="Upload" size={14} />
              Добавить материал
            </button>
          </div>
        </div>
      </section>

      <div className="gold-line max-w-4xl mx-auto" />

      {/* ── ФОРУМ ── */}
      <section id="forum" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="star-deco mb-4">★ ★ ★</div>
            <h2 className="font-display text-5xl sm:text-6xl font-semibold section-title">Форум</h2>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-5 py-2 border border-gold/40 text-gold text-sm font-body hover:bg-gold/10 transition-colors">
            <Icon name="Plus" size={14} />
            Новая тема
          </button>
        </div>

        <div className="space-y-2">
          {forumTopics.map((topic, i) => (
            <div key={i} className="thread-item border border-border p-5 cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-body font-semibold text-foreground mb-2 hover:text-gold transition-colors">{topic.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={11} />
                      {topic.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={11} />
                      {topic.date}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-gold font-display text-xl">{topic.replies}</div>
                  <div className="text-muted-foreground text-xs font-body">ответов</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-8 py-3 border border-border text-muted-foreground font-body text-sm hover:border-gold/50 hover:text-gold transition-colors">
            Все темы форума
          </button>
        </div>
      </section>

      <div className="gold-line max-w-4xl mx-auto" />

      {/* ── СОБЫТИЯ ── */}
      <section id="events" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="star-deco mb-4">★ ★ ★</div>
          <h2 className="font-display text-5xl sm:text-6xl font-semibold section-title inline-block">События</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <div key={i} className="bg-card border border-border p-6 profile-card cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold/30 group-hover:bg-gold/60 transition-colors" />
              <div className="font-display text-4xl text-gold/20 font-bold absolute top-4 right-4">{ev.date.split(' ')[0]}</div>
              <div className="relative">
                <div className="text-gold text-sm font-body font-semibold mb-1">{ev.date}</div>
                <div className="text-muted-foreground text-xs font-body mb-3">{ev.month}</div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">{ev.title}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="gold-line max-w-4xl mx-auto" />

      {/* ── ПОИСК ── */}
      <section id="search" className="py-24 px-6 max-w-3xl mx-auto text-center">
        <div className="star-deco mb-4">★ ★ ★</div>
        <h2 className="font-display text-5xl sm:text-6xl font-semibold mb-4 section-title inline-block">Поиск</h2>
        <p className="text-muted-foreground font-body text-sm mb-10 max-w-lg mx-auto">
          Найдите имя ветерана, документ или фотографию из архива 101 ОУТП
        </p>

        <div className="flex gap-0">
          <input
            type="text"
            placeholder="Введите имя, звание или год..."
            className="flex-1 bg-card border border-border border-r-0 px-5 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
          />
          <button className="px-6 py-3 bg-gold text-primary-foreground font-body font-semibold text-sm hover:bg-gold-light transition-colors flex items-center gap-2">
            <Icon name="Search" size={16} />
            Найти
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["Иванов", "Танкисты 1944", "Берлинская операция", "Медаль «За отвагу»", "Курская битва"].map((tag) => (
            <button key={tag} className="px-3 py-1 border border-border text-muted-foreground text-xs font-body hover:border-gold/40 hover:text-gold transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </section>

      <div className="gold-line max-w-4xl mx-auto" />

      {/* ── ВСТУПИТЬ ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-0 overflow-hidden border border-border">
          <div className="lg:col-span-2 relative">
            <img src={VETERANS_IMG} alt="Ветераны" className="w-full h-full object-cover min-h-64" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 hidden lg:block" />
          </div>
          <div className="lg:col-span-3 p-10 flex flex-col justify-center">
            <div className="star-deco mb-4">★ ★ ★</div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
              Присоединяйтесь<br />к сообществу
            </h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 max-w-lg">
              Платформа открыта для ветеранов 101 ОУТП, их родственников, историков и всех,
              кто хочет сохранить и передать память о гвардейцах молодому поколению.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Ветераны 101 ОУТП и их семьи",
                "Исследователи военной истории",
                "Молодёжь, изучающая историю ВОВ",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-body">
                  <Icon name="CheckCircle" size={14} className="text-gold shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <button className="self-start px-8 py-3 bg-gold text-primary-foreground font-body font-semibold text-sm hover:bg-gold-light transition-colors">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section id="contacts" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="star-deco mb-4">★ ★ ★</div>
            <h2 className="font-display text-5xl sm:text-6xl font-semibold mb-4 section-title">Контакты</h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8 max-w-md">
              Есть документы, фотографии или воспоминания? Хотите добавить профиль ветерана?
              Напишите нам — вместе сохраним память.
            </p>
            <div className="space-y-4">
              {[
                { icon: "Mail", label: "Электронная почта", value: "memory@101outp.ru" },
                { icon: "MessageSquare", label: "Телеграм", value: "@outp101" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0">
                    <Icon name={c.icon as "Mail" | "MessageSquare"} size={14} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs font-body">{c.label}</div>
                    <div className="text-foreground text-sm font-body">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-2xl font-semibold mb-6">Написать нам</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Ваше имя" className="w-full bg-background border border-border px-4 py-3 text-sm font-body focus:outline-none focus:border-gold/50 transition-colors text-foreground placeholder:text-muted-foreground" />
              <input type="email" placeholder="Email" className="w-full bg-background border border-border px-4 py-3 text-sm font-body focus:outline-none focus:border-gold/50 transition-colors text-foreground placeholder:text-muted-foreground" />
              <textarea rows={4} placeholder="Ваше сообщение..." className="w-full bg-background border border-border px-4 py-3 text-sm font-body focus:outline-none focus:border-gold/50 transition-colors text-foreground placeholder:text-muted-foreground resize-none" />
              <button className="w-full py-3 bg-gold text-primary-foreground font-body font-semibold text-sm hover:bg-gold-light transition-colors">
                Отправить сообщение
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="gold-line mb-10" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-gold/40 flex items-center justify-center text-gold text-sm">★</div>
              <div>
                <div className="text-gold font-display text-sm font-semibold">101 ОУТП</div>
                <div className="text-muted-foreground text-xs font-body">1-я Гвардейская Танковая Армия</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)} className="text-muted-foreground text-xs font-body hover:text-gold transition-colors">
                  {link.label}
                </button>
              ))}
            </div>
            <div className="text-muted-foreground text-xs font-body text-center sm:text-right">
              <div>Память хранится в людях</div>
              <div className="mt-1">1943 — Навсегда</div>
            </div>
          </div>
          <div className="gold-line mt-10 mb-6" />
          <p className="text-center text-muted-foreground text-xs font-body">
            © 2026 Платформа памяти 101 ОУТП. Открытое сообщество.
          </p>
        </div>
      </footer>
    </div>
  );
}
