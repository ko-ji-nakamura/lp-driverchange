"use client";

import Image from "next/image";
import { useState } from "react";

type Step = "fv" | "page2" | "page3" | "page4" | "page5" | "thanks";

type Answers = {
  timing?: string;
  licenses: string[];
  workStyle: string[];
  driverExperience?: string;
  expectedIncome?: string;
  postalCode?: string;
  name?: string;
  birthYear?: string;
  phone?: string;
  jobStatus?: string;
};

type SingleAnswerKey = "timing" | "driverExperience" | "expectedIncome" | "jobStatus";
type MultiAnswerKey = "licenses" | "workStyle";
type TextAnswerKey = "postalCode" | "name" | "birthYear" | "phone";

type ScreenImage = {
  src: string;
  width: number;
  height: number;
};

const screenImages: Record<Step, ScreenImage> = {
  fv: { src: "/images/fv.png", width: 941, height: 1672 },
  page2: { src: "/images/page2.png", width: 420, height: 640 },
  page3: { src: "/images/page3.png", width: 425, height: 640 },
  page4: { src: "/images/page4.png", width: 420, height: 555 },
  page5: { src: "/images/page5.png", width: 425, height: 555 },
  thanks: { src: "/images/thanks.png", width: 941, height: 1672 },
};

const previousStep: Partial<Record<Step, Step>> = {
  page2: "fv",
  page3: "page2",
  page4: "page3",
  page5: "page4",
};

const timingOptions = [
  { label: "なるべく早く", className: "left-[7.2%] top-[54.7%] h-[5.2%] w-[85.4%]" },
  { label: "1ヶ月以内", className: "left-[7.2%] top-[60.6%] h-[5.2%] w-[85.4%]" },
  { label: "2ヶ月以内", className: "left-[7.2%] top-[66.4%] h-[5.2%] w-[85.4%]" },
  { label: "3ヶ月以内", className: "left-[7.2%] top-[72.2%] h-[5.2%] w-[85.4%]" },
  { label: "よい求人があればいつでも", className: "left-[7.2%] top-[78.1%] h-[5.2%] w-[85.4%]" },
  { label: "今は情報収集をしたい", className: "left-[7.2%] top-[83.9%] h-[5.2%] w-[85.4%]" },
] as const;

const licenseOptions = [
  { label: "普通免許（AT/MT）", className: "left-[6.9%] top-[20.7%] h-[6.1%] w-[88.0%]" },
  { label: "準中型免許", className: "left-[6.9%] top-[26.8%] h-[6.1%] w-[88.0%]" },
  { label: "中型免許", className: "left-[6.9%] top-[32.9%] h-[6.1%] w-[88.0%]" },
  { label: "大型免許", className: "left-[6.9%] top-[39.0%] h-[6.1%] w-[88.0%]" },
  { label: "普通二種免許", className: "left-[6.9%] top-[45.1%] h-[6.1%] w-[88.0%]" },
  { label: "大型二種免許", className: "left-[6.9%] top-[51.2%] h-[6.1%] w-[88.0%]" },
] as const;

const workStyleOptions = [
  { label: "正社員", className: "left-[6.9%] top-[70.2%] h-[4.9%] w-[88.0%]" },
  { label: "アルバイト", className: "left-[6.9%] top-[75.2%] h-[4.9%] w-[88.0%]" },
  { label: "業務委託", className: "left-[6.9%] top-[80.2%] h-[4.9%] w-[88.0%]" },
  { label: "派遣", className: "left-[6.9%] top-[85.2%] h-[4.9%] w-[88.0%]" },
] as const;

const driverExperienceOptions = [
  { label: "あり", className: "left-[5.9%] top-[17.6%] h-[8.4%] w-[87.1%]" },
  { label: "なし", className: "left-[5.9%] top-[27.2%] h-[8.4%] w-[87.1%]" },
] as const;

const expectedIncomeOptions = [
  { label: "300万円", className: "left-[5.9%] top-[48.1%] h-[7.5%] w-[87.1%]" },
  { label: "400万円", className: "left-[5.9%] top-[55.7%] h-[7.5%] w-[87.1%]" },
  { label: "500万円", className: "left-[5.9%] top-[63.2%] h-[7.5%] w-[87.1%]" },
  { label: "600万円以上", className: "left-[5.9%] top-[70.8%] h-[7.5%] w-[87.1%]" },
] as const;

const jobStatusOptions = [
  { label: "離職済み", className: "left-[5.9%] top-[44.3%] h-[7.5%] w-[87.1%]" },
  { label: "退職確定済み", className: "left-[5.9%] top-[51.8%] h-[7.5%] w-[87.1%]" },
  { label: "出来るだけ早く辞めたい", className: "left-[5.9%] top-[59.3%] h-[7.5%] w-[87.1%]" },
  { label: "良い転職先なら検討する", className: "left-[5.9%] top-[66.8%] h-[7.5%] w-[87.1%]" },
  { label: "半年以上は辞められない", className: "left-[5.9%] top-[74.3%] h-[7.5%] w-[87.1%]" },
] as const;

const initialAnswers: Answers = {
  licenses: [],
  workStyle: [],
};

export function DiagnosisExperience() {
  const [step, setStep] = useState<Step>("fv");
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [error, setError] = useState("");

  function goTo(nextStep: Step) {
    setError("");
    setStep(nextStep);

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setSingleAnswer(key: SingleAnswerKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function toggleMultiAnswer(key: MultiAnswerKey, value: string) {
    setAnswers((current) => {
      const values = current[key];
      const nextValues = values.includes(value)
        ? values.filter((selectedValue) => selectedValue !== value)
        : [...values, value];

      return { ...current, [key]: nextValues };
    });
    setError("");
  }

  function setTextAnswer(key: TextAnswerKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function goBack() {
    const backStep = previousStep[step];

    if (backStep) {
      goTo(backStep);
    }
  }

  function nextFromFv() {
    if (!answers.timing) {
      setError("転職時期を1つ選択してください。");
      return;
    }

    goTo("page2");
  }

  function nextFromPage2() {
    if (answers.licenses.length === 0 || answers.workStyle.length === 0) {
      setError("免許と働き方をそれぞれ1つ以上選択してください。");
      return;
    }

    goTo("page3");
  }

  function nextFromPage3() {
    if (!answers.driverExperience || !answers.expectedIncome) {
      setError("ドライバー経験と希望年収を選択してください。");
      return;
    }

    goTo("page4");
  }

  function nextFromPage4() {
    const postalCode = answers.postalCode?.trim();
    const name = answers.name?.trim();
    const birthYear = answers.birthYear?.trim();

    if (!postalCode || !name || !birthYear) {
      setError("郵便番号・お名前・生まれ年を入力してください。");
      return;
    }

    if (!/^\d{4}$/.test(birthYear)) {
      setError("生まれ年は西暦4桁で入力してください。");
      return;
    }

    setAnswers((current) => ({
      ...current,
      postalCode,
      name,
      birthYear,
    }));
    goTo("page5");
  }

  function submitForm() {
    const phone = answers.phone?.trim();
    const normalizedPhone = phone?.replace(/[^\d]/g, "") ?? "";

    if (!normalizedPhone || !answers.jobStatus) {
      setError("携帯番号を入力し、お仕事の状況を選択してください。");
      return;
    }

    if (!/^0\d{9,10}$/.test(normalizedPhone)) {
      setError("携帯番号は0から始まる10〜11桁で入力してください。");
      return;
    }

    const payload: Answers = {
      ...answers,
      phone: normalizedPhone,
    };

    console.log("ドラチェン応募内容", payload);
    setAnswers(payload);
    goTo("thanks");
  }

  const image = screenImages[step];

  return (
    <main className="min-h-screen bg-[#063B8E] text-slate-950">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-[0_0_40px_rgba(0,0,0,0.28)]">
        <section
          className="relative w-full overflow-hidden bg-white"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <Image
            src={image.src}
            alt=""
            aria-hidden="true"
            fill
            priority={step === "fv"}
            sizes="430px"
            className="select-none object-contain"
          />

          {step === "fv" ? (
            <>
              {timingOptions.map((option) => (
                <OverlayButton
                  key={option.label}
                  ariaLabel={option.label}
                  className={option.className}
                  selected={answers.timing === option.label}
                  onClick={() => setSingleAnswer("timing", option.label)}
                />
              ))}
              <OverlayButton
                ariaLabel="次へ進む"
                className="left-[7.2%] top-[91.0%] h-[5.2%] w-[85.4%] rounded-full"
                onClick={nextFromFv}
              />
            </>
          ) : null}

          {step === "page2" ? (
            <>
              <BackButton onClick={goBack} />
              {licenseOptions.map((option) => (
                <OverlayButton
                  key={option.label}
                  ariaLabel={option.label}
                  className={option.className}
                  selected={answers.licenses.includes(option.label)}
                  onClick={() => toggleMultiAnswer("licenses", option.label)}
                />
              ))}
              {workStyleOptions.map((option) => (
                <OverlayButton
                  key={option.label}
                  ariaLabel={option.label}
                  className={option.className}
                  selected={answers.workStyle.includes(option.label)}
                  onClick={() => toggleMultiAnswer("workStyle", option.label)}
                />
              ))}
              <OverlayButton
                ariaLabel="次へ進む"
                className="left-[7.1%] top-[90.8%] h-[6.1%] w-[88.1%] rounded-full"
                onClick={nextFromPage2}
              />
            </>
          ) : null}

          {step === "page3" ? (
            <>
              <BackButton onClick={goBack} />
              {driverExperienceOptions.map((option) => (
                <OverlayButton
                  key={option.label}
                  ariaLabel={option.label}
                  className={option.className}
                  selected={answers.driverExperience === option.label}
                  onClick={() => setSingleAnswer("driverExperience", option.label)}
                />
              ))}
              {expectedIncomeOptions.map((option) => (
                <OverlayButton
                  key={option.label}
                  ariaLabel={option.label}
                  className={option.className}
                  selected={answers.expectedIncome === option.label}
                  onClick={() => setSingleAnswer("expectedIncome", option.label)}
                />
              ))}
              <OverlayButton
                ariaLabel="次へ進む"
                className="left-[5.3%] top-[90.6%] h-[6.2%] w-[87.1%] rounded-full"
                onClick={nextFromPage3}
              />
            </>
          ) : null}

          {step === "page4" ? (
            <>
              <BackButton onClick={goBack} />
              <OverlayInput
                ariaLabel="郵便番号"
                className="left-[7.1%] top-[18.0%] h-[8.1%] w-[85.8%]"
                inputMode="numeric"
                autoComplete="postal-code"
                value={answers.postalCode ?? ""}
                onChange={(value) => setTextAnswer("postalCode", value)}
              />
              <OverlayInput
                ariaLabel="お名前"
                className="left-[7.1%] top-[44.1%] h-[8.1%] w-[85.8%]"
                autoComplete="name"
                value={answers.name ?? ""}
                onChange={(value) => setTextAnswer("name", value)}
              />
              <OverlayInput
                ariaLabel="生まれ年"
                className="left-[7.1%] top-[69.9%] h-[8.1%] w-[85.8%]"
                inputMode="numeric"
                autoComplete="bday-year"
                value={answers.birthYear ?? ""}
                hidePrintedPlaceholder
                onChange={(value) => setTextAnswer("birthYear", value)}
              />
              <OverlayButton
                ariaLabel="次へ進む"
                className="left-[7.1%] top-[88.0%] h-[8.1%] w-[88.0%] rounded-full"
                onClick={nextFromPage4}
              />
            </>
          ) : null}

          {step === "page5" ? (
            <>
              <BackButton onClick={goBack} />
              <OverlayInput
                ariaLabel="携帯番号"
                className="left-[6.6%] top-[18.2%] h-[8.1%] w-[86.5%]"
                inputMode="tel"
                autoComplete="tel"
                value={answers.phone ?? ""}
                onChange={(value) => setTextAnswer("phone", value)}
              />
              {jobStatusOptions.map((option) => (
                <OverlayButton
                  key={option.label}
                  ariaLabel={option.label}
                  className={option.className}
                  selected={answers.jobStatus === option.label}
                  onClick={() => setSingleAnswer("jobStatus", option.label)}
                />
              ))}
              <OverlayButton
                ariaLabel="送信する"
                className="left-[5.2%] top-[88.6%] h-[7.8%] w-[87.2%] rounded-full"
                onClick={submitForm}
              />
            </>
          ) : null}
        </section>

        {error ? (
          <p
            role="alert"
            className="mx-4 mb-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold leading-6 text-red-700 shadow-sm"
          >
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}

function OverlayButton({
  ariaLabel,
  className,
  selected = false,
  onClick,
}: {
  ariaLabel: string;
  className: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "absolute rounded-lg bg-transparent outline-none transition active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        selected ? "bg-blue-500/10 ring-2 ring-blue-500/70" : "",
        className,
      ].join(" ")}
    />
  );
}

function OverlayInput({
  ariaLabel,
  className,
  value,
  onChange,
  inputMode,
  autoComplete,
  hidePrintedPlaceholder = false,
}: {
  ariaLabel: string;
  className: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "text" | "numeric" | "tel";
  autoComplete?: string;
  hidePrintedPlaceholder?: boolean;
}) {
  const backgroundClass = hidePrintedPlaceholder && value ? "bg-white" : "bg-transparent focus:bg-white/30";

  return (
    <input
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputMode={inputMode}
      autoComplete={autoComplete}
      className={[
        "absolute rounded-lg border-0 px-4 text-[16px] font-bold text-slate-950 caret-blue-700 outline-none transition focus:ring-2 focus:ring-blue-500/50",
        backgroundClass,
        className,
      ].join(" ")}
    />
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="前のページへ戻る"
      onClick={onClick}
      className="absolute left-0 top-0 h-[10%] w-[20%] rounded-br-xl bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    />
  );
}
