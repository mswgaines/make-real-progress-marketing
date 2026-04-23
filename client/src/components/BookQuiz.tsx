/**
 * BookQuiz — "Is This Book Right for Me?"
 * Interactive 5-question quiz with personalized result
 * Brand: Forest Green #2C4A2E | Golden Amber #C8922A | Parchment #F8F4EE
 */

import { useState } from "react";
import { ArrowRight, RotateCcw, BookOpen, Smartphone, CheckCircle2 } from "lucide-react";

const FOREST = "#2C4A2E";
const AMBER = "#C8922A";
const PARCHMENT = "#F8F4EE";

const questions = [
  {
    id: 1,
    question: "How would you describe your current debt situation?",
    options: [
      { label: "I'm paying every month but the balance barely moves", value: "stuck" },
      { label: "I have multiple debts and I don't know where to start", value: "overwhelmed" },
      { label: "I'm managing okay but want a clearer strategy", value: "managing" },
      { label: "I'm debt-free and looking for investment advice", value: "debtfree" },
    ],
  },
  {
    id: 2,
    question: "What type of debt are you dealing with?",
    options: [
      { label: "Credit cards (one or more)", value: "credit" },
      { label: "Personal loans or medical bills", value: "loans" },
      { label: "Mortgage or car payments", value: "mortgage" },
      { label: "A mix of several types", value: "mixed" },
    ],
  },
  {
    id: 3,
    question: "Have you tried to tackle your debt before?",
    options: [
      { label: "Yes — I've tried budgets and plans but they fall apart", value: "tried_failed" },
      { label: "Yes — I've read finance books but they felt out of touch", value: "tried_books" },
      { label: "Not really — I haven't found a structured approach yet", value: "not_tried" },
      { label: "I'm looking for advanced investing strategies", value: "investing" },
    ],
  },
  {
    id: 4,
    question: "What does success look like to you?",
    options: [
      { label: "Seeing the actual number go down — real, visible progress", value: "progress" },
      { label: "Feeling less stressed and more in control of my money", value: "control" },
      { label: "Having a clear, simple plan I can actually follow", value: "plan" },
      { label: "Building wealth and investing in the stock market", value: "wealth" },
    ],
  },
  {
    id: 5,
    question: "What's holding you back most right now?",
    options: [
      { label: "I don't know where to start", value: "start" },
      { label: "I've failed before and I'm not sure I can do it", value: "failed" },
      { label: "Life keeps getting in the way — job, family, unexpected bills", value: "life" },
      { label: "Nothing — I'm already on a solid financial path", value: "nothing" },
    ],
  },
];

// Determine if the user is a good fit based on their answers
function getResult(answers: string[]) {
  const notFit = answers.includes("debtfree") || answers.includes("investing") || answers.includes("wealth") || answers.includes("nothing");
  const notFitCount = answers.filter(a => ["debtfree", "investing", "wealth", "nothing"].includes(a)).length;

  if (notFitCount >= 2) {
    return "no";
  }

  // Determine the personalized message
  if (answers.includes("tried_failed") || answers.includes("failed")) {
    return "yes_failed";
  }
  if (answers.includes("life")) {
    return "yes_life";
  }
  if (answers.includes("overwhelmed") || answers.includes("start")) {
    return "yes_overwhelmed";
  }
  return "yes_general";
}

const results: Record<string, { headline: string; body: string; fit: boolean }> = {
  yes_general: {
    fit: true,
    headline: "This book was written for you.",
    body: "Make Real Progress is a practical, judgment-free guide for real people who want to stop spinning their wheels and start seeing their debt actually go down. No fluff, no get-rich-quick promises — just a clear, honest system that works.",
  },
  yes_failed: {
    fit: true,
    headline: "You've tried before. This time will be different.",
    body: "Most finance books assume you just need more information. Make Real Progress assumes you're a real person with a real life — and it meets you there. It's built for people who've tried and stumbled, and it gives you a system that accounts for that.",
  },
  yes_life: {
    fit: true,
    headline: "Life gets in the way. This book works anyway.",
    body: "Make Real Progress was designed for people whose lives don't pause for a debt payoff plan. It gives you a flexible, forgiving system that keeps working even when things get messy — because real progress is still progress.",
  },
  yes_overwhelmed: {
    fit: true,
    headline: "Not knowing where to start is exactly where this book begins.",
    body: "Make Real Progress starts from zero — no assumptions, no jargon, no judgment. It walks you through exactly where to start, what to do first, and how to build momentum one step at a time.",
  },
  no: {
    fit: false,
    headline: "This book may not be your best next step.",
    body: "Make Real Progress is specifically designed for people actively working to pay down debt. If you're already debt-free or focused on investing and wealth-building, you may be beyond what this book covers. That said, it's a great resource to share with someone in your life who is on that journey.",
  },
};

export default function BookQuiz() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => setSelected(value);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setStep("result");
    }
  };

  const handleReset = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
  };

  const resultKey = step === "result" ? getResult(answers) : null;
  const result = resultKey ? results[resultKey] : null;
  const progress = ((current) / questions.length) * 100;

  return (
    <section className="py-20" style={{ background: PARCHMENT }}>
      <div className="container max-w-2xl mx-auto px-4">
        {/* Section label */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ background: `${FOREST}18`, color: FOREST }}
          >
            Quick Quiz
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: FOREST }}
          >
            Is This Book Right for Me?
          </h2>
          <p className="text-base" style={{ color: "#4a5568" }}>
            Answer 5 quick questions and find out in under 2 minutes.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-lg overflow-hidden" style={{ background: "#fff", border: `1px solid ${FOREST}20` }}>
          {/* Intro */}
          {step === "intro" && (
            <div className="p-8 md:p-12 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: `${FOREST}12` }}
              >
                <BookOpen size={28} style={{ color: FOREST }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: FOREST }}>
                Not sure if this book is for you?
              </h3>
              <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "#4a5568" }}>
                This quiz takes less than 2 minutes and gives you an honest answer — no sales pitch, no pressure.
              </p>
              <button
                onClick={() => setStep("quiz")}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: FOREST }}
              >
                Take the Quiz <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Quiz */}
          {step === "quiz" && (
            <div>
              {/* Progress bar */}
              <div className="h-1.5 w-full" style={{ background: `${FOREST}18` }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: AMBER }}
                />
              </div>

              <div className="p-8 md:p-10">
                {/* Question counter */}
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: AMBER }}>
                  Question {current + 1} of {questions.length}
                </p>

                {/* Question */}
                <h3 className="text-xl md:text-2xl font-bold mb-7" style={{ fontFamily: "'Playfair Display', serif", color: FOREST }}>
                  {questions[current].question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {questions[current].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-medium text-sm"
                      style={{
                        borderColor: selected === opt.value ? FOREST : `${FOREST}25`,
                        background: selected === opt.value ? `${FOREST}0e` : "#fff",
                        color: selected === opt.value ? FOREST : "#374151",
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                          style={{
                            borderColor: selected === opt.value ? FOREST : `${FOREST}40`,
                            background: selected === opt.value ? FOREST : "transparent",
                          }}
                        >
                          {selected === opt.value && <span className="w-2 h-2 rounded-full bg-white block" />}
                        </span>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className="w-full py-3.5 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={{
                    background: selected ? FOREST : `${FOREST}40`,
                    cursor: selected ? "pointer" : "not-allowed",
                  }}
                >
                  {current + 1 === questions.length ? "See My Result" : "Next Question"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {step === "result" && result && (
            <div className="p-8 md:p-12">
              {/* Result header */}
              <div
                className="rounded-xl p-6 mb-8 text-center"
                style={{ background: result.fit ? `${FOREST}0d` : "#fff3cd" }}
              >
                {result.fit ? (
                  <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: FOREST }} />
                ) : (
                  <BookOpen size={40} className="mx-auto mb-3" style={{ color: AMBER }} />
                )}
                <h3
                  className="text-2xl md:text-3xl font-bold mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", color: FOREST }}
                >
                  {result.headline}
                </h3>
                <p className="text-base" style={{ color: "#4a5568" }}>
                  {result.body}
                </p>
              </div>

              {/* CTAs */}
              {result.fit && (
                <div className="space-y-3">
                  <a
                    href="https://amzn.to/3OVorkI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: AMBER }}
                  >
                    <BookOpen size={18} /> Get the Paperback on Amazon
                  </a>
                  <a
                    href="https://app.makerealprogressapp.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold border-2 transition-all hover:opacity-80"
                    style={{ borderColor: FOREST, color: FOREST }}
                  >
                    <Smartphone size={18} /> Create a Free App Account
                  </a>
                </div>
              )}

              {/* Retake */}
              <button
                onClick={handleReset}
                className="mt-6 flex items-center gap-1.5 text-sm mx-auto transition-opacity hover:opacity-70"
                style={{ color: "#6b7280" }}
              >
                <RotateCcw size={14} /> Retake the quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
