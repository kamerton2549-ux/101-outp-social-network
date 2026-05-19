import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/ca3df51e-8d09-4790-a55a-30b62a3b8673";

const IMG_KRAKOW  = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/2d8618e5-9c64-4e0c-86c2-f38a1c1076e0.jpg";
const IMG_DRESDEN = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/aa483e23-240e-47fe-a9e4-bba8b4e20b28.jpg";
const IMG_REUNION = "https://cdn.poehali.dev/projects/5a725459-9c28-4f3c-813d-94bb7e060502/files/b3cbf8e6-fc7a-4c99-b319-e489c9713b57.jpg";

const TANKS_LIST = ["Т-54", "Т-55", "Т-62", "Т-64", "Т-10М", "ПТ-76"];
const RANKS = [
  "Рядовой", "Ефрейтор", "Младший сержант", "Сержант", "Старший сержант",
  "Старшина", "Прапорщик", "Старший прапорщик",
  "Младший лейтенант", "Лейтенант", "Старший лейтенант", "Капитан",
  "Майор", "Подполковник", "Полковник",
];
const BATTALIONS = ["1-й учебный", "2-й учебный", "3-й учебный", "4-й Кракау"];

interface FormData {
  full_name: string; birth_year: string; hometown: string;
  email: string; phone: string; rank: string;
  years_from: string; years_to: string; battalion: string;
  company: string; role: string; tanks: string[];
  awards: string; bio: string; agree: boolean;
}

const EMPTY: FormData = {
  full_name: "", birth_year: "", hometown: "", email: "", phone: "",
  rank: "", years_from: "", years_to: "", battalion: "", company: "",
  role: "", tanks: [], awards: "", bio: "", agree: false,
};

const DEMO = {
  name: "Сергей Александрович Петров", rank: "Старший сержант",
  years: "1973–1975", battalion: "2-й учебный батальон",
  tank: "Т-55", role: "Механик-водитель",
  location: "Дрезден, ГДР", hometown: "г. Воронеж", joined: "Январь 2025",
};
const MEDALS = [
  { name: "Медаль «За службу в ГСВГ»",     icon: "⭐" },
  { name: "Отличник боевой подготовки",      icon: "🏅" },
  { name: "Ветеран воинской службы",         icon: "🎖" },
  { name: "Участник встречи ветеранов 2023", icon: "🤝" },
];
const MEMORIES = [
  { title: "Первый выезд на полигон Кракау", date: "Июнь 1973", place: "Полигон Кракау, ГДР",
    text: "Помню, как нас впервые привезли на полигон. Командир объяснял особенности Т-55 — машина тяжёлая, но послушная..." },
  { title: "Учения в составе 2-го батальона", date: "Октябрь 1974", place: "Дрезден, ГДР",
    text: "Совместные учения с другими подразделениями. Командовал капитан Волков. Мороз, раннее утро..." },
  { title: "Последний день службы", date: "Февраль 1975", place: "Дрезден, ГДР",
    text: "День, который помнишь всю жизнь. Построение на плацу, прощание с командиром..." },
];
const COMRADES = [
  { name: "Владимир Козлов",   years: "1973–1975", bn: "2-й учебный", tank: "Т-62" },
  { name: "Михаил Сидоров",    years: "1974–1976", bn: "2-й учебный", tank: "Т-55" },
  { name: "Андрей Лебедев",    years: "1972–1974", bn: "4-й Кракау",  tank: "Т-55" },
  { name: "Николай Громов",    years: "1973–1975", bn: "2-й учебный", tank: "Т-55" },
];
const PHOTOS = [
  { src: IMG_KRAKOW,  caption: "Полигон Кракау, 1974 г." },
  { src: IMG_DRESDEN, caption: "Дрезден, площадь полка, 1973 г." },
  { src: IMG_REUNION, caption: "Встреча ветеранов 2023 г." },
  { src: IMG_KRAKOW,  caption: "Занятия по вождению, лето 1974 г." },
  { src: IMG_DRESDEN, caption: "Торжественное построение, 1974 г." },
  { src: IMG_REUNION, caption: "Однополчане, Москва 2019 г." },
];

type Tab  = "memories" | "photos" | "comrades" | "medals";
type View = "demo" | "register" | "success";

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState<Tab>("memories");
  const [view, setView]       = useState<View>("demo");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHC] = useState(false);
  const [form, setForm]       = useState<FormData>(EMPTY);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "memories", label: "Воспоминания", icon: "BookOpen" },
    { id: "photos",   label: "Фотоархив",    icon: "Camera" },
    { id: "comrades", label: "Сослуживцы",   icon: "Users" },
    { id: "medals",   label: "Награды",      icon: "Award" },
  ];

  const setF = (k: keyof FormData, v: string | boolean | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  const toggleTank = (t: string) =>
    setF("tanks", form.tanks.includes(t) ? form.tanks.filter(x => x !== t) : [...form.tanks, t]);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.full_name.trim()) e.full_name = "Укажите ФИО";
    if (!form.battalion)        e.battalion = "Выберите батальон";
    if (!form.agree)            e.agree     = "Необходимо согласие";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name:  form.full_name.trim(),
          birth_year: form.birth_year ? parseInt(form.birth_year) : null,
          hometown:   form.hometown   || null,
          email:      form.email      || null,
          phone:      form.phone      || null,
          rank:       form.rank       || null,
          years_from: form.years_from ? parseInt(form.years_from) : null,
          years_to:   form.years_to   ? parseInt(form.years_to)   : null,
          battalion:  form.battalion,
          company:    form.company    || null,
          role:       form.role       || null,
          tanks:      form.tanks,
          awards:     form.awards     || null,
          bio:        form.bio        || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessId(data.id);
        setView("success");
      } else {
        setErrors({ full_name: data.error || "Ошибка при отправке" });
      }
    } catch {
      setErrors({ full_name: "Нет связи с сервером. Попробуйте позже." });
    } finally {
      setLoading(false);
    }
  };

  /* ─── Shared topbar ─── */
  const Topbar = () => (
    <div className="nav-hero fixed top-0 inset-x-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 text-parchment/80 hover:text-parchment transition-colors font-body text-sm">
          <Icon name="ArrowLeft" size={16} />
          101 ОУТП
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setFontSize(f => Math.max(14, f - 2))}
            className="w-7 h-7 border border-parchment/25 text-parchment/70 hover:text-parchment text-xs font-bold flex items-center justify-center">A−</button>
          <button onClick={() => setFontSize(f => Math.min(22, f + 2))}
            className="w-7 h-7 border border-parchment/25 text-parchment/70 hover:text-parchment text-sm font-bold flex items-center justify-center">A+</button>
          <button onClick={() => setHC(v => !v)}
            className={`flex items-center gap-1 px-3 py-1 border text-xs font-body transition-colors ${highContrast ? "border-gold text-gold bg-gold/10" : "border-parchment/25 text-parchment/70"}`}>
            <Icon name="Contrast" size={12} />
            Контраст
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════════ SUCCESS ══════════════ */
  if (view === "success") return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontSize: `${fontSize}px` }}>
      <Topbar />
      <div className="max-w-xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="w-20 h-20 bg-khaki/10 border-2 border-khaki/20 flex items-center justify-center mx-auto mb-6 text-4xl">🎖</div>
        <h1 className="font-display font-black text-3xl mb-3">Заявка принята!</h1>
        <div className="divider-gold max-w-xs mx-auto mb-5" />
        {successId && <p className="font-body text-xs text-muted-foreground mb-2">Номер заявки: #{successId}</p>}
        <p className="font-body text-muted-foreground text-base leading-relaxed mb-8">
          Ваши данные сохранены. Совет ветеранов 101 ОУТП проверит информацию
          и опубликует профиль в течение <strong>1–3 рабочих дней</strong>.
        </p>
        <div className="bg-sand/60 border border-border p-5 text-left mb-8">
          <p className="font-display italic text-base text-foreground/85 leading-relaxed">
            «Добро пожаловать в сообщество 101 ОУТП. Вы вступаете в круг людей,
            объединённых памятью о службе в Дрездене и ГСВГ.»
          </p>
          <p className="font-body text-muted-foreground text-xs mt-2">— Совет ветеранов 101 ОУТП</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 justify-center px-6 py-3 bg-khaki text-parchment font-body font-bold rounded-sm hover:bg-khaki-light transition-colors">
            <Icon name="Home" size={15} />
            На главную
          </button>
          <button onClick={() => { setForm(EMPTY); setErrors({}); setView("register"); }}
            className="flex items-center gap-2 justify-center px-6 py-3 border-2 border-khaki/40 text-khaki font-body font-bold rounded-sm hover:bg-khaki hover:text-parchment transition-colors">
            Добавить ещё профиль
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════════ REGISTRATION FORM ══════════════ */
  if (view === "register") return (
    <div className={`min-h-screen bg-background text-foreground ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${fontSize}px` }}>
      <Topbar />
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("demo")}
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-body text-sm">
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
                  <input type="text" value={form.full_name}
                    onChange={e => setF("full_name", e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className={`input-field rounded-sm ${errors.full_name ? "border-brick" : ""}`} />
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

            {/* О себе */}
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
                <div onClick={() => setF("agree", !form.agree)}
                  className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    form.agree ? "border-khaki bg-khaki" : "border-border group-hover:border-khaki/40"
                  }`}>
                  {form.agree && <Icon name="Check" size={12} className="text-parchment" />}
                </div>
                <span className="font-body text-sm text-muted-foreground leading-relaxed">
                  Я подтверждаю, что указанные сведения достоверны, и даю согласие на хранение
                  и отображение данных в рамках некоммерческого сообщества 101 ОУТП.
                  Профиль проверяется модераторами перед публикацией.
                </span>
              </label>
              {errors.agree && <p className="font-body text-brick text-xs mb-4">{errors.agree}</p>}

              <button onClick={submit} disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-khaki text-parchment font-body font-bold text-base hover:bg-khaki-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm">
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
    </div>
  );

  /* ══════════════ DEMO PROFILE ══════════════ */
  return (
    <div className={`min-h-screen bg-background text-foreground ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${fontSize}px` }}>
      <Topbar />
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">

        {/* CTA banner */}
        <div className="bg-khaki/8 border border-khaki/20 p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon name="UserPlus" size={20} className="text-khaki shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-bold text-base">Это пример профиля участника</div>
              <div className="font-body text-muted-foreground text-sm mt-0.5">Зарегистрируйтесь, чтобы ваш профиль появился в списке сообщества</div>
            </div>
          </div>
          <button onClick={() => setView("register")}
            className="flex items-center gap-2 px-6 py-2.5 bg-khaki text-parchment font-body font-bold text-sm rounded-sm hover:bg-khaki-light transition-colors shrink-0">
            <Icon name="PenLine" size={14} />
            Зарегистрировать профиль
          </button>
        </div>

        {/* Profile header */}
        <div className="bg-card border border-border mb-5 overflow-hidden">
          <div className="relative h-40 lg:h-52 overflow-hidden">
            <img src={IMG_DRESDEN} alt="Дрезден" className="w-full h-full object-cover object-center" />
            <div className="hero-img-overlay absolute inset-0" />
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start -mt-10 sm:-mt-12">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-sand border-4 border-card flex items-center justify-center shrink-0">
                <Icon name="User" size={36} className="text-khaki/40" />
              </div>
              <div className="flex-1 pt-2 sm:pt-14">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground leading-tight">{DEMO.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="badge-bn">{DEMO.rank}</span>
                      <span className="badge-gold-sm">{DEMO.tank}</span>
                      <span className="font-body text-muted-foreground text-sm">{DEMO.years}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors">
                      <Icon name="MessageSquare" size={14} />
                      Написать
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 border-2 border-khaki/40 text-khaki font-body font-bold text-sm hover:bg-khaki hover:text-parchment transition-colors">
                      <Icon name="UserPlus" size={14} />
                      Друзья
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider-khaki mt-4 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "Shield",   label: "Батальон",    val: DEMO.battalion },
                { icon: "MapPin",   label: "Дислокация",  val: DEMO.location },
                { icon: "Home",     label: "Родной город",val: DEMO.hometown },
                { icon: "Calendar", label: "В сообществе",val: `с ${DEMO.joined}` },
              ].map(d => (
                <div key={d.label} className="flex items-start gap-2.5">
                  <Icon name={d.icon as "Shield"|"MapPin"|"Home"|"Calendar"} size={14} className="text-khaki/50 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-body text-[10px] text-muted-foreground uppercase tracking-wide">{d.label}</div>
                    <div className="font-body text-sm font-bold text-foreground leading-tight">{d.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border border-b-0 flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 font-body font-bold text-sm whitespace-nowrap border-b-2 transition-colors flex-1 justify-center ${
                tab === t.id ? "border-khaki text-khaki bg-sand/40" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-sand/20"
              }`}>
              <Icon name={t.icon as "BookOpen"|"Camera"|"Users"|"Award"} size={15} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border p-6 min-h-80">

          {tab === "memories" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl">Воспоминания</h2>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors">
                  <Icon name="Plus" size={14} />Добавить
                </button>
              </div>
              <div className="space-y-4">
                {MEMORIES.map((m, i) => (
                  <div key={i} className="border border-border p-5 hover:border-khaki/30 hover:bg-sand/30 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-bold text-base group-hover:text-khaki transition-colors">{m.title}</h3>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="Calendar" size={11} />{m.date}</span>
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={11} />{m.place}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "photos" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl">Фотоархив</h2>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-khaki text-parchment font-body font-bold text-sm hover:bg-khaki-light transition-colors">
                  <Icon name="Upload" size={14} />Загрузить
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PHOTOS.map((p, i) => (
                  <div key={i} className="group cursor-pointer overflow-hidden border border-border hover:border-khaki/40 transition-colors">
                    <img src={p.src} alt={p.caption} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="px-3 py-2 bg-sand/40">
                      <p className="font-body text-xs text-muted-foreground line-clamp-1">{p.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "comrades" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-xl">Сослуживцы</h2>
                  <p className="font-body text-muted-foreground text-sm mt-0.5">Автоподбор по 2-му учебному батальону, 1973–1975</p>
                </div>
              </div>
              <div className="space-y-2">
                {COMRADES.map((c, i) => (
                  <div key={i} className="member-card bg-background border border-border p-4 flex items-center justify-between gap-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sand border border-border flex items-center justify-center shrink-0">
                        <Icon name="User" size={16} className="text-khaki/40" />
                      </div>
                      <div>
                        <div className="font-body font-bold text-sm text-foreground">{c.name}</div>
                        <div className="flex gap-1.5 mt-0.5 flex-wrap">
                          <span className="badge-bn">{c.bn}</span>
                          <span className="badge-gold-sm">{c.tank}</span>
                          <span className="font-body text-muted-foreground text-xs">{c.years}</span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-khaki/30 text-khaki text-xs font-body font-bold hover:bg-khaki hover:text-parchment transition-colors shrink-0">
                      <Icon name="MessageSquare" size={11} />Написать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "medals" && (
            <div>
              <h2 className="font-display font-bold text-xl mb-5">Награды и достижения</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {MEDALS.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 border border-border p-4 hover:border-gold/30 hover:bg-sand/30 transition-all">
                    <div className="w-12 h-12 bg-sand border border-border flex items-center justify-center text-2xl shrink-0">{m.icon}</div>
                    <div>
                      <div className="font-body font-bold text-sm text-gold">{m.name}</div>
                      <div className="font-body text-xs text-muted-foreground mt-0.5">101 ОУТП · ГСВГ</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider-khaki mb-5" />
              <h3 className="font-display font-bold text-base mb-3">Виртуальные знаки</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {[
                  { icon: "🎖", label: "Ветеран",   earned: true },
                  { icon: "🏅", label: "Отличник",  earned: true },
                  { icon: "📸", label: "Архивист",  earned: true },
                  { icon: "✍️", label: "Летописец", earned: false },
                  { icon: "🤝", label: "Друг",      earned: false },
                  { icon: "⭐", label: "Активист",  earned: false },
                ].map((b, i) => (
                  <div key={i} className={`text-center p-3 border ${b.earned ? "border-gold/30 bg-gold/5" : "border-border opacity-40"}`}>
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <div className={`font-body text-[10px] font-bold ${b.earned ? "text-gold" : "text-muted-foreground"}`}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
