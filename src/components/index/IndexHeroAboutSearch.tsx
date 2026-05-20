import Icon from "@/components/ui/icon";

const IMG_DRESDEN = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/aa483e23-240e-47fe-a9e4-bba8b4e20b28.jpg";
const IMG_KRAKOW  = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/2d8618e5-9c64-4e0c-86c2-f38a1c1076e0.jpg";

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

interface Props {
  searchVal: string;
  setSearchVal: (v: string) => void;
  filterBn: string;
  setFilterBn: (v: string) => void;
  filteredMembers: typeof MEMBERS;
}

export default function IndexHeroAboutSearch({ searchVal, setSearchVal, filterBn, setFilterBn, filteredMembers }: Props) {
  return (
    <>
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

          <p className="op0 anim-up d4 font-body text-parchment/70 text-lg sm:text-xl leading-relaxed max-w-xl mb-8">
            Отдельный учебный танковый полк.<br />
            Дрезден, 1961–1991. Группа Советских Войск в Германии.
          </p>

          <div className="op0 anim-up d5 flex flex-wrap gap-3 mb-14">
            <button
              onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-7 py-3 bg-gold text-coal font-body font-bold text-sm rounded-sm hover:bg-gold-light transition-colors"
            >
              <Icon name="Search" size={15} />
              Найти сослуживца
            </button>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-7 py-3 border-2 border-parchment/35 text-parchment font-body font-bold text-sm rounded-sm hover:bg-parchment/10 transition-colors"
            >
              <Icon name="BookOpen" size={15} />
              История полка
            </button>
          </div>

          <div className="op0 anim-fade d6 flex flex-wrap gap-8">
            {[
              { v: "101",    l: "Учебный полк" },
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
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-khaki/30 text-khaki text-xs font-body font-bold hover:bg-khaki hover:text-parchment transition-colors rounded-sm">
                      <Icon name="User" size={12} />
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
    </>
  );
}

export { MEMBERS };
