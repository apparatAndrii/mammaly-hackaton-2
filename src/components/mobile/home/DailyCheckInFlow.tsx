"use client";

import { useEffect, useState } from "react";
import { checkInQuestions } from "@/lib/daily-checkin";

type DailyCheckInFlowProps = {
  onClose: () => void;
  onComplete: (answers: Record<string, string>) => void;
};

/** Wird vom Parent nur bei geöffnetem Sheet gemountet — State startet frisch. */
export function DailyCheckInFlow({ onClose, onComplete }: DailyCheckInFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const currentQuestion = checkInQuestions[step];
  const progress = ((step + 1) / checkInQuestions.length) * 100;

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
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/25 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkin-title"
        className="w-full max-w-sm rounded-3xl bg-paper p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-olive">
            Frage {step + 1} von {checkInQuestions.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-olive transition hover:text-ink"
          >
            Schließen
          </button>
        </div>

        <div className="mt-3 h-1 rounded-full bg-cream-deep">
          <div
            className="h-full rounded-full bg-forest transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {currentQuestion && (
          <>
            <h2
              id="checkin-title"
              className="mt-4 font-display text-xl font-semibold text-ink"
            >
              {currentQuestion.question}
            </h2>

            <div className="mt-4 space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion.id, option.label)}
                  className="w-full rounded-2xl border border-cream-deep bg-cream px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-cream-deep active:scale-[0.98]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
