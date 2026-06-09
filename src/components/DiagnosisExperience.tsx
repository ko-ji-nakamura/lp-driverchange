"use client";

import { FormEvent, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import { config } from "@/config/lp";

type QuestionId = "workStyle" | "license" | "area" | "timing" | "priority";

type AnswerOption = {
  label: string;
  icon: string;
};

type Question = {
  id: QuestionId;
  title: string;
  helper: string;
  options: AnswerOption[];
};

type Answers = Partial<Record<QuestionId, string>>;

const questions: Question[] = [
  {
    id: "workStyle",
    title: "希望する働き方を選んでください",
    helper: "今の希望に一番近いものを選んでください。",
    options: [
      { label: "正社員", icon: "🏢" },
      { label: "アルバイト", icon: "🕒" },
      { label: "業務委託", icon: "🚚" },
      { label: "まだ決まっていない", icon: "💬" },
    ],
  },
  {
    id: "license",
    title: "お持ちの免許を選んでください",
    helper: "該当する免許が複数ある場合は、上位のものを選んでください。",
    options: [
      { label: "普通免許", icon: "🚗" },
      { label: "準中型免許", icon: "🚙" },
      { label: "中型免許", icon: "🚛" },
      { label: "大型免許", icon: "🚚" },
      { label: "二種免許", icon: "🚕" },
      { label: "免許なし", icon: "🔰" },
    ],
  },
  {
    id: "area",
    title: "希望する勤務地を選んでください",
    helper: "通いやすいエリアを中心に確認します。",
    options: [
      { label: "千葉県内", icon: "📍" },
      { label: "東京都内", icon: "🗼" },
      { label: "埼玉県内", icon: "🌿" },
      { label: "茨城県内", icon: "🛣️" },
      { label: "その他", icon: "🧭" },
    ],
  },
  {
    id: "timing",
    title: "転職希望時期を選んでください",
    helper: "未定でも大丈夫です。状況に合わせて相談できます。",
    options: [
      { label: "すぐに", icon: "⚡" },
      { label: "1ヶ月以内", icon: "📅" },
      { label: "3ヶ月以内", icon: "🗓️" },
      { label: "まだ決まっていない", icon: "☁️" },
    ],
  },
  {
    id: "priority",
    title: "転職で重視したいことを選んでください",
    helper: "求人確認時に優先したい条件を教えてください。",
    options: [
      { label: "給与を上げたい", icon: "💰" },
      { label: "休みを増やしたい", icon: "🌙" },
      { label: "近場で働きたい", icon: "🏠" },
      { label: "未経験から始めたい", icon: "✨" },
      { label: "条件に合う求人を見たい", icon: "🔎" },
    ],
  },
];

const trustBadges = ["完全無料", "在職中OK", "未経験歓迎求人あり"];

function scrollToElement(target: HTMLElement | null) {
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DiagnosisExperience() {
  const diagnosisRef = useRef<HTMLElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isQuestionStep = currentStep < questions.length;
  const activeQuestion = questions[currentStep];
  const progress = isQuestionStep ? ((currentStep + 1) / questions.length) * 100 : 100;
  const fixedCtaLabel = isQuestionStep
    ? currentStep === 0
      ? config.mainCta
      : "診断に戻る"
    : "診断結果を受け取る";

  function startDiagnosis() {
    scrollToElement(diagnosisRef.current);
  }

  function handleAnswer(question: Question, option: AnswerOption) {
    if (isAdvancing) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [question.id]: option.label,
    }));
    setIsAdvancing(true);

    window.setTimeout(() => {
      setCurrentStep((step) => Math.min(step + 1, questions.length));
      setIsAdvancing(false);
    }, 220);
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
    setPhoneError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = contact.name.trim();
    const normalizedPhone = contact.phone.replace(/[^\d]/g, "");

    if (!trimmedName) {
      return;
    }

    if (!/^0\d{9,10}$/.test(normalizedPhone)) {
      setPhoneError("電話番号は0から始まる10〜11桁で入力してください。");
      return;
    }

    const payload = {
      ...answers,
      name: trimmedName,
      phone: normalizedPhone,
    };

    console.log("ドラチェン診断回答", payload);
    setPhoneError("");
    setIsSubmitted(true);
    window.setTimeout(() => scrollToElement(diagnosisRef.current), 0);
  }

  return (
    <>
      <main className="relative mx-auto min-h-screen max-w-[460px] overflow-hidden bg-blue-950 text-slate-950 shadow-soft">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.45),transparent_42%),linear-gradient(160deg,#061a46_0%,#0a4f93_48%,#11a4d7_100%)]" />
          <div className="absolute left-0 right-0 top-20 h-36 -skew-y-6 bg-white/10" />
          <div className="absolute inset-x-4 top-28 h-32 rounded-lg border border-white/15 bg-white/5" />
          <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.48)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-10 left-0 h-36 w-full bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.16)_50%,transparent_100%)]" />
        </div>

        <section className="relative px-5 pb-3 pt-5 text-white">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-800 shadow-[0_14px_30px_rgba(2,6,23,0.24)]">
                <Truck className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-black leading-none">{config.serviceName}</p>
                <p className="mt-1 text-xs font-bold text-cyan-100">ドライバー転職サポート</p>
              </div>
            </div>
            <span className="rounded-lg bg-white/15 px-3 py-2 text-xs font-black text-white ring-1 ring-white/25">
              30秒診断
            </span>
          </header>

          <div className="mt-6">
            <p className="inline-flex items-center gap-1 rounded-lg bg-yellow-300 px-3 py-1 text-xs font-black text-blue-950 shadow-[0_10px_22px_rgba(250,204,21,0.28)]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              希望条件をすぐチェック
            </p>
            <h1 className="mt-3 text-[2.25rem] font-black leading-[1.08]">
              ドライバー転職なら
              <br />
              ドラチェン
            </h1>
            <p className="mt-3 text-base font-bold leading-7 text-cyan-50">{config.subCta}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-lg bg-white px-2 py-2.5 text-center text-[12px] font-black leading-5 text-blue-900 shadow-[0_12px_28px_rgba(2,6,23,0.18)]"
              >
                <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-500" aria-hidden="true" />
                {badge}
              </div>
            ))}
          </div>
        </section>

        <section ref={diagnosisRef} id="diagnosis" className="relative px-4 pb-8 pt-2">
          <div className="mb-3 rounded-lg border border-white/20 bg-white/12 p-3 text-white shadow-[0_14px_32px_rgba(2,6,23,0.2)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-yellow-200" aria-hidden="true" />
                <p className="text-sm font-black">5問で条件チェック</p>
              </div>
              <p className="text-xs font-bold text-cyan-100">完全無料</p>
            </div>
          </div>

          {isSubmitted ? (
            <ThanksCard />
          ) : isQuestionStep ? (
            <QuestionCard
              key={activeQuestion.id}
              question={activeQuestion}
              questionNumber={currentStep + 1}
              totalQuestions={questions.length}
              progress={progress}
              selectedAnswer={answers[activeQuestion.id]}
              isAdvancing={isAdvancing}
              canGoBack={currentStep > 0}
              onBack={handleBack}
              onAnswer={handleAnswer}
            />
          ) : (
            <ContactCard
              progress={progress}
              contact={contact}
              phoneError={phoneError}
              onBack={handleBack}
              onChange={setContact}
              onPhoneChange={() => setPhoneError("")}
              onSubmit={handleSubmit}
            />
          )}
        </section>

        <CompactFooter />
      </main>

      {!isSubmitted ? (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-[460px] rounded-lg bg-white/95 p-2 shadow-[0_-16px_36px_rgba(15,23,42,0.2)] backdrop-blur">
            <button
              type="button"
              onClick={startDiagnosis}
              className="cta-float inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 px-5 text-base font-black text-blue-950 shadow-[0_12px_30px_rgba(249,115,22,0.32)] active:translate-y-0.5"
            >
              {fixedCtaLabel}
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  progress,
  selectedAnswer,
  isAdvancing,
  canGoBack,
  onBack,
  onAnswer,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  selectedAnswer?: string;
  isAdvancing: boolean;
  canGoBack: boolean;
  onBack: () => void;
  onAnswer: (question: Question, option: AnswerOption) => void;
}) {
  return (
    <article className="card-in rounded-lg bg-white p-5 shadow-[0_22px_50px_rgba(2,6,23,0.26)]">
      <CardHeader
        label={`Q${questionNumber}`}
        count={`${questionNumber}/${totalQuestions}`}
        progress={progress}
      />
      <h2 className="mt-5 text-[1.55rem] font-black leading-snug text-slate-950">
        {question.title}
      </h2>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{question.helper}</p>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.label;

          return (
            <button
              key={option.label}
              type="button"
              disabled={isAdvancing}
              onClick={() => onAnswer(question, option)}
              className={[
                "group flex min-h-[60px] w-full items-center gap-3 rounded-lg border px-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition active:translate-y-0.5 disabled:cursor-wait",
                isSelected
                  ? "border-orange-300 bg-amber-50 text-blue-950"
                  : "border-slate-100 bg-gradient-to-r from-white to-sky-50 text-slate-900 hover:border-blue-200",
              ].join(" ")}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-lg text-white shadow-[0_10px_18px_rgba(29,78,216,0.22)]">
                {option.icon}
              </span>
              <span className="flex-1 text-base font-black">{option.label}</span>
              <ChevronRight
                className="h-5 w-5 text-blue-700 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <BackButton canGoBack={canGoBack} onBack={onBack} />
    </article>
  );
}

function ContactCard({
  progress,
  contact,
  phoneError,
  onBack,
  onChange,
  onPhoneChange,
  onSubmit,
}: {
  progress: number;
  contact: { name: string; phone: string };
  phoneError: string;
  onBack: () => void;
  onChange: (contact: { name: string; phone: string }) => void;
  onPhoneChange: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <article className="card-in rounded-lg bg-white p-5 shadow-[0_22px_50px_rgba(2,6,23,0.26)]">
      <CardHeader label="LAST" count="入力" progress={progress} />
      <div className="mt-5 flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white">
          <PhoneCall className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[1.45rem] font-black leading-snug text-slate-950">
            診断結果を受け取るために、あと少しだけ入力してください
          </h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            かんたん30秒で完了。完全無料・在職中でもOKです。
          </p>
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-black text-slate-800">お名前</span>
          <input
            required
            value={contact.name}
            onChange={(event) => onChange({ ...contact, name: event.target.value })}
            autoComplete="name"
            placeholder="例：山田 太郎"
            className="min-h-[56px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-black text-slate-800">電話番号</span>
          <input
            required
            value={contact.phone}
            onChange={(event) => {
              onPhoneChange();
              onChange({ ...contact, phone: event.target.value });
            }}
            inputMode="tel"
            autoComplete="tel"
            placeholder="例：09012345678"
            aria-describedby={phoneError ? "phone-error" : undefined}
            className="min-h-[56px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-base font-bold outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
          {phoneError ? (
            <span id="phone-error" className="block text-sm font-bold text-red-600">
              {phoneError}
            </span>
          ) : null}
        </label>

        <div className="rounded-lg bg-blue-50 p-3 text-xs font-bold leading-6 text-slate-600">
          入力情報は求人紹介・条件確認・連絡対応の目的で利用します。
          <a href="#terms" className="text-blue-800 underline underline-offset-2">
            利用規約
          </a>
          ・
          <a href="#privacy" className="text-blue-800 underline underline-offset-2">
            プライバシーポリシー
          </a>
          に同意のうえ送信してください。
        </div>

        <button
          type="submit"
          className="inline-flex min-h-[58px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 px-5 text-base font-black text-blue-950 shadow-[0_14px_30px_rgba(249,115,22,0.34)] transition active:translate-y-0.5"
        >
          診断結果を受け取る
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>

      <BackButton canGoBack onBack={onBack} />
    </article>
  );
}

function ThanksCard() {
  return (
    <article className="card-in rounded-lg bg-white p-6 text-center shadow-[0_22px_50px_rgba(2,6,23,0.26)]">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-[0_14px_28px_rgba(37,99,235,0.3)]">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </span>
      <p className="mt-5 text-2xl font-black text-blue-950">送信ありがとうございました</p>
      <p className="mt-3 text-base font-bold leading-8 text-slate-600">
        担当者よりご連絡いたします。入力いただいた条件をもとに、希望に近い求人をご案内します。
      </p>
      <div className="mt-5 rounded-lg bg-blue-50 p-3 text-sm font-black text-blue-800">
        完全無料・在職中でも相談OK
      </div>
    </article>
  );
}

function CardHeader({ label, count, progress }: { label: string; count: string; progress: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-lg bg-blue-700 px-3 py-1 text-xs font-black text-white">
          {label}
        </span>
        <span className="text-xs font-black text-slate-500">{count}</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-lg bg-slate-100">
        <div
          className="h-full rounded-lg bg-gradient-to-r from-orange-500 via-yellow-300 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function BackButton({ canGoBack, onBack }: { canGoBack: boolean; onBack: () => void }) {
  return canGoBack ? (
    <button
      type="button"
      onClick={onBack}
      className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 shadow-sm transition active:translate-y-0.5"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      戻る
    </button>
  ) : (
    <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-400">
      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
      回答内容はあとから確認できます
    </div>
  );
}

function CompactFooter() {
  return (
    <footer className="relative space-y-4 bg-slate-950 px-5 pb-28 pt-6 text-xs leading-6 text-slate-400">
      <div className="flex items-center gap-2 text-white">
        <UserRound className="h-4 w-4" aria-hidden="true" />
        <p className="font-black">{config.operatorName}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 font-bold text-slate-200">
        <a id="terms" href="#terms" className="rounded-lg bg-white/5 px-3 py-2">
          利用規約
        </a>
        <a id="privacy" href="#privacy" className="rounded-lg bg-white/5 px-3 py-2">
          プライバシーポリシー
        </a>
        <a href={`mailto:${config.contactEmail}`} className="rounded-lg bg-white/5 px-3 py-2">
          お問い合わせ
        </a>
        <span className="rounded-lg bg-white/5 px-3 py-2">運営会社</span>
      </div>
      <div className="space-y-1">
        <p>運営会社：{config.companyName}</p>
        <p>{config.licenseNumber}</p>
        <p>所在地：{config.address}</p>
      </div>
      <p className="text-center text-slate-500">© {config.serviceName}</p>
    </footer>
  );
}
