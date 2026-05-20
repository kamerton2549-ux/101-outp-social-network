import Icon from "@/components/ui/icon";

const TANKS_LIST = ["Т-54", "Т-55", "Т-62", "Т-64", "Т-10М", "ПТ-76"];
const RANKS = [
  "Рядовой", "Ефрейтор", "Младший сержант", "Сержант", "Старший сержант",
  "Старшина", "Прапорщик", "Старший прапорщик",
  "Младший лейтенант", "Лейтенант", "Старший лейтенант", "Капитан",
  "Майор", "Подполковник", "Полковник",
];
const BATTALIONS = ["1-й учебный", "2-й учебный", "3-й учебный", "4-й Кракау"];

export interface FormData {
  full_name: string; birth_year: string; hometown: string;
  email: string; phone: string; rank: string;
  years_from: string; years_to: string; battalion: string;
  company: string; role: string; tanks: string[];
  awards: string; bio: string; agree: boolean;
}

export const EMPTY_FORM: FormData = {
  full_name: "", birth_year: "", hometown: "", email: "", phone: "",
  rank: "", years_from: "", years_to: "", battalion: "", company: "",
  role: "", tanks: [], awards: "", bio: "", agree: false,
};

interface Props {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  loading: boolean;
  onBack: () => void;
  setF: (k: keyof FormData, v: string | boolean | string[]) => void;
  onSubmit: () => void;
}

export default function ProfileRegisterForm({ form, errors, loading, onBack, setF, onSubmit }: Props) {
  const toggleTank = (t: string) =>
    setF("tanks", form.tanks.includes(t) ? form.tanks.filter(x => x !== t) : [...form.tanks, t]);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-body text-sm"
        >
          <Icon name="ArrowLeft" size={15} />
          Назад
        </button>
        <div>
          <h1 className="font-display font-black text-3xl">Регистрация профиля</h1>
          <p className="font-body text-muted-foreground text-sm mt-0.5">101 ОУТП · Дрезден · ГСВГ</p>
        </div>
      </div>
      <div className="divider-gold max-w-xs mb-8" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Личные данные */}
          <div className="bg-card border border-border p-6">
            <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
              <Icon name="User" size={18} className="text-khaki/60" />
              Личные данные
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">
                  ФИО (полностью) <span className="text-brick">*</span>
                </label>
                <input
                  type="text" value={form.full_name}
                  onChange={e => setF("full_name", e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className={`input-field rounded-sm ${errors.full_name ? "border-brick" : ""}`}
                />
                {errors.full_name && <p className="font-body text-brick text-xs mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Год рождения</label>
                <input type="number" value={form.birth_year} onChange={e => setF("birth_year", e.target.value)}
                  placeholder="1952" min="1920" max="1975" className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Родной город</label>
                <input type="text" value={form.hometown} onChange={e => setF("hometown", e.target.value)}
                  placeholder="Москва" className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setF("email", e.target.value)}
                  placeholder="ivan@example.ru" className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Телефон</label>
                <input type="tel" value={form.phone} onChange={e => setF("phone", e.target.value)}
                  placeholder="+7 (999) 123-45-67" className="input-field rounded-sm" />
              </div>
            </div>
          </div>

          {/* Служебные данные */}
          <div className="bg-card border border-border p-6">
            <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
              <Icon name="Shield" size={18} className="text-khaki/60" />
              Служебные данные
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Звание</label>
                <select value={form.rank} onChange={e => setF("rank", e.target.value)} className="input-field rounded-sm">
                  <option value="">— Выберите звание —</option>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Батальон <span className="text-brick">*</span>
                </label>
                <select value={form.battalion} onChange={e => setF("battalion", e.target.value)}
                  className={`input-field rounded-sm ${errors.battalion ? "border-brick" : ""}`}>
                  <option value="">— Выберите батальон —</option>
                  {BATTALIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.battalion && <p className="font-body text-brick text-xs mt-1">{errors.battalion}</p>}
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Год призыва</label>
                <input type="number" value={form.years_from} onChange={e => setF("years_from", e.target.value)}
                  placeholder="1973" min="1961" max="1991" className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Год увольнения</label>
                <input type="number" value={form.years_to} onChange={e => setF("years_to", e.target.value)}
                  placeholder="1975" min="1961" max="1991" className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Рота / Взвод</label>
                <input type="text" value={form.company} onChange={e => setF("company", e.target.value)}
                  placeholder="3-я рота, 1-й взвод" className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Должность</label>
                <input type="text" value={form.role} onChange={e => setF("role", e.target.value)}
                  placeholder="Механик-водитель" className="input-field rounded-sm" />
              </div>
            </div>
            <div className="mt-5">
              <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-3">Тип учебной машины</label>
              <div className="flex flex-wrap gap-2">
                {TANKS_LIST.map(t => (
                  <button key={t} type="button" onClick={() => toggleTank(t)}
                    className={`px-4 py-2 font-body font-bold text-sm border-2 transition-colors rounded-sm ${
                      form.tanks.includes(t)
                        ? "border-khaki bg-khaki text-parchment"
                        : "border-border text-muted-foreground hover:border-khaki/40 hover:text-khaki"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Дополнительно */}
          <div className="bg-card border border-border p-6">
            <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
              <Icon name="BookOpen" size={18} className="text-khaki/60" />
              Дополнительно
            </h2>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Награды и отличия</label>
                <input type="text" value={form.awards} onChange={e => setF("awards", e.target.value)}
                  placeholder="Медаль «За службу в ГСВГ», Отличник боевой подготовки..."
                  className="input-field rounded-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">О себе / Краткая история</label>
                <textarea rows={4} value={form.bio} onChange={e => setF("bio", e.target.value)}
                  placeholder="Расскажите о себе, о службе, о самых запоминающихся моментах..."
                  className="input-field rounded-sm resize-none" />
                <p className="font-body text-muted-foreground text-xs mt-1">Это поможет сослуживцам узнать вас</p>
              </div>
            </div>
          </div>

          {/* Согласие + кнопка */}
          <div className="bg-card border border-border p-6">
            <label className="flex items-start gap-3 cursor-pointer group mb-5">
              <div
                onClick={() => setF("agree", !form.agree)}
                className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  form.agree ? "border-khaki bg-khaki" : "border-border group-hover:border-khaki/40"
                }`}
              >
                {form.agree && <Icon name="Check" size={12} className="text-parchment" />}
              </div>
              <span className="font-body text-sm text-muted-foreground leading-relaxed">
                Я подтверждаю, что указанные сведения достоверны, и даю согласие на хранение
                и отображение данных в рамках некоммерческого сообщества 101 ОУТП.
                Профиль проверяется модераторами перед публикацией.
              </span>
            </label>
            {errors.agree && <p className="font-body text-brick text-xs mb-4">{errors.agree}</p>}

            <button
              onClick={onSubmit} disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-khaki text-parchment font-body font-bold text-base hover:bg-khaki-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            >
              {loading
                ? <><Icon name="Loader2" size={18} className="animate-spin" />Отправка заявки...</>
                : <><Icon name="Send" size={16} />Подать заявку на регистрацию</>}
            </button>
            <p className="font-body text-xs text-muted-foreground text-center mt-3">
              Заявка проверяется модераторами. Обычно 1–3 рабочих дня.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border p-5">
            <h3 className="font-display font-bold text-base mb-4">Как это работает</h3>
            <div className="space-y-4">
              {[
                { n: "1", t: "Заполните форму",  d: "Укажите данные о службе — батальон, годы, технику" },
                { n: "2", t: "Отправьте заявку", d: "Данные сохраняются и уходят на проверку" },
                { n: "3", t: "Модерация",         d: "Совет ветеранов проверяет данные (1–3 дня)" },
                { n: "4", t: "Публикация",        d: "Профиль появится в списке участников" },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-khaki text-parchment font-display font-black text-sm flex items-center justify-center shrink-0">{s.n}</div>
                  <div>
                    <div className="font-body font-bold text-sm">{s.t}</div>
                    <div className="font-body text-xs text-muted-foreground mt-0.5">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sand/40 border border-border p-4">
            <div className="flex items-start gap-2">
              <Icon name="Lock" size={14} className="text-khaki shrink-0 mt-0.5" />
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                Email и телефон не публикуются — только для связи с администрацией.
                Данные хранятся на защищённом сервере.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border p-4">
            <p className="font-body text-xs text-muted-foreground">
              Обязательные поля: <strong className="text-foreground">ФИО</strong> и <strong className="text-foreground">батальон</strong>. Остальное — по желанию.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
