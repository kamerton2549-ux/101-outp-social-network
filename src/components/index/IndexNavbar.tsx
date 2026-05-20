import { Link } from "react-router-dom";
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
  scrolled: boolean;
  activeNav: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  goTo: (id: string) => void;
}

export default function IndexNavbar({ scrolled, activeNav, mobileOpen, setMobileOpen, goTo }: Props) {
  return (
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
            <Link to="/gallery" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-parchment/65 hover:text-parchment text-xs font-body transition-colors rounded-sm">
              <Icon name="Images" size={12} />
              Галерея
            </Link>
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
  );
}

export { NAV };