import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const IMG_KRAKOW  = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/2d8618e5-9c64-4e0c-86c2-f38a1c1076e0.jpg";
const IMG_DRESDEN = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/aa483e23-240e-47fe-a9e4-bba8b4e20b28.jpg";
const IMG_REUNION = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/b3cbf8e6-fc7a-4c99-b319-e489c9713b57.jpg";

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

export default function IndexCommunity() {
  const navigate = useNavigate();

  return (
    <>
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
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-khaki text-parchment font-body font-bold text-sm rounded-sm hover:bg-khaki-light transition-colors">
                  <Icon name="Send" size={14} />
                  Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
