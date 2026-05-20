import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { EMPTY_FORM, FormData } from "./ProfileRegisterForm";
import MemberPhotoUpload from "./MemberPhotoUpload";

interface Props {
  successId: number | null;
  onAddAnother: () => void;
}

export default function ProfileSuccess({ successId, onAddAnother }: Props) {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto px-4 pt-24 pb-16 text-center">
      <div className="w-20 h-20 bg-khaki/10 border-2 border-khaki/20 flex items-center justify-center mx-auto mb-6 text-4xl">
        🎖
      </div>
      <h1 className="font-display font-black text-3xl mb-3">Заявка принята!</h1>
      <div className="divider-gold max-w-xs mx-auto mb-5" />
      {successId && (
        <p className="font-body text-xs text-muted-foreground mb-2">Номер заявки: #{successId}</p>
      )}
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
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 justify-center px-6 py-3 bg-khaki text-parchment font-body font-bold rounded-sm hover:bg-khaki-light transition-colors"
        >
          <Icon name="Home" size={15} />
          На главную
        </button>
        <button
          onClick={onAddAnother}
          className="flex items-center gap-2 justify-center px-6 py-3 border-2 border-khaki/40 text-khaki font-body font-bold rounded-sm hover:bg-khaki hover:text-parchment transition-colors"
        >
          Добавить ещё профиль
        </button>
      </div>

      {successId && (
        <div className="mt-10 border-t border-border pt-8">
          <MemberPhotoUpload memberId={successId} />
        </div>
      )}
    </div>
  );
}

export type { FormData };
export { EMPTY_FORM };