"use client";

import { useEffect, useState } from "react";
import { checkInQuestions } from "@/lib/daily-checkin";

type DailyCheckInFlowProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (answers: Record<string, string>) => void;
  onSkipNeutral: () => void;
  onUseTestAnswers: () => void;
};

export function DailyCheckInFlow({
  open,
  onClose,
  onComplete,
  onSkipNeutral,
  onUseTestAnswers,
}: DailyCheckInFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setAnswers({});
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const currentQuestion = checkInQuestions[step];

  const handleAnswer = (questionId: string, value: string) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (step < checkInQuestions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    onComplete(nextAnswers);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/20 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkin-title"
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
            Step {step + 1} of {checkInQuestions.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-zinc-400 transition hover:text-zinc-600"
          >
            Close
          </button>
        </div>

        {currentQuestion && (
          <>
            <h2
              id="checkin-title"
              className="mt-2 text-base font-semibold text-zinc-900"
            >
              {currentQuestion.question}
            </h2>

            <div className="mt-4 space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion.id, option.label)}
                  className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-left text-sm font-medium text-zinc-800 transition active:scale-[0.98] hover:bg-zinc-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
          <button
            type="button"
            onClick={() => {
              onSkipNeutral();
              onClose();
            }}
            className="text-xs font-medium text-zinc-500 transition hover:text-zinc-700"
          >
            Skip (neutral)
          </button>
          <button
            type="button"
            onClick={() => {
              onUseTestAnswers();
              onClose();
            }}
            className="text-xs font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            Use test answers
          </button>
        </div>
      </div>
    </div>
  );
}
