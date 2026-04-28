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
    values: [] as string[],
  });

  const companyValues = ["Innovation", "Impact", "Bienveillance", "Excellence", "Diversité", "Agilité", "Transparence", "Ambition"];

  const [job, setJob] = useState({
    title: "",
    seniority: "",
    experienceYears: "",
    description: "",
    workMode: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    hardSkills: [] as string[],
    softSkills: [] as string[],
    hardInput: "",
    softInput: "",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
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
                  step === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : step > i + 1 ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {step > i + 1 ? "✓" : s.icon}
                </div>
                <span className={cn("text-xs mt-1.5 font-medium", step === i + 1 ? "text-indigo-600" : step > i + 1 ? "text-emerald-600" : "text-gray-400")}>
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
                <div className="space-y-1.5">
                  <Label>{o.linkedin} <span className="text-gray-400 font-normal">{o.optional}</span></Label>
                  <Input placeholder="linkedin.com/in/jean-martin" value={manager.linkedinUrl} onChange={(e) => setManager({ ...manager, linkedinUrl: e.target.value })} />
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
                  disabled={!manager.firstName || !manager.title}
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
                          company.industry === ind ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-600 hover:border-indigo-300"
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
                          company.size === size ? "bg-indigo-600 border-indigo-600 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-indigo-300"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.locationLabel}</Label>
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
                          company.values.includes(val) ? "bg-violet-600 border-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"
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
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">📋</div>
              <h1 className="text-2xl font-bold text-gray-900">{o.step3Title}</h1>
              <p className="text-gray-500 mt-2">{o.step3Sub}</p>
            </div>
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-1.5">
                  <Label>{o.jobTitle}</Label>
                  <Input
                    placeholder={o.jobTitlePlaceholder}
                    value={job.title}
                    onChange={(e) => setJob({ ...job, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{o.seniority}</Label>
                    <div className="space-y-1">
                      {["Junior", "Mid", "Senior", "Lead / Expert"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setJob({ ...job, seniority: s })}
                          className={cn(
                            "w-full p-2 rounded-lg border text-sm text-left transition-all",
                            job.seniority === s ? "border-violet-500 bg-violet-50 text-violet-700 font-medium" : "border-gray-200 text-gray-600 hover:border-violet-200"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{o.experienceYears}</Label>
                    <Input
                      type="number"
                      placeholder="7"
                      min="0"
                      max="30"
                      value={job.experienceYears}
                      onChange={(e) => setJob({ ...job, experienceYears: e.target.value })}
                    />
                    <Label className="mt-3">{o.workMode}</Label>
                    <div className="space-y-1">
                      {[{ v: "remote", l: "🏠 Remote" }, { v: "hybrid", l: "🔄 Hybride" }, { v: "onsite", l: "🏢 Présentiel" }].map((w) => (
                        <button
                          key={w.v}
                          type="button"
                          onClick={() => setJob({ ...job, workMode: w.v })}
                          className={cn(
                            "w-full p-2 rounded-lg border text-sm text-left transition-all",
                            job.workMode === w.v ? "border-violet-500 bg-violet-50 text-violet-700 font-medium" : "border-gray-200 text-gray-600 hover:border-violet-200"
                          )}
                        >
                          {w.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>{o.jobDescription}</Label>
                  <Textarea
                    placeholder={o.jobDescPlaceholder}
                    value={job.description}
                    onChange={(e) => setJob({ ...job, description: e.target.value })}
                    className="h-28"
                  />
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

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="hard" className="text-xs">{o.hardSkillsRequired}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {HARD_SKILLS_POOL.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleJobSkill(skill, "hard")}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          job.hardSkills.includes(skill) ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-600 hover:border-indigo-300"
                        )}
                      >
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
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="soft" className="text-xs">{o.softSkillsWanted}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SOFT_SKILLS_POOL.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleJobSkill(skill, "soft")}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          job.softSkills.includes(skill) ? "bg-pink-600 border-pink-600 text-white" : "border-gray-200 text-gray-600 hover:border-pink-300"
                        )}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder={o.add} value={job.softInput} onChange={(e) => setJob({ ...job, softInput: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addCustomJobSkill("soft")} className="text-sm" />
                    <Button variant="outline" size="sm" onClick={() => addCustomJobSkill("soft")}>+</Button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">{o.back}</Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={() => router.push("/manager/dashboard")}
                    className="flex-2 flex-grow-2"
                    disabled={!job.title || (job.hardSkills.length + job.softSkills.length < 2)}
                  >
                    {o.publish}
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
