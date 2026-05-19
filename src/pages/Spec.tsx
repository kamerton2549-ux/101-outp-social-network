import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SECTIONS = [
  {
    id: "overview",
    title: "1. Обзор проекта",
    icon: "FileText",
    content: [
      {
        heading: "Назначение",
        text: `Социальная сеть «101 ОУТП» — некоммерческая платформа для объединения ветеранов, выпускников, командиров и потомков личного состава 101-го отдельного учебного танкового полка (Дрезден, ГСВГ, 1961–1991).`,
      },
      {
        heading: "Целевая аудитория",
        text: "Ветераны службы (60–90 лет), выпускники полка, их родственники, исследователи военной истории. Приоритет — старшее поколение, крупный шрифт, минимализм.",
      },
      {
        heading: "Исторический контекст",
        bullets: [
          "Создан: 17 октября 1961 года, Дрезден, ГДР",
          "Состав: 4 батальона — 3 учебных + 4-й батальон практического вождения (Кракау)",
          "Вышестоящее командование: 1-я Гвардейская Танковая Армия, ГСВГ",
          "Специализация: подготовка механиков-водителей лёгких, средних и тяжёлых танков",
          "Парк техники: Т-54, Т-55, Т-62, Т-64, Т-10М, ПТ-76",
        ],
      },
    ],
  },
  {
    id: "structure",
    title: "2. Карта сайта",
    icon: "Sitemap",
    content: [
      {
        heading: "Основные разделы",
        tree: [
          { label: "Главная", children: ["Лента активности", "Памятные даты", "Анонсы встреч", "Быстрые ссылки", "Историческая справка"] },
          { label: "Профиль пользователя", children: ["Личные данные", "Служебная информация (батальон, годы, техника, звание)", "Воспоминания", "Фотоархив", "Сослуживцы", "Награды и значки", "Экспорт в PDF"] },
          { label: "Поиск сослуживцев", children: ["Фильтры: год призыва, батальон, специальность, тип машины", "Результаты: карточки с фото и кнопкой «Написать»"] },
          { label: "Архив", children: ["Фотоархив по годам и батальонам", "Видеохроника", "Документы (с пометкой «требует проверки»)", "Устная история (аудио + расшифровка)"] },
          { label: "Обсуждения / Форум", children: ["Батальон Кракау", "Учебные машины", "Встречи", "Поиск архивов", "Память", "Вопросы историку"] },
          { label: "Встречи и события", children: ["Календарь", "Регистрация участников", "Карта мест", "Отчёты"] },
          { label: "О полку", children: ["История 101 ОУТП", "Структура 1 ГвТА / ГСВГ", "Командный состав", "Карта ГСВГ", "Совет ветеранов"] },
        ],
      },
    ],
  },
  {
    id: "stack",
    title: "3. Технический стек",
    icon: "Server",
    content: [
      {
        heading: "Рекомендуемый стек (WordPress + BuddyPress)",
        table: {
          headers: ["Компонент", "Решение", "Назначение"],
          rows: [
            ["CMS",          "WordPress 6.x",            "Основа сайта"],
            ["Соцсеть",      "BuddyPress 12.x",          "Профили, лента, друзья, сообщения"],
            ["Форум",        "bbPress",                   "Тематические обсуждения"],
            ["Тема",         "BuddyBoss Platform",        "Адаптивная тема под BuddyPress"],
            ["Поля профиля", "BuddyPress XProfile + ACF", "Служебные данные участника"],
            ["Поиск",        "BuddyPress XProfile Search","Фильтрация по полям профиля"],
            ["Галереи",      "Modula / Envira Gallery",   "Фотоальбомы и архивы"],
            ["Награды",      "GamiPress",                 "Значки и достижения"],
            ["События",      "The Events Calendar",       "Встречи и даты"],
            ["Модерация",    "New User Approve + BP Mod", "Проверка регистраций и контента"],
            ["Безопасность", "Wordfence Security",        "Брандмауэр и сканирование"],
            ["Резервн. коп.","UpdraftPlus",               "Автоматические бекапы"],
            ["Кэш",          "WP Rocket / LiteSpeed",    "Ускорение загрузки"],
            ["GDPR / 152-ФЗ","WP GDPR Compliance",       "Согласие и персональные данные"],
          ],
        },
      },
      {
        heading: "Хостинг",
        bullets: [
          "Сервер: VPS от 4 GB RAM, SSD от 40 GB",
          "PHP 8.1+, MySQL 8 / MariaDB 10.6+",
          "Рекомендую: Timeweb Cloud, Selectel или REG.RU VPS",
          "CDN для медиа: Cloudflare (бесплатный) или BunnyCDN",
          "SSL: Let's Encrypt (бесплатно)",
        ],
      },
    ],
  },
  {
    id: "profiles",
    title: "4. Профиль участника",
    icon: "User",
    content: [
      {
        heading: "Поля профиля BuddyPress XProfile",
        table: {
          headers: ["Поле", "Тип", "Значения / Описание"],
          rows: [
            ["Звание",           "Выпадающий список",  "Рядовой, Ефрейтор, Мл. сержант ... Полковник"],
            ["Годы службы",      "Диапазон дат",       "От / До (например 1973–1975)"],
            ["Батальон",         "Радио-кнопки",       "1-й учебный / 2-й учебный / 3-й учебный / 4-й Кракау"],
            ["Рота / Взвод",     "Текст",              "Свободный ввод"],
            ["Должность",        "Текст",              "Механик-водитель, инструктор, командир..."],
            ["Тип техники",      "Чекбоксы",           "Т-54 / Т-55 / Т-62 / Т-64 / Т-10М / ПТ-76"],
            ["Место службы",     "Чекбоксы",           "Дрезден / Полигон Кракау / Другое"],
            ["Награды",          "Текст (repeatable)", "Перечень наград (ACF Repeater)"],
            ["Родной город",     "Текст",              "Свободный ввод"],
            ["О себе",           "Textarea",           "Биография / краткое описание"],
          ],
        },
      },
      {
        heading: "Функции профиля",
        bullets: [
          "Автоподбор сослуживцев по совпадению батальона и пересечению годов службы",
          "Вкладки: Воспоминания / Фото / Сослуживцы / Награды",
          "Экспорт профиля в PDF (библиотека mPDF + шаблон)",
          "Настройки доступности: размер шрифта, высокий контраст",
          "Настройки приватности: кто видит каждое поле",
        ],
      },
    ],
  },
  {
    id: "design",
    title: "5. Дизайн-система",
    icon: "Palette",
    content: [
      {
        heading: "Цветовая палитра",
        palette: [
          { name: "Хаки (основной)",  hex: "#4B5320", bg: "bg-[#4B5320]", text: "text-white" },
          { name: "Песочный (фон)",   hex: "#F8F4E9", bg: "bg-[#F8F4E9]", text: "text-gray-700" },
          { name: "Золотой (акцент)", hex: "#C5A455", bg: "bg-[#C5A455]", text: "text-white" },
          { name: "Угольный (текст)", hex: "#2A2A2A", bg: "bg-[#2A2A2A]", text: "text-white" },
          { name: "Кирпичный (внимание)", hex: "#A54436", bg: "bg-[#A54436]", text: "text-white" },
          { name: "Серебряный",       hex: "#A8A8A8", bg: "bg-[#A8A8A8]", text: "text-white" },
        ],
      },
      {
        heading: "Типографика",
        bullets: [
          "Заголовки: Merriweather (serif) — строгий, читаемый, исторический характер",
          "Текст: PT Sans (sans-serif) — ясный, удобный для чтения",
          "Базовый размер: 16px (минимум), поддержка 18px и 20px через переключатель",
          "Высота строки: 1.6–1.65",
          "Подключение: Google Fonts (Merriweather + PT Sans)",
        ],
      },
      {
        heading: "Доступность (WCAG 2.1 AA)",
        bullets: [
          "Переключатель размера шрифта (A− / A+) в шапке каждой страницы",
          "Режим высокого контраста (переключатель + localStorage)",
          "Фокус-индикаторы: 3px сплошная золотая обводка",
          "ARIA-атрибуты для интерактивных элементов",
          "Skip-link (пропуск навигации) для клавиатурной навигации",
          "Alt-тексты обязательны для всех изображений",
          "Плагины: One Click Accessibility + WP Accessibility Helper",
        ],
      },
    ],
  },
  {
    id: "mvp",
    title: "6. MVP — первый запуск",
    icon: "Rocket",
    content: [
      {
        heading: "Минимальный набор функций (2–3 месяца разработки)",
        table: {
          headers: ["Функция", "Инструмент", "Сложность"],
          rows: [
            ["Регистрация с модерацией",    "BuddyPress + New User Approve",     "Низкая"],
            ["Профиль с полями службы",     "BuddyPress XProfile + ACF",         "Низкая"],
            ["Поиск с фильтрами",           "BuddyPress XProfile Search",        "Средняя"],
            ["Лента активности",            "BuddyPress Activity (настройка)",   "Низкая"],
            ["Личные сообщения",            "BuddyPress Messages (встроено)",    "Низкая"],
            ["Загрузка фотографий",         "WordPress Media + модерация",       "Низкая"],
            ["Календарь встреч",            "The Events Calendar (бесплатный)",  "Низкая"],
            ["Адаптивная тема",             "BuddyBoss Platform",                "Средняя"],
            ["Форум",                       "bbPress",                           "Низкая"],
            ["Модерация контента",          "BP Moderation + ручная",            "Низкая"],
          ],
        },
      },
      {
        heading: "Второй этап (после запуска)",
        bullets: [
          "Групповые чаты по батальонам (BuddyPress Groups + Private Messages)",
          "Виртуальные награды — медали полка (GamiPress + ACF)",
          "Экспорт профиля в PDF (mPDF + шаблон)",
          "Аудио-воспоминания (Seriously Simple Podcasting)",
          "Интерактивная карта ГСВГ с метками (MapPress / Leaflet)",
          "Мультиязычность: рус / нем (Polylang)",
          "Интеграция ВКонтакте / Одноклассники для импорта фото",
        ],
      },
    ],
  },
  {
    id: "moderation",
    title: "7. Модерация и правила",
    icon: "ShieldCheck",
    content: [
      {
        heading: "Правила сообщества (краткий свод)",
        bullets: [
          "Запрещены политические высказывания, оскорбления, фейковая история",
          "Все архивные документы проходят премодерацию с пометкой «на проверке»",
          "Регистрация требует подтверждения — модераторы проверяют каждого",
          "Жалоба на контент — кнопка «Пожаловаться» у каждой записи",
          "Совет модераторов — проверенные ветераны и историки",
        ],
      },
      {
        heading: "Онбординг — текст приветствия",
        quote: "Добро пожаловать в сообщество 101 ОУТП.\n\nВы вступаете в круг людей, объединённых памятью о службе в Дрездене и ГСВГ. Здесь бережно хранятся истории, фотографии и документы полка.\n\nПожалуйста, соблюдайте уважительный тон, говорите только правду и помогайте друг другу находить старых товарищей.\n\nС уважением, Совет ветеранов 101 ОУТП.",
      },
    ],
  },
];

export default function Spec() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const section = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Top bar */}
      <div className="nav-hero fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-parchment/80 hover:text-parchment transition-colors font-body text-sm"
          >
            <Icon name="ArrowLeft" size={16} />
            101 ОУТП
          </button>
          <span className="font-display font-bold text-parchment text-sm">Техзадание</span>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gold text-coal text-xs font-body font-bold hover:bg-gold-light transition-colors">
            <Icon name="Download" size={12} />
            Скачать PDF
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">

        {/* Header */}
        <div className="bg-khaki text-parchment p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="section-overline text-parchment/55">Техническое задание</span>
              <h1 className="font-display text-3xl sm:text-4xl font-black mt-2 leading-tight">
                Социальная сеть «101 ОУТП»
              </h1>
              <p className="font-display text-parchment/70 text-lg italic mt-2">
                WordPress + BuddyPress Edition
              </p>
              <div className="divider-gold max-w-sm mt-4" />
            </div>
            <div className="bg-parchment/10 border border-parchment/20 p-4 text-sm font-body min-w-48">
              <div className="space-y-1.5">
                {[
                  ["Версия",   "1.2"],
                  ["Дата",     "Май 2026"],
                  ["Статус",   "К разработке"],
                  ["Платформа","WordPress 6.x + BuddyPress"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="text-parchment/50 min-w-24">{k}:</span>
                    <span className="text-parchment/90 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border sticky top-20">
              <div className="px-4 py-3 border-b border-border bg-sand/30">
                <span className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide">Содержание</span>
              </div>
              <div className="divide-y divide-border">
                {SECTIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full text-left px-4 py-3.5 flex items-center gap-3 font-body text-sm transition-colors ${
                      activeSection === s.id
                        ? "bg-sand/60 text-khaki font-bold border-l-2 border-khaki"
                        : "text-muted-foreground hover:bg-sand/30 hover:text-foreground"
                    }`}
                  >
                    <Icon name={s.icon as "FileText" | "Server" | "User" | "Palette" | "Rocket" | "ShieldCheck"} size={14} className="shrink-0" fallback="FileText" />
                    <span className="text-xs leading-tight">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border p-6 lg:p-8">
              <h2 className="font-display text-2xl font-black mb-6 pb-4 border-b border-border">{section.title}</h2>

              {section.content.map((block, bi) => (
                <div key={bi} className="mb-8 last:mb-0">
                  {block.heading && (
                    <h3 className="font-display font-bold text-lg mb-3 text-foreground">{block.heading}</h3>
                  )}

                  {block.text && (
                    <p className="font-body text-base text-muted-foreground leading-relaxed">{block.text}</p>
                  )}

                  {block.bullets && (
                    <ul className="space-y-2">
                      {block.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {block.quote && (
                    <div className="quote-block rounded-sm">
                      <p className="font-display text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{block.quote}</p>
                    </div>
                  )}

                  {block.tree && (
                    <div className="space-y-3">
                      {block.tree.map((node, ni) => (
                        <div key={ni} className="border border-border">
                          <div className="px-4 py-2.5 bg-sand/40 border-b border-border">
                            <span className="font-body font-bold text-sm text-foreground flex items-center gap-2">
                              <Icon name="Folder" size={14} className="text-khaki" />
                              {node.label}
                            </span>
                          </div>
                          <div className="px-4 py-3 space-y-1">
                            {node.children.map((c, ci) => (
                              <div key={ci} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                                <Icon name="FileText" size={11} className="text-muted-foreground/40 shrink-0" />
                                {c}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {block.table && (
                    <div className="overflow-x-auto">
                      <table className="w-full border border-border text-sm font-body">
                        <thead>
                          <tr className="bg-sand/60">
                            {block.table.headers.map(h => (
                              <th key={h} className="px-4 py-2.5 text-left font-bold text-foreground border-b border-border text-xs uppercase tracking-wide">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.table.rows.map((row, ri) => (
                            <tr key={ri} className={ri % 2 === 0 ? "bg-background" : "bg-sand/20"}>
                              {row.map((cell, ci) => (
                                <td key={ci} className={`px-4 py-2.5 border-b border-border text-muted-foreground ${ci === 0 ? "font-bold text-foreground" : ""}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {block.palette && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {block.palette.map(p => (
                        <div key={p.hex} className="border border-border overflow-hidden">
                          <div className={`h-14 ${p.bg}`} />
                          <div className="px-3 py-2 bg-card">
                            <div className="font-body font-bold text-xs text-foreground">{p.name}</div>
                            <div className="font-body text-muted-foreground text-xs font-mono">{p.hex}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Nav between sections */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  const idx = SECTIONS.findIndex(s => s.id === activeSection);
                  if (idx > 0) setActiveSection(SECTIONS[idx - 1].id);
                }}
                disabled={activeSection === SECTIONS[0].id}
                className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-body text-muted-foreground hover:text-foreground hover:border-khaki/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronLeft" size={16} />
                Назад
              </button>
              <span className="font-body text-xs text-muted-foreground">
                {SECTIONS.findIndex(s => s.id === activeSection) + 1} / {SECTIONS.length}
              </span>
              <button
                onClick={() => {
                  const idx = SECTIONS.findIndex(s => s.id === activeSection);
                  if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1].id);
                }}
                disabled={activeSection === SECTIONS[SECTIONS.length - 1].id}
                className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-body text-muted-foreground hover:text-foreground hover:border-khaki/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Далее
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
