"use client";

import { FormEvent, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Headphones,
  LockKeyhole,
  PhoneCall,
  ShieldCheck,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";
import { config } from "@/config/lp";

type QuestionId = "workStyle" | "license" | "area" | "timing" | "priority";

type AnswerOption = {
  label: string;
  icon: string;
};

type Question = {
  id: QuestionId;
  q: string;
  title: string;
  lead: string;
  options: AnswerOption[];
};

type Answers = Partial<Record<QuestionId, string>>;

const questions: Question[] = [
  {
    id: "workStyle",
    q: "Q1",
    title: "現在の働き方について、最も近いものはどれですか？",
    lead: "あなたの状況に近いものを1つ選んでください",
    options: [
      { label: "正社員として安定して働いている", icon: "🏢" },
      { label: "契約社員・派遣などで働いている", icon: "🗓️" },
      { label: "現在、ドライバーとして働いている", icon: "🚚" },
      { label: "現在は働いていない／転職を考えている", icon: "🔍" },
    ],
  },
  {
    id: "license",
    q: "Q2",
    title: "お持ちの免許を選んでください",
    lead: "該当する免許が複数ある場合は、上位のものを選んでください",
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
    q: "Q3",
    title: "希望する勤務地を選んでください",
    lead: "通いやすいエリアを中心に求人を確認します",
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
    q: "Q4",
    title: "転職希望時期を選んでください",
    lead: "未定でも大丈夫です。状況に合わせて相談できます",
    options: [
      { label: "すぐに", icon: "⚡" },
      { label: "1ヶ月以内", icon: "📅" },
      { label: "3ヶ月以内", icon: "🗓️" },
      { label: "まだ決まっていない", icon: "☁️" },
    ],
  },
  {
    id: "priority",
    q: "Q5",
    title: "転職で重視したいことを選んでください",
    lead: "求人確認時に優先したい条件を教えてください",
    options: [
      { label: "給与を上げたい", icon: "💰" },
      { label: "休みを増やしたい", icon: "🌙" },
      { label: "近場で働きたい", icon: "🏠" },
      { label: "未経験から始めたい", icon: "✨" },
      { label: "条件に合う求人を見たい", icon: "🔎" },
    ],
  },
];

const heroBadges = [
  { title: "未経験OK", text: "安心サポート", icon: BriefcaseBusiness },
  { title: "高収入求人", text: "多数ご紹介", icon: Wallet },
  { title: "日勤・土日休みなど", text: "働きやすさ重視", icon: CalendarDays },
];

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

  const questionIndex = currentStep - 1;
  const activeQuestion = questions[questionIndex];
  const isQuestionStep = currentStep >= 1 && currentStep <= questions.length;
  const isContactStep = currentStep === questions.length + 1;
  const isThanksStep = currentStep === questions.length + 2;

  function startDiagnosis() {
    setCurrentStep(1);
    window.setTimeout(() => scrollToElement(diagnosisRef.current), 0);
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
      setCurrentStep((step) => (step >= questions.length ? questions.length + 1 : step + 1));
      setIsAdvancing(false);
    }, 220);
  }

  function handleBack() {
    setPhoneError("");
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.setTimeout(() => scrollToElement(stepTarget()), 0);
  }

  function stepTarget() {
    return currentStep <= 1 ? null : diagnosisRef.current;
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
    setCurrentStep(questions.length + 2);
    window.setTimeout(() => scrollToElement(diagnosisRef.current), 0);
  }

  return (
    <main className="relative mx-auto min-h-screen max-w-[430px] overflow-hidden bg-blue-950 text-slate-950 shadow-soft">
      <BackgroundDecor />

      {currentStep === 0 ? <HeroScreen onStart={startDiagnosis} /> : null}

      {currentStep > 0 ? (
        <section ref={diagnosisRef} id="diagnosis" className="relative px-5 pb-8 pt-7">
          {!isThanksStep ? <ScreenHeader currentStep={Math.min(currentStep, questions.length)} /> : null}

          {isQuestionStep ? (
            <QuestionScreen
              key={activeQuestion.id}
              question={activeQuestion}
              step={currentStep}
              answers={answers}
              isAdvancing={isAdvancing}
              onAnswer={handleAnswer}
              onBack={handleBack}
            />
          ) : null}

          {isContactStep ? (
            <ContactScreen
              contact={contact}
              phoneError={phoneError}
              onBack={handleBack}
              onChange={setContact}
              onPhoneChange={() => setPhoneError("")}
              onSubmit={handleSubmit}
            />
          ) : null}

          {isThanksStep ? <ThanksScreen /> : null}
        </section>
      ) : null}

      <CompactFooter />
    </main>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_8%,rgba(125,211,252,0.48),transparent_36%),linear-gradient(150deg,#031a52_0%,#063f99_45%,#0b9be8_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.42)_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="absolute right-[-120px] top-16 h-20 w-[520px] rotate-[-44deg] bg-cyan-300/20 blur-sm" />
      <div className="absolute right-[-90px] top-0 h-10 w-[420px] rotate-[-44deg] bg-white/20 blur-sm" />
      <div className="absolute bottom-64 left-[-120px] h-16 w-[460px] rotate-[-28deg] bg-cyan-300/14" />
      <div className="absolute left-5 top-36 text-xl text-white/90">✦</div>
      <div className="absolute right-8 top-28 text-lg text-yellow-300">◆</div>
      <div className="absolute right-12 top-64 text-2xl text-white">✦</div>
      <div className="absolute left-8 top-72 text-sm text-yellow-200">◆</div>
    </div>
  );
}

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-white">
      <span
        className={[
          "flex shrink-0 items-center justify-center rounded-md border-2 border-white text-white",
          compact ? "h-9 w-10" : "h-11 w-12",
        ].join(" ")}
      >
        <Truck className={compact ? "h-6 w-6" : "h-7 w-7"} aria-hidden="true" />
      </span>
      <div>
        <p className={compact ? "text-2xl font-black leading-none" : "text-4xl font-black leading-none"}>
          {config.serviceName}
        </p>
        <p className="mt-1 text-xs font-black text-white">ドライバー転職チェンジ</p>
      </div>
    </div>
  );
}

function FreeBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-lg border border-yellow-300 bg-gradient-to-br from-white via-amber-50 to-yellow-100 text-blue-950 shadow-[0_14px_24px_rgba(2,6,23,0.24)]",
        compact ? "px-3 py-2" : "px-4 py-3",
      ].join(" ")}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-200" />
      <div className="flex items-center gap-2">
        <ShieldCheck className={compact ? "h-5 w-5 text-blue-700" : "h-6 w-6 text-blue-700"} aria-hidden="true" />
        <div>
          <p className={compact ? "text-lg font-black leading-none" : "text-2xl font-black leading-none"}>完全無料</p>
          <p className="mt-1 text-sm font-black text-orange-500">1分で完了！</p>
        </div>
      </div>
    </div>
  );
}

function HeroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative max-h-[844px] overflow-hidden bg-[linear-gradient(180deg,#063B8E_0%,#0EA5E9_100%)] px-4 pb-5 pt-6 text-white">
      <HeroDecorations />

      <div className="relative z-10">
        <LogoMark />
      </div>

      <div className="relative z-10 mt-5">
        <div className="relative inline-flex -rotate-3 rounded-[18px] bg-white px-4 py-2 text-blue-950 shadow-[0_12px_22px_rgba(2,6,23,0.24)]">
          <span className="absolute -bottom-2 left-12 h-4 w-4 rotate-45 bg-white" />
          <span className="relative text-[18px] font-black">
            <span className="text-[32px] leading-none text-[#FF8A00]">5</span>?????????
          </span>
        </div>

        <h1 className="mt-5 text-[32px] font-black leading-[1.2] drop-shadow-[0_4px_0_rgba(2,24,87,0.45)]">
          ?????????
          <br />
          <span className="text-[32px] leading-[1.2] text-yellow-300">?????</span>
          <br />
          <span className="text-[32px] leading-[1.2]">????</span>
        </h1>

        <p className="mt-3 max-w-[210px] text-[15px] font-black leading-[1.6]">
          ???OK??????????????
          <span className="text-yellow-300">????????</span>????????
        </p>
      </div>

      <HeroIllustration />

      <div className="relative z-20 mt-1 grid grid-cols-3 gap-2">
        {heroBadges.map(({ title, text, icon: Icon }) => (
          <div
            key={title}
            className="flex aspect-square flex-col items-center justify-center rounded-full border-[3px] border-yellow-300 bg-gradient-to-b from-white to-yellow-50 px-2 text-center text-blue-950 shadow-[0_12px_22px_rgba(2,6,23,0.24)]"
          >
            <Icon className="h-7 w-7 text-blue-700" aria-hidden="true" />
            <p className="mt-1 text-[13px] font-black leading-[1.25]">{title}</p>
            <p className="mt-0.5 text-[10px] font-black leading-[1.25] text-blue-800">{text}</p>
          </div>
        ))}
      </div>

      <div className="relative z-20 mt-3 rounded-[28px] bg-white px-4 py-5 text-center shadow-[0_18px_40px_rgba(2,6,23,0.26)]">
        <p className="text-[24px] font-black leading-[1.2] text-blue-950">
          ? ????<span className="text-[34px] text-[#FF8A00]">1?</span>???? ?
        </p>
        <button
          type="button"
          onClick={onStart}
          className="cta-float mt-4 inline-flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#FF8A00_0%,#FFD84D_100%)] px-5 text-[24px] font-black text-white shadow-[0_12px_26px_rgba(255,138,0,0.42),inset_0_2px_0_rgba(255,255,255,0.45)] ring-4 ring-white transition active:translate-y-0.5"
        >
          ?????????
          <ChevronRight className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>

      <p className="relative z-20 mt-3 text-center text-[13px] font-bold leading-[1.6] text-white">
        ?????????????????????????
      </p>
    </section>
  );
}

function HeroDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[-90px] top-[-24px] h-24 w-[360px] rotate-[-46deg] bg-white/18 blur-sm" />
      <div className="absolute right-[-80px] top-14 h-10 w-[300px] rotate-[-46deg] bg-cyan-200/28" />
      <div className="absolute right-2 top-20 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
      <div className="absolute right-0 top-16 h-56 w-36 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.72)_1.5px,transparent_1.5px)] [background-size:10px_10px]" />
      <div className="absolute left-[-60px] bottom-32 h-24 w-[270px] rotate-[-20deg] rounded-full bg-blue-950/25" />
      <div className="absolute left-5 top-28 text-xl text-white">?</div>
      <div className="absolute right-8 top-28 text-base text-yellow-300">?</div>
      <div className="absolute right-11 top-52 text-2xl text-white">?</div>
      <div className="absolute left-8 top-64 text-sm text-yellow-200">?</div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative z-10 -mt-16 h-[204px]">
      <div className="absolute bottom-0 left-[-18px] right-[-18px] h-20 rounded-t-[100%] bg-blue-900/35" />
      <div className="absolute bottom-10 left-8 h-[82px] w-[198px] rounded-lg bg-gradient-to-b from-white to-slate-200 shadow-[0_18px_35px_rgba(2,6,23,0.26)]">
        <div className="absolute -right-10 bottom-0 h-[82px] w-[62px] rounded-r-lg bg-gradient-to-br from-slate-100 to-slate-300" />
        <div className="absolute left-5 top-7 h-9 w-16 rounded bg-cyan-100" />
        <div className="absolute right-5 top-7 h-10 w-16 rounded bg-cyan-100" />
        <div className="absolute bottom-[-12px] left-8 h-8 w-8 rounded-full border-4 border-slate-800 bg-slate-500" />
        <div className="absolute bottom-[-12px] right-10 h-8 w-8 rounded-full border-4 border-slate-800 bg-slate-500" />
      </div>
      <div className="absolute bottom-6 right-0 h-[150px] w-[112px]">
        <div className="absolute left-8 top-0 h-16 w-16 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 shadow-lg" />
        <div className="absolute left-5 top-14 h-24 w-[88px] rounded-t-[2rem] bg-gradient-to-b from-blue-700 to-blue-950 shadow-[0_18px_32px_rgba(2,6,23,0.32)]" />
        <div className="absolute left-0 top-[92px] h-8 w-[88px] -rotate-12 rounded-full bg-blue-900" />
        <div className="absolute right-[-6px] top-[92px] h-8 w-[88px] rotate-12 rounded-full bg-blue-900" />
        <div className="absolute left-12 top-7 h-2 w-2 rounded-full bg-slate-900" />
        <div className="absolute left-[78px] top-7 h-2 w-2 rounded-full bg-slate-900" />
      </div>
    </div>
  );
}

function ScreenHeader({ currentStep }: { currentStep: number }) {
  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <LogoMark compact />
      <FreeBadge compact />
      <span className="sr-only">{currentStep}/5問</span>
    </header>
  );
}

function StepRail({ step }: { step: number }) {
  return (
    <div className="relative mt-5">
      <div className="absolute left-7 right-7 top-5 h-2 rounded-full bg-slate-200" />
      <div
        className="absolute left-7 top-5 h-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 transition-all duration-300"
        style={{ width: `${Math.max(0, ((step - 1) / 4) * 100)}%` }}
      />
      <div className="relative z-10 flex justify-between">
        {questions.map((question, index) => {
          const number = index + 1;
          const active = number === step;
          const done = number < step;

          return (
            <span
              key={question.id}
              className={[
                "flex h-11 w-11 items-center justify-center rounded-full text-lg font-black shadow-sm",
                active
                  ? "bg-orange-500 text-white"
                  : done
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-400",
              ].join(" ")}
            >
              {number}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function QuestionScreen({
  question,
  step,
  answers,
  isAdvancing,
  onAnswer,
  onBack,
}: {
  question: Question;
  step: number;
  answers: Answers;
  isAdvancing: boolean;
  onAnswer: (question: Question, option: AnswerOption) => void;
  onBack: () => void;
}) {
  const selectedAnswer = answers[question.id];

  return (
    <div className="card-in">
      <section className="overflow-hidden rounded-lg bg-white shadow-[0_22px_50px_rgba(2,6,23,0.3)]">
        <div className="px-5 pb-5 pt-5">
          <div className="flex items-center justify-center gap-3 text-blue-800">
            <span className="h-px w-7 bg-blue-700" />
            <p className="text-2xl font-black">診断中</p>
            <span className="h-px w-7 bg-blue-700" />
            <span className="ml-auto rounded-full bg-blue-800 px-5 py-2 text-lg font-black text-white">
              {step}/5問
            </span>
          </div>
          <StepRail step={step} />
        </div>

        <div className="border-t border-slate-100 px-5 pb-5 pt-6">
          <div className="text-center">
            <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-xl font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)]">
              {question.q}
              <span className="absolute -right-3 -top-2 text-yellow-300">〟</span>
            </span>
            <h2 className="mt-5 text-[1.75rem] font-black leading-[1.4] text-blue-950">
              {highlightTitle(question.title)}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2 text-blue-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-black">{question.lead}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {question.options.map((option) => (
              <button
                key={option.label}
                type="button"
                disabled={isAdvancing}
                onClick={() => onAnswer(question, option)}
                className={[
                  "group flex min-h-[76px] w-full items-center gap-4 rounded-lg border px-4 text-left shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition active:translate-y-0.5 disabled:cursor-wait",
                  selectedAnswer === option.label
                    ? "border-orange-300 bg-amber-50"
                    : "border-slate-100 bg-white hover:border-blue-200",
                ].join(" ")}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-4xl">
                  {option.icon}
                </span>
                <span className="flex-1 text-xl font-black leading-8 text-blue-950">{option.label}</span>
                <ChevronRight className="h-8 w-8 shrink-0 text-blue-700 transition group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700 text-yellow-300">
                <ShieldCheck className="h-8 w-8" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-lg font-black text-blue-900">すべての回答は非公開です</p>
                <p className="text-sm font-bold text-blue-800">安心してご回答ください</p>
              </div>
              <LockKeyhole className="h-8 w-8 text-slate-300" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-[86px_1fr] gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[70px] flex-col items-center justify-center rounded-full bg-white text-blue-800 shadow-[0_14px_24px_rgba(2,6,23,0.2)]"
        >
          <ArrowLeft className="h-6 w-6" aria-hidden="true" />
          <span className="mt-1 text-sm font-black">戻る</span>
        </button>
        <div className="flex min-h-[70px] items-center justify-center rounded-full bg-gradient-to-b from-white to-slate-200 px-5 text-lg font-black text-slate-400 shadow-inner">
          選択してください
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-bold text-white">
        選択すると自動で次の質問に進みます
      </p>
    </div>
  );
}

function highlightTitle(title: string) {
  if (title.includes("最も近いもの")) {
    return (
      <>
        現在の働き方について、
        <br />
        <span className="text-orange-500">最も近いもの</span>はどれですか？
      </>
    );
  }

  return title;
}

function ContactScreen({
  contact,
  phoneError,
  onBack,
  onChange,
  onPhoneChange,
  onSubmit,
}: {
  contact: { name: string; phone: string };
  phoneError: string;
  onBack: () => void;
  onChange: (contact: { name: string; phone: string }) => void;
  onPhoneChange: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="card-in">
      <section className="overflow-hidden rounded-lg bg-white shadow-[0_22px_50px_rgba(2,6,23,0.3)]">
        <div className="px-5 pb-5 pt-5">
          <div className="flex items-center justify-center gap-3 text-blue-800">
            <span className="h-px w-7 bg-blue-700" />
            <p className="text-2xl font-black">診断中</p>
            <span className="h-px w-7 bg-blue-700" />
            <span className="ml-auto rounded-full bg-blue-800 px-5 py-2 text-lg font-black text-white">
              5/5問
            </span>
          </div>
          <StepRail step={5} />
        </div>

        <form className="border-t border-slate-100 px-5 pb-6 pt-7" onSubmit={onSubmit}>
          <div className="text-center">
            <p className="text-3xl font-black leading-snug text-blue-950">あと少しで診断完了です！</p>
            <p className="mt-3 text-lg font-black leading-8 text-blue-950">
              あなたにピッタリの求人をお届けするために
              <br />
              <span className="text-orange-500">お名前とお電話番号</span>をご入力ください
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xl font-black text-blue-950">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                お名前
                <span className="rounded-md bg-red-500 px-2 py-1 text-sm text-white">必須</span>
              </span>
              <input
                required
                value={contact.name}
                onChange={(event) => onChange({ ...contact, name: event.target.value })}
                autoComplete="name"
                placeholder="例）山田 太郎"
                className="min-h-[68px] w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-xl font-bold outline-none transition placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xl font-black text-blue-950">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white">
                  <PhoneCall className="h-5 w-5" aria-hidden="true" />
                </span>
                電話番号
                <span className="rounded-md bg-red-500 px-2 py-1 text-sm text-white">必須</span>
              </span>
              <input
                required
                value={contact.phone}
                onChange={(event) => {
                  onPhoneChange();
                  onChange({ ...contact, phone: event.target.value });
                }}
                inputMode="tel"
                autoComplete="tel"
                placeholder="例）090-1234-5678"
                aria-describedby={phoneError ? "phone-error" : undefined}
                className="min-h-[68px] w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-xl font-bold outline-none transition placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
              {phoneError ? (
                <span id="phone-error" className="mt-2 block text-sm font-bold text-red-600">
                  {phoneError}
                </span>
              ) : null}
            </label>
          </div>

          <div className="mt-5 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 shrink-0 text-blue-700" aria-hidden="true" />
              <p className="text-sm font-black leading-6 text-blue-950">
                ご入力いただいた電話番号へ、求人のご案内や条件に合う情報をお届けします
                （無理な営業は一切いたしません）
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-1 h-7 w-7 shrink-0 text-blue-700" aria-hidden="true" />
              <p className="text-sm font-bold leading-6 text-blue-950">
                ご入力いただいた個人情報は、プライバシーポリシーに基づき厳重に管理いたします。
                <a href="#privacy" className="text-blue-700 underline underline-offset-2">
                  プライバシーポリシー
                </a>
                に同意の上、ご利用ください。
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex min-h-[76px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 px-5 text-2xl font-black text-white shadow-[0_14px_28px_rgba(249,115,22,0.46),inset_0_2px_0_rgba(255,255,255,0.5)] ring-4 ring-white transition active:translate-y-0.5"
          >
            無料で求人を受け取る
            <ChevronRight className="h-8 w-8" aria-hidden="true" />
          </button>

          <p className="mt-4 text-center text-lg font-black text-blue-950">
            <CheckCircle2 className="mr-2 inline h-6 w-6 text-blue-700" aria-hidden="true" />
            たった<span className="text-3xl text-orange-500">1</span>分で完了！ 完全無料です
          </p>
        </form>
      </section>

      <div className="mt-6 text-center text-white">
        <p className="text-2xl font-black">＼ 安心してご利用いただけます ／</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <TrustTile icon={<ShieldCheck className="h-9 w-9" />} title="完全無料" text="費用は一切かかりません" />
          <TrustTile icon={<Headphones className="h-9 w-9" />} title="サポート充実" text="専任アドバイザーが対応" />
          <TrustTile icon={<LockKeyhole className="h-9 w-9" />} title="情報は厳守" text="第三者に開示しません" />
        </div>
        <p className="mt-5 text-sm font-bold leading-6">
          ご登録後、担当者よりお電話またはSMSにてご連絡いたします。
          <br />
          ご都合が合わない場合はいつでも停止できます。
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-blue-800 shadow-[0_12px_24px_rgba(2,6,23,0.2)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        戻る
      </button>
    </div>
  );
}

function TrustTile({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg bg-white p-3 text-center text-blue-950 shadow-[0_12px_24px_rgba(2,6,23,0.22)]">
      <div className="mx-auto flex h-11 w-11 items-center justify-center text-blue-700">{icon}</div>
      <p className="mt-2 text-base font-black">{title}</p>
      <p className="mt-1 text-[11px] font-bold leading-4">{text}</p>
    </div>
  );
}

function ThanksScreen() {
  return (
    <section className="card-in overflow-hidden rounded-[2.3rem] bg-white text-center shadow-[0_22px_50px_rgba(2,6,23,0.3)]">
      <div className="relative px-6 pb-6 pt-8">
        <div className="absolute left-0 right-0 top-0 h-20 rounded-b-[100%] bg-blue-50" />
        <div className="relative">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-700 shadow-[0_14px_26px_rgba(37,99,235,0.2)] ring-8 ring-blue-50">
            <Check className="h-12 w-12" aria-hidden="true" />
          </span>
          <p className="mt-6 text-2xl font-black text-blue-950">ご登録ありがとうございます！</p>
          <h2 className="mt-2 text-4xl font-black text-blue-950">
            <span className="text-orange-500">受付が完了</span>しました
          </h2>
          <div className="mx-auto mt-5 h-1 w-full max-w-xs rounded-full bg-[repeating-linear-gradient(90deg,#60a5fa_0_5px,transparent_5px_12px)]" />
          <p className="mt-5 text-lg font-black leading-8 text-blue-950">
            ご入力いただいた内容をもとに、
            <br />
            あなたにピッタリの求人をご提案いたします。
          </p>
          <p className="mt-2 text-base font-black leading-7 text-blue-950">
            担当者より、<span className="text-orange-500">お電話またはSMS</span>にてご連絡いたします。
          </p>
        </div>

        <div className="mt-7 rounded-lg bg-blue-50 p-4 text-left shadow-inner">
          <div className="grid grid-cols-[76px_1fr] items-center gap-4">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-200 bg-white text-blue-700">
              <PhoneCall className="h-11 w-11" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-black text-blue-950">ご連絡の目安</p>
              <p className="mt-1 text-2xl font-black text-blue-950">
                最短<span className="text-4xl text-orange-500">30分以内</span>にご連絡します
              </p>
              <p className="mt-1 text-xs font-bold leading-5 text-blue-900">
                営業時間内でのご連絡となります。状況によりお時間をいただく場合がございます。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-lg bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-blue-500" />
            <p className="text-2xl font-black text-blue-950">今後の流れ</p>
            <span className="h-px w-12 bg-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-blue-950">
            <FlowStep number="1" icon={<PhoneCall className="h-8 w-8" />} title="担当者からご連絡" />
            <FlowStep number="2" icon={<ClipboardList className="h-8 w-8" />} title="ご希望のヒアリング" />
            <FlowStep number="3" icon={<Truck className="h-8 w-8" />} title="求人をご提案" />
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 shrink-0 text-blue-700" aria-hidden="true" />
            <p className="text-sm font-black leading-6 text-blue-950">
              ご登録いただいた情報は厳重に管理します。プライバシーポリシーに基づき、第三者に開示することはありません。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-950 px-5 py-5 text-white">
        <p className="text-base font-black">この画面は閉じても問題ありません</p>
      </div>
    </section>
  );
}

function FlowStep({ number, icon, title }: { number: string; icon: ReactNode; title: string }) {
  return (
    <div className="relative rounded-lg bg-white p-3 text-center shadow-sm">
      <span className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-800 text-sm font-black text-white">
        {number}
      </span>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        {icon}
      </div>
      <p className="mt-2 text-sm font-black leading-5">{title}</p>
    </div>
  );
}

function CompactFooter() {
  return (
    <footer className="relative space-y-4 px-5 pb-8 pt-6 text-xs leading-6 text-white/80">
      <div className="flex items-center gap-2 text-white">
        <UserRound className="h-4 w-4" aria-hidden="true" />
        <p className="font-black">{config.operatorName}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 font-bold text-white">
        <a id="terms" href="#terms" className="rounded-lg bg-white/10 px-3 py-2">
          利用規約
        </a>
        <a id="privacy" href="#privacy" className="rounded-lg bg-white/10 px-3 py-2">
          プライバシーポリシー
        </a>
        <a href={`mailto:${config.contactEmail}`} className="rounded-lg bg-white/10 px-3 py-2">
          お問い合わせ
        </a>
        <span className="rounded-lg bg-white/10 px-3 py-2">運営会社</span>
      </div>
      <div className="space-y-1">
        <p>運営会社：{config.companyName}</p>
        <p>{config.licenseNumber}</p>
        <p>所在地：{config.address}</p>
      </div>
      <p className="text-center text-white/60">© {config.serviceName}</p>
    </footer>
  );
}
