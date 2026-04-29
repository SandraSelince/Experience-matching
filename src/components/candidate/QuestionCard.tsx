"use client";

import { useState } from "react";
import { Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  total: number;
  onAnswer: (questionId: string, value: string | number | string[]) => void;
  existingAnswer?: string | number | string[];
}

export function QuestionCard({ question, questionNumber, total, onAnswer, existingAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | number | string[]>(existingAnswer ?? (question.type === "scale" ? 3 : question.type === "multi" ? [] : ""));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (question.type === "scale" || (question.type !== "multi" && selected !== "") || (question.type === "multi" && (selected as string[]).length > 0)) {
      setSubmitted(true);
      setTimeout(() => {
        onAnswer(question.id, selected);
        setSubmitted(false);
      }, 300);
    }
  };

  const toggleMulti = (value: string) => {
    const current = selected as string[];
    if (current.includes(value)) {
      setSelected(current.filter((v) => v !== value));
    } else if (current.length < 3) {
      setSelected([...current, value]);
    }
  };

  return (
    <div className={cn("transition-all duration-300", submitted ? "opacity-0 scale-95" : "opacity-100 scale-100")}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400 font-medium">Question {questionNumber} / {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-6 rounded-full transition-all",
                i < questionNumber ? "bg-emerald-500" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        {question.emoji && <div className="text-5xl mb-4">{question.emoji}</div>}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{question.text}</h3>
        {question.subtitle && <p className="text-sm text-gray-500">{question.subtitle}</p>}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {(question.type === "choice" || question.type === "scenario") && question.options?.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            className={cn(
              "w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all",
              selected === opt.value
                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
            )}
          >
            {opt.emoji && <span className="text-xl flex-shrink-0">{opt.emoji}</span>}
            <span className={cn("text-sm font-medium", selected === opt.value ? "text-emerald-700" : "text-gray-700")}>
              {opt.label}
            </span>
          </button>
        ))}

        {question.type === "multi" && question.options?.map((opt) => {
          const isSelected = (selected as string[]).includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleMulti(opt.value)}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all",
                isSelected
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all",
                isSelected ? "bg-emerald-600 border-emerald-600" : "border-gray-300"
              )}>
                {isSelected && <span className="text-white text-xs">✓</span>}
              </div>
              {opt.emoji && <span className="text-xl flex-shrink-0">{opt.emoji}</span>}
              <span className={cn("text-sm font-medium", isSelected ? "text-emerald-700" : "text-gray-700")}>
                {opt.label}
              </span>
            </button>
          );
        })}

        {question.type === "scale" && (
          <div className="py-4">
            <div className="flex justify-between text-xs text-gray-500 mb-3 px-1">
              <span>{question.minLabel}</span>
              <span>{question.maxLabel}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSelected(val)}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 font-semibold text-sm transition-all",
                    selected === val
                      ? "bg-emerald-600 border-emerald-600 text-white scale-110 shadow-lg shadow-emerald-200"
                      : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-500"
                  )}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-3 px-1">
              <span>1</span>
              <span>5</span>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        variant="gradient"
        size="lg"
        className="w-full mt-8"
        disabled={
          (question.type === "multi" && (selected as string[]).length === 0) ||
          (question.type !== "multi" && question.type !== "scale" && selected === "")
        }
      >
        {questionNumber === total ? "Terminer le test" : "Question suivante →"}
      </Button>
    </div>
  );
}
