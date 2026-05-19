import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

type MarkerType = "hq" | "polygon" | "army" | "city";

interface MapMarker {
  id: string;
  type: MarkerType;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  detail: {
    title: string;
    period: string;
    desc: string;
    unit?: string;
  };
}

const MARKERS: MapMarker[] = [
  {
    id: "dresden", type: "hq", label: "Дрезден", sublabel: "Штаб 101 ОУТП",
    x: 47, y: 34,
    detail: {
      title: "Дрезден — штаб 101 ОУТП",
      period: "1961–1991",
      unit: "101-й отдельный учебный танковый полк",
      desc: "Место дислокации 101 ОУТП. Здесь располагались казармы, штаб полка, парк боевых машин. 3 учебных батальона готовили механиков-водителей танков.",
    },
  },
  {
    id: "krakow", type: "polygon", label: "Кракау", sublabel: "Полигон / 4-й батальон",
    x: 52, y: 28,
    detail: {
      title: "Полигон Кракау",
      period: "1961–1991",
      unit: "4-й батальон практического вождения",
      desc: "Учебный полигон к северо-востоку от Дрездена. Батальон практического вождения. Здесь курсанты под руководством инструкторов отрабатывали управление Т-54, Т-55, Т-62, Т-64, Т-10М, ПТ-76.",
    },
  },
  {
    id: "wuensdorf", type: "army", label: "Вюнсдорф", sublabel: "Штаб 1 ГвТА / ГСВГ",
    x: 60, y: 25,
    detail: {
      title: "Вюнсдорф — штаб ГСВГ",
      period: "1945–1994",
      unit: "1-я Гвардейская Танковая Армия",
      desc: "Главный штаб Группы Советских Войск в Германии. «Русский город» — крупнейший военный объект СССР за пределами страны. Вышестоящее командование для 101 ОУТП.",
    },
  },
  {
    id: "berlin", type: "city", label: "Берлин", sublabel: "Гарнизоны ГСВГ",
    x: 64, y: 22,
    detail: {
      title: "Берлин — гарнизоны ГСВГ",
      period: "1945–1994",
      desc: "Западная Германия граничила здесь с ГДР. Советские части несли службу по периметру. Символ раздела Европы эпохи холодной войны.",
    },
  },
  {
    id: "magdeburg", type: "army", label: "Магдебург", sublabel: "2-я Гв. Танковая армия",
    x: 52, y: 19,
    detail: {
      title: "Магдебург — 2-я ГвТА",
      period: "1945–1994",
      unit: "2-я Гвардейская Танковая Армия",
      desc: "Место дислокации 2-й Гвардейской Танковой Армии ГСВГ. Рядом с границей с Западной Германией.",
    },
  },
  {
    id: "erfurt", type: "army", label: "Эрфурт", sublabel: "8-я Общевойсковая армия",
    x: 42, y: 28,
    detail: {
      title: "Эрфурт — 8-я ОА",
      period: "1945–1994",
      unit: "8-я Гвардейская Общевойсковая Армия",
      desc: "Один из крупных советских гарнизонов в ГДР. Мотострелковые и танковые дивизии несли боевое дежурство.",
    },
  },
  {
    id: "chemnitz", type: "city", label: "Карл-Маркс-Штадт", sublabel: "Части ГСВГ",
    x: 49, y: 38,
    detail: {
      title: "Карл-Маркс-Штадт (Хемниц)",
      period: "1952–1990",
      desc: "Промышленный центр ГДР. Рядом с Дрезденом. В окрестностях располагались отдельные части ГСВГ.",
    },
  },
];

const TYPE_STYLES: Record<MarkerType, { dot: string; ring: string; label: string }> = {
  hq:      { dot: "bg-gold border-2 border-coal/30",   ring: "ring-gold/40",   label: "Штаб полка" },
  polygon: { dot: "bg-brick border-2 border-coal/30",  ring: "ring-brick/40",  label: "Полигон" },
  army:    { dot: "bg-khaki border-2 border-coal/30",  ring: "ring-khaki/40",  label: "Штаб армии" },
  city:    { dot: "bg-sand-deep border-2 border-coal/30", ring: "ring-sand/40",label: "Город ГСВГ" },
};

export default function MapGSVG() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MapMarker | null>(MARKERS[0]);
  const [hovered, setHovered]   = useState<string | null>(null);

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
          <span className="font-display font-bold text-parchment text-sm">Карта ГСВГ</span>
          <div className="font-body text-parchment/50 text-xs hidden sm:block">Группа Советских Войск в Германии · 1945–1994</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">

        {/* Header */}
        <div className="mb-6">
          <span className="section-overline">Дислокация</span>
          <h1 className="font-display text-3xl sm:text-4xl font-black mt-1 mb-2">Карта ГСВГ</h1>
          <div className="divider-gold max-w-xs mb-3" />
          <p className="font-body text-muted-foreground text-sm max-w-xl">
            Интерактивная карта Группы Советских Войск в Германии. Нажмите на метку, чтобы узнать подробнее о дислокации.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border overflow-hidden">
              {/* Legend */}
              <div className="px-5 py-3 border-b border-border bg-sand/30 flex flex-wrap gap-4">
                {Object.entries(TYPE_STYLES).map(([type, style]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                    <span className="font-body text-xs text-muted-foreground">{style.label}</span>
                  </div>
                ))}
              </div>

              {/* SVG Map */}
              <div className="relative bg-[#e8e0d0] overflow-hidden" style={{ paddingBottom: "62%" }}>
                <svg
                  viewBox="0 0 100 62"
                  className="absolute inset-0 w-full h-full"
                  style={{ fontFamily: "PT Sans, sans-serif" }}
                >
                  {/* Background gradient — map feel */}
                  <defs>
                    <radialGradient id="mapBg" cx="50%" cy="50%" r="70%">
                      <stop offset="0%" stopColor="#ddd5c0" />
                      <stop offset="100%" stopColor="#c8bea8" />
                    </radialGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  <rect width="100" height="62" fill="url(#mapBg)" />

                  {/* Rivers (stylised) */}
                  <path d="M30 55 Q38 42 47 34 Q52 28 60 18" stroke="#a8c4d4" strokeWidth="0.6" fill="none" opacity="0.7" />
                  <path d="M55 62 Q58 48 52 38 Q47 30 50 18" stroke="#a8c4d4" strokeWidth="0.4" fill="none" opacity="0.5" />

                  {/* Label: Elbe river */}
                  <text x="33" y="48" fontSize="2.2" fill="#7aa0b8" opacity="0.8" transform="rotate(-35 33 48)">р. Эльба</text>

                  {/* Country borders area */}
                  <path
                    d="M28 5 L72 5 L78 15 L80 30 L74 50 L70 60 L28 60 L22 50 L18 35 L20 18 Z"
                    fill="#d4cabb" stroke="#b0a890" strokeWidth="0.5" opacity="0.7"
                  />

                  {/* GDR label */}
                  <text x="48" y="50" fontSize="3.5" fontWeight="bold" fill="#8a7e6a" opacity="0.4" textAnchor="middle">ГДР</text>

                  {/* Grid lines subtle */}
                  {[20, 30, 40, 50, 60, 70].map(x => (
                    <line key={`vl${x}`} x1={x} y1="0" x2={x} y2="62" stroke="#b8ad98" strokeWidth="0.15" opacity="0.4" />
                  ))}
                  {[15, 25, 35, 45, 55].map(y => (
                    <line key={`hl${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#b8ad98" strokeWidth="0.15" opacity="0.4" />
                  ))}

                  {/* Connection line: Дрезден → Кракау */}
                  <line
                    x1={MARKERS[0].x} y1={MARKERS[0].y}
                    x2={MARKERS[1].x} y2={MARKERS[1].y}
                    stroke="#c5a455" strokeWidth="0.4" strokeDasharray="1 0.7" opacity="0.7"
                  />

                  {/* Markers */}
                  {MARKERS.map(m => {
                    const style = TYPE_STYLES[m.type];
                    const isSelected = selected?.id === m.id;
                    const isHovered  = hovered === m.id;
                    const active = isSelected || isHovered;

                    return (
                      <g
                        key={m.id}
                        transform={`translate(${m.x},${m.y})`}
                        onClick={() => setSelected(m)}
                        onMouseEnter={() => setHovered(m.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ cursor: "pointer" }}
                        filter={active ? "url(#shadow)" : undefined}
                      >
                        {/* Pulse ring when selected */}
                        {isSelected && (
                          <circle r="4.5" fill="none" stroke="#c5a455" strokeWidth="0.5" opacity="0.5" />
                        )}

                        {/* Dot */}
                        <circle
                          r={active ? "2.4" : "1.8"}
                          fill={
                            m.type === "hq"      ? "#c5a455" :
                            m.type === "polygon" ? "#a54436" :
                            m.type === "army"    ? "#4b5320" :
                                                   "#8a7e6a"
                          }
                          stroke="white"
                          strokeWidth={active ? "0.6" : "0.4"}
                          style={{ transition: "r 0.2s" }}
                        />

                        {/* Label */}
                        <text
                          x="0" y={active ? "-3.5" : "-3"}
                          fontSize={active ? "2.4" : "2.1"}
                          fontWeight={active ? "bold" : "normal"}
                          fill={active ? "#2a2a2a" : "#4a4035"}
                          textAnchor="middle"
                          style={{ transition: "all 0.2s", userSelect: "none" }}
                        >
                          {m.label}
                        </text>
                        {active && (
                          <text x="0" y="-1" fontSize="1.6" fill="#8a7e6a" textAnchor="middle">
                            {m.sublabel}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Compass */}
                  <g transform="translate(88,8)">
                    <circle r="4" fill="white" opacity="0.6" />
                    <text x="0" y="-1.5" fontSize="2" fontWeight="bold" fill="#4a4035" textAnchor="middle">С</text>
                    <line x1="0" y1="-0.5" x2="0" y2="-3.2" stroke="#c5a455" strokeWidth="0.6" />
                    <line x1="0" y1="-0.5" x2="0" y2="2.5" stroke="#8a7e6a" strokeWidth="0.4" />
                  </g>

                  {/* Scale */}
                  <g transform="translate(10,55)">
                    <line x1="0" y1="0" x2="8" y2="0" stroke="#6a5f50" strokeWidth="0.5" />
                    <line x1="0" y1="-0.5" x2="0" y2="0.5" stroke="#6a5f50" strokeWidth="0.5" />
                    <line x1="8" y1="-0.5" x2="8" y2="0.5" stroke="#6a5f50" strokeWidth="0.5" />
                    <text x="4" y="-1.2" fontSize="1.6" fill="#6a5f50" textAnchor="middle">~80 км</text>
                  </g>
                </svg>
              </div>

              <div className="px-5 py-3 bg-sand/20 border-t border-border">
                <p className="font-body text-xs text-muted-foreground text-center">
                  Схематичная карта. Нажмите на точку для подробностей.
                  Красные линии — маршруты учебного вождения (Дрезден ↔ Кракау).
                </p>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-4">

            {/* Selected marker detail */}
            {selected && (
              <div className="bg-card border border-border overflow-hidden">
                <div className="bg-khaki px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      selected.type === "hq" ? "bg-gold" :
                      selected.type === "polygon" ? "bg-brick" :
                      "bg-khaki-light"
                    }`}>
                      <Icon name={
                        selected.type === "hq"      ? "Star" :
                        selected.type === "polygon" ? "Target" :
                        selected.type === "army"    ? "Shield" : "MapPin"
                      } size={16} className="text-parchment" />
                    </div>
                    <div>
                      <h2 className="font-display font-black text-parchment text-lg leading-tight">{selected.detail.title}</h2>
                      <div className="font-body text-parchment/60 text-xs mt-1">{selected.detail.period}</div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  {selected.detail.unit && (
                    <div className="badge-bn mb-3 inline-block">{selected.detail.unit}</div>
                  )}
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {selected.detail.desc}
                  </p>
                </div>
              </div>
            )}

            {/* All points list */}
            <div className="bg-card border border-border">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-display font-bold text-base">Объекты на карте</h3>
              </div>
              <div className="divide-y divide-border">
                {MARKERS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-colors ${
                      selected?.id === m.id ? "bg-sand/50" : "hover:bg-sand/30"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      m.type === "hq"      ? "bg-gold" :
                      m.type === "polygon" ? "bg-brick" :
                      m.type === "army"    ? "bg-khaki" : "bg-sand-deep"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-body text-sm font-bold ${selected?.id === m.id ? "text-khaki" : "text-foreground"}`}>{m.label}</div>
                      <div className="font-body text-xs text-muted-foreground truncate">{m.sublabel}</div>
                    </div>
                    {selected?.id === m.id && <Icon name="ChevronRight" size={14} className="text-khaki shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-sand/40 border border-border p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={14} className="text-khaki shrink-0 mt-0.5" />
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  Карта носит историко-информационный характер. Координаты объектов приблизительные.
                  Если вы знаете точное расположение объектов — напишите нам.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
