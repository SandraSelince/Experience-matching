"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/i18n/context";
import { LangToggle } from "@/components/shared/LangToggle";
import { cn } from "@/lib/utils";

const MOCK_CANDIDATES: Record<string, CandidateData> = {
  me: {
    id: "me",
    firstName: "Marie",
    lastName: "Dupont",
    title: "Senior Product Designer",
    seniority: "Senior (5-8 ans)",
    location: "Paris",
    workMode: "hybrid",
    bio: "Designer produit passionnée par les interfaces B2B. 7 ans d'expérience dans des scale-ups tech, de la discovery à la delivery. Convaincue que le bon design naît de la collaboration étroite avec les équipes dev et produit.",
    cvFileName: "Marie_Dupont_CV_2025.pdf",
    hardSkills: ["Figma", "UX Design", "UI Design", "Design System", "Prototypage", "UX Research"],
    softSkills: ["Leadership", "Communication", "Créativité", "Empathie", "Travail en équipe"],
    desiredRole: "Lead Product Designer",
    salaryMin: 65000,
    salaryMax: 80000,
    industries: ["Tech / SaaS", "FinTech"],
    psychProfile: {
      strengths: "Créativité, Résolution de problèmes",
      workStyle: "Autonome & orienté impact",
      leadership: "Expert & facilitateur",
      motivators: "Impact, Apprentissage, Autonomie",
    },
    profileCompletion: 90,
    status: "validated",
  },
  c1: {
    id: "c1",
    firstName: "Marie",
    lastName: "D.",
    title: "Senior Product Designer",
    seniority: "Senior (5-8 ans)",
    location: "Paris",
    workMode: "hybrid",
    bio: "Designer produit passionnée par les interfaces B2B. 7 ans d'expérience dans des scale-ups tech.",
    cvFileName: "CV_disponible.pdf",
    hardSkills: ["Figma", "UX Design", "UI Design", "Design System", "Prototypage"],
    softSkills: ["Leadership", "Communication", "Créativité", "Empathie"],
    desiredRole: "Lead Product Designer",
    salaryMin: 65000,
    salaryMax: 80000,
    industries: ["Tech / SaaS"],
    psychProfile: {
      strengths: "Créativité, Résolution de problèmes",
      workStyle: "Autonome & orienté impact",
      leadership: "Expert & facilitateur",
      motivators: "Impact, Apprentissage, Autonomie",
    },
    profileCompletion: 90,
    status: "validated",
    matchScore: 94,
    hardScore: 96,
    softScore: 91,
  },
  c2: {
    id: "c2",
    firstName: "Lucas",
    lastName: "M.",
    title: "Lead UX Designer",
    seniority: "Expert (8+ ans)",
    location: "Lyon",
    workMode: "remote",
    bio: "Expert UX avec 9 ans d'expérience, spécialisé dans les plateformes complexes et la recherche utilisateur.",
    cvFileName: "CV_disponible.pdf",
    hardSkills: ["Figma", "UX Design", "UI Design", "UX Research"],
    softSkills: ["Leadership", "Autonomie", "Esprit critique"],
    desiredRole: "Head of Design",
    salaryMin: 70000,
    salaryMax: 90000,
    industries: ["Tech / SaaS", "FinTech"],
    psychProfile: {
      strengths: "Leadership, Analyse",
      workStyle: "Structuré & orienté data",
      leadership: "Leader décisif",
      motivators: "Excellence, Autonomie",
    },
    profileCompletion: 85,
    status: "validated",
    matchScore: 87,
    hardScore: 89,
    softScore: 84,
  },
  c4: {
    id: "c4",
    firstName: "Thomas",
    lastName: "B.",
    title: "Senior Product Manager",
    seniority: "Mid (2-5 ans)",
    location: "Paris",
    workMode: "hybrid",
    bio: "Product Manager orienté data avec 4 ans d'expérience sur des produits B2B SaaS.",
    cvFileName: "CV_disponible.pdf",
    hardSkills: ["Product Management", "Agile/Scrum", "SQL", "Jira", "Analytics"],
    softSkills: ["Communication", "Leadership", "Orientation résultats"],
    desiredRole: "Senior PM / Lead PM",
    salaryMin: 55000,
    salaryMax: 70000,
    industries: ["Tech / SaaS", "E-commerce"],
    psychProfile: {
      strengths: "Data-driven, Leadership",
      workStyle: "Orienté résultats & structuré",
      leadership: "Facilitateur & décisif",
      motivators: "Impact, Performance",
    },
    profileCompletion: 88,
    status: "validated",
    matchScore: 91,
    hardScore: 93,
    softScore: 88,
  },
  c5: {
    id: "c5",
    firstName: "Amina",
    lastName: "R.",
    title: "Product Manager",
    seniority: "Mid (2-5 ans)",
    location: "Paris",
    workMode: "remote",
    bio: "PM centrée utilisateur, 3 ans d'expérience en startup.",
    cvFileName: "CV_disponible.pdf",
    hardSkills: ["Product Management", "Agile/Scrum", "Jira"],
    softSkills: ["Communication", "Empathie", "Adaptabilité"],
    desiredRole: "Senior Product Manager",
    salaryMin: 50000,
    salaryMax: 65000,
    industries: ["Tech / SaaS", "HealthTech"],
    psychProfile: {
      strengths: "Empathie, Communication",
      workStyle: "Centré utilisateur & collaboratif",
      leadership: "Facilitateur bienveillant",
      motivators: "Impact, Bienveillance",
    },
    profileCompletion: 80,
    status: "validated",
    matchScore: 83,
    hardScore: 80,
    softScore: 87,
  },
};

interface CandidateData {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  seniority: string;
  location: string;
  workMode: string;
  bio: string;
  cvFileName?: string;
  hardSkills: string[];
  softSkills: string[];
  desiredRole: string;
  salaryMin?: number;
  salaryMax?: number;
  industries: string[];
  psychProfile: { strengths: string; workStyle: string; leadership: string; motivators: string };
  profileCompletion: number;
  status: string;
  matchScore?: number;
  hardScore?: number;
  softScore?: number;
}

const HARD_SKILLS_POOL = [
  "Product Management", "UX Design", "UI Design", "Figma", "Data Analysis",
  "SQL", "Python", "React", "Node.js", "TypeScript", "Agile/Scrum", "Jira",
  "SEO/SEA", "Growth Hacking", "Marketing Digital", "Content Strategy",
  "Project Management", "UX Research", "Design System", "Prototypage",
];

const SOFT_SKILLS_POOL = [
  "Leadership", "Communication", "Travail en équipe", "Adaptabilité",
  "Résolution de problèmes", "Créativité", "Gestion du temps", "Empathie",
  "Esprit critique", "Négociation", "Pédagogie", "Curiosité intellectuelle",
  "Autonomie", "Orientation résultats",
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-violet-600";
  return "text-amber-600";
};

const getScoreBg = (score: number) => {
  if (score >= 90) return "bg-emerald-50 border-emerald-200";
  if (score >= 75) return "bg-violet-50 border-violet-200";
  return "bg-amber-50 border-amber-200";
};

export default function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLang();
  const p = t.candidateProfile;
  const workModeLabel = Object.fromEntries(t.onboardingCandidate.workModes.map(({ v, l }) => [v, l]));

  const isOwnProfile = id === "me";
  const raw = MOCK_CANDIDATES[id] ?? MOCK_CANDIDATES["c1"];

  const [editing, setEditing] = useState(false);
  const [candidate, setCandidate] = useState<CandidateData>(raw);
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");

  const toggleSkill = (skill: string, type: "hard" | "soft") => {
    if (!editing) return;
    if (type === "hard") {
      setCandidate((c) => ({
        ...c,
        hardSkills: c.hardSkills.includes(skill)
          ? c.hardSkills.filter((s) => s !== skill)
          : [...c.hardSkills, skill],
      }));
    } else {
      setCandidate((c) => ({
        ...c,
        softSkills: c.softSkills.includes(skill)
          ? c.softSkills.filter((s) => s !== skill)
          : [...c.softSkills, skill],
      }));
    }
  };

  const addCustomSkill = (type: "hard" | "soft") => {
    if (type === "hard" && hardInput.trim()) {
      setCandidate((c) => ({ ...c, hardSkills: [...c.hardSkills, hardInput.trim()] }));
      setHardInput("");
    } else if (type === "soft" && softInput.trim()) {
      setCandidate((c) => ({ ...c, softSkills: [...c.softSkills, softInput.trim()] }));
      setSoftInput("");
    }
  };

  const initials = `${candidate.firstName[0] ?? ""}${candidate.lastName[0] ?? ""}`;

  const psychLabels = t.onboardingCandidate.psychResults.map((r) => r.label);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">EM</div>
              <span className="font-semibold text-gray-800 text-sm hidden sm:block">Experience Matching</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            {isOwnProfile && !editing && (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                {p.editProfile}
              </Button>
            )}
            {isOwnProfile && editing && (
              <>
                <Button variant="outline" size="sm" onClick={() => { setCandidate(raw); setEditing(false); }}>
                  {p.cancel}
                </Button>
                <Button variant="success" size="sm" onClick={() => setEditing(false)}>
                  {p.save}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="md:col-span-1 space-y-4">
            <Card className="shadow-none border-gray-100 overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-violet-500 to-indigo-600" />
              <CardContent className="pt-0 pb-5">
                <div className="-mt-8 mb-4 flex items-end justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                    {initials}
                  </div>
                  {candidate.status === "validated" && (
                    <Badge variant="success" className="text-xs mb-1">{p.validatedProfile}</Badge>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{p.firstName}</Label>
                        <Input value={candidate.firstName} onChange={(e) => setCandidate({ ...candidate, firstName: e.target.value })} className="text-sm h-8 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">{p.lastName}</Label>
                        <Input value={candidate.lastName} onChange={(e) => setCandidate({ ...candidate, lastName: e.target.value })} className="text-sm h-8 mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">{p.title}</Label>
                      <Input value={candidate.title} onChange={(e) => setCandidate({ ...candidate, title: e.target.value })} className="text-sm h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">{p.locationLabel}</Label>
                      <Input value={candidate.location} onChange={(e) => setCandidate({ ...candidate, location: e.target.value })} className="text-sm h-8 mt-1" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-lg font-bold text-gray-900">{candidate.firstName} {candidate.lastName}</h1>
                    <p className="text-sm text-gray-500">{candidate.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                      <span>📍 {candidate.location}</span>
                      <span>{workModeLabel[candidate.workMode] ?? candidate.workMode}</span>
                      <span>🏆 {candidate.seniority}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {!isOwnProfile && candidate.matchScore && (
              <Card className={cn("shadow-none border-2", getScoreBg(candidate.matchScore))}>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">{p.matchScore}</p>
                  <div className={cn("text-4xl font-extrabold", getScoreColor(candidate.matchScore))}>
                    {candidate.matchScore}%
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{p.hardSkills}</span><span className="font-medium">{candidate.hardScore}%</span></div>
                      <Progress value={candidate.hardScore} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{p.softSkills}</span><span className="font-medium">{candidate.softScore}%</span></div>
                      <Progress value={candidate.softScore} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isOwnProfile && (
              <Card className="shadow-none border-gray-100">
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">{p.profileCompletion}</span>
                    <span className="text-xs font-bold text-violet-600">{candidate.profileCompletion}%</span>
                  </div>
                  <Progress value={candidate.profileCompletion} className="h-1.5" />
                </CardContent>
              </Card>
            )}

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-4 pb-4 space-y-3">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{p.careerTitle}</h3>
                {editing ? (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">{p.desiredRole}</Label>
                      <Input value={candidate.desiredRole} onChange={(e) => setCandidate({ ...candidate, desiredRole: e.target.value })} className="text-sm h-8 mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{p.salaryMin}</Label>
                        <Input type="number" value={candidate.salaryMin ?? ""} onChange={(e) => setCandidate({ ...candidate, salaryMin: Number(e.target.value) })} className="text-sm h-8 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">{p.salaryMax}</Label>
                        <Input type="number" value={candidate.salaryMax ?? ""} onChange={(e) => setCandidate({ ...candidate, salaryMax: Number(e.target.value) })} className="text-sm h-8 mt-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-400">🎯</span>
                      <span className="text-gray-700">{candidate.desiredRole}</span>
                    </div>
                    {candidate.salaryMin && (
                      <div className="flex gap-2">
                        <span className="text-gray-400">💰</span>
                        <span className="text-gray-700">{(candidate.salaryMin / 1000).toFixed(0)}-{(candidate.salaryMax! / 1000).toFixed(0)}k€ {p.perYear}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="text-gray-400">🏢</span>
                      <span className="text-gray-700">{candidate.industries.join(", ")}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {candidate.cvFileName && (
              <Card className="shadow-none border-gray-100">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📄</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{candidate.cvFileName}</p>
                        <p className="text-xs text-gray-400">{p.cvLabel}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      {p.view}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-5 pb-5">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{p.about}</h2>
                {editing ? (
                  <Textarea
                    value={candidate.bio}
                    onChange={(e) => setCandidate({ ...candidate, bio: e.target.value })}
                    className="h-28 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">{candidate.bio}</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{p.hardSkills}</h2>
                  <Badge variant="hard" className="text-xs">{candidate.hardSkills.length} {p.skills}</Badge>
                </div>
                {editing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {HARD_SKILLS_POOL.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill, "hard")}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                            candidate.hardSkills.includes(skill)
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-gray-200 text-gray-600 hover:border-indigo-300"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Ajouter..." value={hardInput} onChange={(e) => setHardInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomSkill("hard")} className="text-sm h-8" />
                      <Button variant="outline" size="sm" onClick={() => addCustomSkill("hard")}>+</Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {candidate.hardSkills.map((s) => (
                      <Badge key={s} variant="hard" className="text-sm py-1 px-3">{s}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{p.softSkills}</h2>
                  <Badge variant="soft" className="text-xs">{candidate.softSkills.length} {p.skills}</Badge>
                </div>
                {editing ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {SOFT_SKILLS_POOL.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill, "soft")}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                            candidate.softSkills.includes(skill)
                              ? "bg-pink-600 border-pink-600 text-white"
                              : "border-gray-200 text-gray-600 hover:border-pink-300"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Ajouter..." value={softInput} onChange={(e) => setSoftInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomSkill("soft")} className="text-sm h-8" />
                      <Button variant="outline" size="sm" onClick={() => addCustomSkill("soft")}>+</Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {candidate.softSkills.map((s) => (
                      <Badge key={s} variant="soft" className="text-sm py-1 px-3">{s}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-100">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{p.psychTitle}</h2>
                  {!isOwnProfile && (
                    <Badge variant="secondary" className="text-xs">{p.psychPartial}</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: psychLabels[0], value: candidate.psychProfile.strengths, icon: "✨", bg: "bg-violet-50" },
                    { label: psychLabels[1], value: candidate.psychProfile.workStyle, icon: "⚡", bg: "bg-indigo-50" },
                    { label: psychLabels[2], value: candidate.psychProfile.leadership, icon: "🌟", bg: "bg-pink-50" },
                    { label: psychLabels[3], value: candidate.psychProfile.motivators, icon: "🔥", bg: "bg-orange-50" },
                  ].map((item) => (
                    <div key={item.label + item.icon} className={cn("p-3 rounded-xl", item.bg)}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span>{item.icon}</span>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
                {!isOwnProfile && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-2">
                    <span className="text-sm flex-shrink-0">🔒</span>
                    <p className="text-xs text-amber-800">{p.psychNote}</p>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="mt-4 p-3 bg-violet-50 rounded-xl flex gap-2">
                    <span className="text-sm flex-shrink-0">ℹ️</span>
                    <p className="text-xs text-violet-700">{p.psychOwn}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {!isOwnProfile && (
              <Card className="shadow-none border-gray-100">
                <CardContent className="pt-4 pb-4">
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 text-gray-500" onClick={() => router.back()}>
                      {p.notRetained}
                    </Button>
                    <Button variant="success" className="flex-2 flex-grow-2" onClick={() => router.back()}>
                      {p.retain}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
