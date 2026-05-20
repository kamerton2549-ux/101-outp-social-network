import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

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

interface Props {
  goTo: (id: string) => void;
}

export default function IndexFooter({ goTo }: Props) {
  const navigate = useNavigate();

  return (
    <>
      {/* ═══ БЫСТРЫЙ ДОСТУП (float panel) ═══ */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
        <div className="bg-card border border-border shadow-lg p-3 flex flex-col gap-2">
          <div className="font-body text-[10px] text-muted-foreground uppercase tracking-wide text-center mb-1">Разделы</div>
          {[
            { icon: "Rss",      label: "Лента",      path: "/feed" },
            { icon: "Map",      label: "Карта ГСВГ",  path: "/map" },
            { icon: "User",     label: "Профиль",    path: "/profile" },
            { icon: "Shield",   label: "Модератор",  path: "/admin" },
            { icon: "FileText", label: "Техзадание", path: "/spec" },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2 px-3 py-2 border border-border text-xs font-body text-muted-foreground hover:bg-sand hover:text-khaki hover:border-khaki/30 transition-colors text-left whitespace-nowrap"
            >
              <Icon name={item.icon as "Rss" | "Map" | "User" | "Shield" | "FileText"} size={13} className="text-khaki/60" />
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
    </>
  );
}