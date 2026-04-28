"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StepIndicator } from "@/components/candidate/StepIndicator";
import { QuestionCard } from "@/components/candidate/QuestionCard";
import { psychQuestions } from "@/data/questions";
import { useLang } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const HARD_SKILLS_POOL = [
  "Product Management", "UX Design", "UI Design", "Figma", "Data Analysis",
  "SQL", "Python", "React", "Node.js", "TypeScript", "Agile/Scrum", "Jira",
  "SEO/SEA", "Growth Hacking", "Marketing Digital", "Content Strategy",
  "Project Management", "Business Analysis", "Excel/Sheets", "Salesforce",
];

const SOFT_SKILLS_POOL = [
  "Leadership", "Communication", "Travail en équipe", "Adaptabilité",
  "Résolution de problèmes", "Créativité", "Gestion du temps", "Empathie",
  "Esprit critique", "Négociation", "Pédagogie", "Curiosité intellectuelle",
];

type Answer = { questionId: string; value: string | number | string[] };

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const { t } = useLang();
  const o = t.onboardingCandidate;

  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    title: "",
    location: "",
    bio: "",
    desiredRole: "",
    workMode: "",
    seniority: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvDragOver, setCvDragOver] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questDone, setQuestDone] = useState(false);

  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");

  const toggleSkill = (skill: string, type: "hard" | "soft") => {
    if (type === "hard") {
      setHardSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
    } else {
      setSoftSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
    }
  };

  const addCustomSkill = (type: "hard" | "soft") => {
    const input = type === "hard" ? hardInput.trim() : softInput.trim();
    if (!input) return;
    if (type === "hard") { setHardSkills((p) => [...p, input]); setHardInput(""); }
    else { setSoftSkills((p) => [...p, input]); setSoftInput(""); }
  };

  const handleAnswer = (questionId: string, value: string | number | string[]) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, value };
        return updated;
      }
      return [...prev, { questionId, value }];
    });
    if (currentQuestion < psychQuestions.length - 1) {
      setCurrentQuestion((c) => c + 1);
    } else {
      setQuestDone(true);
    }
  };

  const handleFinish = () => {
    router.push("/candidate/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
            <span className="font-semibold text-gray-800 text-sm">Experience Matching</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{o.step} {step}/5</span>
            <Link href="/" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all" title={o.quit}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <StepIndicator currentStep={step} labels={o.steps} />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">👤</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step1Title}</h1>
              <p className="text-gray-500 mt-2">{o.step1Sub}</p>
            </div>
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.firstName}</Label>
                    <Input placeholder="Marie" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{o.lastName}</Label>
                    <Input placeholder="Dupont" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.currentTitle}</Label>
                  <Input placeholder="Ex : Senior Product Designer" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{o.location}</Label>
                  <Input placeholder="Paris, France" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{o.desiredRole}</Label>
                  <Input placeholder="Ex : Product Manager B2B SaaS" value={profile.desiredRole} onChange={(e) => setProfile({ ...profile, desiredRole: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{o.seniority}</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {o.seniorityLevels.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setProfile({ ...profile, seniority: s })}
                        className={cn(
                          "p-2 rounded-lg border text-xs text-center transition-all",
                          profile.seniority === s ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-gray-200 text-gray-600 hover:border-violet-200"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.workMode}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {o.workModes.map((w) => (
                      <button
                        key={w.v}
                        type="button"
                        onClick={() => setProfile({ ...profile, workMode: w.v })}
                        className={cn(
                          "p-2.5 rounded-lg border text-sm text-center transition-all",
                          profile.workMode === w.v ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-gray-200 text-gray-600 hover:border-violet-200"
                        )}
                      >
                        {w.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.bio} <span className="text-gray-400 font-normal">{o.optional}</span></Label>
                  <Textarea placeholder={o.bioPlaceholder} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="h-24" />
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={!profile.firstName || !profile.title || !profile.seniority}
                >
                  {o.continue}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">📄</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step2Title}</h1>
              <p className="text-gray-500 mt-2">{o.step2Sub}</p>
            </div>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setCvDragOver(true); }}
                  onDragLeave={() => setCvDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setCvDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) setCvFile(file);
                  }}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
                    cvDragOver ? "border-violet-500 bg-violet-50" : cvFile ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/30"
                  )}
                  onClick={() => document.getElementById("cv-input")?.click()}
                >
                  <input
                    id="cv-input"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) setCvFile(e.target.files[0]); }}
                  />
                  {cvFile ? (
                    <>
                      <div className="text-4xl mb-3">✅</div>
                      <p className="font-semibold text-emerald-700">{cvFile.name}</p>
                      <p className="text-sm text-gray-400 mt-1">{(cvFile.size / 1024 / 1024).toFixed(2)} Mo</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                        className="mt-3 text-xs text-gray-400 hover:text-red-500 underline"
                      >
                        {o.delete}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl mb-3">📤</div>
                      <p className="font-semibold text-gray-700">{o.dropzone}</p>
                      <p className="text-sm text-gray-400 mt-1">{o.orBrowse}</p>
                    </>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl flex gap-3">
                  <span className="text-lg flex-shrink-0">💡</span>
                  <p className="text-sm text-blue-700">{o.cvDisclaimer}</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">{o.back}</Button>
                  <Button
                    variant="gradient"
                    onClick={() => setStep(3)}
                    className="flex-2 flex-grow-2"
                    disabled={!cvFile}
                  >
                    {o.continue}
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-600 underline"
                >
                  {o.skip}
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            {!questDone ? (
              <>
                <div className="text-center mb-8">
                  <div className="text-4xl mb-3">🧠</div>
                  <h1 className="text-2xl font-bold text-gray-900">{o.step3Title}</h1>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">{o.step3Sub}</p>
                </div>

                <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <span className="text-xl flex-shrink-0">🔒</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">{o.confidentialTitle}</p>
                    <p className="text-xs text-amber-700 mt-0.5">{o.confidentialDesc}</p>
                  </div>
                </div>

                <Card className="shadow-sm">
                  <CardContent className="pt-6">
                    <QuestionCard
                      key={psychQuestions[currentQuestion].id}
                      question={psychQuestions[currentQuestion]}
                      questionNumber={currentQuestion + 1}
                      total={psychQuestions.length}
                      onAnswer={handleAnswer}
                      existingAnswer={answers.find((a) => a.questionId === psychQuestions[currentQuestion].id)?.value}
                    />
                  </CardContent>
                </Card>

                <div className="mt-4 flex gap-2 justify-center flex-wrap">
                  {["Strengths", "Work Style", "Leadership", "Motivation", "Collaboration"].map((cat, i) => (
                    <Badge key={cat} variant={i < Math.floor((currentQuestion / 12) * 5) ? "success" : "secondary"} className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>

                {currentQuestion > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestion((c) => c - 1)}
                    className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    {o.prevQuestion}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center animate-fade-in-up">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{o.testDoneTitle}</h2>
                <p className="text-gray-500 mb-8">{o.testDoneSub}</p>

                <Card className="shadow-sm mb-6">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {o.psychResults.map((item) => (
                        <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="text-left">
                            <p className="text-xs text-gray-500">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-violet-50 rounded-xl">
                      <p className="text-xs text-violet-700 text-center">{o.psychConfidential}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => { setQuestDone(false); setCurrentQuestion(0); }} className="flex-1">
                    {o.retakeTest}
                  </Button>
                  <Button variant="gradient" onClick={() => setStep(4)} className="flex-2 flex-grow-2">
                    {o.validateContinue}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">⚡</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step4Title}</h1>
              <p className="text-gray-500 mt-2">{o.step4Sub}</p>
            </div>

            <Card className="shadow-sm mb-4">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="hard" className="text-xs">{o.hardSkills}</Badge>
                    <span className="text-xs text-gray-400">{o.hardSkillsSub}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {HARD_SKILLS_POOL.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill, "hard")}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          hardSkills.includes(skill)
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                        )}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={o.addSkill}
                      value={hardInput}
                      onChange={(e) => setHardInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomSkill("hard")}
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={() => addCustomSkill("hard")}>+</Button>
                  </div>
                  {hardSkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hardSkills.map((s) => (
                        <Badge key={s} variant="hard" className="cursor-pointer" onClick={() => toggleSkill(s, "hard")}>
                          {s} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="soft" className="text-xs">{o.softSkills}</Badge>
                    <span className="text-xs text-gray-400">{o.softSkillsSub}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SOFT_SKILLS_POOL.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill, "soft")}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          softSkills.includes(skill)
                            ? "bg-pink-600 border-pink-600 text-white"
                            : "border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600"
                        )}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={o.addSkill}
                      value={softInput}
                      onChange={(e) => setSoftInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomSkill("soft")}
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={() => addCustomSkill("soft")}>+</Button>
                  </div>
                  {softSkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {softSkills.map((s) => (
                        <Badge key={s} variant="soft" className="cursor-pointer" onClick={() => toggleSkill(s, "soft")}>
                          {s} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">{o.back}</Button>
                  <Button
                    variant="gradient"
                    onClick={() => setStep(5)}
                    className="flex-2 flex-grow-2"
                    disabled={hardSkills.length + softSkills.length < 2}
                  >
                    {o.continue}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">✅</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step5Title}</h1>
              <p className="text-gray-500 mt-2">{o.step5Sub}</p>
            </div>

            <Card className="shadow-sm mb-4">
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                    {profile.firstName[0] || "?"}{profile.lastName[0] || ""}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{profile.firstName} {profile.lastName}</p>
                    <p className="text-sm text-gray-500">{profile.title}</p>
                    <p className="text-xs text-gray-400">{profile.location} • {profile.seniority}</p>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-violet-600 hover:underline">{o.edit}</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cvFile?.name || o.noCv}</p>
                      <p className="text-xs text-gray-400">{o.cvLabel ?? "CV"}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="text-xs text-violet-600 hover:underline">{o.edit}</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{questDone ? o.testCompleted : o.testIncomplete}</p>
                      <p className="text-xs text-gray-400">{answers.length} {o.answers} {psychQuestions.length}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(3)} className="text-xs text-violet-600 hover:underline">{o.redo}</button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-900">{o.skills}</p>
                    <button type="button" onClick={() => setStep(4)} className="text-xs text-violet-600 hover:underline">{o.edit}</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {hardSkills.map((s) => <Badge key={s} variant="hard" className="text-xs">{s}</Badge>)}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.map((s) => <Badge key={s} variant="soft" className="text-xs">{s}</Badge>)}
                  </div>
                </div>

                <div className="p-4 bg-violet-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-violet-900">{o.profileCompletion}</p>
                    <span className="text-sm font-bold text-violet-600">
                      {Math.round(
                        ((profile.firstName ? 20 : 0) +
                          (cvFile ? 20 : 0) +
                          (questDone ? 30 : (answers.length / psychQuestions.length) * 30) +
                          (hardSkills.length > 0 ? 15 : 0) +
                          (softSkills.length > 0 ? 15 : 0))
                      )}%
                    </span>
                  </div>
                  <Progress
                    value={
                      (profile.firstName ? 20 : 0) +
                      (cvFile ? 20 : 0) +
                      (questDone ? 30 : (answers.length / psychQuestions.length) * 30) +
                      (hardSkills.length > 0 ? 15 : 0) +
                      (softSkills.length > 0 ? 15 : 0)
                    }
                    className="h-2"
                  />
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
                  <span className="text-xl flex-shrink-0">🔒</span>
                  <p className="text-sm text-emerald-800">{o.privacyNotice}</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1">{o.back}</Button>
                  <Button variant="success" size="lg" onClick={handleFinish} className="flex-2 flex-grow-2">
                    {o.validate}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
