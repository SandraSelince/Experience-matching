"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "Tech / SaaS", "FinTech", "HealthTech", "E-commerce", "Média / Contenu",
  "Conseil", "Agence", "Industrie", "Retail", "Éducation",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

const HARD_SKILLS_POOL = [
  "Product Management", "UX Design", "UI Design", "Figma", "Data Analysis",
  "SQL", "Python", "React", "Node.js", "TypeScript", "Agile/Scrum",
  "SEO/SEA", "Growth Hacking", "Marketing Digital", "Project Management",
];

const SOFT_SKILLS_POOL = [
  "Leadership", "Communication", "Travail en équipe", "Adaptabilité",
  "Résolution de problèmes", "Créativité", "Gestion du temps",
  "Esprit critique", "Autonomie", "Orientation résultats",
];

export default function ManagerOnboardingPage() {
  const router = useRouter();
  const { t } = useLang();
  const o = t.onboardingManager;

  const [step, setStep] = useState(1);

  const [manager, setManager] = useState({
    firstName: "",
    lastName: "",
    title: "",
    currentCompany: "",
    location: "",
    linkedinUrl: "",
    bio: "",
  });

  const [company, setCompany] = useState({
    name: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    description: "",
    growthRate: "",
    recentHires: [] as { name: string; role: string }[],
    values: [] as string[],
  });

  const [hireNameInput, setHireNameInput] = useState("");
  const [hireRoleInput, setHireRoleInput] = useState("");

  const HIRE_COLORS = ["bg-orange-400", "bg-emerald-500", "bg-violet-400", "bg-pink-400", "bg-emerald-500", "bg-teal-500"];

  const addHire = () => {
    if (!hireNameInput.trim()) return;
    setCompany((c) => ({ ...c, recentHires: [...c.recentHires, { name: hireNameInput.trim(), role: hireRoleInput.trim() }] }));
    setHireNameInput("");
    setHireRoleInput("");
  };

  const removeHire = (index: number) => {
    setCompany((c) => ({ ...c, recentHires: c.recentHires.filter((_, i) => i !== index) }));
  };

  const [managerAutoFillState, setManagerAutoFillState] = useState<"idle" | "loading" | "success">("idle");

  const handleManagerAutoFill = () => {
    if (!manager.linkedinUrl.trim()) return;
    setManagerAutoFillState("loading");
    setTimeout(() => {
      setManager((m) => ({
        ...m,
        firstName: "Jean",
        lastName: "Martin",
        title: "Head of Product",
        currentCompany: "Acme Corp",
        location: "Paris, France",
        bio: "Head of Product chez Acme Corp, je pilote la stratégie produit et recrute des talents passionnés. Convaincu que le bon matching entre un candidat et une entreprise est la clé d'une collaboration réussie.",
      }));
      setManagerAutoFillState("success");
    }, 1800);
  };

  const [companyLinkedinUrl, setCompanyLinkedinUrl] = useState("");
  const [autoFillState, setAutoFillState] = useState<"idle" | "loading" | "success">("idle");

  const handleAutoFill = () => {
    if (!companyLinkedinUrl.trim()) return;
    setAutoFillState("loading");
    setTimeout(() => {
      setCompany({
        name: "Acme Corp",
        industry: "Tech / SaaS",
        size: "51-200",
        location: "Paris, France",
        website: "www.acmecorp.com",
        description: "Acme Corp est une scale-up SaaS B2B qui révolutionne la gestion de projets pour les équipes produit. Fondée en 2018, nous accompagnons plus de 500 entreprises dans leur transformation digitale avec une plateforme collaborative intuitive et puissante.",
        growthRate: "+40%",
        recentHires: [
          { name: "Karim Benali", role: "Product Manager" },
          { name: "Thomas Durand", role: "Lead Developer" },
          { name: "Léa Martin", role: "Head of Sales" },
        ],
        values: ["Innovation", "Impact", "Transparence"],
      });
      setAutoFillState("success");
    }, 1800);
  };

  const companyValues = ["Innovation", "Impact", "Bienveillance", "Excellence", "Diversité", "Agilité", "Transparence", "Ambition"];

  const [job, setJob] = useState({
    title: "",
    seniority: "",
    experienceYears: "",
    description: "",
    aboutRole: "",
    lookingFor: "",
    workMode: "",
    location: "",
    relocation: false,
    visaSponsorship: false,
    englishLevel: "",
    startDate: "",
    salaryMin: "",
    salaryMax: "",
    benefits: [] as string[],
    hardSkills: [] as string[],
    softSkills: [] as string[],
    hardInput: "",
    softInput: "",
    openProfiles: [] as string[],
    openProfileInput: "",
    processMilestones: [] as { step: string; collaborator: string }[],
    milestoneStepInput: "",
    milestoneCollabInput: "",
  });

  const toggleJobSkill = (skill: string, type: "hard" | "soft") => {
    if (type === "hard") {
      setJob((j) => ({ ...j, hardSkills: j.hardSkills.includes(skill) ? j.hardSkills.filter((s) => s !== skill) : [...j.hardSkills, skill] }));
    } else {
      setJob((j) => ({ ...j, softSkills: j.softSkills.includes(skill) ? j.softSkills.filter((s) => s !== skill) : [...j.softSkills, skill] }));
    }
  };

  const addCustomJobSkill = (type: "hard" | "soft") => {
    if (type === "hard" && job.hardInput.trim()) {
      setJob((j) => ({ ...j, hardSkills: [...j.hardSkills, j.hardInput.trim()], hardInput: "" }));
    } else if (type === "soft" && job.softInput.trim()) {
      setJob((j) => ({ ...j, softSkills: [...j.softSkills, j.softInput.trim()], softInput: "" }));
    }
  };

  const addMilestone = () => {
    if (!job.milestoneStepInput.trim()) return;
    setJob((j) => ({
      ...j,
      processMilestones: [...j.processMilestones, { step: j.milestoneStepInput.trim(), collaborator: j.milestoneCollabInput.trim() }],
      milestoneStepInput: "",
      milestoneCollabInput: "",
    }));
  };

  const addOpenProfile = () => {
    if (!job.openProfileInput.trim()) return;
    setJob((j) => ({ ...j, openProfiles: [...j.openProfiles, j.openProfileInput.trim()], openProfileInput: "" }));
  };

  const BENEFITS_POOL = ["Remote-friendly", "Full Remote", "Stock options", "Equity", "Budget formation", "Team retreats", "Mutuelle premium", "MacBook Pro", "Budget bien-être", "Tickets restaurant", "RTT supplémentaires", "Vélo / transport", "Crèche"];

  // Voice recorder
  const [voiceState, setVoiceState] = useState<"idle" | "recording" | "filling" | "done">("idle");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceState("idle"); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";
    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript;
      setVoiceTranscript(text);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setVoiceTranscript("");
    setVoiceState("recording");
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setVoiceState("filling");
    setTimeout(() => {
      const transcript = voiceTranscript || "Senior Product Designer avec 5 ans d'expérience en SaaS B2B, passionné par les interfaces complexes. Cherche quelqu'un de bilingue, capable de travailler en autonomie, avec une vraie culture produit. Poste hybride Paris, visa possible, début ASAP.";
      setJob((j) => ({
        ...j,
        aboutRole: transcript.length > 20 ? transcript : "Nous recherchons un profil senior pour renforcer notre équipe produit. Le rôle implique de concevoir des interfaces complexes, de maintenir notre design system et de collaborer étroitement avec les équipes engineering et produit.",
        lookingFor: "Profil autonome avec une vraie culture produit, capable de prendre des décisions design en autonomie et de défendre ses choix en cross-fonctionnel.",
        englishLevel: "Bilingue",
        startDate: "ASAP",
        relocation: true,
        visaSponsorship: true,
      }));
      setVoiceState("done");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-emerald-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
            <span className="font-semibold text-gray-800 text-sm">Experience Matching</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{o.step} {step}/3</span>
            <Link href="/" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all" title={o.quit}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {o.steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  step === i + 1 ? "bg-violet-600 text-white shadow-lg shadow-violet-200 scale-110" : step > i + 1 ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {step > i + 1 ? "✓" : s.icon}
                </div>
                <span className={cn("text-xs mt-1.5 font-medium", step === i + 1 ? "text-violet-600" : step > i + 1 ? "text-emerald-600" : "text-gray-400")}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className={cn("w-12 h-0.5 mx-1 mb-5 transition-all", step > i + 1 ? "bg-emerald-400" : "bg-gray-200")} />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">👤</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step1Title}</h1>
              <p className="text-gray-500 mt-2">{o.step1Sub}</p>
            </div>
            {/* LinkedIn auto-fill block */}
            <div className="mb-4 p-4 rounded-xl border border-violet-100 bg-violet-50/60 space-y-3">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <p className="text-xs text-violet-600">{o.linkedinHint}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="linkedin.com/in/jean-martin"
                  value={manager.linkedinUrl}
                  onChange={(e) => { setManager({ ...manager, linkedinUrl: e.target.value }); setManagerAutoFillState("idle"); }}
                  className="text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={handleManagerAutoFill}
                  disabled={!manager.linkedinUrl.trim() || managerAutoFillState === "loading"}
                  className="shrink-0 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {managerAutoFillState === "loading" ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                      {o.linkedinAutoFilling}
                    </>
                  ) : (
                    o.linkedinAutoFillBtn
                  )}
                </button>
              </div>
              {managerAutoFillState === "success" && (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {o.linkedinAutoFillSuccess}
                </p>
              )}
            </div>

            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.firstName}</Label>
                    <Input placeholder="Jean" value={manager.firstName} onChange={(e) => setManager({ ...manager, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{o.lastName}</Label>
                    <Input placeholder="Martin" value={manager.lastName} onChange={(e) => setManager({ ...manager, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.titleLabel}</Label>
                  <Input placeholder={o.titlePlaceholder} value={manager.title} onChange={(e) => setManager({ ...manager, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.currentCompany}</Label>
                    <Input placeholder={o.currentCompanyPlaceholder} value={manager.currentCompany} onChange={(e) => setManager({ ...manager, currentCompany: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{o.locationLabel}</Label>
                    <Input placeholder={o.locationPlaceholder} value={manager.location} onChange={(e) => setManager({ ...manager, location: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.about} <span className="text-gray-400 font-normal">{o.optional}</span></Label>
                  <Textarea
                    placeholder={o.aboutPlaceholder}
                    value={manager.bio}
                    onChange={(e) => setManager({ ...manager, bio: e.target.value })}
                    className="h-24"
                  />
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={!manager.firstName || !manager.title || !manager.linkedinUrl}
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
              <div className="text-4xl mb-3">🏢</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step2Title}</h1>
              <p className="text-gray-500 mt-2">{o.step2Sub}</p>
            </div>
            {/* LinkedIn auto-fill block */}
            <div className="mb-4 p-4 rounded-xl border border-violet-100 bg-violet-50/60 space-y-3">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <p className="text-xs text-violet-600">{o.autoFillHint}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={o.companyLinkedinPlaceholder}
                  value={companyLinkedinUrl}
                  onChange={(e) => { setCompanyLinkedinUrl(e.target.value); setAutoFillState("idle"); }}
                  className="text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={!companyLinkedinUrl.trim() || autoFillState === "loading"}
                  className="shrink-0 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {autoFillState === "loading" ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                      {o.autoFilling}
                    </>
                  ) : (
                    o.autoFillBtn
                  )}
                </button>
              </div>
              {autoFillState === "success" && (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {o.autoFillSuccess}
                </p>
              )}
            </div>

            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-1.5">
                  <Label>{o.companyName}</Label>
                  <Input placeholder="Acme Corp" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{o.industry}</Label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => setCompany({ ...company, industry: ind })}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs border transition-all",
                          company.industry === ind ? "bg-violet-600 border-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.companySize}</Label>
                  <div className="flex gap-2">
                    {COMPANY_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setCompany({ ...company, size })}
                        className={cn(
                          "flex-1 py-2 rounded-lg border text-xs transition-all",
                          company.size === size ? "bg-violet-600 border-violet-600 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-violet-300"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.companyLocationLabel}</Label>
                    <Input placeholder="Paris, France" value={company.location} onChange={(e) => setCompany({ ...company, location: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{o.website} <span className="text-gray-400 font-normal">{o.optional}</span></Label>
                    <Input placeholder="www.acmecorp.com" value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.description}</Label>
                  <Textarea
                    placeholder={o.descriptionPlaceholder}
                    value={company.description}
                    onChange={(e) => setCompany({ ...company, description: e.target.value })}
                    className="h-24"
                  />
                </div>
                {/* Croissance visuelle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{o.growthRate} <span className="text-gray-400 font-normal">{o.optional}</span></Label>
                    {company.growthRate && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="#10b981"><polygon points="5,0 10,10 0,10"/></svg>
                        <span className="text-sm font-extrabold text-emerald-600">{company.growthRate}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="+35%"
                      value={company.growthRate}
                      onChange={(e) => setCompany({ ...company, growthRate: e.target.value })}
                      className="max-w-[120px]"
                    />
                    <div className="flex items-end gap-1 h-10 flex-1">
                      {[35, 45, 38, 52, 60, company.growthRate ? 80 : 30].map((v, i) => (
                        <div
                          key={i}
                          className={cn("flex-1 rounded-sm transition-all", i === 5 && company.growthRate ? "bg-violet-500" : "bg-violet-100")}
                          style={{ height: `${(v / 80) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recrutements récents visuels */}
                <div className="space-y-3">
                  <Label>{o.recentHires} <span className="text-gray-400 font-normal">{o.optional}</span></Label>
                  {company.recentHires.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {company.recentHires.map((hire, i) => (
                        <div key={i} className="flex items-center gap-2 pl-1 pr-2 py-1 bg-gray-50 rounded-full border border-gray-100">
                          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", HIRE_COLORS[i % HIRE_COLORS.length])}>
                            {hire.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="leading-tight">
                            <span className="text-xs font-semibold text-gray-800">{hire.name}</span>
                            {hire.role && <span className="text-xs text-gray-400"> · {hire.role}</span>}
                          </div>
                          <button type="button" onClick={() => removeHire(i)} className="text-gray-300 hover:text-red-400 transition-colors text-base leading-none ml-1">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Prénom Nom"
                      value={hireNameInput}
                      onChange={(e) => setHireNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addHire()}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Rôle"
                      value={hireRoleInput}
                      onChange={(e) => setHireRoleInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addHire()}
                      className="text-sm"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addHire} className="shrink-0 px-3">+</Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{o.values}</Label>
                  <div className="flex flex-wrap gap-2">
                    {companyValues.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCompany((c) => ({
                          ...c,
                          values: c.values.includes(val) ? c.values.filter((v) => v !== val) : [...c.values, val],
                        }))}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs border transition-all",
                          company.values.includes(val) ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-emerald-300"
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">{o.back}</Button>
                  <Button
                    variant="gradient"
                    onClick={() => setStep(3)}
                    className="flex-2 flex-grow-2"
                    disabled={!company.name || !company.industry}
                  >
                    {o.continue}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📋</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step3Title}</h1>
              <p className="text-gray-500 mt-2">{o.step3Sub}</p>
            </div>

            {/* ── VOICE RECORDER ── */}
            <div className={cn(
              "rounded-2xl border-2 p-5 transition-all",
              voiceState === "recording" ? "border-red-300 bg-red-50/60" : voiceState === "done" ? "border-emerald-200 bg-emerald-50/40" : "border-violet-100 bg-violet-50/50"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{o.voiceTitle}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.voiceSub}</p>
                </div>
                {voiceState === "idle" && (
                  <button type="button" onClick={startVoiceRecording}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    {o.voiceStart}
                  </button>
                )}
                {voiceState === "recording" && (
                  <button type="button" onClick={stopVoiceRecording}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all">
                    <span className="w-3 h-3 rounded-sm bg-white" />
                    {o.voiceStop}
                  </button>
                )}
              </div>
              {voiceState === "recording" && (
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  <p className="text-sm text-gray-600 italic min-h-[20px]">{voiceTranscript || o.voiceListening}</p>
                </div>
              )}
              {voiceState === "filling" && (
                <div className="flex items-center gap-2 text-sm text-violet-600">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  {o.voiceFilling}
                </div>
              )}
              {voiceState === "done" && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {o.voiceFilled}
                  <button type="button" onClick={() => { setVoiceState("idle"); setVoiceTranscript(""); }} className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline">Recommencer</button>
                </div>
              )}
            </div>

            {/* ── INTITULÉ & CONTEXTE ── */}
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-1.5">
                  <Label>{o.jobTitle}</Label>
                  <Input placeholder={o.jobTitlePlaceholder} value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <Label>{o.aboutRole}</Label>
                  <Textarea placeholder={o.aboutRolePlaceholder} value={job.aboutRole} onChange={(e) => setJob({ ...job, aboutRole: e.target.value })} className="h-24" />
                </div>

                <div className="space-y-1.5">
                  <Label>{o.lookingFor}</Label>
                  <Textarea placeholder={o.lookingForPlaceholder} value={job.lookingFor} onChange={(e) => setJob({ ...job, lookingFor: e.target.value })} className="h-20" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.seniority}</Label>
                    <div className="space-y-1">
                      {["Junior", "Mid", "Senior", "Lead / Expert"].map((s) => (
                        <button key={s} type="button" onClick={() => setJob({ ...job, seniority: s })}
                          className={cn("w-full p-2 rounded-lg border text-sm text-left transition-all", job.seniority === s ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium" : "border-gray-200 text-gray-600 hover:border-emerald-200")}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>{o.experienceYears}</Label>
                      <Input type="number" placeholder="5" min="0" max="30" value={job.experienceYears} onChange={(e) => setJob({ ...job, experienceYears: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{o.startDate}</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {o.startDateOptions.map((d) => (
                          <button key={d} type="button" onClick={() => setJob({ ...job, startDate: d })}
                            className={cn("px-3 py-1.5 rounded-full text-xs border transition-all", job.startDate === d ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-emerald-300")}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── CONDITIONS ── */}
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-1.5">
                  <Label>{o.workMode}</Label>
                  <div className="flex gap-2">
                    {[{ v: "remote", l: "🏠 Remote" }, { v: "hybrid", l: "🔄 Hybride" }, { v: "onsite", l: "🏢 Présentiel" }].map((w) => (
                      <button key={w.v} type="button" onClick={() => setJob({ ...job, workMode: w.v })}
                        className={cn("flex-1 py-2 rounded-lg border text-sm transition-all", job.workMode === w.v ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium" : "border-gray-200 text-gray-600 hover:border-emerald-200")}>
                        {w.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">{o.relocation}</Label>
                    <div className="flex gap-2">
                      {[true, false].map((v) => (
                        <button key={String(v)} type="button" onClick={() => setJob({ ...job, relocation: v })}
                          className={cn("flex-1 py-1.5 rounded-lg border text-xs transition-all", job.relocation === v ? "bg-violet-600 border-violet-600 text-white font-semibold" : "border-gray-200 text-gray-500 hover:border-violet-300")}>
                          {v ? o.yes : o.no}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{o.visaSponsorship}</Label>
                    <div className="flex gap-2">
                      {[true, false].map((v) => (
                        <button key={String(v)} type="button" onClick={() => setJob({ ...job, visaSponsorship: v })}
                          className={cn("flex-1 py-1.5 rounded-lg border text-xs transition-all", job.visaSponsorship === v ? "bg-violet-600 border-violet-600 text-white font-semibold" : "border-gray-200 text-gray-500 hover:border-violet-300")}>
                          {v ? o.yes : o.no}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{o.englishLevel}</Label>
                    <select value={job.englishLevel} onChange={(e) => setJob({ ...job, englishLevel: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 text-xs px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-violet-300">
                      <option value="">—</option>
                      {o.englishLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.salaryMin}</Label>
                    <Input placeholder="45000" type="number" value={job.salaryMin} onChange={(e) => setJob({ ...job, salaryMin: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{o.salaryMax}</Label>
                    <Input placeholder="65000" type="number" value={job.salaryMax} onChange={(e) => setJob({ ...job, salaryMax: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{o.benefits}</Label>
                  <div className="flex flex-wrap gap-2">
                    {BENEFITS_POOL.map((b) => (
                      <button key={b} type="button"
                        onClick={() => setJob((j) => ({ ...j, benefits: j.benefits.includes(b) ? j.benefits.filter((x) => x !== b) : [...j.benefits, b] }))}
                        className={cn("px-3 py-1.5 rounded-full text-xs border transition-all", job.benefits.includes(b) ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-emerald-300")}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── COMPÉTENCES ── */}
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div>
                  <Badge variant="hard" className="text-xs mb-3">{o.hardSkillsRequired}</Badge>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {HARD_SKILLS_POOL.map((skill) => (
                      <button key={skill} type="button" onClick={() => toggleJobSkill(skill, "hard")}
                        className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", job.hardSkills.includes(skill) ? "bg-violet-600 border-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300")}>
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder={o.add} value={job.hardInput} onChange={(e) => setJob({ ...job, hardInput: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addCustomJobSkill("hard")} className="text-sm" />
                    <Button variant="outline" size="sm" onClick={() => addCustomJobSkill("hard")}>+</Button>
                  </div>
                </div>
                <div>
                  <Badge variant="soft" className="text-xs mb-3">{o.softSkillsWanted}</Badge>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SOFT_SKILLS_POOL.map((skill) => (
                      <button key={skill} type="button" onClick={() => toggleJobSkill(skill, "soft")}
                        className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", job.softSkills.includes(skill) ? "bg-pink-600 border-pink-600 text-white" : "border-gray-200 text-gray-600 hover:border-pink-300")}>
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder={o.add} value={job.softInput} onChange={(e) => setJob({ ...job, softInput: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addCustomJobSkill("soft")} className="text-sm" />
                    <Button variant="outline" size="sm" onClick={() => addCustomJobSkill("soft")}>+</Button>
                  </div>
                </div>

                {/* Profils envisagés */}
                <div className="space-y-2">
                  <Label>{o.openProfiles}</Label>
                  {job.openProfiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {job.openProfiles.map((p, i) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs text-emerald-700 font-medium">
                          {p}
                          <button type="button" onClick={() => setJob((j) => ({ ...j, openProfiles: j.openProfiles.filter((_, idx) => idx !== i) }))} className="text-emerald-300 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input placeholder={o.openProfilesPlaceholder} value={job.openProfileInput} onChange={(e) => setJob({ ...job, openProfileInput: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addOpenProfile()} className="text-sm" />
                    <Button variant="outline" size="sm" onClick={addOpenProfile}>+</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── JALONS PROCESS ── */}
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <Label>{o.processMilestones}</Label>
                {job.processMilestones.length > 0 && (
                  <div className="space-y-2">
                    {job.processMilestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{m.step}</p>
                          {m.collaborator && <p className="text-xs text-gray-400">avec {m.collaborator}</p>}
                        </div>
                        <button type="button" onClick={() => setJob((j) => ({ ...j, processMilestones: j.processMilestones.filter((_, idx) => idx !== i) }))} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder={o.milestoneStepPlaceholder} value={job.milestoneStepInput} onChange={(e) => setJob({ ...job, milestoneStepInput: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addMilestone()} className="text-sm" />
                    <Input placeholder={o.milestoneCollabPlaceholder} value={job.milestoneCollabInput} onChange={(e) => setJob({ ...job, milestoneCollabInput: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addMilestone()} className="text-sm" />
                    <Button variant="outline" size="sm" onClick={addMilestone} className="shrink-0">+</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">{o.back}</Button>
              <Button variant="gradient" size="lg" onClick={() => router.push("/manager/dashboard")} className="flex-2 flex-grow-2"
                disabled={!job.title || (job.hardSkills.length + job.softSkills.length < 2)}>
                {o.publish}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
