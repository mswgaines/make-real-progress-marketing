import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Question {
  id: number;
  text: string;
  options: { label: string; value: string; tag: string }[];
}

interface Result {
  headline: string;
  subheadline: string;
  message: string;
  cta_primary: string;
  cta_primary_href: string;
  cta_secondary: string;
  cta_secondary_href: string;
  type: "yes" | "maybe" | "no";
}

// ── Quiz Data ─────────────────────────────────────────────────────────────────
const questions: Question[] = [
  {
    id: 1,
    text: "Which of these best describes where you are right now?",
    options: [
      { label: "I'm making payments but the balance barely moves", value: "a", tag: "core" },
      { label: "I feel overwhelmed and don't know where to start", value: "b", tag: "core" },
      { label: "I've tried budgets before but they always fall apart", value: "c", tag: "core" },
      { label: "I'm debt-free and looking to grow my wealth", value: "d", tag: "no" },
    ],
  },
  {
    id: 2,
    text: "What type of debt is weighing on you most?",
    options: [
      { label: "Credit cards — the interest never stops", value: "a", tag: "core" },
      { label: "Student loans, car loans, or personal loans", value: "b", tag: "core" },
      { label: "A mortgage or medical bills from a tough season", value: "c", tag: "core" },
      { label: "I don't really have debt — I'm looking for investment advice", value: "d", tag: "no" },
    ],
  },
  {
    id: 3,
    text: "Has a life event made your finances harder recently?",
    options: [
      { label: "Yes — divorce, job loss, or medical bills hit hard", value: "a", tag: "core" },
      { label: "Yes — just life piling up and costs rising", value: "b", tag: "core" },
      { label: "Not really, I just never got a handle on it", value: "c", tag: "core" },
      { label: "No — I'm in a good place financially", value: "d", tag: "no" },
    ],
  },
  {
    id: 4,
    text: "What does success look like to you?",
    options: [
      { label: "Seeing the actual number go down — real, visible progress", value: "a", tag: "progress" },
      { label: "Feeling less stressed and more in control of my money", value: "b", tag: "control" },
      { label: "Having a clear, simple plan I can actually follow", value: "c", tag: "plan" },
      { label: "Getting rich quick — I want fast results", value: "d", tag: "no" },
    ],
  },
  {
    id: 5,
    text: "What's holding you back most right now?",
    options: [
      { label: "I don't know where to start", value: "a", tag: "start" },
      { label: "I've failed before and I'm not sure I can do it", value: "b", tag: "confidence" },
      { label: "Life keeps getting in the way", value: "c", tag: "life" },
      { label: "Nothing — I'm already on track", value: "d", tag: "no" },
    ],
  },
];

// ── Result logic ──────────────────────────────────────────────────────────────
function getResult(answers: Record<number, string>): Result {
  const noCount = Object.values(answers).filter((v) => v === "d").length;

  if (noCount >= 3) {
    return {
      type: "no",
      headline: "This book may not be your next step.",
      subheadline: "But that's okay — knowing that is progress too.",
      message:
        "Make Real Progress is written for people actively dealing with debt who want a practical, judgment-free plan. If you're already debt-free or looking for investment strategies, this book isn't the right fit right now. But if that changes — we'll be here.",
      cta_primary: "Browse the Free Resources",
      cta_primary_href: "#resources",
      cta_secondary: "Learn About the App",
      cta_secondary_href: "https://app.makerealprogressapp.com/signup",
    };
  }

  // Determine personalized message based on dominant tag
  const tags = Object.entries(answers)
    .filter(([, v]) => v !== "d")
    .map(([k]) => {
      const q = questions.find((q) => q.id === Number(k));
      const opt = q?.options.find((o) => o.value === answers[Number(k)]);
      return opt?.tag || "";
    });

  let message = "";
  let subheadline = "";

  if (tags.includes("start")) {
    subheadline = "You're exactly who this book was written for.";
    message =
      "Not knowing where to start is the most common place to be — and the most important one to move through. Make Real Progress gives you a clear, step-by-step framework that removes the guesswork and replaces overwhelm with a real plan. No jargon. No judgment. Just a path forward.";
  } else if (tags.includes("confidence")) {
    subheadline = "You've tried before. This time can be different.";
    message =
      "Failing at a budget doesn't mean you're bad with money — it means the system wasn't built for your real life. Make Real Progress is designed around the way real people actually live, slip, recover, and keep going. The book won't shame you for past attempts. It will give you a better approach.";
  } else if (tags.includes("life")) {
    subheadline = "Life got in the way. That's real — and it's okay.";
    message =
      "Divorce, job loss, medical bills, rising costs — these aren't excuses, they're reality. Make Real Progress was written for people navigating real life, not ideal conditions. It meets you where you are and helps you build a plan that works even when life doesn't cooperate.";
  } else if (tags.includes("control")) {
    subheadline = "Feeling in control starts with seeing clearly.";
    message =
      "The stress of debt isn't just financial — it's emotional. Make Real Progress helps you get everything on paper, understand exactly where you stand, and build a plan that gives you back a sense of control. Many readers say the first chapter alone changed how they felt about their situation.";
  } else {
    subheadline = "You're ready to see real movement.";
    message =
      "If you're tired of paying and not progressing, Make Real Progress will show you exactly why that happens and how to fix it. The book gives you a practical framework — not theory — for attacking your debt strategically and seeing the numbers actually move.";
  }

  return {
    type: "yes",
    headline: "Yes — this book was written for you.",
    subheadline,
    message,
    cta_primary: "Get the Paperback on Amazon",
    cta_primary_href: "https://amzn.to/3OVorkI",
    cta_secondary: "Create Free App Account",
    cta_secondary_href: "https://app.makerealprogressapp.com/signup",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookQuiz() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const question = questions[current];
  const progress = ((current) / questions.length) * 100;

  function handleStart() {
    setStarted(true);
    setCurrent(0);
    setAnswers({});
    setResult(null);
    setSelected(null);
  }

  function handleSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setResult(getResult(newAnswers));
    }
  }

  function handleRestart() {
    setStarted(false);
    setCurrent(0);
    setAnswers({});
    setResult(null);
    setSelected(null);
  }

  // ── Intro screen ────────────────────────────────────────────────────────────
  if (!started) {
    return (
      <section id="quiz" className="py-20 px-4" style={{ background: "linear-gradient(135deg, #1A2E1A 0%, #2C4A2E 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(200,146,42,0.18)", color: "#C8922A" }}
          >
            5-Question Quiz
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE" }}
          >
            Is This Book Right for You?
          </h2>
          <p className="text-lg mb-10" style={{ color: "#A8C4A8" }}>
            Answer five honest questions and find out if Make Real Progress is the right next step on your debt journey.
          </p>
          <div
            className="rounded-2xl p-8 mb-8 text-left"
            style={{ background: "rgba(248,244,238,0.06)", border: "1px solid rgba(200,146,42,0.25)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: "5", label: "Quick questions" },
                { num: "2", label: "Minutes to complete" },
                { num: "100%", label: "Judgment-free" },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#C8922A" }}>
                    {num}
                  </div>
                  <div className="text-sm" style={{ color: "#A8C4A8" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: "#C8922A", color: "#1A2E1A" }}
          >
            Take the Quiz
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    );
  }

  // ── Result screen ───────────────────────────────────────────────────────────
  if (result) {
    const isYes = result.type === "yes";
    return (
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, #1A2E1A 0%, #2C4A2E 100%)" }}>
        <div className="max-w-2xl mx-auto">
          {/* Result card */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#F8F4EE" }}
          >
            {/* Top bar */}
            <div
              className="px-8 py-6"
              style={{ background: isYes ? "#2C4A2E" : "#4A4A4A" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ background: "#C8922A", color: "#1A2E1A" }}
                >
                  {isYes ? "✓" : "→"}
                </div>
                <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#C8922A" }}>
                  Your Result
                </span>
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE" }}
              >
                {result.headline}
              </h3>
            </div>

            {/* Body */}
            <div className="px-8 py-7">
              <p
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "#2C4A2E" }}
              >
                {result.subheadline}
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#3A5A3E" }}>
                {result.message}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={result.cta_primary_href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: "#C8922A", color: "#1A2E1A" }}
                >
                  {result.cta_primary}
                </a>
                <a
                  href={result.cta_secondary_href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: "#2C4A2E", color: "#F8F4EE" }}
                >
                  {result.cta_secondary}
                </a>
              </div>

              <button
                onClick={handleRestart}
                className="mt-5 text-sm underline underline-offset-2 block mx-auto"
                style={{ color: "#6A8A6E" }}
              >
                Retake the quiz
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Question screen ─────────────────────────────────────────────────────────
  return (
    <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, #1A2E1A 0%, #2C4A2E 100%)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C8922A" }}>
              Question {current + 1} of {questions.length}
            </span>
            <span className="text-xs" style={{ color: "#A8C4A8" }}>
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(248,244,238,0.12)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "#C8922A" }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#F8F4EE" }}>
          <div className="px-8 py-7" style={{ background: "#2C4A2E" }}>
            <h3
              className="text-xl md:text-2xl font-bold leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE" }}
            >
              {question.text}
            </h3>
          </div>

          <div className="px-8 py-7 space-y-3">
            {question.options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-medium text-sm"
                  style={{
                    borderColor: isSelected ? "#C8922A" : "#D8D0C4",
                    background: isSelected ? "#FFF8EC" : "#FFFDF9",
                    color: isSelected ? "#1A2E1A" : "#3A5A3E",
                    boxShadow: isSelected ? "0 0 0 3px rgba(200,146,42,0.15)" : "none",
                  }}
                >
                  <span
                    className="inline-block w-6 h-6 rounded-full border-2 mr-3 align-middle text-center text-xs font-bold leading-5"
                    style={{
                      borderColor: isSelected ? "#C8922A" : "#A8B8A8",
                      background: isSelected ? "#C8922A" : "transparent",
                      color: isSelected ? "#1A2E1A" : "#6A8A6E",
                    }}
                  >
                    {isSelected ? "✓" : opt.value.toUpperCase()}
                  </span>
                  {opt.label}
                </button>
              );
            })}

            <div className="pt-4">
              <button
                onClick={handleNext}
                disabled={!selected}
                className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: selected ? "#2C4A2E" : "#C8D8C8",
                  color: selected ? "#F8F4EE" : "#8A9A8A",
                  cursor: selected ? "pointer" : "not-allowed",
                }}
              >
                {current + 1 === questions.length ? "See My Result →" : "Next Question →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
