import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const IMG_KRAKOW  = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/2d8618e5-9c64-4e0c-86c2-f38a1c1076e0.jpg";
const IMG_REUNION = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/b3cbf8e6-fc7a-4c99-b319-e489c9713b57.jpg";

type PostType = "memory" | "photo" | "event" | "news" | "search";

interface Post {
  id: number;
  type: PostType;
  author: string;
  rank: string;
  bn: string;
  time: string;
  text: string;
  image?: string;
  tag?: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1, type: "memory", author: "Сергей Петров", rank: "Ст. сержант", bn: "2-й учебный",
    time: "2 часа назад",
    text: "Вспоминаю осень 1974 года. Учения на полигоне Кракау — впервые самостоятельно прошёл трассу на Т-55 без единой ошибки. Командир сказал: «Петров, из тебя выйдет механик». До сих пор помню тот холодный октябрьский день...",
    tag: "Воспоминание", likes: 24, comments: 7,
  },
  {
    id: 2, type: "photo", author: "Архив 101 ОУТП", rank: "Администратор", bn: "Сообщество",
    time: "вчера",
    text: "Добавлены новые фотографии из архива — полигон Кракау, 1973–1975 гг. Если узнаёте себя или сослуживцев — подписывайте снимки в комментариях.",
    image: IMG_KRAKOW,
    tag: "Архив", likes: 58, comments: 21,
  },
  {
    id: 3, type: "event", author: "Совет ветеранов", rank: "", bn: "101 ОУТП",
    time: "2 дня назад",
    text: "📅 ВСТРЕЧА ВЕТЕРАНОВ\n17 октября 2026 года — торжественное собрание по случаю 65-летия формирования 101 ОУТП. Москва. Регистрация открыта. Приглашаем всех ветеранов, выпускников и их семьи.",
    tag: "Событие", likes: 102, comments: 43,
  },
  {
    id: 4, type: "search", author: "Виктор Семёнов", rank: "Рядовой", bn: "3-й учебный",
    time: "3 дня назад",
    text: "Разыскиваю однополчан из 3-го учебного батальона, призыв весна 1979 года. Командиром роты был майор Красилов. Машины — Т-10М. Если кто-то служил в это время — напишите мне.",
    tag: "Поиск", likes: 15, comments: 9,
  },
  {
    id: 5, type: "memory", author: "Владимир Козлов", rank: "Младший сержант", bn: "4-й Кракау",
    time: "5 дней назад",
    text: "Батальон Кракау — особое место. Полигон, запах солярки, команды командира. Практическое вождение Т-62 по ночной трассе — адреналин был как в настоящем бою. Кто служил в Кракау — поймёт.",
    tag: "Воспоминание", likes: 37, comments: 14,
  },
  {
    id: 6, type: "photo", author: "Михаил Орлов", rank: "Ефрейтор", bn: "1-й учебный",
    time: "неделю назад",
    text: "Нашёл старые снимки со встречи ветеранов 2019 года. Какие лица! Как будто и не было этих лет... Ребята, кто на фотографии — дайте знать.",
    image: IMG_REUNION,
    tag: "Фото", likes: 89, comments: 32,
  },
  {
    id: 7, type: "news", author: "Редакция 101 ОУТП", rank: "", bn: "Сообщество",
    time: "2 недели назад",
    text: "В архив добавлены сканы исторических приказов по полку за 1961–1965 годы. Материалы предоставлены семьёй первого командира полка. Просмотреть можно в разделе «Архив → Документы».",
    tag: "Новость", likes: 44, comments: 11,
  },
];

const TYPE_LABELS: Record<PostType, string> = {
  memory: "Воспоминание",
  photo:  "Фото",
  event:  "Событие",
  search: "Поиск",
  news:   "Новость",
};

const FILTERS: { id: PostType | "all"; label: string }[] = [
  { id: "all",    label: "Всё" },
  { id: "memory", label: "Воспоминания" },
  { id: "photo",  label: "Фото" },
  { id: "event",  label: "События" },
  { id: "search", label: "Поиск людей" },
  { id: "news",   label: "Новости" },
];

const DATES = [
  { label: "17 окт",  desc: "65 лет полку",              dot: "bg-gold" },
  { label: "22 июня", desc: "День памяти и скорби",       dot: "bg-brick" },
  { label: "12 дек",  desc: "Зимняя встреча",             dot: "bg-khaki" },
];

export default function Feed() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PostType | "all">("all");
  const [posts, setPosts]   = useState<Post[]>(INITIAL_POSTS);
  const [newText, setNewText] = useState("");

  const visible = filter === "all" ? posts : posts.filter(p => p.type === filter);

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const tagColor: Record<PostType | string, string> = {
    memory: "badge-gold-sm",
    photo:  "badge-bn",
    event:  "bg-brick/10 text-brick border border-brick/25 text-[0.65rem] font-bold px-1.5 py-0.5 rounded-sm",
    search: "bg-khaki/10 text-khaki border border-khaki/25 text-[0.65rem] font-bold px-1.5 py-0.5 rounded-sm",
    news:   "badge-bn",
  };

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
          <span className="font-display font-bold text-parchment text-sm">Лента сообщества</span>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gold text-coal text-xs font-body font-bold hover:bg-gold-light transition-colors">
            <Icon name="Bell" size={12} />
            Уведомления
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Main feed ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Post composer */}
            <div className="bg-card border border-border p-4">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-sand border border-border flex items-center justify-center shrink-0">
                  <Icon name="User" size={16} className="text-khaki/40" />
                </div>
                <textarea
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  placeholder="Поделитесь воспоминанием, добавьте фото или напишите о поиске однополчан..."
                  className="input-field resize-none text-sm h-20 rounded-sm flex-1"
                />
              </div>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2">
                  {[
                    { icon: "Camera",  label: "Фото" },
                    { icon: "BookOpen",label: "Воспоминание" },
                    { icon: "Search",  label: "Поиск" },
                  ].map(a => (
                    <button key={a.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground text-xs font-body hover:border-khaki/30 hover:text-khaki transition-colors"
                    >
                      <Icon name={a.icon as "Camera" | "BookOpen" | "Search"} size={12} />
                      {a.label}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!newText.trim()}
                  className="flex items-center gap-1.5 px-5 py-1.5 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="Send" size={13} />
                  Опубликовать
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="bg-card border border-border flex overflow-x-auto">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2.5 font-body text-sm whitespace-nowrap border-b-2 transition-colors flex-1 ${
                    filter === f.id
                      ? "border-khaki text-khaki font-bold bg-sand/30"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {visible.map(post => (
                <div key={post.id} className="bg-card border border-border hover:border-khaki/20 transition-colors">
                  {/* Author */}
                  <div className="p-4 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sand border border-border flex items-center justify-center shrink-0">
                        <Icon name="User" size={16} className="text-khaki/40" />
                      </div>
                      <div>
                        <div className="font-body font-bold text-sm text-foreground">{post.author}</div>
                        <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                          {post.rank && <span>{post.rank}</span>}
                          {post.rank && post.bn && <span>·</span>}
                          <span>{post.bn}</span>
                          <span>·</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className={tagColor[post.type]}>{TYPE_LABELS[post.type]}</span>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3">
                    <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line">{post.text}</p>
                  </div>

                  {/* Image */}
                  {post.image && (
                    <div className="px-4 pb-3">
                      <img src={post.image} alt="" className="w-full h-52 object-cover border border-border" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="px-4 py-3 border-t border-border flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm font-body transition-colors ${
                        post.liked ? "text-brick font-bold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon name={post.liked ? "Heart" : "Heart"} size={15}
                        className={post.liked ? "fill-brick text-brick" : ""} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="MessageCircle" size={15} />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="Share2" size={15} />
                      Поделиться
                    </button>
                    <div className="flex-1" />
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="Bookmark" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visible.length === 0 && (
              <div className="bg-card border border-border p-12 text-center">
                <Icon name="Inbox" size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-body text-muted-foreground">Нет записей в этой категории</p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Quick nav */}
            <div className="bg-card border border-border p-5">
              <h3 className="font-display font-bold text-base mb-4">Быстрые действия</h3>
              <div className="space-y-2">
                {[
                  { icon: "User",       label: "Мой профиль",      action: () => navigate("/profile") },
                  { icon: "Search",     label: "Найти сослуживца", action: () => navigate("/") },
                  { icon: "Map",        label: "Карта ГСВГ",       action: () => navigate("/map") },
                  { icon: "Archive",    label: "Архив полка",      action: () => navigate("/") },
                  { icon: "CalendarDays", label: "Встречи",        action: () => navigate("/") },
                  { icon: "FileText",   label: "Техзадание",       action: () => navigate("/spec") },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left font-body text-sm text-foreground hover:bg-sand hover:text-khaki transition-colors"
                  >
                    <Icon name={item.icon as "User" | "Search" | "Map" | "Archive" | "CalendarDays" | "FileText"} size={15} className="text-khaki/60" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="bg-card border border-border p-5">
              <h3 className="font-display font-bold text-base mb-4">Памятные даты 2026</h3>
              <div className="space-y-3">
                {DATES.map(d => (
                  <div key={d.label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${d.dot}`} />
                    <div>
                      <div className="font-body text-sm font-bold text-foreground">{d.label}</div>
                      <div className="font-body text-xs text-muted-foreground">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card border border-border p-5">
              <h3 className="font-display font-bold text-base mb-4">Сообщество</h3>
              <div className="space-y-3">
                {[
                  { label: "Участников",      val: "342" },
                  { label: "Воспоминаний",    val: "1 240" },
                  { label: "Фотографий",      val: "2 147" },
                  { label: "Документов",      val: "389" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">{s.label}</span>
                    <span className="font-display font-black text-khaki">{s.val}</span>
                  </div>
                ))}
              </div>
              <div className="divider-khaki my-4" />
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors"
              >
                <Icon name="UserPlus" size={14} />
                Создать профиль
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
