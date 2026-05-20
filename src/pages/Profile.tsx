import { useState } from "react";
import ProfileTopbar from "@/components/profile/ProfileTopbar";
import ProfileRegisterForm, { FormData, EMPTY_FORM } from "@/components/profile/ProfileRegisterForm";
import ProfileSuccess from "@/components/profile/ProfileSuccess";
import ProfileDemo from "@/components/profile/ProfileDemo";

const API = "https://functions.poehali.dev/ca3df51e-8d09-4790-a55a-30b62a3b8673";

type View = "demo" | "register" | "success";

export default function Profile() {
  const [view, setView]           = useState<View>("demo");
  const [fontSize, setFontSize]   = useState(16);
  const [highContrast, setHC]     = useState(false);
  const [form, setForm]           = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors]       = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading]     = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);

  const setF = (k: keyof FormData, v: string | boolean | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

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

  const topbar = (
    <ProfileTopbar
      fontSize={fontSize}
      setFontSize={setFontSize}
      highContrast={highContrast}
      setHighContrast={setHC}
    />
  );

  if (view === "success") return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontSize: `${fontSize}px` }}>
      {topbar}
      <ProfileSuccess
        successId={successId}
        onAddAnother={() => { setForm(EMPTY_FORM); setErrors({}); setView("register"); }}
      />
    </div>
  );

  if (view === "register") return (
    <div className={`min-h-screen bg-background text-foreground ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${fontSize}px` }}>
      {topbar}
      <ProfileRegisterForm
        form={form}
        errors={errors}
        loading={loading}
        onBack={() => setView("demo")}
        setF={setF}
        onSubmit={submit}
      />
    </div>
  );

  return (
    <div className={`min-h-screen bg-background text-foreground ${highContrast ? "high-contrast" : ""}`} style={{ fontSize: `${fontSize}px` }}>
      {topbar}
      <ProfileDemo onRegister={() => setView("register")} />
    </div>
  );
}
