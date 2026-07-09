"use client";

import { Check, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getStoredDailyCheckIn,
  getTodayKey,
  saveDailyCheckIn,
  type DailyCheckInState,
} from "@/lib/daily-checkin";
import {
  applyCheckInToHealthProfile,
  ensureHealthProfileInitialized,
} from "@/lib/health-state";
import { checkInQuestions } from "@/lib/mock-data";

export function DailyCheckInCard() {
  const [completed, setCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = getStoredDailyCheckIn();
    setCompleted(stored?.date === getTodayKey() && stored.completed);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  const openCheckIn = () => {
    setStep(0);
    setAnswers({});
    setModalOpen(true);
  };

  const handleAnswer = (questionId: string, value: string) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (step < checkInQuestions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    const checkInState: DailyCheckInState = {
      date: getTodayKey(),
      completed: true,
      answers: {
        appetite: nextAnswers.appetite,
        energy: nextAnswers.energy,
        concerns: nextAnswers.concerns,
      },
    };

    saveDailyCheckIn(checkInState);
    applyCheckInToHealthProfile(ensureHealthProfileInitialized(), checkInState);

    setCompleted(true);
    setModalOpen(false);
  };

  const currentQuestion = checkInQuestions[step];

  return (
    <>
      <button
        type="button"
        onClick={openCheckIn}
        className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-left transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              completed ? "bg-emerald-50" : "bg-zinc-100"
            }`}
          >
            {completed ? (
              <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
            ) : (
              <span className="h-2 w-2 rounded-full bg-zinc-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">Daily check-in</p>
            <p className="text-xs text-zinc-500">
              {completed ? "Completed today" : "Not done yet"} · ~20 sec
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-400" strokeWidth={2.5} />
      </button>

      {modalOpen && currentQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/20 p-4"
          onClick={() => setModalOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkin-title"
            className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
              Step {step + 1} of {checkInQuestions.length}
            </p>
            <h2
              id="checkin-title"
              className="mt-2 text-base font-semibold text-zinc-900"
            >
              {currentQuestion.question}
            </h2>

            <div className="mt-4 space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                  className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-left text-sm font-medium text-zinc-800 transition active:scale-[0.98] hover:bg-zinc-100"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
