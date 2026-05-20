import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface Props {
  fontSize: number;
  setFontSize: (fn: (f: number) => number) => void;
  highContrast: boolean;
  setHighContrast: (fn: (v: boolean) => boolean) => void;
}

export default function ProfileTopbar({ fontSize, setFontSize, highContrast, setHighContrast }: Props) {
  const navigate = useNavigate();

  return (
    <div className="nav-hero fixed top-0 inset-x-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-parchment/80 hover:text-parchment transition-colors font-body text-sm"
        >
          <Icon name="ArrowLeft" size={16} />
          101 ОУТП
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize(f => Math.max(14, f - 2))}
            className="w-7 h-7 border border-parchment/25 text-parchment/70 hover:text-parchment text-xs font-bold flex items-center justify-center"
          >
            A−
          </button>
          <button
            onClick={() => setFontSize(f => Math.min(22, f + 2))}
            className="w-7 h-7 border border-parchment/25 text-parchment/70 hover:text-parchment text-sm font-bold flex items-center justify-center"
          >
            A+
          </button>
          <button
            onClick={() => setHighContrast(v => !v)}
            className={`flex items-center gap-1 px-3 py-1 border text-xs font-body transition-colors ${
              highContrast ? "border-gold text-gold bg-gold/10" : "border-parchment/25 text-parchment/70"
            }`}
          >
            <Icon name="Contrast" size={12} />
            Контраст
          </button>
        </div>
      </div>
    </div>
  );
}
